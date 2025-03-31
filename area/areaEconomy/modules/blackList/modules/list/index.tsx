import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { cloneDeep, isEmpty, isFunction } from 'lodash';
import styled from 'styled-components';

import { Empty, Spin, Table } from '@/components/antd';
import Pagination from '@/components/Pagination';
import Ellipsis from '@/pages/area/areaEconomy/modules/blackList/component/ellipsis';
import {
  FooterHeight,
  NavBarHeight,
  PAGESIZE,
  TableBarHeight,
  TABLEHEADERHEIGHT,
} from '@/pages/area/areaEconomy/modules/blackList/constant';
import { CtxProps, useCtx } from '@/pages/area/areaEconomy/modules/blackList/context';
import {
  ConditionProps,
  defaultParams,
  useGetListData,
} from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetListData';
import {
  TableChangeLoading,
  TableInnerLoading,
  TableInnerEmptyAndError,
} from '@/pages/area/areaEconomy/modules/blackList/style';
import { useImmer } from '@/utils/hooks';

import { column as originColumn } from './config';

type TableParamsType = Pick<ConditionProps, 'pageSize' | 'sort' | 'skip'>;
interface ListProps {
  hanleOpenModal: (row: Record<string, any>) => void;
  setTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tabChangeLoading: boolean;
  clearSelect: Function;
  handleSkipChange?: Function;
  advanceSearchHeight?: number;
  region?: {
    regionCode1: string;
    regionCode2: string;
    regionCode3: string;
  };
  clearCondition: () => void;
}

