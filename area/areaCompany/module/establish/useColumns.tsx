import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

interface Props {
  curPage: number;
  restParams: CompanyFilterResultType;
}

export default ({ curPage, restParams }: Props) => {
  return useMemo(
    () =>
      [
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
          dataIndex: 'companyName',
          title: '企业名称',
          sortKey: 'ITName',
          sorter: true,
          align: 'left',
          fixed: 'left',
          width: 233,
          render: (_: string, row: Record<string, any>) => {
            return (
              <CoNameAndTags
                code={row?.itCode}
                name={row?.companyName}
                tag={row?.businessTypesTag}
                keyword={restParams?.keyWord}
              />
            );
          },
        },
        {
          dataIndex: 'establishmentDate',
          sortKey: 'CR0001_002',
          title: '成立日期',
          sorter: true,
          align: 'center',
          width: 96,
        },
        {
          dataIndex: 'representative',
          sortKey: 'prefixCR0001_004',
          title: '法定代表人',
          align: 'left',
          sorter: true,
          width: 132,
          render: (txt: any) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
        },
        {
          dataIndex: 'registerCapital',
          sortKey: 'CR0001_005',
          title: '注册资本',
          sorter: true,
          align: 'right',
          width: 104,
        },
        {
          dataIndex: 'regCurrency',
          sortKey: 'CR0001_006',
          title: '注册资本币种',
          sorter: true,
          align: 'center',
          width: 122,
        },
        {
          dataIndex: 'socialUnifiedCreditCode',
          sortKey: 'CR0001_008',
          title: '统一社会信用代码',
          sorter: true,
          align: 'left',
          width: 180,
        },
        {
          dataIndex: 'businessTypes',
          title: '企业类型',
          align: 'left',
          width: 92,
        },
        {
          dataIndex: 'organizationalForm',
          title: '组织形式',
          width: 104,
          align: 'left',
        },
        {
          dataIndex: 'telephone',
          title: '联系电话',
          width: 128,
          align: 'left',
        },
        {
          dataIndex: 'industryLevel1',
          title: '国标行业',
          align: 'left',
          width: 220,
          render: getIndustryRender(['industryLevel1', 'industryLevel2', 'industryLevel3', 'industryLevel4']),
        },
        {
          dataIndex: 'area',
          title: '所属地区',
          align: 'left',
          width: 189,
        },
        {
          dataIndex: 'registerArea',
          title: '注册地址',
          width: 331,
          align: 'left',
          render: (txt: any) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
        },
      ].map((itemColumn: any) => {
        return {
          ...itemColumn,
          sortDirections: ['descend', 'ascend'],
          render: itemColumn?.render ? itemColumn?.render : (txt: any) => <TextWrap>{txt || '-'}</TextWrap>,
        };
      }),
    [curPage, restParams?.keyWord],
  );
};
