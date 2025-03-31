import { useCreation } from 'ahooks';

import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import { CoNameAndTags } from '../../components/tableCpns/coNameAndTag';
import TextWrap from '../../components/tableCpns/textWrap';

const TAG = [
  '央企',
  '央企子公司',
  '国企',
  '民企',
  '主板',
  '创业板',
  '科创板',
  '北交所',
  '新三板',
  '港股',
  '中概股',
  '发债',
];

export const useColumns = ({ curPage, restParams }: { curPage: number; restParams: any }) => {
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
        title: '法定代表人/负责人',
        key: 'legalRepresentative',
        dataIndex: 'legalRepresentative',
        width: 133,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },

      {
        title: '注册资本/开办资金',
        key: 'registeredCapital',
        dataIndex: 'registeredCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 150,
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
        key: 'issuanceDate',
        dataIndex: 'issuanceDate',
        width: 220,
        align: 'left',
        render: getIndustryRender(['industryName1', 'industryName2', 'industryName3', 'industryName4']),
      },
      {
        title: '所属地区',
        key: 'area',
        dataIndex: 'area',
        width: 189,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '实际控制人',
        key: 'actualController',
        dataIndex: 'actualController',
        width: 300,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '第一大股东',
        key: 'firstShareholder',
        dataIndex: 'firstShareholder',
        width: 233,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
    ],
    [curPage, restParams],
  );
};
