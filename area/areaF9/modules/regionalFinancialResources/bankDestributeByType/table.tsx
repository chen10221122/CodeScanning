import { FC, memo } from 'react';

import { Table as DzhTable, Spin } from '@dzh/components';

import { Loading } from '@/components';
import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';

import { EmptyContainer, SearchEmptyContainer } from '../common/style';
import useTableData from '../common/useTableData';
import { useCtx } from '../context';
import { PAGE_SIZE } from '../type';

interface Props {
  columns: any[];
  offsetHeader: number;
}

const Table: FC<Props> = ({ columns, offsetHeader }) => {
  const {
    state: { tableData, total, tableCondition, conditionChangeLoading, tableError },
    update,
  } = useCtx();

  useTableData();

  return (
    <>
      {tableData.length > 0 ? (
        <DzhTable
          columnLayout="fixed"
          columns={columns}
          dataSource={tableData}
          showSorterTooltip={false}
          scroll={{ x: 1020 }}
          sticky={{
            offsetHeader: offsetHeader,
            getContainer: () => document.querySelector('.main-container') as HTMLElement,
          }}
          sortDirections={['descend', 'ascend']}
          pagination={false}
          loading={{
            spinning: conditionChangeLoading,
            translucent: true,
            indicator: <Spin type="square" tip="加载中" />,
          }}
        />
      ) : (
        <Loading show={conditionChangeLoading}>
          {tableError === 1 ? (
            <EmptyContainer>
              <Empty style={{ paddingTop: '15%' }} type={Empty.PAGE_NO_DATA_NEW} />
            </EmptyContainer>
          ) : (
            <SearchEmptyContainer>
              <Empty
                type={Empty.NO_DATA_IN_FILTER_CONDITION}
                onClick={() => {
                  update((d) => {
                    d.searchRef?.setInputValue('');
                    d.searchRef?.toggleInput(false);
                    d.resetParams();
                  });
                }}
              />
            </SearchEmptyContainer>
          )}
        </Loading>
      )}
      <Pagination
        current={tableCondition?.skip / PAGE_SIZE + 1 || 1}
        pageSize={50}
        total={total}
        onChange={(current) => {
          update((d) => {
            d.tableCondition.skip = (current - 1) * PAGE_SIZE;
            d.conditionChangeLoading = true;
          });
        }}
        style={{ padding: '8px 0px 0px', position: 'relative', marginBottom: 0 }}
        align={'left'}
      />
    </>
  );
};

export default memo(Table);
