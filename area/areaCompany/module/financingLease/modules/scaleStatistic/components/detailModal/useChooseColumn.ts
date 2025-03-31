import { useEffect, useState } from 'react';

import { cloneDeep } from 'lodash';

import { columnType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/table';
import { DetailModuleType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { columnConfig as leaserWillExpireColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/lessorExpiringEvents/useTableConfig';
import { columnConfig as leaserColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/lessorTotalAmount/useTableConfig';
import { columnConfig as lesseeWillExpireColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/tenantryExpiringEvents/useTableConfig';
import { columnConfig as lesseeColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/tenantryTotalAmount/useTableConfig';

/** 新增租赁事件数、将到期租赁事件数弹窗表格配置 */
const leaseEventColumn: columnType[] = [
  {
    dataIndex: 'startDate',
    title: '登记起始日',
    align: 'center',
    width: 92,
    isDetailModalFixed: true,
    detailModalResizable: { max: 796 },
  },
  {
    dataIndex: 'lessee',
    title: '承租人',
    align: 'left',
    width: 300,
    wrapLine: true,
    isTextEllipsis: true,
    LesseeOrLeaser: 'lessee',
  },
  {
    dataIndex: 'leaser',
    title: '出租人',
    align: 'left',
    width: 260,
    wrapLine: true,
    isTextEllipsis: true,
    LesseeOrLeaser: 'leaser',
  },
  {
    dataIndex: 'financedMoney',
    title: '登记金额(万元)',
    align: 'right',
    width: 116,
  },
  {
    dataIndex: 'period',
    title: '期限',
    align: 'right',
    width: 72,
  },
  {
    dataIndex: 'endDate',
    title: '登记到期日',
    align: 'center',
    width: 92,
    detailModalResizable: true,
  },
  {
    dataIndex: 'publishDate',
    title: '披露日期',
    align: 'center',
    width: 92,
  },
  {
    dataIndex: 'registerStatus',
    title: '登记状态',
    align: 'center',
    width: 80,
  },
];

interface stringMap {
  [key: string]: columnType[];
}

const DETAIL_PARAMS_MAP: stringMap = {
  [DetailModuleType.LEASEEVENTNUM]: leaseEventColumn,
  [DetailModuleType.LEASE_WILLEXPIREEVENTNUM]: leaseEventColumn,
  [DetailModuleType.LEASERNUM]: leaserColumn,
  [DetailModuleType.LEASER_WILLEXPIRENUM]: leaserWillExpireColumn,
  [DetailModuleType.LESSEENUM]: lesseeColumn,
  [DetailModuleType.LESSEE_WILLEXPIRENUM]: lesseeWillExpireColumn,
};

interface Props {
  /** 弹框类型 */
  type: string;
}

export default function useChooseColumn({ type }: Props) {
  /** 弹框类型 */
  const [column, setColumn] = useState<columnType[]>([]);

  useEffect(() => {
    if (type === DetailModuleType.LEASE_WILLEXPIREEVENTNUM) {
      const cloneColumn = cloneDeep(DETAIL_PARAMS_MAP[type]);
      cloneColumn[0].isDetailModalFixed = false;
      cloneColumn[5].isDetailModalFixed = true;
      /** 如果是将到期的租赁事件数，需要将到期日和起始日位置对调 */
      [cloneColumn[5], cloneColumn[0]] = [cloneColumn[0], cloneColumn[5]];
      setColumn(cloneColumn);
    } else {
      setColumn(DETAIL_PARAMS_MAP[type]);
    }
  }, [type]);

  return { column };
}

export const getColumnsByModalType = (type: string) => {
  if (type === DetailModuleType.LEASE_WILLEXPIREEVENTNUM) {
    const cloneColumn = cloneDeep(DETAIL_PARAMS_MAP[type]);
    cloneColumn[0].isDetailModalFixed = false;
    cloneColumn[5].isDetailModalFixed = true;
    /** 如果是将到期的租赁事件数，需要将到期日和起始日位置对调 */
    [cloneColumn[5], cloneColumn[0]] = [cloneColumn[0], cloneColumn[5]];
    return cloneColumn ?? [];
  } else {
    return DETAIL_PARAMS_MAP[type] ?? [];
  }
};
