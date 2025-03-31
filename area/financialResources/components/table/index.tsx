import { memo, useMemo, useRef, Dispatch, useEffect } from 'react';

import { useSize } from 'ahooks';
import classNames from 'classnames';
import { isBoolean } from 'lodash';
import styled from 'styled-components';

import { AREA_PAGE_HEADER, DEFAULT_NEXT_PAGE_HEIGHT, DEFAULT_PAGE_VERTICAL_MARGIN, getConfig } from '@/app';
import { Empty, Table } from '@/components/antd';
import SimpleIcon from '@/components/icon';
import Pagination from '@/components/Pagination';
import useTableColumns from '@/pages/finance/stockIssuance/components/useTableColumns';

import { SETTINHG_COLUMS_WIDTH, TAB_HEIGHT } from '../const';
import { GlobalStyle } from './resizeTable';

export interface Pager {
  pageSize: number;
  current: number;
  total: number;
}

interface TableProps {
  targetSelector: string;
  columns: any[];
  tableData: any[];
  pager: Pager;
  onChangePage: (current: number) => void;
  handleSort: (pagination: any, filters: any, sorter: any) => void;
  handleReset?: () => void;
  setHeadInfo?: Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  headFixedPosition?: number;
  scroll?: { x: number };
  hasSettingColumn?: boolean;
  stickyTop?: number;
  setFinalColumn?: React.Dispatch<React.SetStateAction<any[]>>;
  tabHeight?: number;
}

const StockTable = ({
  targetSelector,
  columns,
  scroll,
  tableData,
  pager,
  onChangePage,
  handleSort,
  handleReset,
  setHeadInfo,
  loading,
  headFixedPosition = 36,
  hasSettingColumn,
  stickyTop = 54,
  setFinalColumn,
  tabHeight,
}: TableProps) => {
  const { height: tableHeight } = useSize(document.querySelector(targetSelector)) || {};
  const { height: containerHeight } = useSize(document.querySelector('.main-container')) || {};

  const top = document.querySelector(`${targetSelector} .ant-table-thead`)?.getBoundingClientRect().top || 0;

  const stockRef = useRef<HTMLDivElement>(null);

  const newTargetSelector = useMemo(() => {
    return `${targetSelector}-stocktable`;
  }, [targetSelector]);

  const { tableColumns, tableScroll } = useTableColumns(columns, {
    hasSettingColumn: !!hasSettingColumn,
    getPopupContainer: () => stockRef.current || document.getElementById(newTargetSelector) || document.body,
    targetSelector: newTargetSelector,
  });

  useEffect(() => {
    const temp: React.ReactNode[] = [];
    tableColumns.forEach((item) => {
      if (!['index', 'operation'].includes(item.key!)) {
        temp.push(item.title);
      }
    });
    if (setHeadInfo) {
      setHeadInfo(temp);
    }
  }, [tableColumns, setHeadInfo]);

  useEffect(() => {
    setFinalColumn && setFinalColumn([...tableColumns]);
  }, [tableColumns, setFinalColumn]);

  const hasTableStickyScroll = useMemo(() => {
    return tableHeight && containerHeight && tableHeight > containerHeight;
  }, [tableHeight, containerHeight]);

  return (
    <>
      <GlobalStyle hasTableStickyScroll={isBoolean(hasTableStickyScroll) && hasTableStickyScroll} />
      {tableData?.length ? (
        <TableWrapper
          top={top}
          stickyTop={stickyTop}
          clientHeight={(document.getElementById('root')?.clientHeight || 0) - top - 26}
        >
          <div id={newTargetSelector.replace('#', '')} ref={stockRef} className="sticky-mount"></div>
          <MyTable
            type="stickyTable"
            sticky={{
              offsetHeader: headFixedPosition,
              getContainer: () => document.querySelector('.main-container') || document.body,
            }}
            showSorterTooltip={false}
            columns={tableColumns}
            dataSource={tableData}
            scroll={scroll ? scroll : tableScroll}
            onChange={handleSort}
            className={classNames({ 'has-setting-column': hasSettingColumn })}
            loading={
              loading
                ? {
                    wrapperClassName: 'enterpriseScreening-mount-table-loading',
                    tip: '加载中',
                    indicator: (
                      <SimpleIcon
                        style={{ width: 28, height: 28 }}
                        image={require('@/assets/images/common/loading.gif')}
                      />
                    ),
                  }
                : false
            }
          />
          {pager?.total > 50 ? (
            <Pagination
              current={pager.current}
              onChange={onChangePage}
              pageSize={50}
              total={pager?.total}
              style={{ padding: '8px 0px 0px', marginBottom: 0, position: 'relative' }}
              align={'left'}
            />
          ) : null}
        </TableWrapper>
      ) : null}
      {!loading && !tableData?.length ? (
        <EmptyContent tabHeight={tabHeight} headFixedPosition={headFixedPosition}>
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
        </EmptyContent>
      ) : null}
    </>
  );
};

StockTable.defaultProps = {
  hasSettingColumn: false,
};

export default memo(StockTable);

