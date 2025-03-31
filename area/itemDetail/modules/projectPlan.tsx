import { memo, FC } from 'react';

import { HorizontalTableColumnsType, Table } from '@dzh/components';

import { Card } from '@pages/area/itemDetail';

interface ProjectPlanProps {
  info: Record<string, any>;
}

const COLUMNS: HorizontalTableColumnsType = [
  [
    {
      title: '项目建设期',
      dataIndex: 'constructDate',
      render: (text) => <div style={{ width: '100%', textAlign: 'right' }}>{text || '-'}</div>,
    },
    {
      title: '项目运营期',
      dataIndex: 'operationDate',
      render: (text) => <div style={{ width: '100%', textAlign: 'right' }}>{text || '-'}</div>,
    },
  ],
];

const WIDTH = [278];

const ProjectPlan: FC<ProjectPlanProps> = ({ info }) => {
  return (
    <Card title="项目计划">
      <Table.Horizontal columns={COLUMNS} dataSource={info} width={WIDTH} className={''} />
    </Card>
  );
};

export default memo(ProjectPlan);
