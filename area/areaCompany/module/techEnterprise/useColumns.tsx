import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { LinkToFile } from '@/pages/area/areaCompany/components/tableCpns/openOrDownloadFiles';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

interface Props {
  curPage: number;
  curDataCounts: number;
  restParams: Record<string, any>;
}

export default ({ curPage, curDataCounts, restParams }: Props) => {
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
        key: 'ITName',
        dataIndex: 'enterpriseName',
        sorter: true,
        width: 232,
        fixed: 'left',
        align: 'left',
        render(_: string, all: Record<string, any>, idx: number) {
          return (
            <CoNameAndTags
              name={_}
              code={all?.enterpriseCode}
              tag={all?.enterpriseNature}
              keyword={restParams?.itName}
            />
          );
        },
      },
      {
        title: '法定代表人',
        key: 'CR0001_004',
        dataIndex: 'legalRepresentative',
        // sorter: true,
        // sortDirections: ['descend', 'ascend'],
        width: 132,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '成立日期',
        key: 'CR0001_002',
        dataIndex: 'establishmentTime',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '注册资本',
        key: 'CR0001_005_yuan',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        dataIndex: 'registeredCapital',
        width: 134,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '国标行业',
        key: 'area',
        dataIndex: 'area',
        width: 220,
        align: 'left',
        render: getIndustryRender([
          'industryCodeLevel1',
          'industryCodeLevel2',
          'industryCodeLevel3',
          'industryCodeLevel4',
        ]),
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
        title: '原文',
        key: 'content',
        width: 55,
        align: 'center',
        render: (text: string, record: any) => {
          return (
            <>
              <LinkToFile originalText={record.originalTextUrl} fileName={record.sFileName} />
            </>
          );
        },
      },
      {
        title: '公布日期',
        key: 'DeclareDate',
        dataIndex: 'declareDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '称号',
        key: 'title',
        dataIndex: 'title',
        width: 132,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '认定单位',
        key: 'issueUnit',
        dataIndex: 'issueUnit',
        width: 232,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
    ],
    [curPage, restParams],
  );
};
