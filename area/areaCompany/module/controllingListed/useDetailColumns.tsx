import { useMemo } from 'react';

import StupidCpn from '@/pages/area/areaCompany/components/tableCpns/aStupidComponent/stupid';
import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumberAndFixedFloat } from '@/utils/format';

interface Props {
  curPage: number;
  /** 股票简称改为八个字的长度 */
  bondNameIsEight?: boolean;
}

const TAG = [
  '央企',
  '央企子公司',
  '国企',
  '民企',
  '城投',
  '城投子公司',
  '主板',
  '创业板',
  '科创板',
  '北交所',
  '新三板',
  '港股',
  '中概股',
  '发债',
];

const renderFn =
  (str: string, isLeft = false) =>
  (_: any, info: any) => {
    return <StupidCpn isLeft={isLeft} info={info?.stockList?.map((i: any) => i?.[str])}></StupidCpn>;
  };

export default ({ curPage, bondNameIsEight = false }: Props) => {
  return useMemo(
    () => [
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
        title: '企业名称',
        key: 'enterpriseInfo.itName',
        dataIndex: 'enterpriseInfo',
        sorter: true,
        width: 233,
        fixed: 'left',
        align: 'left',
        render(_: string, all: Record<string, any>) {
          return (
            <CoNameAndTags
              code={all.enterpriseInfo.itCode}
              name={all.enterpriseInfo.itName}
              tag={all.enterpriseInfo.tags}
              keyword={''}
              standaryTagList={TAG}
            />
          );
        },
      },
      {
        title: '总市值(亿元)',
        key: 'marketCap',
        dataIndex: 'marketCap',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 118,
        align: 'right',
        render: (text: string) => <span>{formatNumberAndFixedFloat(text) || '-'}</span>,
      },
      {
        title: '总股本(亿股)',
        key: 'totalShareCapital',
        dataIndex: 'totalShareCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 118,
        align: 'right',
        render: (text: string) => <span>{formatNumberAndFixedFloat(text) || '-'}</span>,
      },
      {
        title: '股票代码',
        key: 'stockCode',
        dataIndex: 'stockCode',
        width: 93,
        align: 'center',
        render: renderFn('stockCode'),
      },
      {
        title: '股票简称',
        key: 'sName',
        dataIndex: 'sName',
        width: bondNameIsEight ? 132 : 77,
        align: bondNameIsEight ? 'left' : 'center',
        render: renderFn('sName', true),
      },
      {
        title: '上市日期',
        key: 'listingDate',
        dataIndex: 'listingDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 98,
        align: 'center',
        render: renderFn('listingDate'),
      },
      {
        title: '最新收盘价',
        key: 'latestClosingPrice',
        dataIndex: 'latestClosingPrice',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 128,
        align: 'right',
        render: renderFn('latestClosingPrice'),
      },
      {
        title: '持股比例(%)',
        key: 'shareholdingRatio',
        dataIndex: 'shareholdingRatio',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 118,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },

      {
        title: '法定代表人',
        key: 'legalRepresentative',
        dataIndex: 'legalRepresentative',
        width: 133,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '注册资本',
        key: 'registeredCapital',
        dataIndex: 'registeredCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 135,
        align: 'right',
        render: (text: string, record: Record<string, any>) => (
          // record.currency是直接展示在导出里的，和页面展示规则不太一样，人民币页面不显示
          <TextWrap>
            {text ? `${text}${!record.currency || record.currency === '人民币' ? '' : record.currency}` : '-'}
          </TextWrap>
        ),
      },
      {
        title: '成立日期',
        key: 'establishmentDate',
        dataIndex: 'establishmentDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render: (text: string) => <span>{text || '-'}</span>,
      },
      {
        title: '国标行业',
        key: 'issuanceStockCount',
        dataIndex: 'issuanceStockCount',
        width: 221,
        align: 'left',
        render: getIndustryRender(['industryName1', 'industryName2', 'industryName3', 'industryName4']),
      },
      {
        title: '所属地区',
        key: 'area',
        dataIndex: 'area',
        width: 190,
        align: 'left',
        render: (text: string) => <span>{text || '-'}</span>,
      },
    ],
    [curPage, bondNameIsEight],
  );
};
