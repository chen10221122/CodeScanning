import { useMemo } from 'react';

import { LineWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/bankDestributeByType/useColumns';
import CompanyName from '@/pages/area/financialResources/module/common/companyName';
import { MIN_WIDTH, PADDING } from '@/pages/area/financialResources/module/common/const';
import { Pager } from '@/pages/area/financialResources/module/common/type';

import { sortDescend } from '../../common/const';

const useColumns = ({ pager, keyWord }: { pager: Pager; keyWord?: string }) => {
  const column = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${pager.current * pager.pageSize}`.length * 10 + PADDING, MIN_WIDTH),
        className: 'pdd-8',
        align: 'center',
        render: (text: string, obj: any, i: number) => {
          return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
        },
      },
      {
        title: <div style={{ textAlign: 'center' }}>授信机构</div>,
        dataIndex: 'itName',
        align: 'left',
        width: 354,
        resizable: true,
        ellipsis: true,
        render: (text?: string, raw?: any) => {
          const { itCode2, itName, highLight } = raw || {};
          return <CompanyName code={itCode2} name={keyWord ? highLight : itName} />;
        },
      },
      {
        title: '授信额度(亿元)',
        dataIndex: 'creditLimit',
        align: 'right',
        sorter: true,
        width: 120,
        resizable: true,
        ellipsis: true,
        render: (text?: string) => <LineWrap title={text}> {text || '-'}</LineWrap>,
      },
      {
        title: '已使用(亿元)',
        dataIndex: 'used',
        align: 'right',
        sorter: true,
        width: 120,
        resizable: true,
        ellipsis: true,
        sortDirections: sortDescend,
        render: (used?: string) => <LineWrap title={used}> {used || '-'}</LineWrap>,
      },
      {
        title: '未使用(亿元)',
        dataIndex: 'nonUsed',
        align: 'right',
        sorter: true,
        width: 120,
        resizable: true,

        sortDirections: sortDescend,
        render: (text?: string) => <LineWrap title={text}> {text || '-'}</LineWrap>,
      },
    ],
    [pager, keyWord],
  );
  return column;
};

export default useColumns;
