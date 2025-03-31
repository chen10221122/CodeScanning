import { useMemo } from 'react';

import CompanyWithTags from '@/pages/area/areaCompany/components/tableCpns/companyWithTags';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import { REGIONAL_MODAL } from '../config';

const columnMap = new Map([
  [
    REGIONAL_MODAL.BOND_FINANCING,
    [
      {
        title: '发行日期',
        key: 'issueDate',
        dataIndex: 'issueDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 94,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '发行规模(亿)',
        key: 'issueAmount',
        dataIndex: 'issueAmount',
        sorter: true,
        width: 118,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
  [
    REGIONAL_MODAL.BOND_ISSUED,
    [
      {
        title: '发行日期',
        key: 'issueDate',
        dataIndex: 'issueDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 94,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '发行规模(亿)',
        key: 'issueAmount',
        dataIndex: 'issueAmount',
        sorter: true,
        width: 118,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
  [
    REGIONAL_MODAL.NET_FINANCING_AMOUNT,
    [
      {
        title: '变动日期',
        key: 'changeDate',
        dataIndex: 'changeDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 96,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '变动类型',
        key: 'changeType',
        dataIndex: 'changeType',
        width: 112,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '净融资额(亿)',
        key: 'netFinancingAmount',
        dataIndex: 'netFinancingAmount',
        width: 100,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '发行额(亿)',
        key: 'issueAmount',
        dataIndex: 'issueAmount',
        width: 90,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '偿还额(亿)',
        key: 'repayAmount',
        dataIndex: 'repayAmount',
        width: 90,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
  [
    REGIONAL_MODAL.BOND_REPAY_PRESSURE,
    [
      {
        title: '变动日期',
        key: 'changeDate',
        dataIndex: 'changeDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 96,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '变动类型',
        key: 'changeType',
        dataIndex: 'changeType',
        width: 112,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '变动金额(亿)',
        key: 'changeAmount',
        dataIndex: 'changeAmount',
        sorter: true,
        width: 118,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
]);

const columnOtherMap = new Map([
  [
    REGIONAL_MODAL.BOND_FINANCING,
    [
      {
        title: '发行价格(元)',
        key: 'issuingPrice',
        dataIndex: 'issuingPrice',
        sorter: true,
        width: 118,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '参考收益率(%)',
        key: 'referenceRate',
        dataIndex: 'referenceRate',
        sorter: true,
        width: 130,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
  [
    REGIONAL_MODAL.BOND_ISSUED,
    [
      {
        title: '发行价格(元)',
        key: 'issuingPrice',
        dataIndex: 'issuingPrice',
        sorter: true,
        width: 118,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '参考收益率(%)',
        key: 'referenceRate',
        dataIndex: 'referenceRate',
        sorter: true,
        width: 130,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
  ],
]);

//表格中间相同的几列
const columnMid = [
  {
    title: '债券类型',
    key: 'bondType',
    dataIndex: 'bondType',
    width: 112,
    align: 'left',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '债券期限(年)',
    key: 'bondMaturity',
    dataIndex: 'bondMaturity',
    sorter: true,
    width: 118,
    align: 'right',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '票面利率(%)',
    key: 'couponRate',
    dataIndex: 'couponRate',
    sorter: true,
    width: 118,
    align: 'right',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '到期日期',
    key: 'dateExpiry',
    dataIndex: 'dateExpiry',
    sorter: true,
    width: 104,
    align: 'center',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
];

//表格后面相同的几列
const columnEnd = [
  {
    title: '债项评级',
    key: 'debtRating',
    dataIndex: 'debtRating',
    width: 80,
    align: 'center',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '主体评级',
    key: 'subjectRating',
    dataIndex: 'subjectRating',
    width: 80,
    align: 'center',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '上市市场',
    key: 'listedMarket',
    dataIndex: 'listedMarket',
    width: 80,
    align: 'center',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '发行人',
    key: 'issuer',
    dataIndex: 'issuer',
    width: 220,
    align: 'left',
    resizable: true,
    wrapLine: true,
    render(text: string, row: Record<string, any>) {
      return (
        <CompanyWithTags
          type={'company'}
          data={{
            ...row,
            code: row.issuerItCode2,
            name: text,
          }}
        />
      );
    },
  },
  {
    title: '省份',
    key: 'province',
    dataIndex: 'province',
    width: 102,
    align: 'left',
    resizable: true,
    wrapLine: true,
    render: (text: string) => text || '-',
  },
  {
    title: '地级市',
    key: 'city',
    dataIndex: 'city',
    width: 180,
    align: 'left',
    resizable: true,
    wrapLine: true,
    render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
  },
  {
    title: '区县',
    key: 'district',
    dataIndex: 'district',
    width: 180,
    align: 'left',
    resizable: true,
    wrapLine: true,
    render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
  },
];

//债券融资，净融资额，新发行债券只数，债券偿还压力弹窗
const useAreaColumns = (curPage: number, type: REGIONAL_MODAL) => {
  /** 表格前面相同的几列 */
  const columnStart = useMemo(
    () => [
      {
        title: '序号',
        key: 'idx',
        dataIndex: 'idx',
        // width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        fixed: 'left',
        align: 'center',
        render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
      },
      {
        title: '债券简称',
        key: 'bondAbbreviation',
        dataIndex: 'bondAbbreviation',
        width: 166,
        fixed: 'left',
        align: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string, row: Record<string, any>) => {
          return (
            <CompanyWithTags
              type={'co'}
              data={{
                ...row,
                code: row.trCode,
                name: text,
              }}
            />
          );
        },
      },
      {
        title: '债券代码',
        key: 'bondCode',
        dataIndex: 'bondCode',
        width: 102,
        align: 'left',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
    [curPage],
  );

  const columns = useMemo(
    () => [
      ...columnStart,
      ...(columnMap.get(type) || []),
      ...columnMid,
      ...(columnOtherMap.get(type) || []),
      ...columnEnd,
    ],
    [columnStart, type],
  );

  return columns;
};

export default useAreaColumns;
