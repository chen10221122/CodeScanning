import { useMemo } from 'react';

import TableCell from '@/pages/area/areaFinancingBoard/components/TableCell';
import type { TrustFinancingLsit } from '@/pages/area/areaFinancingBoard/types';

const useColumns = (handleOpenModal: (row: any, extraParams?: any) => void) => {
  const columns = useMemo(
    () => [
      {
        title: '起始日',
        dataIndex: 'startDate',
        width: 87,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: any) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '新增融资事件数',
        dataIndex: 'financeEventNum',
        width: 120,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: TrustFinancingLsit) => {
          return (
            <TableCell
              text={text}
              handleClick={() =>
                handleOpenModal(
                  { dataType: 'trust', registStartDate: obj?.startDate },
                  { month: obj?.startDate, sortKey: 'startDate', sortRule: 'desc' },
                )
              }
            />
          );
        },
      },
      {
        title: '融资总额(亿元)',
        dataIndex: 'totalFinanceAmount',
        width: 109,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: any) => {
          return <span>{text || '-'}</span>;
        },
      },
    ],
    [handleOpenModal],
  );

  const x = columns.reduce((t, c) => (t += c.width), 0);

  return [columns, x];
};

export default useColumns;
