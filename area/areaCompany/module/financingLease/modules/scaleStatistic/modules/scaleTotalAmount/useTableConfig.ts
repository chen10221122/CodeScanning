import { columnType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/table';

export const columnConfig: columnType[] = [
  {
    title: '登记起始日',
    dataIndex: 'registerStartDate',
    width: 107,
    align: 'center',
    sortKey: 'registerStartDate',
    isQuarterFormat: true,
  },
  {
    title: '新增租赁事件数',
    dataIndex: 'leaseEventNum',
    width: 131,
    align: 'right',
    sortKey: 'leaseEventNum',
    isNumberModal: true,
    NumberModalType: 'leaseEventNum',
  },
  {
    title: '登记金额(万元)',
    dataIndex: 'financedMoney',
    width: 127,
    align: 'right',
    sortKey: 'financedMoney',
  },
  {
    title: '承租人数量',
    dataIndex: 'lesseeNum',
    width: 105,
    align: 'right',
    sortKey: 'lesseeNum',
    isNumberModal: true,
    NumberModalType: 'lesseeNum',
  },
  {
    title: '出租人数量',
    dataIndex: 'leaserNum',
    width: 105,
    align: 'right',
    sortKey: 'leaserNum',
    isNumberModal: true,
    NumberModalType: 'leaserNum',
  },
];
