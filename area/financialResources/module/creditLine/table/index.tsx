import { memo, useMemo, useRef } from 'react';

import { Table, Spin } from '@dzh/components';
import classNames from 'classnames';
import styled from 'styled-components';

import { AREA_PAGE_HEADER, DEFAULT_NEXT_PAGE_HEIGHT, DEFAULT_PAGE_VERTICAL_MARGIN, getConfig } from '@/app';
import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { TableWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import useTableColumns from '@/pages/finance/stockIssuance/components/useTableColumns';
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
  loading: boolean;
  headFixedPosition?: number;
  scroll?: { x: number };
  hasSettingColumn?: boolean;
  stickyTop?: number;
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
  loading,
  headFixedPosition = 36,
  hasSettingColumn = false,
  tabHeight,
}: TableProps) => {
  const stockRef = useRef<HTMLDivElement>(null);

  const newTargetSelector = useMemo(() => {
    return `${targetSelector}-stocktable`;
  }, [targetSelector]);

  const { tableColumns } = useTableColumns(columns, {
    hasSettingColumn: !!hasSettingColumn,
    getPopupContainer: () => stockRef.current || document.getElementById(newTargetSelector) || document.body,
    targetSelector: newTargetSelector,
  });

  return (
    <>
      {tableData?.length ? (
        <>
          <div id={newTargetSelector.replace('#', '')} ref={stockRef} className="sticky-mount"></div>
          <TableWrapper>
            <Table
              columnLayout="fixed"
              sticky={{
                offsetHeader: headFixedPosition,
                getContainer: () => (document.querySelector('.main-container') as HTMLElement) || document.body,
              }}
              showSorterTooltip={false}
              columns={tableColumns as any}
              dataSource={tableData}
              scroll={{ x: '100%' }}
              onChange={handleSort}
              className={classNames({ 'has-setting-column': hasSettingColumn })}
              pagination={false}
              loading={{ spinning: loading, translucent: true, indicator: <Spin type="square" tip="加载中" /> }}
            />
          </TableWrapper>

          {pager?.total > 50 ? (
            <Pagination
              current={pager.current}
              onChange={onChangePage}
              pageSize={50}
              total={pager?.total}
              style={{ padding: '4px 0px 0px', marginBottom: 0, position: 'relative' }}
              align={'left'}
            />
          ) : null}
        </>
      ) : null}
      {!loading && !tableData?.length ? (
        <EmptyContent tabHeight={tabHeight} headFixedPosition={headFixedPosition}>
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
        </EmptyContent>
      ) : null}
    </>
  );
};

export default memo(StockTable);

export const EmptyContent = styled.div<{ tabHeight?: number; headFixedPosition?: number }>`
  height: ${({ tabHeight, headFixedPosition }) => `calc(
    100vh - ${getConfig((config) => config.css.pageVerticalMargin, DEFAULT_PAGE_VERTICAL_MARGIN)} - ${
    tabHeight ? tabHeight : 40
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
`;
