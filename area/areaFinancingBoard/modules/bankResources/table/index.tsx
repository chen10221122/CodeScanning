import { FC, memo } from 'react';

import styled from 'styled-components';

import { Table } from '@/components/antd';
import { CompactTable } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';

interface IProps {
  columns: any[];
  tableData: any[];
  scroll?: any;
}

const CommonTable: FC<IProps> = ({ columns, tableData, scroll }) => {
  return (
    <CompactTable>
      <MyTable
        type="stickyTable"
        columns={columns}
        dataSource={tableData}
        scroll={scroll}
        stripe={false}
        border={false}
      />
    </CompactTable>
  );
};

export default memo(CommonTable);

const MyTable = styled(Table)`
  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .bold {
    font-family: Arial, Arial-BoldMT;
    font-weight: 700;
  }
`;
