import { memo, FC } from 'react';

import { Table } from '@dzh/components';

import { Card } from '@pages/area/itemDetail';

interface YearsFinancingProps {
  lists: Record<string, any>[];
}

const COLUMNS = [
  { title: '年份', dataIndex: 'year', align: 'left', width: 150, render: (text: string) => text || '-' },
  {
    title: '专项债融资(亿)',
    dataIndex: 'totalBondAmount',
    align: 'right',
    width: 150,
    render: (text: string) => text || '-',
  },
  {
    title: '用作资本金(亿)',
    dataIndex: 'totalCapitalAmount',
    align: 'right',
    width: 150,
    render: (text: string) => text || '-',
  },
];

const YearsFinancing: FC<YearsFinancingProps> = ({ lists }) => {
  return (
    <Card title="专项债历年融资情况">
      <Table columns={COLUMNS as any} dataSource={lists} pagination={false} />
    </Card>
  );
};

export default memo(YearsFinancing);
