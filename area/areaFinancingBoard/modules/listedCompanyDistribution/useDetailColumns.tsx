import { useMemo } from 'react';

import { isString } from 'lodash';

import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CompanyName from '@/pages/area/areaFinancingBoard/modules/enterpriseCreditDistribution/companyName';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';
import { formatNumber } from '@/utils/format';

//判断逻辑参考：src\pages\area\financialResources\module\creditDetail\useColumns.tsx
const useDetailColumns = ({ curPage, type, branchType }: DetailColumnsProps) => {
  const column = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: 42,
        className: 'pdd-8',
        fixed: 'left',
        render: (_: any, __: any, i: number) => {
          return (curPage - 1) * PAGESIZE + i + 1;
        },
        hideInSetting: true,
      },
      {
        title: '企业名称',
        dataIndex: 'itname',
        align: 'left',
        width: 230,
        fixed: 'left',
        render: (itname?: string, raw?: any) => {
          const { itcode2, tags } = raw || {};
          return <CompanyName code={itcode2} name={itname} tag={tags} maxWidth={289} />;
        },
      },
      {
        title: '股票代码',
        dataIndex: 'Symbol',
        width: 120,
        align: 'left',
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: '上市日期',
        dataIndex: 'EQ0062_006',
        width: 90,
        className: 'no-padding',
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: '上市板块',
        dataIndex: 'EQ0062_002',
        width: 88,
        align: 'left',
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: '最新市值(亿元)',
        dataIndex: 'EQ9107_007',
        width: 122,
        align: 'right',
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: '募资总额(亿元)',
        dataIndex: 'EQ0062_009',
        width: 122,
        render: (text?: any) => (
          <div> {isString(text) && text.indexOf(',') > -1 ? text : formatNumber(text, 2) || '-'} </div>
        ),
      },
      {
        title: '企业性质',
        dataIndex: 'entType',
        width: 96,
        render: (text?: string) => <div>{text || '-'}</div>,
      },
      {
        title: '产业类别',
        dataIndex: 'industryType',
        width: 100,
        render: (text?: string) => <div>{text || '-'}</div>,
      },
    ],
    [curPage],
  );
  return column;
};

export default useDetailColumns;