const orderMap = new Map([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

// 默认表格排序
const defaultSort = {
  key: '',
  sort: '',
};

const List: FC<ListProps> = ({
  hanleOpenModal,
  setTableLoading,
  tabChangeLoading,
  clearSelect,
  handleSkipChange,
  advanceSearchHeight,
  region,
  clearCondition,
}) => {
  const {
    state: { searchParams, activeTab },
    update,
  } = useCtx();

  // 双滚动条问题
  const [hasStickyScroll, setHasStickyScroll] = useState(false);
  // 排序状态
  const [sortInfo, setSortInfo] = useState(defaultSort);
  // 表格参数
  const [tableParams, updateTableParams] = useImmer<TableParamsType>(defaultParams);
  // 请求参数
  const [condition, updateCondition] = useImmer<ConditionProps>(defaultParams);
  const isSkipChangeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: pageHeight } = useSize(document.getElementById('root')) || {};
  const { height: tableContainerHeight, width: tablContainerWidth } = useSize(containerRef) || {};
  // 表格头部距离顶部的高度
  const top = document.querySelector('#blackListContainer .ant-table-thead')?.getBoundingClientRect().top || 0;

  // 请求
  const {
    tableData,
    listTotalCount,
    loadingStatus,
    loading: tableLoading,
    hasData,
    error: tableError,
    run,
  } = useGetListData(condition, activeTab);

  // 手动判断双滚动条问题
  useEffect(() => {
    if (pageHeight && tableContainerHeight && top) {
      setHasStickyScroll(pageHeight <= tableContainerHeight + top + FooterHeight + 20);
    }
  }, [pageHeight, tableContainerHeight, top]);

  // 表格内筛选，滚动条回滚
  useEffect(() => {
    let wrap = document.getElementById('blackListContainer');
    if (wrap) {
      if (loadingStatus) {
        if (isSkipChangeRef.current) {
          isSkipChangeRef.current = false;
          wrap.scrollTop = (advanceSearchHeight || 0) + 1;
        }
      }
      // 加载时滚动条隐藏
      let status = 'overlay';
      if (!loadingStatus || tabChangeLoading) {
        status = 'hidden';
      }
      wrap.style.overflowY = status;
    }
    return () => {
      if (wrap) {
        wrap.style.overflowY = 'overlay';
      }
    };
  }, [loadingStatus, advanceSearchHeight, tabChangeLoading]);

  // loading暴露给父级
  useEffect(() => {
    if (setTableLoading) {
      setTableLoading(tableLoading);
    }
  }, [tableLoading, setTableLoading]);

  // 处理tab右侧
  useEffect(() => {
    if (loadingStatus) {
      update((d: CtxProps) => {
        d.tabRightInfo.count = listTotalCount;
      });
    }
  }, [listTotalCount, loadingStatus, update]);

  // 筛选参数变化，更新请求参数
  useEffect(() => {
    if (searchParams) {
      // setSkip(0);
      setSortInfo(defaultSort);
      updateTableParams((d: TableParamsType) => {
        d = defaultParams;
        return d;
      });
      updateCondition((d: ConditionProps) => {
        d = {
          ...defaultParams,
          ...searchParams,
        };
        return d;
      });
    }
  }, [searchParams, updateCondition, updateTableParams]);

  // 表格参数变化，更新请求参数
  useEffect(() => {
    if (tableParams && Object.values(tableParams!).length) {
      isFunction(clearSelect) && clearSelect();
      update((d: CtxProps) => {
        d.tableParams = tableParams;
      });
      updateCondition((d: ConditionProps) => {
        d.sort = tableParams.sort;
        d.skip = tableParams.skip;
      });
    }
  }, [tableParams, updateCondition, update, clearSelect]);

  const firstColumn = useMemo(() => {
    const skip = tableParams.skip;
    const targetColumn = cloneDeep(originColumn);
    const detailRow = targetColumn.filter((item: any) => item.key === 'detail')[0];
    detailRow.render = (_: string, row: any) => {
      return (
        <span className="table-detail-open-modal" onClick={() => (row.blackList ? hanleOpenModal(row) : null)}>
          {row.blackList ? '查看' : '-'}
        </span>
      );
    };
    targetColumn.unshift({
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: (String(skip + 50).length - 2) * 13 + 42,
      fixed: true,
      render: (_: any, __: any, i: number) => <>{skip + i + 1}</>,
    });
    return targetColumn;
  }, [tableParams.skip, hanleOpenModal]);

  // 手动控制表格排序
  const column = useMemo(() => {
    const len = firstColumn.length;
    let targetSortItem: Record<string, any>, hasSortItem: Record<string, any>;
    for (let i = 0; i < len; i++) {
      const item = firstColumn[i];
      // 清除所有状态
      if (item.key === sortInfo.key) {
        targetSortItem = item;
        // break;
      }
      if (item.sortOrder) {
        hasSortItem = item;
      }
      item.sortOrder = '';

      if (!item.render) {
        item.render = (record: string) => (
          <Ellipsis
            text={item.dataIndex === 'caseNumber' ? record?.replace(/(.*)（(.*)）(.*)/, '$1($2)$3') : record}
            hasHoverStyle={false}
            getContainer={() => document.getElementById('blackListContainer') || document.body}
          />
        );
      }
    }

    if (targetSortItem!) {
      targetSortItem.sortOrder = sortInfo.sort;
    } else if (hasSortItem!) {
      // 高级筛选改变sortInfo，找到hasSortItem即有排序的
      hasSortItem.sortOrder = sortInfo.sort;
    }
    return firstColumn;
  }, [firstColumn, sortInfo]);

  // 计算空状态以及失败高度  128 是两个模块 黑名单 和 区域经济之间的差异
  const emptyHeight = useMemo(() => {
    return (
      (pageHeight || 0) -
      (NavBarHeight + (advanceSearchHeight || 0) + TableBarHeight + TABLEHEADERHEIGHT + FooterHeight + 20 + 12) -
      128
    );
  }, [pageHeight, advanceSearchHeight]);

  // 分页
  const handlePageChange = useMemoizedFn((page: number) => {
    let hasLimit: boolean = false;
    if (isFunction(handleSkipChange)) {
      hasLimit = handleSkipChange(page);
    }
    if (!hasLimit) {
      isSkipChangeRef.current = true;
      // setSkip(page - 1);
      updateTableParams((d: TableParamsType) => {
        d.skip = (page - 1) * 50;
      });
    }
  });

  // 排序
  const handleChangeSort = useMemoizedFn((_, __, { columnKey, order }) => {
    setSortInfo({
      key: columnKey,
      sort: order,
    });
    updateTableParams((d: TableParamsType) => {
      d.sort = order ? `${columnKey}:${orderMap.get(order)}` : defaultParams.sort;
      d.skip = defaultParams.skip;
    });
  });

  return (
    <TableWrapper
      ref={containerRef}
      hasStickyScroll={hasStickyScroll}
      isTabChangeLoading={tabChangeLoading}
      noScroll={!!tableError || !hasData}
      emptyHeight={emptyHeight}
    >
      <TableChangeLoading>
        <Spin type="square" spinning={tabChangeLoading}>
          <TableInnerLoading
            top={top}
            clientHeight={(pageHeight || 0) - top - FooterHeight}
            maxWidth={tablContainerWidth}
          >
            <Spin type="square" spinning={tableLoading} />
          </TableInnerLoading>
          <Table
            type="stickyTable"
            rowKey={(d: any, index: number) => `${JSON.stringify(d)}${index}`}
            showSorterTooltip={false}
            columns={column}
            dataSource={tableData?.list || []}
            sticky={{
              offsetHeader: 114,
              getContainer: () => document.getElementById('blackListContainer') || document.body,
            }}
            scroll={{ x: 1124 }}
            pagination={false}
            onChange={handleChangeSort}
            locale={{
              // 接口data为null时returncode返回了100，但不属于接口错误，加层判断
              emptyText:
                tableError && (tableError as any).returncode !== 100 ? (
                  <TableInnerEmptyAndError
                    height="auto"
                    // heightnumber={emptyHeight}
                    type={Empty.MODULE_LOAD_FAIL}
                    onClick={() => run({ ...condition, ...region })}
                  />
                ) : isEmpty(searchParams) ? (
                  <TableInnerEmptyAndError type={Empty.NO_NEW_RELATED_DATA} />
                ) : (
                  <TableInnerEmptyAndError type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={clearCondition} />
                ),
            }}
          />
          {tableData?.totalSize > PAGESIZE ? (
            <Pagination
              current={tableParams.skip / 50 + 1}
              onChange={handlePageChange}
              pageSize={PAGESIZE}
              total={tableData?.totalSize}
              style={{ padding: '8px 0 0', marginBottom: 0, position: 'relative' }}
              align={'left'}
            />
          ) : null}
        </Spin>
      </TableChangeLoading>
    </TableWrapper>
  );
};

export default List;

const TableWrapper = styled.div<{
  hasStickyScroll: boolean;
  isTabChangeLoading: boolean;
  noScroll: boolean;
  emptyHeight: number;
}>`
  padding-bottom: 20px;

  /* .ant-spin-nested-loading > div > .ant-spin {
    position: absolute;
  } */

  /* 重置table样式 */
  .ant-table-container {
    /* 无数据表格自带滚动条去除 */
    .ant-table-body {
      overflow-x: ${({ noScroll }) => (noScroll ? 'hidden' : 'auto')}!important;
    }
    /* 空状态默认样式修改 */
    ${({ noScroll, emptyHeight }) => {
      return noScroll
        ? `
        .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
          background: #fff !important;
        }
        .ant-table-placeholder {
          height: ${emptyHeight ? `${emptyHeight}px` : '100%'};
          >td {
            padding: 0;
            >.ant-table-expanded-row-fixed {
              padding: 0;
              height: 100%;
            }
          }
        }
      `
        : '';
    }}

    .ant-table-header {
      top: ${({ isTabChangeLoading }) => (isTabChangeLoading ? '0 !important' : '')};
    }

    &::after {
      display: none;
    }

    .ant-checkbox-inner {
      transform: scale(0.75) translateX(-4px);
    }

    // 取消 checkbox 点击水波纹效果
    .ant-checkbox-checked::after {
      display: none;
    }
    .ant-table-thead {
      tr > th {
        line-height: 17px;
      }

      // 序号列单独设置 padding
      th:nth-child(2) {
        padding: 6px 7px;
      }
      th.ant-table-column-has-sorters:hover {
        background: #f8faff !important;
      }
      // antd 排序的一些样式
      .ant-table-column-sorters {
        margin-top: 0 !important;
        margin-left: 4px;
        align-items: center;
        padding: 0;
        // 可控制表头的 align 根据需要改
        justify-content: center;

        .ant-table-column-sorter-full {
          position: relative;
          top: 1px;
          margin-top: 0;
          margin-left: 4px;
          .ant-table-column-sorter-inner {
            height: 20px;
          }
        }

        .ant-table-column-title {
          flex: initial;
          text-align: right;
          width: fit-content;
          //width: 100%;
        }
      }
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 5px 12px;
    }

    /* 双滚动条 */
    .ant-table-sticky-scroll {
      display: ${({ hasStickyScroll }) => (hasStickyScroll ? 'block' : 'none')};
    }
  }

  .ant-table-sticky-holder {
    /* padding-top: 0px !important;
    margin-top: 0px !important; */
    table {
      padding-top: 10px;
      margin-top: -10px;
    }
  }

  /* .ant-spin-container {
    transform: translateZ(0);
  } */

  .table-detail-open-modal {
    cursor: pointer;
    color: #025cdc;
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
    &:hover {
      text-decoration: underline;
    }
  }
`;
