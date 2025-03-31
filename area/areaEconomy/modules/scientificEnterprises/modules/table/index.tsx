import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useInViewport, useMemoizedFn, useSize } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Empty, Table, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import SkeletonScreen from '@/components/skeletonScreen';
import useTableScroll from '@/pages/detail/modules/enterprise/peerComparison/bankCompare/hooks/useTableScroll';
import { LinkToFile } from '@/pages/enterprise/technologyEnterprise/components/linkToFile';
import { HasPayOverLimitType, HasPayOverLimitListener } from '@/utils/hooks/useHasPayOverLimit';
import { shortId } from '@/utils/share';

import { ChangeScreenStyle } from '../../../../style';
import { EnterpriseTags, CoName } from '../../components';
import { useTableData } from '../../hooks/useTableData';
import PdfImg from '../../image/pdfIcon.webp';
import { useCtx } from '../../provider/ctx';
import TargetContainer from './otherTitleCount';
import styles from './style.module.less';

/** 排序规则映射表 */
const sortMap = new Map<string, string>([
  ['desc', 'descend'],
  ['asc', 'ascend'],
]);

export const TechEnterpriseTable = ({ item, filterParams, hasBottomLine, clearCondition }: any) => {
  const tableRef = useRef(null);
  const tableWapperSize = useRef(null);
  /** 加载状态开关，是否需要在加载完成后滚动到表格顶部 */
  const needScrollToTopRef = useRef(false);
  /** 首次骨架屏加载*/
  const firstSkeletonLoadingRef = useRef(0);
  /** scrollIntoView定位 */
  const scrollPosition = useRef<HTMLElement>(null);

  const havePay = useSelector((store: any) => store.user.info).havePay;
  /** 是否需要发翻页排序后滚动 */
  const [scrollTipVisible] = useInViewport(scrollPosition);

  const {
    state: { enterpriseStatus, areaOrTagChangeMaskLoading, cardContainerHeight },
  } = useCtx();

  /** 条件改变，表格数据请求 */
  const { change, data, loading: tableLoading, params: exportParams } = useTableData({ selectedTarget: item });

  // 筛选条件变化的时候去触发事件重新请求
  useEffect(() => {
    const { filterType, filterValue } = filterParams || {};
    switch (filterType) {
      case 'areaChange':
        change.areaChange({ payload: filterValue });
        break;
      case 'industryChange':
        change.industryChange({ payload: filterValue });
        break;
      case 'amountChange':
        change.amountChange({ payload: filterValue });
        break;
      case 'otherChange':
        change.otherChange({ payload: filterValue });
        break;
      case 'searchChange':
        change.searchChange({ payload: filterValue });
        break;
      case 'clearCondition':
        change.resetChange();
        break;
      default:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  const [limitModalVisible, setLimitModalVisible] = useState(false);

  const tableScrollVisible = useTableScroll({
    currentDom: tableWapperSize.current,
    parentDom: document.getElementById(`tech_enterprise_${enterpriseStatus}`) as HTMLElement,
    // 一些写死的高度
    // 45是卡片上面筛选高度 12是卡片marginBottom 252是图形高度 8是table的marginTop 38是table的筛选项高度
    middleHeight: (cardContainerHeight || 0) + 45 + 12 + 252 + 8 + 38,
  });

  const handlePageChange = useMemoizedFn((page: number) => {
    // normal user 5 pages
    if (!havePay && page > 25) {
      setLimitModalVisible(true);
      return;
    }
    if (page > 1000) {
      PubSub.publish(HasPayOverLimitListener, HasPayOverLimitType.DATA_QUERY);
      return;
    }
    change.pageChange({ type: 'page', payload: page });
  });

  const col = useMemo(() => {
    const col = [
      {
        title: '序号',
        dataIndex: 'index',
        width:
          exportParams?.skip && Number(exportParams?.skip) + 50 > 50
            ? (Number(exportParams.skip) + 50).toString().length * 8 +
              24 /** padding [L 12] + [R 12] + count * [char 8] */
            : 48,
        align: 'center',
        fixed: 'left',
        render: (text: string, row: any, index: number) => {
          return exportParams?.skip ? Number(exportParams?.skip) + index + 1 : index + 1;
        },
      },
      {
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'ITName',
        sorter: true,
        width: 289,
        fixed: 'left',
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return (
            <>
              {text ? <CoName name={text} code={row?.enterpriseCode} keyword={exportParams.itName} /> : '-'}
              <EnterpriseTags coTags={row?.enterpriseNature} />
            </>
          );
        },
      },
      {
        title: '公告日期',
        sorter: true,
        key: 'DeclareDate',
        dataIndex: 'declareDate',
        width: 89,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return (
            <div style={{ width: '66px', textOverflow: 'ellipsis', wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
              {row.declareDate ? row.declareDate : '-'}
            </div>
          );
        },
      },
      {
        title: '发布单位',
        dataInde: 'issueUnit',
        align: 'left',
        width: 247,
        render: (text: string, row: any) => {
          return row.issueUnit ? row.issueUnit : '-';
        },
      },
      {
        title: '其它称号',
        sorter: true,
        key: 'otherTagCodesCount',
        dataInde: 'otherTitleCount',
        width: 87,
        align: 'center',
        render: (text: string, row: any) => {
          return row.otherTitleCount ? (
            <TargetContainer
              count={row.otherTitleCount}
              tag={row.otherTitleCodes}
              needContainer={data?.data?.totalSize >= 4}
            />
          ) : (
            '-'
          );
        },
      },
      {
        title: '原文',
        dataInde: 'originalTextUrl',
        width: 69,
        render: (text: string, row: any) => {
          if (row.originalTextUrl) {
            return (
              <IconWapper>
                <LinkToFile fileName={`${row.enterpriseName}-${row.declareDate}`} originalText={row?.originalTextUrl} />
              </IconWapper>
            );
          } else {
            return '-';
          }
        },
      },
      {
        title: '法定代表人',
        sorter: true,
        key: 'CR0001_004',
        dataIndex: 'legalRepresentative',
        width: 100,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.legalRepresentative ? row.legalRepresentative : '-';
        },
      },
      {
        title: '上市/发债',
        key: 'companyTypeCode',
        sorter: true,
        dataIndex: 'listed',
        width: 92,
        render: (text: string, row: any, index: number) => {
          return row.listed ? row.listed : '-';
        },
      },
      {
        title: '成立日期',
        key: 'CR0001_002',
        sorter: true,
        dataIndex: 'establishmentTime',
        width: 90,
        render: (text: string, row: any, index: number) => {
          return (
            <div style={{ width: '66px', textOverflow: 'ellipsis', wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
              {row.establishmentTime ? row.establishmentTime : '-'}
            </div>
          );
        },
      },
      {
        title: '注册资本',
        key: 'CR0001_005_yuan',
        sorter: true,
        dataIndex: 'registeredCapital',
        width: 102,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.registeredCapital ? row.registeredCapital : '-';
        },
      },
      {
        title: '国标行业门类',
        dataIndex: 'industryCodeLevel1',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return row.industryCodeLevel1 ? row.industryCodeLevel1 : '-';
        },
      },
      {
        title: '国标行业大类',
        dataIndex: 'industryCodeLevel2',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return row.industryCodeLevel2 ? row.industryCodeLevel2 : '-';
        },
      },
      {
        title: '国标行业中类',
        dataIndex: 'industryCodeLevel3',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return row.industryCodeLevel3 ? row.industryCodeLevel3 : '-';
        },
      },
      {
        title: '国标行业细类',
        dataIndex: 'industryCodeLevel4',
        width: 193,
        align: 'left',
        render: (text: string, row: any, index: number) => {
          return row.industryCodeLevel4 ? row.industryCodeLevel4 : '-';
        },
      },
      {
        title: '所属省',
        dataIndex: 'province',
        width: 76,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.province ? row.province : '-';
        },
      },
      {
        title: '所属市',
        dataIndex: 'city',
        width: 80,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.city ? row.city : '-';
        },
      },
      {
        title: '所属区县',
        dataIndex: 'country',
        width: 101,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.country ? row.country : '-';
        },
      },
      {
        title: '称号',
        dataIndex: 'title',
        width: 155,
        align: 'center',
        render: (text: string, row: any, index: number) => {
          return row.title ? row.title : '-';
        },
      },
    ];
    for (let i = 0, len = col.length; i < len; i++) {
      const item = col[i];
      // @ts-ignore
      if (item?.key === exportParams.sortKey) {
        (item as any).sortOrder = sortMap.get(exportParams.sortRule) ?? '';
        break;
      }
    }
    return col;
  }, [exportParams, data]);

  useEffect(() => {
    if (!tableLoading && data) {
      firstSkeletonLoadingRef.current++;
    }
  }, [tableLoading, data]);

  /** 位于指定位置翻页/排序操作才滚动 */
  useEffect(() => {
    if (!tableLoading && needScrollToTopRef.current && !scrollTipVisible) {
      // (scrollPosition.current as HTMLElement).scrollIntoView();
      needScrollToTopRef.current = false;
    }
  }, [tableLoading, scrollTipVisible]);

  /** XXX 去双滚动条*/
  useEffect(() => {
    /** 只有小于20px */
    if (!tableLoading && data?.data?.totalSize < 20) {
      const node = document.querySelector(`#tech_enterprise_${enterpriseStatus} .ant-table-body`);
      if (node) {
        /** XXX 兄弟们别学我嗷 */
        node.scrollLeft++;
      }
    }
  }, [tableLoading, data, enterpriseStatus]);

  // 表格头部距离顶部的高度
  const top = document.querySelector('.ant-table-thead')?.getBoundingClientRect().top || 0;

  const size = useSize(tableWapperSize);

  return (
    <>
      {/* 标题 */}
      <FilterContainer className="filter-container" loading={!areaOrTagChangeMaskLoading && tableLoading}>
        <div className="card-title">{item?.title}</div>
        <div className={styles['screenLine']}>
          <div className={styles['exportAndCount']}>
            <span className={styles['counter']}>
              共<span className={styles['countNumber']}>&nbsp;{data?.data?.totalSize ?? '0'}&nbsp;</span>条
            </span>
            <ExportDoc
              condition={{
                ...exportParams,
                exportFlag: true,
                module_type: 'high_tech_enterprise_web',
                sheetNames: { 0: `${item?.title}` },
              }}
              filename={enterpriseStatus === 1 ? '科技型企业' : '被撤销科技型企业资格'}
            />
          </div>
        </div>
      </FilterContainer>
      {firstSkeletonLoadingRef.current === 0 && !data && (
        <div style={{ height: '200px' }}>
          <SkeletonScreen num={1} firstStyle={{ paddingTop: '23px' }} />
        </div>
      )}
      {/* 表格 */}
      <TableWapper
        style={firstSkeletonLoadingRef.current === 0 && !data ? { opacity: '0', position: 'fixed', zIndex: -10 } : {}}
        clientHeight={(document.getElementById('root')?.clientHeight || 0) - top - 26}
        top={top}
        height={size?.height}
        ref={tableWapperSize}
        enterpriseStatus={enterpriseStatus}
        tableScrollVisible={tableScrollVisible}
      >
        {!isEmpty(data?.data?.list) ? (
          <ChangeScreenStyle>
            <Spin type="square" spinning={!areaOrTagChangeMaskLoading && tableLoading}>
              <Tbl
                columns={col}
                size="small"
                type="stickyTable"
                dataSource={data?.data?.list || []}
                scroll={{ x: 'max-content' }}
                showSorterTooltip={false}
                isStatic={true}
                rowKey={() => shortId()}
                revoke={enterpriseStatus}
                sticky={{
                  offsetHeader: 142,
                  getContainer: () =>
                    document.getElementById(`tech_enterprise_${enterpriseStatus}`) || tableRef.current || document.body,
                }}
                onChange={(pagination: any, filters: any, sorter: any, extra: any) => {
                  change.sortChange({ type: 'table', payload: { sorter, extra } });
                  needScrollToTopRef.current = true;
                }}
                pagination={{
                  total: data?.data?.totalSize,
                  pageSize: 10,
                  style: { padding: '8px 0 16px 0', position: 'relative' },
                  align: 'left',
                  onChange: (p: number) => {
                    handlePageChange(p);
                  },
                  showSizeChanger: false,
                  current: exportParams?.skip ? Number(exportParams.skip) / 10 + 1 : '1',
                }}
              />
            </Spin>
          </ChangeScreenStyle>
        ) : (
          <Empty type={Empty.NO_SCREEN_DATA_CLEAR} className="smallNoScreenDataClear" onClick={clearCondition} />
        )}
        <BottomLine hasPagination={data?.data?.totalSize > 10} hasBottomLine={hasBottomLine} />
      </TableWapper>
      <NoPowerDialog
        visible={limitModalVisible}
        setVisible={setLimitModalVisible}
        type="cloud_total_count_limit"
        key={123}
      />
    </>
  );
};

