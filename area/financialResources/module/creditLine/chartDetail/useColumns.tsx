import { useMemo } from 'react';

import { LineWrap } from '@/pages/area/areaF9/modules/regionalFinancialResources/bankDestributeByType/useColumns';
import { MIN_WIDTH, PADDING } from '@/pages/area/financialResources/module/common/const';
import { Pager } from '@/pages/area/financialResources/module/common/type';

const useColumns = ({ pager, regionName }: { pager: Pager; regionName?: string }) => {
  const column = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: Math.max(`${pager.current * pager.pageSize}`.length * 10 + PADDING, MIN_WIDTH),
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span>{(pager.current - 1) * pager.pageSize + i + 1}</span>;
        },
      },
      {
        title: '截止年度',
        dataIndex: 'reportPeriod',
        align: 'center',
        width: 241,
        ellipsis: true,
        resizable: true,
        render: (text?: string) => <LineWrap title={text}> {text || '-'}</LineWrap>,
      },
      {
        title: '银行总授信规模(亿元)',
        dataIndex: 'totalCreditLimit',
        align: 'right',
        width: 241,
        ellipsis: true,
        resizable: true,
        render: (text?: string) => <LineWrap title={text}> {text || '-'}</LineWrap>,
      },
      {
        title: `${regionName}授信规模占比(%)`,
        dataIndex: 'ratio',
        align: 'right',
        width: 242,
        ellipsis: true,
        resizable: true,
        render: (text?: string) => <LineWrap title={text}> {text || '-'}</LineWrap>,
      },
    ],
    [pager, regionName],
  );
  return column;
};

export default useColumns;
