import { memo } from 'react';

// import { isNumber } from 'lodash';
import styled from 'styled-components';

import { Table } from '@/components/antd';
// import { formatNumber } from '@/utils/format';

const Table2 = () => {
  const arr = [6, 0, 0, 0, 0, 0];

  const dataSource = [
    // 经济实力
    {
      key: '1',
      partName: '经济实力',
      name: 'GDP',
      lel1: '≥3000',
      lel2: '(600，3000]',
      lel3: '(300,600]',
      lel4: '(150,300]',
      lel5: '(80,150]',
      lel6: '[0,80]',
    },
    {
      key: '2',
      partName: '经济实力',
      name: 'GDP增速',
      lel1: '≥7',
      lel2: '(5,7]',
      lel3: '(4,5]',
      lel4: '(2,4]',
      lel5: '(0,2]',
      lel6: '[-15,0]',
    },
    {
      key: '3',
      partName: '经济实力',
      name: '人均GDP',
      lel1: '≥150000',
      lel2: '(80000,150000]',
      lel3: '(65000,80000]',
      lel4: '(50000,65000]',
      lel5: '(35000,40000]',
      lel6: '[0,35000]',
    },
    {
      key: '4',
      partName: '经济实力',
      name: '城镇人均可支配收入',
      lel1: '≥65000',
      lel2: '(45000,65000]',
      lel3: '(40000,45000]',
      lel4: '(36000,40000]',
      lel5: '(32000,36000]',
      lel6: '[0,32000]',
    },
    {
      key: '5',
      partName: '经济实力',
      name: '经济密度',
      lel1: '≥7',
      lel2: '(1,7]',
      lel3: '(0.3,1]',
      lel4: '(0.1,0.3]',
      lel5: '(0.01,0.1]',
      lel6: '[0,0.01]',
    },
    {
      key: '6',
      partName: '经济实力',
      name: '城镇化率',
      lel1: '≥85',
      lel2: '(60,85]',
      lel3: '(58,60]',
      lel4: '(56,58]',
      lel5: '(45,56]',
      lel6: '[0,45]',
    },
  ];

  const columns = [
    {
      title: '一级指标',
      width: 72,
      dataIndex: 'partName',
      fixed: 'left',
      render: (value, _row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = arr[index];

        return obj;
      },
    },
    {
      title: '二级指标',
      fixed: 'left',
      width: 132,
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '分档情况',
      align: 'center',
      children: [
        {
          title: '5',
          align: 'right',
          width: 78,
          dataIndex: 'lel1',
        },
        {
          title: '(4,5]',
          align: 'right',
          width: 112,
          dataIndex: 'lel2',
        },
        {
          title: '(3,4]',
          align: 'right',
          width: 112,
          dataIndex: 'lel3',
        },
        {
          title: '(2,3]',
          align: 'right',
          width: 112,
          dataIndex: 'lel4',
        },
        {
          title: '（1,2]',
          align: 'right',
          width: 112,
          dataIndex: 'lel5',
        },
        {
          title: '[0,1]',
          align: 'right',
          width: 112,
          dataIndex: 'lel6',
        },
      ],
    },
  ];

  return (
    <OutTableBox>
      <Table
        type="blueBorderInterlace"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%' }}
        sticky={{
          getContainer: () =>
            document.getElementsByClassName('dzh-pro-modal-help-body-inner-content-right')[0] || document.body,
        }}
      />
    </OutTableBox>
  );
};

export default memo(Table2);

const OutTableBox = styled.div`
  padding-top: 8px;
  .ant-table-tbody > tr.ant-table-row[data-row-key='1'] > td.ant-table-cell:first-of-type {
    background: #f3f8ff !important;
    color: #262626 !important;
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none !important;
  }

  .ant-table-thead > tr:nth-of-type(2) > th.ant-table-cell {
    text-align: right !important;
  }
`;
