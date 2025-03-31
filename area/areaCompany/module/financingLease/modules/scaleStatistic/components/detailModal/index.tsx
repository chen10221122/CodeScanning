import { FC, memo, useRef, useMemo, useEffect } from 'react';

import { useCreation } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import { cloneDeep, isUndefined } from 'lodash';
import styled from 'styled-components';

import CommonLink from '@/app/components/CommonLink';
import { Empty } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import TableFinance from '@/components/tableFinance';
import PDF_image from '@/pages/finance/financingLeaseNew/images/PDF.svg';
import { divisionNumber, getExternalLink } from '@/utils/format';
import { shortId } from '@/utils/share';

import CompanyEllipsis from '../../components/companyEllipsis';
import FullModal from './fullModal';
import S from './style.module.less';

const PAGESIZE = 50;

interface IProps<R = any> {
  /** 弹窗分类名称(承租人或出租人) */
  name?: 'lessee' | 'leaser' | '';
  /** 总数 */
  total?: number;
  /** 标题 */
  title: string;
  /** 导出参数 */
  exportCondition?: any;
  /** 导出文件名 */
  exportFileName: string;
  /** 返回列表数据 */
  data?: any;
  /** 是否加载中 */
  loading: boolean;
  /** 可见性 */
  visible?: boolean;
  /** 设置可见性 */
  setVisible: (visible: boolean) => void;
  /** 喜欢什么加什么 */
  restProps?: R;
  /** columns配置 */
  columnsConf: any[];
  /** 表格横向滚动宽度 */
  scrollWidth?: number;
  currentPage?: number;
  paginationSize?: number;
  /** 分页事件 */
  onPageChange?: Function;
  container?: HTMLElement | null;
  /** 导出后缀 */
  exportFileNameSuffix?: string;
}

