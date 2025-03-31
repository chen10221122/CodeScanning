import { memo, useMemo, useRef, useState } from 'react';

import { Table, Empty, Pagination, Spin, Icon, Modal } from '@dzh/components';
import { useRequest, useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled, { createGlobalStyle } from 'styled-components';

import { getSimilarScoreModal } from '@/apis/area/areaEconomy';
import ExportDoc from '@/components/exportDoc';
import { formatNumber } from '@/utils/format';

import { useCtx2 } from '../../context2';
import { IFilterProps2, PAGE_SIZE } from '../../utils';
enum Estatus {
  SUCCESS,
  ERROR,
  NO_POWER,
}

const defaultParams: IFilterProps2 = {
  from: 0,
  size: PAGE_SIZE.MODAL_PAGE_SIZE,
  // code: '',
};

interface Props {
  containerId: string;
  sameRegionLevel: any;
  onlyProvince: any;
  administrationLevel: any;
  provinceCode: any;
}

const MoreArea = (props: Props) => {
  const { containerId, sameRegionLevel, onlyProvince, administrationLevel, provinceCode } = props;
  // const [loading, setLoading] = useState(true);
  const {
    state: { isOpenModals, modalRow, params },
    update,
  } = useCtx2();

  // const { regionName, regionCode, score } = modalRow;

  const baseProvinceData = {
    // deviation: '0.00',
    regionName: modalRow?.regionName,
    score: modalRow?.score,
    regionCode: modalRow?.regionCode,
  };

  const [firstLoading, setFirstLoading] = useState(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<Estatus>(Estatus.SUCCESS);

  const [conditions, setConditions] = useState<IFilterProps2>(defaultParams);
  const scrollDomRef = useRef<HTMLDivElement>(null); // 滚动容器
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 请求参数
  const { run, loading } = useRequest(getSimilarScoreModal, {
    manual: true,
    onSuccess(res) {
      // console.log('res', res);
      if (res?.data?.data?.length && !isEmpty(modalRow)) {
        let rowDatas = res.data.data;
        if (rowDatas) {
          setDataSource([baseProvinceData, ...rowDatas]);
          setUnit(rowDatas?.[0]?.displayCunit || '');
          // 已失败调用，重新回到之前浏览的一页
          setCurrentPage(conditions.from / conditions.size + 1);
          setStatus(Estatus.SUCCESS);
          setTotal(res.data.total);
        }
      }
    },
    onError(error: Error) {
      const customError = error as Error & { returncode: number };
      // 无权限
      if (customError.returncode === 205) {
        setStatus(Estatus.NO_POWER);
        setConditions({ ...conditions, from: (currentPage - 1) * conditions.size });
      } else {
        setStatus(Estatus.ERROR);
      }
    },
    onFinally() {
      setFirstLoading(false);
    },
  });

  // 关闭弹窗
  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.isOpenModals = false;
      d.modalRow = undefined;
    });
    setCurrentPage(1);
    setStatus(Estatus.SUCCESS);
    setFirstLoading(true);
  });

  // 翻页
  const turnPage = useMemoizedFn((page, size) => {
    if (scrollDomRef.current) {
      scrollDomRef.current.scrollTop = 0;
    }
    setConditions({ ...conditions, from: (page - 1) * size });
  });

  // 打开弹窗
  useMemo(() => {
    if (isOpenModals) {
      setConditions({
        // ...params,
        from: 0,
        size: PAGE_SIZE.MODAL_PAGE_SIZE,
        administrationLevel: sameRegionLevel ? administrationLevel : '',
        provinceCode: onlyProvince ? provinceCode : '',
        indicatorCode: modalRow?.indicatorCode,
        originIndicatorValue: modalRow?.originIndicatorValue,
        regionCode: params.code,
        year: params.year,
        deviationRange: params.deviationRange,
        // indicName: modalRow?.indicName2,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModals]);

  useMemo(() => {
    conditions.regionCode && run(conditions);
  }, [run, conditions]);

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        key: 'xuhao',
        align: 'center',
        width: Math.max(`${conditions.from + conditions.size}`.length * 15, 50),
        render: (_: any, row: { regionCode: any }, index: number) => {
          return <>{row?.regionCode === params.code ? '1' : index + conditions.from + 2}</>;
          // return <>{index + conditions.from + 2}</>;
        },
      },
      {
        title: '地区',
        dataIndex: 'regionName',
        width: 460,
        align: 'left',
        render: (text: any, row: { regionCode: any }) => {
          const localTag = <span className="icon-region"></span>;
          return (
            <div className={['region'].join(' ')} title={text}>
              {text}
              {row?.regionCode === params.code ? localTag : null}
              {/* {localTag} */}
            </div>
          );
        },
      },
      {
        title: modalRow?.title + (unit ? '(' + unit + ')' : ''),
        dataIndex: 'score',
        width: 212,
        align: 'right',
        render: (text: string | number) => {
          return <span>{formatNumber(text)}</span>;
        },
      },
      {
        title: '偏离值(%)',
        dataIndex: 'deviation',
        width: 212,
        align: 'right',
        render: (text: string) => {
          // console.log('text', text);
          let prevNum = (text && text.split('%')[0]) || null;
          let num = Number(prevNum);
          return (
            <span
              className="deviateDegree"
              style={{
                color: num && num !== 0.0 ? (num > 0 ? '#FE3A2F' : '#14BA70') : '#262626',
              }}
            >
              {prevNum || '-'}
            </span>
          );
        },
      },
    ];
  }, [conditions.from, conditions.size, modalRow?.title, params.code, unit]);

  /* 漏表头加载 */
  const tableLoading = useMemo(() => {
    if (loading) {
      return {
        wrapperClassName: 'more-sort-page-loading',
        indicator: (
          <span className="more-loading-tips">
            <Icon
              style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
              image={require('@/assets/images/common/loading.gif')}
            />
            <span className="more-loading-text">加载中</span>
          </span>
        ),
      };
    }
  }, [loading]);

  const pinnedRows = useMemo(() => (dataSource?.length ? dataSource.slice(0, 1) : []), [dataSource]);

  return (
    <>
      <MaskScrollGlobalStyle></MaskScrollGlobalStyle>
      <MoreAreaModal
        title={'更多相似地区'}
        width={1000}
        visible={isOpenModals}
        destroyOnClose={true}
        onCancel={closeModal}
        centered={false}
        footer={null}
        zIndex={100}
        maskClosable={false}
        wrapClassName={classNames('MoreAreaModal-modal-mask-scroll')}
        getContainer={() => (document.getElementById(containerId || 'similarContainer') as HTMLElement) || document}
        extra={
          <>
            <ExportDoc
              condition={{
                module_type: 'area_f9_similar_score_more',
                isPost: true,
                exportFlag: true,
                year: conditions.year,
                regionCode: conditions.regionCode,
                indicatorCode: conditions.indicatorCode,
                originIndicatorValue: conditions.originIndicatorValue,
                deviationRange: conditions.deviationRange,
                administrationLevel: conditions.administrationLevel,
                provinceCode: conditions.provinceCode,
              }}
              filename={`相似评分_${modalRow?.title}_${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </>
        }
      >
        <Spin spinning={firstLoading} type="thunder" direction="vertical" tip="加载中">
          <div className="modalContent">
            {status === Estatus.SUCCESS ? (
              <>
                <div
                  className={['tableWrap', dataSource.length < 20 ? 'noScrollTable' : null].join(' ')}
                  style={{ overflowY: loading ? 'hidden' : 'auto' }}
                  ref={scrollDomRef}
                >
                  <Table
                    pagination={false}
                    columns={columns as any[]}
                    dataSource={dataSource?.slice(1)}
                    loading={tableLoading}
                    alignSync
                    pinnedRows={pinnedRows}
                    pinnedRowsFixed
                    sticky={{
                      offsetHeader: 0,
                      getContainer: () => scrollDomRef.current!,
                    }}
                  ></Table>
                </div>
                {loading ? null : (
                  <div className="footer">
                    <span className="hint">备注：同本地区相比，指标在偏离度绝对值范围内的地区</span>
                    {dataSource.length ? (
                      <Pagination.AntPagination
                        current={currentPage}
                        total={total}
                        hideOnSinglePage
                        pageSize={conditions.size}
                        size={'small'}
                        showSizeChanger={false}
                        onChange={turnPage}
                      />
                    ) : null}
                  </div>
                )}
              </>
            ) : (
              <Empty type={Empty.LOAD_FAIL}></Empty>
            )}
          </div>
        </Spin>
      </MoreAreaModal>
    </>
  );
};
export default memo(MoreArea);

const MoreAreaModal = styled(Modal.FullScreen)`
  .dzh-modal-body-inner {
    padding: 0px !important;
    overflow: unset !important;
  }
  .ant-spin-container {
    height: 100%;
  }
  .ant-modal-content {
    .areaWrap {
      padding: 12px 32px;
    }
  }
  .modalContent {
    height: 100%;
  }
  .noScrollTable {
    padding-right: 32px !important;
  }
  .more-loading-tips {
    width: 88px;
    height: 88px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 22px 6px rgba(44, 44, 48, 0.07);
    opacity: 1;
    margin-top: -44px;
    z-index: 1;
    top: 45% !important;
    left: calc(50% - 44px) !important;
    .more-loading-text {
      font-size: 13px;
      color: #434343;
      line-height: 20px;
      margin-top: 6px;
      display: block;
    }
  }
  /** 露表头 */
  .more-sort-page-loading {
    //设置翻页时露出表头
    position: relative;
    z-index: 100px;
    .ant-spin-container {
      opacity: 1;
      overflow: visible !important;
      &:after {
        top: 0px; //此top根据表格头部高度来设定
        left: 1px;
        opacity: 0.9;
        transition: none;
        z-index: 2 !important;
        /* height: calc(100% + 30px); */
        width: calc(100% - 2px);
      }
    }
  }
  .tableWrap {
    max-height: calc(100% - 40px);
    padding-left: 32px;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    .region {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      white-space: nowrap;
      width: 100%;
      text-overflow: ellipsis;
      line-height: 18px;
      .icon-region {
        margin-left: 4px;
        display: inline-block;
        width: 21px;
        height: 15px;
        background: url(${require('@/assets/images/area/icon-region.svg')}) no-repeat center center;
        background-size: contain;
        flex-shrink: 0;
      }
    }
    .ant-spin {
      position: ;
    }
  }
  .footer {
    padding: 0px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .hint {
      font-size: 13px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
  }
`;

const MaskScrollGlobalStyle = createGlobalStyle`
  .ant-modal {
    max-width: unset !important;
  }
  .MoreAreaModal-modal-mask-scroll{
    overflow: hidden;
    right: 0;
    z-index: 100;
  }
  @media screen and (max-width: 1279px){
    .MoreAreaModal-modal-mask-scroll{
      overflow-x: auto !important;
      min-width: 100vw !important;
      border: 1px solid transparent;
      .ant-modal-content{
        margin-left: 140px;
      }
    }
  }
`;
