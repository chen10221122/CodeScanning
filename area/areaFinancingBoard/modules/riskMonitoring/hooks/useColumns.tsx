import { useMemo } from 'react';

import TableCell from '@/pages/area/areaFinancingBoard/components/TableCell';
import type { RiskMonitoringList } from '@/pages/area/areaFinancingBoard/types';

const useColumns = (handleOpenModal: (row: RiskMonitoringList, i: number) => void) => {
  const columns = useMemo(
    () => [
      {
        title: '风险类型',
        dataIndex: 'riskType',
        width: 75,
        align: 'left',
        className: 'pdd-8',
        render: (text: string, obj: RiskMonitoringList, index: number) => {
          return <span>{text}</span>;
        },
      },
      {
        title: '涉公司家数',
        dataIndex: 'companyNum',
        width: 87,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: RiskMonitoringList, index: number) => {
          return index === 4 ? (
            <span>{text}</span>
          ) : (
            <TableCell text={text} handleClick={() => handleOpenModal(obj, index)} />
          );
        },
      },
      {
        title: '事件总量',
        dataIndex: 'eventNum',
        width: 74,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: RiskMonitoringList, index: number) => {
          // 债务逾期、票据逾期的事件总量恒展示为-
          return !text || index === 2 || index === 4 ? <>-</> : <span>{text}</span>;
        },
      },
      {
        title: '涉及金额(亿元)',
        dataIndex: 'amount',
        width: 109,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: RiskMonitoringList, index: number) => {
          return <span>{text || '-'}</span>;
        },
      },
    ],
    [handleOpenModal],
  );

  return columns;
};

export default useColumns;
