import { useContext, useMemo } from 'react';

import { Table, Spin } from '@dzh/components';
import styled from 'styled-components';

import Pagination from '@/components/Pagination';
import { shortId } from '@/utils/share';

import IndustrialParkContext from '../../../context';
import MainContext from '../context';
import useColumn from './useColumns';

const TableFinance = () => {
  const { mapStatus, handleOpenEnterpriseModal, handleOpenMapModal } = useContext(IndustrialParkContext);

  const { loading, onlyBodyLoading, condition, tableData, count, handleTableChange, handlePageChange } =
    useContext(MainContext);

  const columns = useColumn({
    mapStatus,
    skip: condition.skip,
    keywords: condition.keywords,
    handleOpenEnterpriseModal,
    handleOpenMapModal,
  });

  const Scroll = useMemo(() => {
    let x = 0;
    if (columns.length)
      columns.forEach((o: any) => {
        x += o.width ? o.width : 0;
      });
    return x ? { x } : undefined;
  }, [columns]);

  return (
    <TableWrapper>
      <Table
        columns={columns}
        dataSource={tableData}
        bordered
        rowKey={() => shortId()}
        onlyBodyLoading={onlyBodyLoading}
        scroll={Scroll}
        sticky={{
          offsetHeader: onlyBodyLoading || !loading ? 32 : 0,
          getContainer: () => (document.querySelector('.side-page-content') as HTMLElement) || document.body,
        }}
        onChange={handleTableChange}
        pagination={false}
        loading={{ spinning: loading, translucent: true, indicator: <Spin type="square" tip="加载中" /> }}
      />
      {count > condition.size ? (
        <Pagination
          current={condition.page}
          pageSize={condition.size}
          total={count}
          onChange={handlePageChange}
          style={{ padding: '8px 0 0 0', margin: 0 }}
          align={'left'}
        />
      ) : null}
    </TableWrapper>
  );
};

export default TableFinance;

export const TableWrapper = styled.div`
  .ant-table-thead > tr > th.pdd-8 {
    padding-left: 8px;
    padding-right: 8px;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr :not(.ant-table-measure-row) > td {
    border: none !important;
    &:not(:last-child, :nth-last-child(2)) {
      border-right: 1px solid #ebf1fb !important;
    }
    &:last-child {
      box-shadow: -1px 0 0 0 #ebf1fb !important;
    }
    &:nth-child(2) {
      border-right-color: #e0e7f4 !important;
    }
  }
  .ant-table-thead > tr > th {
    border-bottom: 1px solid #e0e7f4 !important;
    &:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
      display: none;
    }
  }
  .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
    border-bottom: 1px solid #ebf1fb !important;
  }
`;
