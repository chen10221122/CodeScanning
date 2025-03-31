import { useMemoizedFn } from 'ahooks';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { LinkToFile } from '@/pages/area/areaCompany/components/tableCpns/openOrDownloadFiles';
import { TextWrap } from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { CompanyFilterResultType } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { handleSortDirections } from '@/pages/area/areaCompany/utils/formatColumns';

interface Props {
  curPage: number;
  restParams: CompanyFilterResultType;
}
export default ({ isShortAA }: { isShortAA: boolean }) => {
  return useMemoizedFn(({ curPage, restParams }: Props) => {
    return useMemoizedFn((isShortAA: boolean) => {
      return [
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
          dataIndex: 'enterpriseName',
          title: '企业名称',
          sortKey: 'enterpriseInfo.itName',
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
          dataIndex: 'mainRating',
          title: '最新主体评级',
          align: 'center',
          sorter: isShortAA,
          reverseSort: true,
          width: isShortAA ? 122 : 108,
        },
        {
          dataIndex: 'ratingOutlook',
          title: '最新展望',
          align: 'center',
          sorter: true,
          reverseSort: true,
          width: 94,
        },
        {
          dataIndex: 'ratingDate',
          title: '最新评级日期',
          sorter: true,
          align: 'center',
          width: 122,
        },
        isShortAA
          ? {
              dataIndex: 'disclosureDate',
              title: '最新披露日期',
              sorter: true,
              align: 'center',
              width: 122,
            }
          : null,
        {
          dataIndex: 'ratingCompany',
          title: '评级公司',
          sorter: true,
          // reverseSort: true,
          align: 'center',
          width: 94,
        },
        {
          dataIndex: 'ratingObject',
          title: '评级对象',
          width: 83,
          align: 'center',
        },
        {
          dataIndex: 'fileUrl',
          title: '评级报告',
          width: 82,
          align: 'center',
          render: (text: string, record: any) => {
            return <LinkToFile originalText={record.fileUrl} />;
          },
        },
        {
          dataIndex: 'legalRepresentative',
          title: '法定代表人',
          width: 132,
          align: 'left',
          render: (txt: string) => <TextWrap line={3}>{txt || '-'}</TextWrap>,
        },
        {
          dataIndex: 'registeredCapital',
          title: '注册资本',
          width: 132,
          sorter: true,
          align: 'right',
        },
        {
          dataIndex: 'establishmentDate',
          title: '成立日期',
          align: 'center',
          sorter: true,
          width: 96,
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
      ]
        .filter((item: any) => !!item)
        .map((itemColumn: any) => {
          return handleSortDirections(itemColumn);
        });
    })(isShortAA);
  });
};
