import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import getRegistrationStatusPopover from '@/pages/area/areaCompany/components/commonColumn/registrationStatusPopover';
import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { ShowDetails } from '@/pages/area/areaCompany/components/tableCpns/showDetails';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { handleSortDirections } from '@/pages/area/areaCompany/utils/formatColumns';
import { highlight } from '@/utils/dom';

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
            sorter: true,
            sortKey: 'ITNamePinyinInitial',
            align: 'left',
            fixed: 'left',
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
            dataIndex: 'blackListName',
            title: '黑榜榜单',
            align: 'left',
            width: 232,
            render: (txt: string, row: Record<string, any>) =>
              txt ? (
                <TextWrap line={3} showPopContent={txt || '-'}>
                  <ShowDetails
                    onTrigger={() => openDetailModal(row)}
                    text={highlight(txt, restParams?.text)}
                    disableWrap={false}
                    hasUnderline={true}
                  />
                </TextWrap>
              ) : (
                '-'
              ),
          },
          {
            dataIndex: 'identifyUnit',
            title: '认定单位',
            align: 'left',
            width: 154,
            render: (txt: any) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
          },
          {
            dataIndex: 'dataSource',
            title: '数据来源',
            align: 'left',
            width: 180,
            render: (txt: any) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
          },
          {
            dataIndex: 'inclusionDate',
            title: '列入日期',
            sorter: true,
            sortKey: 'BeginDate',
            align: 'center',
            width: 96,
          },
          {
            dataIndex: 'endDate',
            title: '截止日期',
            sorter: true,
            sortKey: 'EndDate',
            align: 'center',
            width: 96,
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
            render: (txt: string) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
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
