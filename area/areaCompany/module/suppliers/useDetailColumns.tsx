import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

interface Props {
  curPage: number;
}

export default ({ curPage }: Props) => {
  return useMemo(
    () => [
      {
        title: '序号',
        key: 'idx',
        dataIndex: 'idx',
        width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
        // fixed: 'left',
        align: 'center',
        render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
      },
      {
        title: '客户名称',
        key: 'companyName',
        dataIndex: 'companyName',
        width: 365,
        align: 'left',
        // fixed: 'left',
        render(text: string, record: Record<string, any>) {
          return <CoNameAndTags code={record.companyCode} name={text} tag={record.labels} />;
        },
      },
      {
        title: '公告日期',
        key: 'noticeDate',
        dataIndex: 'noticeDate',
        defaultSortOrder: 'descend',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '报告期',
        key: 'reportDate',
        dataIndex: 'reportDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 80,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '合同金额',
        key: 'contractAmount',
        dataIndex: 'contractAmount',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 108,
        align: 'right',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '数据来源',
        key: 'dateSource',
        dataIndex: 'dateSource',
        width: 205,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
    ],
    [curPage],
  );
};
