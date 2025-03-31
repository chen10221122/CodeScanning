import { useMemo } from 'react';

import CompanyWithTags from '@/pages/area/areaCompany/components/tableCpns/companyWithTags';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import { isFinancialEnterprice } from '../config';

interface Props {
  curPage: number;
  pageType: REGIONAL_PAGE;
  /** 是否是城投，默认为是 */
  isUrbanBond?: boolean;
}



/** 每个页面不同的列 */
const columnMap = new Map([
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK, [
    {
      title: '债券余额(亿)',
      key: 'bondBalance',
      dataIndex: 'bondBalance',
      width: 100,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券类型',
      key: 'bondType',
      dataIndex: 'bondType',
      width: 112,
      align: 'left',
      render: (text: string) => text || '-',
    },
    {
      title: '发行日期',
      key: 'issueDate',
      dataIndex: 'issueDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 94,
      render: (text: string) => text || '-',
    },
    {
      title: '发行规模(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE, [
    {
      title: '变动日期',
      key: 'changeDate',
      dataIndex: 'changeDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '变动类型',
      key: 'changeType',
      dataIndex: 'changeType',
      width: 112,
      render: (text: string) => text || '-',
    },
    {
      title: '净融资额(亿)',
      key: 'netFinancingAmount',
      dataIndex: 'netFinancingAmount',
      width: 100,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '发行额(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      width: 90,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '偿还额(亿)',
      key: 'repayAmount',
      dataIndex: 'repayAmount',
      width: 90,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券类型',
      key: 'bondType',
      dataIndex: 'bondType',
      width: 112,
      align: 'left',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE, [
    {
      title: '发行日期',
      key: 'issueDate',
      dataIndex: 'issueDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 94,
      render: (text: string) => text || '-',
    },
    {
      title: '发行规模(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券类型',
      key: 'bondType',
      dataIndex: 'bondType',
      width: 112,
      align: 'left',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY, [
    {
      title: '变动日期',
      key: 'changeDate',
      dataIndex: 'changeDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '变动类型',
      key: 'changeType',
      dataIndex: 'changeType',
      width: 112,
      render: (text: string) => text || '-',
    },
    {
      title: '变动金额(亿)',
      key: 'changeAmount',
      dataIndex: 'changeAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券类型',
      key: 'bondType',
      dataIndex: 'bondType',
      width: 112,
      align: 'left',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK, [
    {
      title: '债券余额(亿)',
      key: 'bondBalance',
      dataIndex: 'bondBalance',
      width: 100,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券一级类型',
      key: 'firstBondType',
      dataIndex: 'firstBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券二级类型',
      key: 'secondBondType',
      dataIndex: 'secondBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '发行日期',
      key: 'issueDate',
      dataIndex: 'issueDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 94,
      render: (text: string) => text || '-',
    },
    {
      title: '发行规模(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE, [
    {
      title: '变动日期',
      key: 'changeDate',
      dataIndex: 'changeDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '变动类型',
      key: 'changeType',
      dataIndex: 'changeType',
      width: 112,
      render: (text: string) => text || '-',
    },
    {
      title: '净融资额(亿)',
      key: 'netFinancingAmount',
      dataIndex: 'netFinancingAmount',
      width: 100,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '发行额(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      width: 90,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '偿还额(亿)',
      key: 'repayAmount',
      dataIndex: 'repayAmount',
      width: 90,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券一级类型',
      key: 'firstBondType',
      dataIndex: 'firstBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券二级类型',
      key: 'secondBondType',
      dataIndex: 'secondBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE, [
    {
      title: '发行日期',
      key: 'issueDate',
      dataIndex: 'issueDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 94,
      render: (text: string) => text || '-',
    },
    {
      title: '发行规模(亿)',
      key: 'issueAmount',
      dataIndex: 'issueAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券一级类型',
      key: 'firstBondType',
      dataIndex: 'firstBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券二级类型',
      key: 'secondBondType',
      dataIndex: 'secondBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY, [
    {
      title: '变动日期',
      key: 'changeDate',
      dataIndex: 'changeDate',
      sorter: true,
      defaultSortOrder: 'descend',
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '变动类型',
      key: 'changeType',
      dataIndex: 'changeType',
      width: 112,
      render: (text: string) => text || '-',
    },
    {
      title: '变动金额(亿)',
      key: 'changeAmount',
      dataIndex: 'changeAmount',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '债券一级类型',
      key: 'firstBondType',
      dataIndex: 'firstBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
    {
      title: '债券二级类型',
      key: 'secondBondType',
      dataIndex: 'secondBondType',
      width: 104,
      render: (text: string) => text || '-',
    },
  ]]
])

/** 每个页面不同的列 */
const columnOtherMap = new Map([
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '发行价格(元)',
      key: 'issuingPrice',
      dataIndex: 'issuingPrice',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '参考收益率(%)',
      key: 'referenceRate',
      dataIndex: 'referenceRate',
      sorter: true,
      width: 130,
      align: 'right',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
    {
      title: '发行价格(元)',
      key: 'issuingPrice',
      dataIndex: 'issuingPrice',
      sorter: true,
      width: 118,
      align: 'right',
      render: (text: string) => text || '-',
    },
    {
      title: '参考收益率(%)',
      key: 'referenceRate',
      dataIndex: 'referenceRate',
      sorter: true,
      width: 130,
      align: 'right',
      render: (text: string) => text || '-',
    },
  ]],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY, [
    {
      title: '到期日期',
      key: 'dateExpiry',
      dataIndex: 'dateExpiry',
      sorter: true,
      width: 96,
      render: (text: string) => text || '-',
    },
  ]],
])

/** 非金融企业后几列 */
const commonNotFinancialEnd = [{
  title: '债项评级',
  key: 'debtRating',
  dataIndex: 'debtRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '主体评级',
  key: 'subjectRating',
  dataIndex: 'subjectRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '上市市场',
  key: 'listedMarket',
  dataIndex: 'listedMarket',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '发行人',
  key: 'issuer',
  dataIndex: 'issuer',
  width: 220,
  align: 'left',
  render(text: string, row: Record<string, any>) {
    return (
      <CompanyWithTags type={'company'} data={{
        ...row, code: row.issuerItCode2, name: text
      }} />
    );
  },
},
{
  title: '企业性质',
  key: 'enterpriseNature',
  dataIndex: 'enterpriseNature',
  width: 102,
  render: (text: string) => text || '-',
},
{
  title: '申万行业',
  key: 'industryName',
  dataIndex: 'industryName',
  width: 80,
  render: (text: string) => text || '-',
},
{
  title: '是否城投',
  key: 'isCityInvestment',
  dataIndex: 'isCityInvestment',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '省份',
  key: 'province',
  dataIndex: 'province',
  width: 102,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '地级市',
  key: 'city',
  dataIndex: 'city',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
},
{
  title: '区县',
  key: 'district',
  dataIndex: 'district',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
},
{
  title: '平台归属地(城投)',
  key: 'pfAttribution',
  dataIndex: 'pfAttribution',
  width: 180,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '股东背景(城投)',
  key: 'shareholderBackground',
  dataIndex: 'shareholderBackground',
  width: 110,
  render: (text: string) => text || '-',
},
{
  title: '股权关系(城投)',
  key: 'ctrlLevelProperties',
  dataIndex: 'ctrlLevelProperties',
  width: 110,
  render: (text: string) => text || '-',
},
{
  title: '平台类型(城投)',
  key: 'pfType',
  dataIndex: 'pfType',
  width: 110,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '平台重要性(城投)',
  key: 'pfImportance',
  dataIndex: 'pfImportance',
  width: 124,
  render: (text: string) => text || '-',
},
{
  title: '所属开发区(城投)',
  key: 'ownDevZone',
  dataIndex: 'ownDevZone',
  width: 180,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '开发区类别(城投)',
  key: 'devZoneCat',
  dataIndex: 'devZoneCat',
  width: 124,
  align: 'left',
  render: (text: string) => text || '-',
}]
/** 非金融企业的偿债压力,不是城投的后几列 */
const noUrbanNotFinancialEnd = [{
  title: '债项评级',
  key: 'debtRating',
  dataIndex: 'debtRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '主体评级',
  key: 'subjectRating',
  dataIndex: 'subjectRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '上市市场',
  key: 'listedMarket',
  dataIndex: 'listedMarket',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '发行人',
  key: 'issuer',
  dataIndex: 'issuer',
  width: 220,
  align: 'left',
  render(text: string, row: Record<string, any>) {
    return (
      <CompanyWithTags type={'company'} data={{
        ...row, code: row.issuerItCode2, name: text
      }} />
    );
  },
},
{
  title: '企业性质',
  key: 'enterpriseNature',
  dataIndex: 'enterpriseNature',
  width: 102,
  render: (text: string) => text || '-',
},
{
  title: '申万行业',
  key: 'industryName',
  dataIndex: 'industryName',
  width: 80,
  render: (text: string) => text || '-',
},
{
  title: '是否城投',
  key: 'isCityInvestment',
  dataIndex: 'isCityInvestment',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '省份',
  key: 'province',
  dataIndex: 'province',
  width: 102,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '地级市',
  key: 'city',
  dataIndex: 'city',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
},
{
  title: '区县',
  key: 'district',
  dataIndex: 'district',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
}]

/** 金融企业后几列 */
const commonFinancialEnd = [{
  title: '债项评级',
  key: 'debtRating',
  dataIndex: 'debtRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '主体评级',
  key: 'subjectRating',
  dataIndex: 'subjectRating',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '上市市场',
  key: 'listedMarket',
  dataIndex: 'listedMarket',
  width: 76,
  render: (text: string) => text || '-',
},
{
  title: '发行人',
  key: 'issuer',
  dataIndex: 'issuer',
  width: 220,
  align: 'left',
  render(text: string, row: Record<string, any>) {
    return (
      <CompanyWithTags type={'company'} data={{
        ...row, code: row.issuerItCode2, name: text
      }} />
    );
  },
},
{
  title: '省份',
  key: 'province',
  dataIndex: 'province',
  width: 102,
  align: 'left',
  render: (text: string) => text || '-',
},
{
  title: '地级市',
  key: 'city',
  dataIndex: 'city',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
},
{
  title: '区县',
  key: 'district',
  dataIndex: 'district',
  width: 180,
  align: 'left',
  render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
},
{
  title: '企业类型',
  key: 'enterpriseType',
  dataIndex: 'enterpriseType',
  width: 104,
  align: 'left',
  render: (text: string) => text || '-',
},
]

export default ({ curPage, pageType, isUrbanBond = true }: Props) => {
  /** 表格前面相同的几列 */
  const columnStart = useMemo(() => [
    {
      title: '序号',
      key: 'idx',
      dataIndex: 'idx',
      width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
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
      render: (text: string, row: Record<string, any>) => {
        return (
          <CompanyWithTags type={'co'} data={{
            ...row, code: row.trCode, name: text
          }} />
        )
      },
    },
    {
      title: '债券代码',
      key: 'bondCode',
      dataIndex: 'bondCode',
      width: 102,
      align: 'left',
      render: (text: string) => text || '-',
    },
  ], [curPage])
  /** 非金融企业的偿债压力页面，是城投才显示城投标识的列 */
  const columnNotFinancialEnd = isUrbanBond ? commonNotFinancialEnd : noUrbanNotFinancialEnd;
  /** 取金融企业/非金融企业后几列 */
  const columnEnd = isFinancialEnterprice(pageType) ? commonFinancialEnd : columnNotFinancialEnd;

  return useMemo(
    () =>
      [
        ...columnStart,
        ...(columnMap.get(pageType) || []),
        {
          title: '债券期限(年)',
          key: 'bondMaturity',
          dataIndex: 'bondMaturity',
          sorter: true,
          width: 118,
          align: 'right',
          render: (text: string) => text || '-',
        },
        {
          title: '票面利率(%)',
          key: 'couponRate',
          dataIndex: 'couponRate',
          sorter: true,
          width: 118,
          align: 'right',
          render: (text: string) => text || '-',
        },
        ...(columnOtherMap.get(pageType) || []),
        ...columnEnd
      ],
    [pageType, columnStart, columnEnd],
  );
};