const MyTable = styled(Table)`
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-thead > tr > th + th {
    white-space: unset;
  }
  &.has-setting-column {
    .ant-table-header {
      .ant-table-thead {
        tr:first-child > th:nth-last-child(2) {
          /* padding-right: ${SETTINHG_COLUMS_WIDTH}px; */
          border-right: none;
        }
      }
    }
    .ant-table-body {
      .ant-table-tbody > tr:not(.ant-table-measure-row) > td:nth-last-child(2) {
        border-right: none;
      }
    }
    .ant-table-thead > tr > th:last-child {
      width: ${SETTINHG_COLUMS_WIDTH}px;
      border-left: 1px solid #f2f4f9 !important;
      z-index: 2;
    }
    .ant-table-thead > tr:first-child > th:last-child.ant-table-cell-fix-sticky {
      display: inline-block;
      height: 33px;
      right: -1px;
    }
    .ant-table-thead > tr:first-child > th:last-child .setText {
      top: 0;
    }
    .ant-table-body table col:last-child {
      width: 0 !important;
    }
    .ant-table-container {
      .ant-table-tbody > tr:not(.ant-table-measure-row) > td:last-child {
        display: none;
      }
    }
    .ant-table-ping-right .ant-table-cell-fix-right-first::after,
    .ant-table-ping-right .ant-table-cell-fix-right-last::after {
      box-shadow: none;
    }
  }

  /* .ant-table-header.ant-table-sticky-holder {
    z-index: 9 !important;
  } */

  .ant-table-column-sorters {
    justify-content: center;
  }
  .ant-table-column-sorter {
    margin-left: 4px;
  }
  .ant-table-column-title {
    flex: none;
  }
  .enterpriseScreening-mount-table-loading {
    .ant-spin-container {
      opacity: 1;
      overflow: visible !important;

      &:after {
        opacity: 0.9;
        transition: none;
        z-index: 2 !important;
        height: 100%;
      }
    }

    .ant-spin-spinning {
      width: 88px !important;
      height: 88px !important;
      background-color: #ffffff;
      left: 57% !important;
      transform: translateX(-50%);
      border-radius: 8px;
      box-shadow: 0px 4px 22px 6px rgba(0, 0, 0, 0.05), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;

      .ant-spin-dot {
        position: static !important;
        margin-bottom: 1px !important;
        margin-top: 0 !important;
      }

      .ant-spin-text {
        position: static !important;
        font-size: 13px;
        font-weight: 400;
        color: #434343;
        line-height: 20px;
      }
    }
  }
  .setting-popover {
    width: 277px;

    .ant-popover-inner-content {
      padding: 0px !important;
      max-height: 360px;
      overflow: auto;

      ::-webkit-scrollbar {
        width: 8px;
      }
    }

    .ant-popover-inner {
      padding: 10px 0 !important;
    }
  }
`;

const TableWrapper = styled.div<{ stickyTop: number; clientHeight: number; top: number }>`
  .setting-popover {
    //cursor: move;
    width: 277px;

    .ant-popover-inner-content {
      padding: 0px !important;
      max-height: 360px;
      overflow: auto;

      ::-webkit-scrollbar {
        width: 8px;
      }
    }

    .ant-popover-inner {
      padding: 10px 0 !important;
    }
  }
  // 翻页loading位置
  .enterpriseScreening-mount-table-loading {
    .ant-spin-spinning {
      position: ${({ clientHeight }) => (clientHeight > 110 ? 'fixed' : 'absolute')} !important;
      top: ${({ top, clientHeight }) => {
        if (clientHeight > 210) {
          return `calc(${top}px + 20vh)`;
        } else if (clientHeight > 110) {
          return top + clientHeight * 0.25 + 'px';
        }

        return clientHeight * 0.25 + 'px';
      }} !important;
    }
  }
  .sticky-mount {
    position: sticky;
    top: ${({ stickyTop }) => stickyTop}px;
    right: 0px;
    float: right;
    z-index: 110;
  }
  .setText {
    cursor: pointer;
    text-align: center;
    position: relative;
    top: 0px;
    > span {
      vertical-align: middle;
    }
    > img:first-child {
      margin-left: -1px;
      margin-right: 3px;
    }
    &:hover {
      color: #0171f6;
    }
  }
`;

export const EmptyContent = styled.div<{ tabHeight?: number; headFixedPosition?: number }>`
  /* height: calc(100vh - 156px); */
  height: ${({ tabHeight, headFixedPosition }) => `calc(
    100vh - ${getConfig((config) => config.css.pageVerticalMargin, DEFAULT_PAGE_VERTICAL_MARGIN)} - ${
    tabHeight ? tabHeight : TAB_HEIGHT
  }px - ${headFixedPosition}px - ${AREA_PAGE_HEADER}px - ${DEFAULT_NEXT_PAGE_HEIGHT}px
  )`};
  position: relative;
  min-height: 380px;
  .ant-empty {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    height: auto !important;
  }
  /* @media screen and (max-height: 648px) {
    .ant-empty {
      top: 80px;
      transform: translate(-50%, 0);
    }
  } */
`;
