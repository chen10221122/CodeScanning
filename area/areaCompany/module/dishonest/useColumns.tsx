import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import getRegistrationStatusPopover from '@/pages/area/areaCompany/components/commonColumn/registrationStatusPopover';
import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { ShowDetails } from '@/pages/area/areaCompany/components/tableCpns/showDetails';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { handleSortDirections, replaceSymble } from '@/pages/area/areaCompany/utils/formatColumns';

interface Props {
  curPage: number;
  restParams: CompanyFilterResultType;
}

export default ({ openDetailModal }: { openDetailModal: (row: Record<string, any>) => void }) => {
  return useMemoizedFn(({ curPage, restParams }: Props) => {
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
            dataIndex: 'enterpriseInfo',
            title: '企业名称',
            sortKey: 'ITNamePinyinInitial',
            sorter: true,
            fixed: 'left',
            align: 'left',
            width: 233,
            render: (_: string, row: Record<string, any>) => {
              return (
                <CoNameAndTags
                  code={row?.enterpriseInfo?.itCode}
                  name={row?.enterpriseInfo?.itName}
                  tag={row?.enterpriseInfo?.tags}
                  keyword={restParams?.text}
                />
              );
            },
          },
          {
            dataIndex: 'publishDate',
            title: '公布日期',
            sorter: true,
            sortKey: 'DeclareDate',
            align: 'center',
            width: 96,
          },
          {
            dataIndex: 'caseNumber',
            title: '案号',
            align: 'left',
            width: 190,
            render: (txt: any) => {
              const val = replaceSymble(txt);
              return <TextWrap>{val || '-'}</TextWrap>;
            },
          },
          {
            dataIndex: 'caseDate',
            title: '立案日期',
            sorter: true,
            sortKey: 'CaseDate',
            align: 'center',
            width: 96,
          },
          {
            dataIndex: 'caseStatus',
            title: '被执行人的履行情况',
            align: 'center',
            width: 142,
          },
          {
            dataIndex: 'a',
            title: '详情',
            align: 'center',
            width: 53,
            render: (_: any, row: Record<string, any>) => (
              <ShowDetails onTrigger={() => openDetailModal(row)} text={'查看'} disableWrap={true} />
            ),
          },
          {
            dataIndex: 'registrationStatus',
            title: '登记状态',
            width: 121,
            sorter: true,
            sortKey: 'registrationAggs',
            align: 'center',
            render: (_: any, obj: Record<string, any>) => getRegistrationStatusPopover(obj),
          },
          {
            dataIndex: 'legalRepresentative',
            title: '法定代表人',
            width: 132,
            align: 'left',
          },
          {
            dataIndex: 'establishmentDate',
            title: '成立日期',
            align: 'center',
            sorter: true,
            sortKey: 'RegDate',
            width: 96,
          },
          {
            dataIndex: 'registeredCapital',
            title: '注册资本',
            align: 'right',
            sorter: true,
            sortKey: 'CR0001_005_sort',
            width: 138,
          },
          {
            dataIndex: 'industryName1',
            title: '国标行业',
            align: 'left',
            width: 220,
            render: getIndustryRender(['industryName1', 'industryName2', 'industryName3', 'industryName4']),
          },
          {
            dataIndex: 'area',
            title: '所属地区',
            align: 'left',
            width: 189,
          },
        ].map((itemColumn: any) => {
          return handleSortDirections(itemColumn);
        }),
      [curPage, restParams?.text],
    );
  });
};
