import { useMemo } from 'react';

import { PAGESIZE } from '@/pages/area/areaCompany/const';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';

import CompanyName from './companyName';

//判断逻辑参考：src\pages\area\financialResources\module\creditDetail\useColumns.tsx
const useDetailColumns = ({ curPage, type, branchType }: DetailColumnsProps) => {
  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        className: 'pdd-8',
        fixed: 'left',
        render: (_: any, __: any, i: number) => {
          return (curPage - 1) * PAGESIZE + i + 1;
        },
        hideInSetting: true,
      },
      {
        title: <span>获授信企业(发债主体)</span>,
        dataIndex: 'itName',
        key: '1',
        align: 'left',
        width: 314,
        sorter: true,
        className: 'enterpriseInfo-classname',
        fixed: 'left',
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (itName?: string, raw?: any) => {
          const { itCode2, tags } = raw || {};
          return <CompanyName code={itCode2} name={itName} tag={tags} maxWidth={289} />;
        },
      },
      {
        title: <span>授信额度(亿元)</span>,
        dataIndex: 'creditLimit',
        align: 'right',
        width: 126,
        sorter: true,
        key: '2',
        resizable: true,
        wrapLine: true,
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: <span>已使用(亿元)</span>,
        dataIndex: 'used',
        align: 'right',
        width: 113,
        sorter: true,
        key: '3',
        resizable: true,
        wrapLine: true,
        render: (used?: string) => <div>{used || '-'}</div>,
      },
      {
        title: <span>未使用(亿元)</span>,
        dataIndex: 'nonUsed',
        align: 'right',
        width: 113,
        sorter: true,
        key: '4',
        resizable: true,
        wrapLine: true,
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: <span>授信机构数量</span>,
        dataIndex: 'creditInstitutionNumber',
        align: 'right',
        width: 118,
        sorter: true,
        key: '5',
        resizable: true,
        wrapLine: true,
        render: (text?: string, raw?: any) => {
          return <div>{text || '-'}</div>;
        },
      },
      {
        title: <span>截止日期</span>,
        dataIndex: 'reportPeriod',
        align: 'center',
        width: 92,
        sorter: true,
        key: '6',
        resizable: true,
        wrapLine: true,
        render: (text?: string) => <div>{text || '-'}</div>,
      },
    ],
    [curPage],
  );

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + cur?.width || 0, 0) + columns.length - 1;
  }, [columns]);

  return { scrollX, columns };
};

export default useDetailColumns;
