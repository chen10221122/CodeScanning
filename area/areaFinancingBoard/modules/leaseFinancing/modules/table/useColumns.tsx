import { useMemo } from 'react';

import TableCell from '@/pages/area/areaFinancingBoard/components/TableCell';
import type { LeaseFinancingList } from '@/pages/area/areaFinancingBoard/types';

const useColumns = (handleOpenModal: (obj: LeaseFinancingList, extraParams?: any) => void) => {
  const columns = useMemo(
    () => [
      {
        title: '登记起始日',
        dataIndex: 'registStartDate',
        width: 87,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: LeaseFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '新增融资事件数',
        dataIndex: 'financeEventNum',
        width: 108,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: LeaseFinancingList) => {
          return (
            <TableCell
              text={text}
              handleClick={() =>
                handleOpenModal(obj, {
                  registerStartDateFrom: obj?.registStartDate,
                  registerStartDateTo: obj?.registStartDate,
                })
              }
            />
          );
        },
      },
      {
        title: '融资总额(亿元)',
        dataIndex: 'financeAmount',
        width: 108,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: LeaseFinancingList) => {
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
