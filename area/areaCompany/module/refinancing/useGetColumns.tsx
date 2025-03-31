import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { SUBPAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumberAndFixedFloat } from '@/utils/format';

const commonColumnsKeys: string[] = [
  '上市日期',
  '发行价格(元)',
  '发行股数(万股)',
  '募资总额(亿元)',
  '募资净额(亿元)',
  '注册资本',
  '成立日期',
  '证监会行业',
  '所属地区',
];
const additionalColumnsKeys: string[] = [
  '序号',
  '企业名称',
  '股票代码',
  '发行方式',
  '上市板块',
  '发行日期',
  ...commonColumnsKeys,
];
const pationColumnsKeys: string[] = [
  '序号',
  '企业名称',
  '股票代码',
  '上市板块',
  '股权登记日',
  '缴款起始日',
  '缴款截止日',
  ...commonColumnsKeys,
];

const columnsMap = new Map([
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE, additionalColumnsKeys],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT, pationColumnsKeys],
]);

/** 表格排序 */
const tableDefaultSortMap = new Map([
  [
    REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE,
    {
      sortKey: 'issuanceDate',
      sortOrder: 'descend',
    },
  ],
  [
    REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT,
    {
      sortKey: 'listingDate',
      sortOrder: 'descend',
    },
  ],
]);

const getAllColumns = (curPage: number, restParams: Record<string, any>) => [
  {
    title: '序号',
    key: 'idx',
    dataIndex: 'idx',
    width: 42 + Math.max((String(curPage * SUBPAGESIZE).length - 2) * 13, 0),
    fixed: 'left',
    align: 'center',
    render: (_: any, __: any, idx: number) => (curPage - 1) * SUBPAGESIZE + idx + 1,
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
        />
      );
    },
  },
  {
    title: '股票代码',
    key: 'stockCode',
    dataIndex: 'stockCode',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 94,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '发行方式',
    key: 'financingType',
    dataIndex: 'financingType',
    sorter: true,
    width: 93,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '上市板块',
    key: 'listingPlate',
    dataIndex: 'listingPlate',
    sorter: true,
    width: 93,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '股权登记日',
    key: 'recordDate',
    dataIndex: 'recordDate',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 106,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '缴款起始日',
    key: 'issuanceDate',
    dataIndex: 'issuanceDate',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 106,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '缴款截止日',
    key: 'paymentDeadline',
    dataIndex: 'paymentDeadline',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 106,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '发行日期',
    key: 'issuanceDate',
    dataIndex: 'issuanceDate',
    sorter: true,
    width: 93,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '上市日期',
    key: 'listingDate',
    dataIndex: 'listingDate',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 93,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '发行价格(元)',
    key: 'issuancePrice',
    dataIndex: 'issuancePrice',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 115,
    align: 'right',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '发行股数(万股)',
    key: 'issuanceStockCount',
    dataIndex: 'issuanceStockCount',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 128,
    align: 'right',
    render: (text: string) => <TextWrap>{text ? formatNumberAndFixedFloat(text) : '-'}</TextWrap>,
  },
  {
    title: '募资总额(亿元)',
    key: 'raiseAmount',
    dataIndex: 'raiseAmount',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 128,
    align: 'right',
    render: (text: string) => <TextWrap>{text ? formatNumberAndFixedFloat(text) : '-'}</TextWrap>,
  },
  {
    title: '募资净额(亿元)',
    key: 'raiseNetAmount',
    dataIndex: 'raiseNetAmount',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 128,
    align: 'right',
    render: (text: string) => <TextWrap>{text ? formatNumberAndFixedFloat(text) : '-'}</TextWrap>,
  },
  {
    title: '注册资本',
    key: 'registeredCapital',
    dataIndex: 'registeredCapital',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 111,
    align: 'right',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '成立日期',
    key: 'establishmentDate',
    dataIndex: 'establishmentDate',
    sorter: true,
    sortDirections: ['descend', 'ascend'],
    width: 93,
    align: 'center',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
  {
    title: '证监会行业',
    key: 'industryOfCSRC',
    dataIndex: 'industryOfCSRC',
    sorter: true,
    width: 198,
    align: 'left',
    render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
  },
  {
    title: '所属地区',
    key: 'area',
    dataIndex: 'area',
    width: 190,
    align: 'left',
    render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
  },
];

export default (type: REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE | REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT) => {
  return useMemoizedFn(({ curPage, restParams }: { curPage: number; restParams: Record<string, any> }) => {
    const allColumns = useMemo(() => getAllColumns(curPage, restParams), [curPage, restParams]);

    return useMemo(() => {
      return allColumns.reduce((res: Record<string, any>[], cur: Record<string, any>) => {
        if (columnsMap.get(type)!.includes(cur.title)) {
          // 表格默认排序
          if (tableDefaultSortMap.has(type)) {
            const defaultSort = tableDefaultSortMap.get(type)!;
            if (cur.key === defaultSort.sortKey) {
              cur.defaultSortOrder = defaultSort.sortOrder;
            }
          }
          res.push(cur);
        }
        return res;
      }, []);
    }, [allColumns]);
  });
};
