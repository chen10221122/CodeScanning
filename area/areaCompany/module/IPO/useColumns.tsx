import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumberAndFixedFloat } from '@/utils/format';

interface Props {
  curPage: number;
  restParams: Record<string, any>;
}

export default ({ curPage, restParams }: Props) => {
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
        title: '发行日期',
        key: 'issuanceDate',
        dataIndex: 'issuanceDate',
        sorter: true,
        defaultSortOrder: 'descend',
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
        width: 194,
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
    ],
    [curPage, restParams.text],
  );
};
