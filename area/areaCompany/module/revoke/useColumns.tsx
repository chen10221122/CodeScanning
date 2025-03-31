import { useMemo } from 'react';

import { StatusColumn } from '@/pages/area/areaCompany/components/commonColumn/statusColumn';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { LinkToBond } from '@/pages/area/areaCompany/components/tableCpns/linkToF9';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { highlight } from '@/utils/dom';

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
          className: 'areaf9-revoke-itname-column',
          render: (_: string, row: Record<string, any>) => {
            const { itCode, companyName } = row;
            return (
              <TextWrap showPopContent={companyName}>
                <LinkToBond
                  limitLine={1}
                  code={itCode}
                  name={highlight(companyName, restParams?.keyWord || '')}
                  type={'company'}
                />
              </TextWrap>
            );
          },
        },
        {
          dataIndex: 'status',
          sortKey: 'CR0001_041',
          title: '企业状态',
          sorter: true,
          align: 'left',
          width: 108,
          render: (val: string, row: any) => {
            return StatusColumn(row);
          },
        },
        {
          dataIndex: 'revokeDate',
          sortKey: 'CR0156_005',
          title: '吊销日期',
          sorter: true,
          align: 'center',
          width: 95,
        },
        {
          dataIndex: 'cancelDate',
          sortKey: 'CR0156_003',
          title: '注销日期',
          sorter: true,
          align: 'center',
          width: 95,
        },
        {
          dataIndex: 'representative',
          sortKey: 'prefixCR0001_004',
          title: '法定代表人',
          align: 'left',
          sorter: true,
          width: 128,
          render: (txt: any) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
        },
        {
          dataIndex: 'establishmentDate',
          sortKey: 'CR0001_002',
          title: '成立日期',
          align: 'center',
          sorter: true,
          width: 95,
        },
        {
          dataIndex: 'registerCapital',
          sortKey: 'CR0001_005',
          title: '注册资本',
          align: 'right',
          sorter: true,
          width: 104,
        },
        {
          dataIndex: 'regCurrency',
          sortKey: 'CR0001_006',
          title: '注册资本币种',
          align: 'center',
          sorter: true,
          width: 122,
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
          align: 'left',
          width: 331,
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
