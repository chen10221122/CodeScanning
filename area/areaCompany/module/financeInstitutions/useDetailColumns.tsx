import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

interface Props {
  curPage: number;
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

export default ({ curPage }: Props) => {
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
        title: '金融机构名称',
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
        title: '持股比例(%)',
        key: 'shareholdingRatio',
        dataIndex: 'shareholdingRatio',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 116,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '金融机构类型',
        key: 'financialOrgType',
        dataIndex: 'financialOrgType',
        width: 102,
        align: 'center',
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
    [curPage],
  );
};
