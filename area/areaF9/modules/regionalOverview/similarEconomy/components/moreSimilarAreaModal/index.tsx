import { useEffect, memo, useMemo, useRef, useState } from 'react';

import { Table, Empty, Pagination, Spin, Icon, Modal } from '@dzh/components';
import { useRequest, useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { getSimilarEconomy } from '@/apis/area/areaEconomy';
import ExportDoc from '@/components/exportDoc';
import { formatNumber } from '@/utils/format';

import { useCtx } from '../../context';
import { IFilterProps, PAGE_SIZE } from '../../utils';
enum Estatus {
  SUCCESS,
  ERROR,
  NO_POWER,
}

const defaultParams: IFilterProps = {
  skip: 0,
  pageSize: PAGE_SIZE.MODAL_PAGE_SIZE,
  code: '',
};

interface Props {
  containerId: string;
}

const MoreArea = (props: Props) => {
  const { containerId } = props;
  // const [loading, setLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<Estatus>(Estatus.SUCCESS);
  const {
    state: { isOpenModals, modalRow, params },
    update,
  } = useCtx();
  const [conditions, setConditions] = useState<IFilterProps>(defaultParams);
  const scrollDomRef = useRef<HTMLDivElement>(null); // 滚动容器
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 请求参数
  const { run, loading } = useRequest(getSimilarEconomy, {
    manual: true,
    onSuccess(res) {
      if (res?.data?.data?.length && !isEmpty(modalRow)) {
        let rowDatas = res.data.data[0];
        if (rowDatas) {
          setDataSource(rowDatas?.val);
          setUnit(rowDatas?.val[0]?.displayCunit || '');
          // 已失败调用，重新回到之前浏览的一页
          setCurrentPage(conditions.skip / conditions.pageSize + 1);
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
        setConditions({ ...conditions, skip: (currentPage - 1) * conditions.pageSize });
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
  const turnPage = useMemoizedFn((page, pageSize) => {
    if (scrollDomRef.current) {
      scrollDomRef.current.scrollTop = 0;
    }
    setConditions({ ...conditions, skip: (page - 1) * pageSize });
  });

  // 打开弹窗
  useMemo(() => {
    if (isOpenModals) {
      setConditions({
        ...params,
        skip: 0,
        pageSize: PAGE_SIZE.MODAL_PAGE_SIZE,
        indicName: modalRow?.indicName2,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModals]);

  useMemo(() => {
    conditions.code && run(conditions);
  }, [run, conditions]);

  const columns = useMemo(() => {
    return [
      {
        title: '序号',
        key: 'xuhao',
        align: 'center',
        width: Math.max(`${conditions.skip + conditions.pageSize}`.length * 15, 50),
        render: (_: any, row: { regionCode4: any }, index: number) => {
          return <>{row?.regionCode4.toString() === params.code ? '1' : index + conditions.skip + 2}</>;
        },
      },
      {
        title: '地区',
        dataIndex: 'regionName4',
        width: 300,
        align: 'left',
        render: (text: any, row: { regionCode4: number }) => {
          const localTag = <span className="icon-region"></span>;
          return (
            <div className={['region'].join(' ')} title={text}>
              {text}
              {row?.regionCode4.toString() === params.code ? localTag : null}
            </div>
          );
        },
      },
      {
        title: modalRow?.title + (unit ? '(' + unit + ')' : ''),
        dataIndex: 'mvalue',
        width: 212,
        align: 'right',
        render: (text: string | number) => {
          return <span>{formatNumber(text)}</span>;
        },
      },
      {
        title: '偏离值(%)',
        dataIndex: 'deviateDegree',
        width: 212,
        align: 'right',
        render: (text: string) => {
          let num = Number(text);
          return (
            <span
              className="deviateDegree"
              style={{
                color: num && num !== 0.0 ? (num > 0 ? '#FE3A2F' : '#14BA70') : '#262626',
              }}
            >
              {text || '-'}
            </span>
          );
        },
      },
    ];
  }, [conditions.skip, conditions.pageSize, modalRow, params.code, unit]);

  // 解决双滚动条处理
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [dataSource]);

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
      <MoreAreaModal
        title={'更多相似地区'}
        visible={isOpenModals}
        destroyOnClose={true}
        onCancel={closeModal}
        footer={null}
        zIndex={100}
        maskClosable={false}
        wrapClassName={classNames('MoreAreaModal-modal-mask-scroll')}
        getContainer={() => (document.getElementById(containerId || 'similarContainer') as HTMLElement) || document}
        scrollRef={scrollDomRef}
        extra={
          <>
            <ExportDoc
              condition={{
                module_type: 'similiar_economic_more',
                exportFlag: true,
                isPost: false,
                sheetNames: { '0': `相似经济${dayjs(new Date()).format('YYYYMMDD')}` },
                ...conditions,
              }}
              filename={`相似经济_${modalRow?.title}_${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </>
        }
      >
        <Spin spinning={firstLoading} type="thunder" direction="vertical" tip="加载中">
          <div className="modalContent">
            {status === Estatus.SUCCESS ? (
              <>
                <div className="tableWrap">
                  <Table
                    className="similar-modal-table"
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
                    scroll={{
                      x: 'max-content',
                    }}
                  ></Table>
                </div>
                {loading ? null : (
                  <div className="footer">
                    <span className="hint">备注：同本地区相比，指标在偏离度绝对值范围内的地区</span>
                    {dataSource.length ? (
                      <Pagination
                        current={currentPage}
                        total={total}
                        hideOnSinglePage
                        pageSize={conditions.pageSize}
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
  .modalContent {
    height: 100%;
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
  }
  .footer {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    .hint {
      font-size: 13px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #8c8c8c;
      line-height: 20px;
    }
  }

  .similar-modal-table {
    // .ant-table-bordered > .ant-table-container > .ant-table-header > table > thead > tr.dzh-table-fixed-row > th {
    //   background-color: #f7fbff;
    // }
  }
`;
