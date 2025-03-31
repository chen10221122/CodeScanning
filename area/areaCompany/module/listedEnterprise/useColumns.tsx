import { useCreation } from 'ahooks';

import StupidCpn from '@/pages/area/areaCompany/components/tableCpns/aStupidComponent/stupid';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumberAndFixedFloat } from '@/utils/format';

import { CoNameAndTags } from '../../components/tableCpns/coNameAndTag';
// import { ShowDetails } from '../../components/tableCpns/showDetails';
import TextWrap from '../../components/tableCpns/textWrap';

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

const renderFn = (str: string, isLeft?: boolean) => (_: any, info: any) => {
  return <StupidCpn isLeft={isLeft} info={info?.stockList?.map((i: any) => i?.[str])}></StupidCpn>;
};

export default (handleOpenModal: Function) => {
  return ({ curPage, restParams }: { curPage: number; restParams: any }) => {
    return useCreation(
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
                keyword={restParams.text}
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
          width: 120,
          align: 'right',
          render: (text: string) => <TextWrap>{formatNumberAndFixedFloat(text) || '-'}</TextWrap>,
        },
        {
          title: '总股本(亿股)',
          key: 'totalShareCapital',
          dataIndex: 'totalShareCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 120,
          align: 'right',
          render: (text: string) => <TextWrap>{formatNumberAndFixedFloat(text) || '-'}</TextWrap>,
        },
        {
          title: '股票代码',
          key: 'stockCode',
          dataIndex: 'stockCode',
          width: 94,
          align: 'left',
          render: renderFn('stockCode'),
        },

        {
          title: '股票简称',
          key: 'sName',
          dataIndex: 'sName',
          width: 130,
          align: 'left',
          render: renderFn('sName', true),
        },
        {
          title: '上市日期',
          key: 'listingDate',
          dataIndex: 'listingDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 96,
          align: 'right',
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
          title: '下属企业',
          key: 'subsidiaryOrgNum',
          dataIndex: 'subsidiaryOrgNum',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 94,
          align: 'right',
          render: (text: string, all: any) => {
            return text ? (
              <span
                className={text && text !== '-' ? 'numberModal' : ''}
                onClick={() =>
                  text && text !== '-'
                    ? handleOpenModal({
                        itCode: all.enterpriseInfo.itCode,
                        itName: all.enterpriseInfo.itName,
                        ...restParams,
                      })
                    : null
                }
              >
                {Number(text) ? formatNumberAndFixedFloat(text, false) : '-'}
              </span>
            ) : (
              '-'
            );
          },
        },
        {
          title: '法定代表人',
          key: 'legalRepresentative',
          dataIndex: 'legalRepresentative',
          width: 133,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 135,
          align: 'right',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '成立日期',
          key: 'establishmentDate',
          dataIndex: 'establishmentDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 94,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
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
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '实际控制人',
          key: 'actualController',
          dataIndex: 'actualController',
          width: 300,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '第一大股东',
          key: 'firstShareholder',
          dataIndex: 'firstShareholder',
          width: 233,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
      ],
      [curPage, restParams],
    );
  };
};
