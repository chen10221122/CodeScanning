import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import CompanyWithTags from '@/pages/area/areaCompany/components/tableCpns/companyWithTags';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';

export default function useColumns({ curPage, tableRef, data }: DetailColumnsProps) {
  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o: Record<string, string>) => o[key]).join('\n'));
    message.success('复制成功');
  });

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        className: 'pdd-8',
        render: (_: any, __: any, i: number) => {
          return (curPage - 1) * PAGESIZE + i + 1;
        },
      },
      {
        title: '债券代码',
        dataIndex: 'bondCode',
        fixed: 'left',
        width: 112,
        align: 'center',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <>
            债券简称
            <AddBtn
              text={'债券简称'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('bondName');
              }}
            />
          </>
        ),
        dataIndex: 'bondName',
        fixed: 'left',
        width: 195,
        align: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render(text: string, row: any) {
          return (
            <CompanyWithTags
              type={'co'}
              data={{
                ...row,
                code: row.bondItCode2,
                name: text,
              }}
            />
          );
        },
      },
      {
        title: '最新违约日',
        key: 'latestDefaultDate',
        dataIndex: 'latestDefaultDate',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 110,
        align: 'center',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '最新违约金额',
        dataIndex: 'latestDefaultAmount',
        align: 'right',
        width: 110,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '已偿还金额',
        dataIndex: 'paidAmount',
        align: 'right',
        width: 110,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <>
            发行人
            <AddBtn
              text={'发行人'}
              container={() => tableRef.current}
              onClickWithHasPower={() => {
                onCopyBtnClick('issuer');
              }}
            />
          </>
        ),
        dataIndex: 'issuer',
        align: 'left',
        width: 260,
        resizable: true,
        wrapLine: true,
        render(text: string, row: any) {
          return (
            <CompanyWithTags
              type={'company'}
              data={{
                ...row,
                code: row.issuerItCode2,
                name: text,
              }}
            />
          );
        },
      },
      {
        title: '主承',
        dataIndex: 'main',
        align: 'left',
        width: 210,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '违约原因',
        dataIndex: 'defaultReason',
        align: 'center',
        width: 100,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '最新违约类型',
        dataIndex: 'latestDefaultType',
        align: 'center',
        width: 110,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '累计违约金额',
        key: 'sumDefaultAmount',
        dataIndex: 'sumDefaultAmount',
        sorter: true,
        width: 125,
        align: 'right',
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '首次违约日',
        dataIndex: 'firstDefaultDay',
        align: 'center',
        width: 110,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '企业性质',
        dataIndex: 'companyNature',
        align: 'center',
        width: 110,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '行业',
        dataIndex: 'industry',
        align: 'center',
        width: 85,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '地区',
        dataIndex: 'area',
        align: 'center',
        width: 140,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
    [curPage, tableRef, onCopyBtnClick],
  );

  return columns;
}