const ModalWithTrendDetail: FC<IProps> = ({
  name,
  title,
  total,
  data,
  exportCondition,
  exportFileName,
  exportFileNameSuffix,
  loading,
  visible,
  setVisible,
  restProps,
  columnsConf,
  scrollWidth,
  currentPage,
  paginationSize = PAGESIZE,
  onPageChange,
  container,
}) => {
  const uuid = useRef(shortId());
  // const first_loading = useLoading(loading);

  const indicatorColumns = useMemo(() => {
    let copyIndicators = cloneDeep(columnsConf);
    /** 将传入的配置信息生成对应的column */
    const getColumnItem = (item: any) => {
      const {
        title,
        sortKey,
        align,
        dataIndex,
        className,
        wrapLine,
        isTextEllipsis,
        LesseeOrLeaser,
        isCreditRating,
        detailModalResizable,
        isDetailModalFixed = false,
      } = item;
      const titleText = <span title={title}>{title}</span>;
      if (isUndefined(align)) item.align = 'center';
      /* 根据有无排序给title赋值*/
      item.title = titleText;
      /* 注意：dataIndex是用作表格列数据渲染的， sortKey是用来传递排序参数的，dataIndex和sortKey可能不是一样的，所以配置两个参数*/
      item.dataIndex = dataIndex ?? sortKey;
      item.key = item.dataIndex;
      item.resizable = isDetailModalFixed && detailModalResizable ? detailModalResizable : true;
      item.wrapLine = wrapLine;
      item.className = className;
      item.fixed = isDetailModalFixed ? 'left' : false;
      if (!item.render) {
        item.render = (text: any, record: any) => {
          let result: any;
          if (text) {
            result = <span title={text}>{text}</span>;
            if (isTextEllipsis) {
              result = (
                <CompanyEllipsis
                  // isNormalType
                  data={LesseeOrLeaser === 'lessee' ? record?.lessee : record?.leaser || []}
                  type={LesseeOrLeaser}
                  textLimitwidth={item.width - 25}
                  noTag={name === LesseeOrLeaser}
                />
              );
            }
            if (isCreditRating) {
              result = (
                <div className="creditRating">
                  <span title={record?.creditRating}>{record?.creditRating}</span>
                  {record?.creditRatingAddress && (
                    <CommonLink to={getExternalLink(record?.creditRatingAddress, true)}>
                      <img src={PDF_image} alt="" style={{ width: '14px', marginLeft: '4px' }} />
                    </CommonLink>
                  )}
                </div>
              );
            }
          } else result = '-';
          return result;
        };
      }
      return item;
    };

    /** 循环 indicators 生成对应的columns结构 */
    const getColumns = (indicatorData: any[]) => {
      const newTree = indicatorData?.map((item) => getColumnItem(item));
      return newTree;
    };

    const indicatorColumns = getColumns(copyIndicators) || [];
    return indicatorColumns;
  }, [columnsConf, name]);

  /** 表格列信息，除前两列信息是写死的，后面所有列的信息是根据传入指标配置生成的 */
  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'orderNumber',
        align: 'center',
        width: Math.max(`${currentPage! * paginationSize}`.length * 16, 44),
        fixed: 'left',
        className: 'pdd-8',
        render: (_: any, __: any, index: number) => {
          return index + 1 + (currentPage! - 1) * paginationSize;
        },
      },

      ...indicatorColumns,
      {
        title: '',
        dataIndex: 'blank',
      },
    ],
    [currentPage, indicatorColumns, paginationSize],
  );

  /** 列表scroll的宽度根据指标中每一列的width进行累加操作 */
  const scroll = useMemo(
    () =>
      columns.reduce(
        (pre, cur) => {
          if (cur.width) return { x: pre.x + Number(cur.width) };
          else return pre;
        },
        { x: 0 },
      ),
    [columns],
  );
  // 解决双滚动条
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [data]);
  const modalTitle = useCreation(() => {
    return (
      <ModalTitle>
        <div className="title">{title ?? '-'}</div>
        <div className="right-title">
          <div className="right-title-content">
            共计
            <span className="right-title-content-count">
              {/* {total && Number(total) ? divisionNumber(total.toString()) :  '-'} */}
              {total && Number(total) ? divisionNumber((total ?? 0).toString()) : '-'}
            </span>
            条
          </div>
          <ExportDoc
            type={EXPORT}
            module_type={exportCondition?.module_type}
            condition={exportCondition}
            filename={`${exportFileName}-${exportFileNameSuffix || dayjs(new Date()).format('YYYYMMDD')}`}
          />
        </div>
      </ModalTitle>
    );
  }, [title, total, exportCondition, exportFileName]);

  const modalContent = useCreation(() => {
    return (
      <>
        <ModalTableContainer id={uuid.current}>
          {data?.length ? (
            <>
              {/* @ts-ignore */}
              <TableFinance
                // rowKey={() => shortId()}
                type="stickyTable"
                isStatic
                stripe
                columns={columns}
                dataSource={data}
                scrollTo={null}
                scroll={scroll}
                sticky={{
                  getContainer: () => document.getElementById(uuid.current) || document.body,
                }}
                saveWidths
                fixedColumnsMaxWidth={840}
              />
              <Pager>
                <div className="changePage">
                  {total && total > paginationSize ? (
                    <Pagination
                      total={total}
                      current={currentPage}
                      pageSize={paginationSize}
                      onChange={onPageChange as any}
                    />
                  ) : null}
                </div>
              </Pager>
            </>
          ) : (
            <Empty type={Empty.NO_DATA} />
          )}
        </ModalTableContainer>
      </>
    );
  }, [data, total, currentPage, columns, loading, scrollWidth]);

  return (
    <FullModal
      visible={visible}
      container={container || document.querySelector('#areaF9censusAnalyseMountedId') || document.body}
      title={[modalTitle]}
      className={cn(`financing-lease-detail-modal`, S.detailModalWrapper)}
      setVisible={setVisible}
      pending={loading}
      content={modalContent}
      wrapClassName="financing-lease-detail-modal-wrapper"
      {...restProps}
    />
  );
};

export default memo(ModalWithTrendDetail);

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    height: 27px;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    color: #141414;
    font-weight: 500;
    line-height: 27px;
  }
  .right-title {
    display: flex;
    align-items: center;
    .right-title-content {
      font-size: 13px;
      color: #8c8c8c;
      line-height: 18px;
      margin-right: 24px;
      font-weight: 400;
      .right-title-content-count {
        color: #262626;
        /* margin: 0 2px; */
      }
    }
  }
`;

const ModalTableContainer = styled.div`
  height: calc(100vh - 213px);
  overflow-y: scroll;
  white-space: normal;
  .reportDate {
    white-space: nowrap !important;
  }
  padding-right: 16px;
  padding-left: 32px;
  margin-right: 6px;
  .ant-empty {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translateX(-75px);
  }
  /* 去除表格阴影 */
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-thead > tr > th {
    text-align: center !important;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  .ant-modal-body {
    padding-bottom: 0;
  }

  .creditRating {
    width: 52px;
    display: flex;
    justify-content: space-between;
    span {
      text-align: right;
      display: inline-block;
      width: 34px;
    }
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: -2px;
      cursor: pointer;
      image-rendering: -webkit-optimize-contrast;
    }
  }
`;

const Pager = styled.div`
  float: right;
  padding-top: 8px;
  position: absolute;
  bottom: -32px;
  right: 32px;
  ul {
    margin-bottom: 0 !important;
  }
`;
