import { useMemo } from 'react';

import TableCell from '@/pages/area/areaFinancingBoard/components/TableCell';
import type { ReceivableAccountsList } from '@/pages/area/areaFinancingBoard/types';

const useColumns = (handleOpenModal: (row: any, extraParams?: any) => void) => {
  const columns = useMemo(
    () => [
      {
        title: '登记起始日',
        dataIndex: 'registStartDate',
        width: 80,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: ReceivableAccountsList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '新增融资事件数',
        dataIndex: 'financeEventNum',
        width: 120,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: ReceivableAccountsList) => {
          return (
            <TableCell
              text={text}
              handleClick={() =>
                handleOpenModal(
                  { dataType: 'receive', registStartDate: obj?.registStartDate },
                  { month: obj?.registStartDate, sortKey: 'registerStartDate', sortRule: 'desc' },
                )
              }
            />
          );
        },
      },
      {
        title: '融资额(万元)',
        dataIndex: 'financeAmount',
        width: 104,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: ReceivableAccountsList) => {
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
