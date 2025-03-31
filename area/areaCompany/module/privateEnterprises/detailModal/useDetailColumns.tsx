import { useMemo } from 'react';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { formatNumber } from '@/utils/format';

interface Props {
  curPage: number;
  keyword: string;
}

export default ({ curPage, keyword }: Props) => {
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
        key: 'name',
        dataIndex: 'name',
        sorter: true,
        width: 233,
        fixed: 'left',
        align: 'left',
        render(_: string, all: Record<string, any>) {
          return <CoNameAndTags code={all.code} name={all.name} tag={all.tags} keyword={keyword} />;
        },
      },
      {
        title: '排名',
        key: 'rank',
        dataIndex: 'rank',
        sorter: true,
        width: 68,
        align: 'right',
        render(text: string) {
          return text ? <TextWrap line={3}>{formatNumber(text, 0)}</TextWrap> : '-';
        },
      },
      {
        title: '连续状态',
        key: 'label',
        dataIndex: 'label',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render(text: string) {
          return text ? <TextWrap line={3}>{text}</TextWrap> : '-';
        },
      },
      {
        title: '登记状态',
        key: 'regStatus',
        dataIndex: 'regStatus',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render(text: string) {
          return text ? <TextWrap line={3}>{text}</TextWrap> : '-';
        },
      },
      {
        title: '法定代表人',
        key: 'legalRepresentative',
        dataIndex: 'legalRepresentative',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 132,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '成立日期',
        key: 'incorporationDate',
        dataIndex: 'incorporationDate',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 94,
        align: 'center',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '注册资本',
        key: 'registeredCapital',
        dataIndex: 'registeredCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 134,
        align: 'right',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '所属地区',
        key: 'provinceName',
        dataIndex: 'provinceName',
        width: 190,
        align: 'left',
        render: (text: string, all: Record<string, any>) => {
          const areaList = [];
          if (text) areaList.push(text);
          if (all.cityName) areaList.push(all.cityName);
          if (all.countyName) areaList.push(all.countyName);
          return <TextWrap line={3}>{areaList.length ? areaList.join('-') : '-'}</TextWrap>;
        },
      },
      {
        title: '行业',
        key: 'industryLevel1',
        dataIndex: 'industryLevel1',
        width: 220,
        align: 'left',
        render: getIndustryRender(['industryLevel1', 'industryLevel2', 'industryLevel3', 'industryLevel4']),
      },
      {
        title: '入选榜单',
        key: 'tagName',
        dataIndex: 'tagName',
        width: 224,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
    ],
    [curPage, keyword],
  );
};