const TableWapper = styled.div<{
  clientHeight: number;
  top: number;
  height: number | undefined | null;
  enterpriseStatus: 2 | 1;
  tableScrollVisible: boolean;
}>`
  height: 100%;

  @media screen and (max-width: 1279px) {
    .ant-table-sticky-scroll {
      bottom: 10px !important;
    }
  }

  .ant-table-sticky-scroll {
    /* ${({ height }) => {
      if (height && height < 350) {
        return `display: none;`;
      }
    }} */
    display: ${({ tableScrollVisible }) => (tableScrollVisible ? 'block' : 'none')};
  }
  .ant-spin-blur {
    overflow: visible !important;
    opacity: 0.2;
  }
  /* 去除表格阴影 */
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
`;

const Tbl = styled((props) => <Table {...props} />)`
  .ant-table.ant-table-small .ant-table-tbody > tr:not(:first-child) > td {
    padding: 6px 12px !important;
  }
  .ant-table.ant-table-small .ant-table-thead > tr > th {
    padding: 6px 12px !important;
  }
  .ant-table-column-title {
    flex: none;
  }

  .ant-table-column-sorters {
    justify-content: center;
  }

  .ant-table-column-sorter {
    position: relative;
    top: 1px;
    left: 2px;
  }

  .ant-table-column-has-sorters {
    &:hover {
      background-color: #f9fbff !important;
    }
  }

  .ant-table-tbody > tr > td {
    line-height: 20px !important;
  }
`;

const IconWapper = styled.div`
  display: inline-block;
  .original {
    color: #0171f6;
  }
  .original-icon {
    width: 14px;
    height: 14px;
    display: inline-block;
    background: url('${PdfImg}') no-repeat;
    background-size: 100% 100%;
    position: relative;
    top: 3px;
    left: 4px;
  }
`;

const FilterContainer = styled.div<{ loading: boolean }>`
  position: sticky;
  z-index: 7;
  top: ${({ loading }) => (loading ? '0px' : '102px')};
  margin-top: 6px;
  margin-bottom: 2px;
  padding: 10px 0;
  box-sizing: content-box;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  .card-title {
    line-height: 20px;
    &::before {
      top: 3px;
    }
  }
`;

const BottomLine = styled.div<{ hasPagination: boolean; hasBottomLine: boolean }>`
  width: calc(100% + 40px);
  margin-left: -20px;
  height: ${({ hasBottomLine }) => (hasBottomLine ? '6px' : '0px')};
  background: #fafbfc;
  /* 如果没有 分页器，需要设置 下划线距离上边的间距 */
  margin-top: ${({ hasPagination }) => (hasPagination ? '0px' : '16px')};
`;
