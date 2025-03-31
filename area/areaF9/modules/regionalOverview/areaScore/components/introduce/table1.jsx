import { memo } from 'react';

// import { isNumber } from 'lodash';
import styled from 'styled-components';

import { Table } from '@/components/antd';
// import { formatNumber } from '@/utils/format';

const Table1 = () => {
  const arr = [
    6, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0,
  ];

  // const renderContent = (value, _row, _index) => {
  //   const obj = {
  //     children: isNumber(value) ? formatNumber(value) : value ? <div className="text-center">{value}</div> : '-',
  //     props: {},
  //   };
  //   return obj;
  // };
  const dataSource = [
    // 经济实力
    {
      key: '1',
      partName: '经济实力(30%)',
      name: 'GDP',
      weight: '33%',
      className: 'bg-blue',
      explain: '地区生产总值(亿)',
    },
    {
      key: '2',
      partName: '经济实力(30%)',
      name: 'GDP增速',
      weight: '10%',
      explain: '近三年GDP增速均值(%)',
    },
    {
      key: '3',
      partName: '经济实力(30%)',
      name: '人均GDP',
      weight: '15%',
      explain: '地区生产总值/人口(元)',
    },
    {
      key: '4',
      partName: '经济实力(30%)',
      name: '城镇人均可支配收入',
      weight: '22%',
      explain: '城镇人均可支配收入(元)',
    },
    {
      key: '5',
      partName: '经济实力(30%)',
      name: '经济密度',
      weight: '9%',
      explain: '地区生产总值/城区面积',
    },
    {
      key: '6',
      partName: '经济实力(30%)',
      name: '城镇化率',
      weight: '11%',
      explain: '城镇人口/常住人口',
    },
    // 财政实力
    {
      key: '7',
      partName: '财政实力(27%)',
      name: '一般公共预算收入',
      weight: '32%',
      explain: '一般公共预算收入',
    },
    {
      key: '8',
      partName: '财政实力(27%)',
      name: '一般公共预算收入增速',
      weight: '7%',
      explain: '近三年一般公共预算收入增速均值',
    },
    {
      key: '9',
      partName: '财政实力(27%)',
      name: '地方政府综合财力',
      weight: '29%',
      explain: '一般公共预算收入+政府性基金收入+转移性收入+国有资本经营收入',
    },
    {
      key: '10',
      partName: '财政实力(27%)',
      name: '土地依赖度',
      weight: '9%',
      explain: '土地出让收入/（一般公共预算收入+政府性基金收入）',
    },
    {
      key: '11',
      partName: '财政实力(27%)',
      name: '税收占比',
      weight: '10%',
      explain: '税收收入/一般公共预算收入',
    },
    {
      key: '12',
      partName: '财政实力(27%)',
      name: '财政自给率',
      weight: '13%',
      explain: '一般公共预算收入/一般公共预算支出',
    },
    // 债务压力
    {
      key: '13',
      partName: '债务压力(15%)',
      name: '地方政府债务',
      weight: '16%',
      explain: '地方政府债务余额+城投有息债务',
    },
    {
      key: '14',
      partName: '债务压力(15%)',
      name: '地方政府债务增速',
      weight: '8%',
      explain: '近三年地方政府债务增速均值（%）',
    },
    {
      key: '15',
      partName: '债务压力(15%)',
      name: '地方政府债务余额限额比',
      weight: '22%',
      explain: '地方政府债务余额/地方政府债务限额（%）',
    },
    {
      key: '16',
      partName: '债务压力(15%)',
      name: '负债率',
      weight: '31%',
      explain: '地方政府债务余额/GDP（%）',
    },
    {
      key: '17',
      partName: '债务压力(15%)',
      name: '债务率',
      weight: '23%',
      explain: '地方政府债务余额/地方政府综合财力（%）',
    },
    // 金融资源
    {
      key: '18',
      partName: '金融资源(13%)',
      name: '属地法人银行资源',
      weight: '10%',
      explain: '属地法人银行总资产规模/GDP(%)',
    },
    {
      key: '19',
      partName: '金融资源(13%)',
      name: '本外币存贷款余额',
      weight: '33%',
      explain: '本外币存款余额+本外币贷款余额(亿元)',
    },
    {
      key: '20',
      partName: '金融资源(13%)',
      name: '本外币存贷款余额增速',
      weight: '9%',
      explain: '近三年本外币存贷款余额增速均值(%)',
    },
    {
      key: '21',
      partName: '金融资源(13%)',
      name: '股票市场资本化率',
      weight: '22%',
      explain: '注册地A股上市公司市值/GDP(%)',
    },
    {
      key: '22',
      partName: '金融资源(13%)',
      name: '信用债融资能力',
      weight: '17%',
      explain: '债券信用债存量规模/GDP(%)',
    },
    {
      key: '23',
      partName: '金融资源(13%)',
      name: '银行网点密度',
      weight: '9%',
      explain: '每万人银行网点总数',
    },
    // 信用风险
    {
      key: '24',
      partName: '信用风险(7%)',
      name: '不良贷款率',
      weight: '17%',
      explain: '(次级类贷款+可疑类贷款+损失类贷款)/各项贷款(%)',
    },
    {
      key: '25',
      partName: '信用风险(7%)',
      name: '债券违约比例',
      weight: '20%',
      explain: '国企债券违约金额/债券余额',
    },
    {
      key: '26',
      partName: '信用风险(7%)',
      name: '城投非标风险事件',
      weight: '16%',
      explain: '城投非标风险事件次数',
    },
    {
      key: '27',
      partName: '信用风险(7%)',
      name: '城投非标票据逾期',
      weight: '13%',
      explain: '城投非标票据逾期家数',
    },
    {
      key: '28',
      partName: '信用风险(7%)',
      name: '城投利差',
      weight: '34%',
      explain: '年度区域城投利差均值',
    },
    // 营商环境
    // {
    //   key: '29',
    //   partName: '营商环境(5%)',
    //   name: '人均企业数量',
    //   weight: '28%',
    //   explain: '企业数量/常住人口(万人)',
    // },
    // {
    //   key: '30',
    //   partName: '营商环境(5%)',
    //   name: '罚没收入占比',
    //   weight: '26%',
    //   explain: '罚没收入/非税收入',
    // },
    // {
    //   key: '31',
    //   partName: '营商环境(5%)',
    //   name: '每万家企业行政处罚次数',
    //   weight: '24%',
    //   explain: '行政处罚次数/企业家数(万家)',
    // },
    // {
    //   key: '32',
    //   partName: '营商环境(5%)',
    //   name: '每万家企业合同纠纷数量',
    //   weight: '22%',
    //   explain: '合同纠纷数量/企业家数(万家)',
    // },
    // 科创能力
    {
      key: '33',
      partName: '科创能力(8%)',
      name: 'R&D经费投入强度',
      weight: '34%',
      explain: 'R&D支出/GDP',
    },
    {
      key: '34',
      partName: '科创能力(8%)',
      name: '每万人发明专利授权数',
      weight: '29%',
      explain: '发明专利授权数量/常住人口(万人)',
    },
    {
      key: '35',
      partName: '科创能力(8%)',
      name: '高新技术企业密度',
      weight: '25%',
      explain: '每万家企业国家高新技术企业数量(万家)',
    },
    {
      key: '36',
      partName: '科创能力(8%)',
      name: '每十万家科创板企业数量',
      weight: '12%',
      explain: '科创板挂牌上市数量/企业数量(十万家)',
    },
  ];

  const columns = [
    {
      title: '一级指标(权重)',
      width: 107,
      dataIndex: 'partName',
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
      width: 176,
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '二级权重',
      width: 72,
      dataIndex: 'weight',
      align: 'right',
      // render: renderContent,
    },
    {
      title: '指标解释',
      width: 280,
      dataIndex: 'explain',
      align: 'left',
      // render: renderContent,
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

export default memo(Table1);

const OutTableBox = styled.div`
  padding-top: 8px;
  .ant-table-tbody > tr.ant-table-row[data-row-key='1'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='7'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='13'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='18'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='24'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='29'] > td.ant-table-cell:first-of-type,
  .ant-table-tbody > tr.ant-table-row[data-row-key='33'] > td.ant-table-cell:first-of-type {
    background: #f3f8ff !important;
    color: #262626 !important;
  }

  .ant-table-tbody > tr.ant-table-row[data-row-key='33'] > td.ant-table-cell:first-of-type {
    border-bottom: none;
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none !important;
  }
`;
