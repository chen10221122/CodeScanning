import { FC, memo } from 'react';

import { Table } from '@/components/antd';
import { CommonTable as TableStyle } from '@/pages/area/areaFinancingBoard/components/moduleWrapper/styles';

interface IProps {
  columns: any[];
  tableData: any[];
  scroll?: any;
}

const CommonTable: FC<IProps> = ({ columns, tableData, scroll }) => {
  return (
    <TableStyle>
      <Table
        type="stickyTable"
        columns={columns}
        dataSource={tableData}
        scroll={scroll}
        stripe={false}
        // border={false}
      />
    </TableStyle>
  );
};

export default memo(CommonTable);
