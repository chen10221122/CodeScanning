import { useMemo } from 'react';

import TableCell from '@/pages/area/areaFinancingBoard/components/TableCell';
import type { BondNetFinancingList } from '@/pages/area/areaFinancingBoard/types';

import { TYPE } from './index';

const useColumns = (handleOpenModal: (obj: BondNetFinancingList, i: TYPE) => void, county: boolean) => {
  const columns = useMemo(() => {
    const list = [
      {
        title: '日期',
        dataIndex: 'date',
        width: 76,
        className: 'pdd-8',
        fixed: 'left',
        align: 'left',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '净融资额(亿)',
        dataIndex: 'netFinanceAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string | number, obj: BondNetFinancingList) => (
          <TableCell text={text} handleClick={() => handleOpenModal(obj, TYPE.NET_FINANCING_AMOUNT)} />
        ),
      },
      {
        title: '总发行额(亿)',
        dataIndex: 'totalIssueAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '总偿还额(亿)',
        dataIndex: 'totalRepayAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '新发行债券只数',
        dataIndex: 'bondNum',
        width: 113,
        align: 'right',
        className: 'pdd-8',
        render: (text: string | number, obj: BondNetFinancingList) => {
          return (
            <TableCell
              text={text}
              handleClick={() => handleOpenModal({ ...obj, ignoreCurDay: true }, TYPE.BOND_ISSUED)}
            />
          );
        },
      },
      {
        title: <span style={{ textAlign: 'right', display: 'flex' }}>加权平均票面利率(%)</span>,
        dataIndex: 'weightedAverageCoupon',
        width: 102,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: <span style={{ textAlign: 'right', display: 'flex' }}>全国加权平均票面利率(%)</span>,
        dataIndex: 'nationalWeightedAverageCoupon',
        width: 103,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      },
    ];

    if (!county) {
      list.splice(6, 0, {
        title: <span style={{ textAlign: 'right', display: 'flex' }}>省加权平均票面利率(%)</span>,
        dataIndex: 'provinceWeightedAverageCoupon',
        width: 102,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondNetFinancingList) => {
          return <span>{text || '-'}</span>;
        },
      });
    }

    return list;
  }, [county, handleOpenModal]);

  const x = columns.reduce((t, c) => (t += c.width), 0);

  return [columns, x];
};

export default useColumns;
