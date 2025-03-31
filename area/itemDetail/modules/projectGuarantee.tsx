import { memo, FC } from 'react';

import { Table, HorizontalTableColumnsType } from '@dzh/components';

import { Card, emptyFilter } from '@/pages/area/itemDetail';

interface ProjectGuaranteeProps {
  info: Record<string, any>;
}

const getRender = (text: string, unit: string): any => (
  <div style={{ width: '100%', textAlign: 'right' }}>{emptyFilter(text, unit)}</div>
);

const COLUMNS: HorizontalTableColumnsType = [
  [
    { title: '项目预测总收益', dataIndex: 'projectForecastTotalRevenue', render: (text) => getRender(text, '亿') },
    { title: '项目总收益/项目总投资', dataIndex: 'projectTotalInvestment', render: (text) => getRender(text, '倍') },
  ],
  [
    { title: '项目总债务融资本息', dataIndex: 'debtPrincipalInterest', render: (text) => getRender(text, '亿') },
    {
      title: '项目总收益/项目总债务融资本息(覆盖倍数)',
      dataIndex: 'projectCoverageMultiple',
      render: (text) => getRender(text, '倍'),
    },
  ],
  [
    { title: '项目总债务融资本金', dataIndex: 'debtPrincipal', render: (text) => getRender(text, '亿') },
    {
      title: '项目总收益/项目总债务融资本金',
      dataIndex: 'totalProjectDebtFinancingPrincipal',
      render: (text) => getRender(text, '倍'),
    },
  ],
  [
    {
      title: '项目总地方债券融资本息',
      dataIndex: 'localBondPrincipalInterest',
      render: (text) => getRender(text, '亿'),
    },
    {
      title: '项目总收益/项目总地方债券融资本息',
      dataIndex: 'totalBondFinancingPrincipalAndInterest',
      render: (text) => getRender(text, '倍'),
    },
  ],
  [
    { title: '项目总地方债券融资本金', dataIndex: 'localBondPrincipal', render: (text) => getRender(text, '亿') },
    {
      title: '项目总收益/项目总地方债券融资本金',
      dataIndex: 'totalBondFinancingPrincipal',
      render: (text) => getRender(text, '倍'),
    },
  ],
];

const WIDTH = [278];

const ProjectGuarantee: FC<ProjectGuaranteeProps> = ({ info }) => {
  return (
    <Card title="项目收益与债务平衡情况">
      <Table.Horizontal columns={COLUMNS} dataSource={info} width={WIDTH} />
    </Card>
  );
};

export default memo(ProjectGuarantee);
