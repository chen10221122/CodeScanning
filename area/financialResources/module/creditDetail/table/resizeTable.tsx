import { FC, memo } from 'react';

import { Table as TableFinance, Spin } from '@dzh/components';

import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { TableWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { EmptyContent, Pager } from '@/pages/area/financialResources/module/creditLine/table';
interface Props {
  columns: any[];
  tableData: any[];
  pager: Pager;
  loading: boolean;
  handleSort: any;
  onChangePage: (curu: number) => void;
  handleReset?: () => void;
  offsetHeader: number;
  tabHeight: number;
  containerId?: string;
}

const Table: FC<Props> = ({
  columns,
  tableData,
  pager,
  loading,
  handleSort,
  onChangePage,
  handleReset,
  offsetHeader,
  tabHeight,
}) => {
  return (
    <>
      {tableData?.length ? (
        <TableWrapper>
          <TableFinance
            columnLayout="fixed"
            columns={columns}
            dataSource={tableData}
            showSorterTooltip={false}
            scroll={{ x: '100%' }}
            sticky={{
              offsetHeader: offsetHeader,
              getContainer: () => document.querySelector('.main-container') as HTMLElement,
            }}
            pagination={false}
            onChange={handleSort}
            loading={{ spinning: loading, translucent: true, indicator: <Spin type="square" tip="加载中" /> }}
          />
          {pager.total > 50 && (
            <Pagination
              onChange={onChangePage}
              current={pager.current || 1}
              pageSize={50}
              total={pager.total}
              style={{ padding: '4px 0px 0px', position: 'relative', left: '9px', marginBottom: 0 }}
              align={'left'}
            />
          )}
        </TableWrapper>
      ) : null}
      {!loading && !tableData?.length ? (
        <EmptyContent tabHeight={tabHeight} headFixedPosition={offsetHeader}>
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
        </EmptyContent>
      ) : null}
    </>
  );
};

export default memo(Table);
