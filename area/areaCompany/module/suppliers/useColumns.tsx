import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { CoNameAndTags } from '@/pages/area/areaCompany/components/tableCpns/coNameAndTag';
import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

interface Props {
  curPage: number;
  restParams: Record<string, any>;
}

export default (handleOpenModal: Function) => {
  return useMemoizedFn(({ curPage, restParams }: Props) =>
    useMemo(
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
          title: '供应商名称',
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
              />
            );
          },
        },
        {
          title: '客户名称',
          key: 'customInfosExport',
          dataIndex: 'customInfosExport',
          width: 232,
          align: 'left',
          render(customInfosExport: string) {
            return customInfosExport ? <TextWrap line={3}>{customInfosExport}</TextWrap> : '-';
          },
        },
        {
          title: '最新公告日期',
          key: 'publishDate',
          dataIndex: 'publishDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 120,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '报告期',
          key: 'reportDate',
          dataIndex: 'reportDate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 82,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '数据来源',
          key: 'dataSource',
          dataIndex: 'dataSource',
          width: 94,
          align: 'center',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '历史明细(次)',
          key: 'detailCount',
          dataIndex: 'detailCount',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 115,
          align: 'right',
          render: (text: string, all: Record<string, any>) => (
            <span
              className={text ? 'numberModal' : ''}
              onClick={() =>
                text
                  ? handleOpenModal({
                      itCode: all.enterpriseInfo.itCode,
                      itName: all.enterpriseInfo.itName,
                      customInfos: all.customInfos,
                      ...restParams,
                    })
                  : null
              }
            >
              {text || '-'}
            </span>
          ),
        },
        {
          title: '法定代表人/负责人',
          key: 'legalRepresentative',
          dataIndex: 'legalRepresentative',
          width: 132,
          align: 'left',
          render: (text: string) => <TextWrap>{text || '-'}</TextWrap>,
        },
        {
          title: '注册资本/开办资金',
          key: 'registeredCapital',
          dataIndex: 'registeredCapital',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          width: 152,
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
          key: 'registerStatus',
          // 门类：industryName1，大类：industryName2，中类industryName3，小类industryName4
          dataIndex: 'industryName4',
          align: 'left',
          width: 220,
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
      ],
      [curPage, restParams],
    ),
  );
};
