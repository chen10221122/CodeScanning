import { useEffect, useState } from 'react';

import { cloneDeep } from 'lodash';

import getIndustryRender from '@/pages/area/areaCompany/components/tableCpns/industry';
import { columnType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/table';
import { DetailModuleType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { columnConfig as leaserWillExpireColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/lessorExpiringEvents/useTableConfig';
import { columnConfig as leaserColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/lessorTotalAmount/useTableConfig';
import { columnConfig as lesseeWillExpireColumn } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/tenantryExpiringEvents/useTableConfig';

const leaseEventColumn: columnType[] = [
  {
    dataIndex: 'startDate',
    title: '登记起始日',
    align: 'center',
    width: 92,
    fixed: 'left',
    isDetailModalFixed: true,
  },
  {
    dataIndex: '',
    title: '承租人',
    align: 'left',
    width: 174,
    isTextEllipsis: true,
    LesseeOrLeaser: 'lessee',
    needTag: false,
    fixed: 'left',
    wrapLine: true,
  },
  {
    dataIndex: '',
    title: '出租人',
    align: 'left',
    fixed: 'left',
    width: 174,
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
    width: 70,
  },
  {
    dataIndex: 'endDate',
    title: '登记到期日',
    align: 'center',
    width: 92,
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
    width: 76,
  },
];

const newLesseeColumn: columnType[] = [
  {
    dataIndex: 'lessee',
    title: '承租人',
    align: 'left',
    width: 232,
    isFixed: true,
    isTextEllipsis: true,
    LesseeOrLeaser: 'lessee',
    isDetailModalFixed: true,
    wrapLine: true,
  },
  {
    dataIndex: 'leaseEventNum',
    sortKey: 'leaseEventNum',
    align: 'right',
    title: '新增租赁事件数',
    width: 132,
    isNumberModal: true,
    NumberModalType: 'leaseEventNum',
    isDetailModalFixed: true,
  },
  {
    dataIndex: 'financedMoney',
    sortKey: 'financedMoney',
    title: '登记金额(万元)',
    align: 'right',
    width: 128,
    isDetailModalFixed: true,
  },
  {
    dataIndex: 'leaserNum',
    sortKey: 'leaserNum',
    title: '出租人数量',
    align: 'right',
    width: 105,
    isNumberModal: true,
    NumberModalType: 'leaserNum',
  },
  {
    dataIndex: 'registerCapital',
    sortKey: 'registerCapital',
    title: '注册资本',
    align: 'right',
    width: 180,
  },
  {
    dataIndex: 'area',
    title: '地区',
    align: 'left',
    width: 189,
  },
  {
    title: '国标行业',
    // 门类-industry 大类-secondIndustry 中类-thirdIndustry 小类-fourthIndustry
    dataIndex: 'fourthIndustry',
    key: 'fourthIndustry',
    align: 'left',
    width: 220,
    render: getIndustryRender(['industry', 'secondIndustry', 'thirdIndustry', 'fourthIndustry']),
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
  [DetailModuleType.LESSEENUM]: newLesseeColumn,
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
      /** 如果是将到期的租赁事件数，需要将到期日和起始日位置对调 */
      [cloneColumn[5], cloneColumn[0]] = [cloneColumn[0], cloneColumn[5]];
      setColumn(cloneColumn);
    } else {
      setColumn(DETAIL_PARAMS_MAP[type]);
    }
  }, [type]);

  return { column };
}
