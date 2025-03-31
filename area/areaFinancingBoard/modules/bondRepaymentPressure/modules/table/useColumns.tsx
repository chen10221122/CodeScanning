import { useMemo } from 'react';

import type { BondRepaymentList } from '@/pages/area/areaFinancingBoard/types';

const useColumns = (handleOpenModal: (row: BondRepaymentList) => void) => {
  const columns = useMemo(
    () => [
      {
        title: '年度',
        dataIndex: 'year',
        width: 65,
        className: 'pdd-8',
        fixed: 'left',
        align: 'left',
        render: (text: string, obj: BondRepaymentList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '总偿还(亿元)',
        dataIndex: 'totalRepayAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondRepaymentList) => {
          return (
            <span className={'link'} onClick={() => handleOpenModal(obj)}>
              {text || '-'}
            </span>
          );
        },
      },
      {
        title: '到期(亿元)',
        dataIndex: 'expireAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondRepaymentList) => {
          return <span>{text || '-'}</span>;
        },
      },
      {
        title: '回售(亿元)',
        dataIndex: 'soldAmount',
        width: 96,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondRepaymentList) => {
          return <span>{text || '-'}</span>;
        },
      },
      // {
      //   title: '赎回(亿元)',
      //   dataIndex: 'redeemAmount',
      //   width: 96,
      //   align: 'right',
      //   className: 'pdd-8',
      //   render: (text: string, obj: BondRepaymentList) => {
      //     return <span className={'blue'}>{text || '-'}</span>;
      //   },
      // },
      // {
      //   title: '提前偿还(亿元)',
      //   dataIndex: 'preRepayAmount',
      //   width: 109,
      //   align: 'right',
      //   className: 'pdd-8',
      //   render: (text: string, obj: BondRepaymentList) => {
      //     return <span>{text || '-'}</span>;
      //   },
      // },
      {
        title: '其他(亿元)',
        dataIndex: 'otherAmount',
        width: 97,
        align: 'right',
        className: 'pdd-8',
        render: (text: string, obj: BondRepaymentList) => {
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
