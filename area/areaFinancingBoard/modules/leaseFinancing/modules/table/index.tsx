import { memo } from 'react';

import { Table } from '@/components/antd';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';

import useColumns from './useColumns';

const FinancingTable = ({
  tableData,
  handleOpenModal,
}: {
  tableData: Record<string, any>;
  handleOpenModal: (row: any, extraParams?: any) => void;
}) => {
  const [columns, x] = useColumns(handleOpenModal);
  return (
    <CompactTable>
      <Table
        type="stickyTable"
        columns={columns}
        dataSource={tableData}
        scroll={{ x, y: 168 }}
        stripe={false}
        border={false}
      />
    </CompactTable>
  );
};

export default memo(FinancingTable);
