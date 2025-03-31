import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

// import ArrowMore from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { SUBPAGESIZE } from '@/pages/area/areaCompany/const';

import { CoNameAndTags } from '../../components/tableCpns/coNameAndTag';
import { LinkToFile } from '../../components/tableCpns/openOrDownloadFiles';
import TextWrap from '../../components/tableCpns/textWrap';

const TAG_1 = ['央企', '央企子公司', '国企', '民企', '城投', '城投子公司', '发债'];
const TAG_2 = [
  '央企',
  '央企子公司',
  '国企',
  '民企',
  '城投',
  '城投子公司',
  '发债',
  '辅导期',
  '申报期',
  '待上市',
  '已上市',
];

export default (handleOpenModal: Function) => {
  return useMemoizedFn(({ curPage, restParams }: { curPage: number; restParams: any }) =>
    useMemo(
      () => [
        {
          title: '序号',
          key: 'idx',
          dataIndex: 'idx',
          width: 42 + Math.max((String(curPage * SUBPAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          render: (_: any, __: any, idx: number) => (curPage - 1) * SUBPAGESIZE + idx + 1,
        },
        {
          title: '企业名称',
          key: 'enterpriseInfo.itName',
          dataIndex: 'enterpriseInfo.itName',
          sorter: true,
          width: 232,
          fixed: 'left',
          align: 'left',
          render(_: string, all: Record<string, any>) {
            return (
              <CoNameAndTags
                code={all.enterpriseInfo.itCode}
                name={all.enterpriseInfo.itName}
                tag={all.enterpriseInfo.tags}
                keyword={restParams.text}
                standaryTagList={TAG_1}
              />
            );
          },
        },
        {
          title: '拟上市板块',
          key: 'intendListingBlock',
          dataIndex: 'intendListingBlock',
          sorter: true,
          width: 108,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '最新状态',
          key: 'newStatus',
          dataIndex: 'newStatus',
          sorter: true,
          width: 105,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '相关公告',
          key: 'sName',
          dataIndex: 'sName',
          width: 82,
          align: 'center',
          render: (text: string, record: any) => {
            return (
              <span className={'numberModal'} onClick={() => handleOpenModal(record)}>
                查看
              </span>
            );
          },
        },
        {
          title: '法定代表人',
          key: 'legalRepresentative',
          dataIndex: 'legalRepresentative',
          width: 133,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 135,
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
          key: '_industry',
          dataIndex: '_industry',
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
    ),
  );
};

export const useReserveColumns = ({ curPage, restParams }: { curPage: number; restParams: any }) => {
  return useMemo(() => {
    return [
      {
        title: '序号',
        key: 'idx',
        dataIndex: 'idx',
        width: 42 + Math.max((String(curPage * SUBPAGESIZE).length - 2) * 13, 0),
        fixed: 'left',
        align: 'center',
        render: (_: any, __: any, idx: number) => (curPage - 1) * SUBPAGESIZE + idx + 1,
      },
      {
        title: '企业名称',
        key: 'enterpriseInfo.itName',
        dataIndex: 'enterpriseInfo.itName',
        sorter: true,
        width: 232,
        fixed: 'left',
        align: 'left',
        render(_: string, all: Record<string, any>) {
          return (
            <CoNameAndTags
              code={all.enterpriseInfo.itCode}
              name={all.enterpriseInfo.itName}
              tag={all.enterpriseInfo.tags}
              keyword={restParams.text}
              standaryTagList={TAG_2}
            />
          );
        },
      },
      {
        title: '法定代表人',
        key: 'legalRepresentative',
        dataIndex: 'legalRepresentative',
        width: 133,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '注册资本',
        key: 'registeredCapital',
        dataIndex: 'registeredCapital',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        width: 135,
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
        key: '_industry',
        dataIndex: '_industry',
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
      {
        title: '榜单名称',
        key: 'tagName',
        dataIndex: 'tagName',
        width: 233,
        align: 'left',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
      {
        title: '原文',
        key: 'fileUrl',
        dataIndex: 'fileUrl',
        width: 50,
        align: 'center',
        render: (text: string, record: any) => {
          return (
            <LinkToFile
              originalText={text}
              fileName={record?.sFileName}
              // suffix={<FileSuffix>查看</FileSuffix>}
            />
          );
        },
      },
      {
        title: '认定单位',
        key: 'recognizedUnit',
        dataIndex: 'recognizedUnit',
        width: 182,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '认定范围',
        key: 'recognizedRange',
        dataIndex: 'recognizedRange',
        width: 76,
        align: 'center',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '数据来源',
        key: 'dataSource',
        dataIndex: 'dataSource',
        width: 182,
        align: 'left',
        render: (text: string) => <TextWrap line={3}>{text || '-'}</TextWrap>,
      },
      {
        title: '公告日期',
        key: 'publishDate',
        dataIndex: 'publishDate',
        // sorter: true,
        width: 94,
        align: 'center',
        render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
      },
    ];
  }, [curPage, restParams]);
};
