import { ScaleTotalAmount, ScaleExpiringEvents } from '../modules';

type Component<T> = React.ComponentType<T>;
type SideMenuMap = Map<string, Component<any>>;

interface SideMenuData {
  label: string;
  key?: string;
  children?: SideMenuData[];
  title?: string;
  [K: string]: any;
}

/** 事件类型 */
export enum ChangeFilter {
  /** 地区筛选 */
  AREA,
  /** 行业筛选 */
  INDUSTRY,
  /** 承租人分类筛选 */
  LESSEE_TYPE,
  /** 出租人类型 */
  LESSOR_TYPE,
  /** 出租人性质 */
  LESSOR_NATURE,
  /** 上市/发债 */
  LISTING_BONDISSUANCE,
  /** 披露日期筛选 */
  DISCLOSURE_DATE,
  /** 登记到期日 */
  REGISTRATE_DUE_DATE,
  /** 含到期事件 */
  EXPIRATION_EVENT,
  /** 分页筛选 */
  PAGE_CHANGE,
  /** 排序 */
  SORT,
  /** 搜索 */
  SEARCH,
  /** 搜索清空 */
  SEARCH_CLEAR,
}

interface stringMap {
  [key: string]: string;
}

/** 弹框类型枚举 */
export enum DetailModuleType {
  LEASEEVENTNUM = 'leaseEventNum',
  LEASERNUM = 'leaserNum',
  LESSEENUM = 'lesseeNum',
  LEASE_WILLEXPIREEVENTNUM = 'leaseWillExpireEventNum',
  LEASER_WILLEXPIRENUM = 'leaserWillExpireNum',
  LESSEE_WILLEXPIRENUM = 'lesseeWillExpireNum',
}

/** 弹框导出类型 */
export const DetailModalExportType: stringMap = {
  [DetailModuleType.LEASEEVENTNUM]: 'financeLease_detail_leaseEventNum_total ',
  [DetailModuleType.LEASERNUM]: 'financeLease_detail_leaser_total',
  [DetailModuleType.LESSEENUM]: 'financeLease_detail_lessee_total',
  [DetailModuleType.LEASE_WILLEXPIREEVENTNUM]: ' financeLease_detail_leaseEventNum_willExpire',
  [DetailModuleType.LEASER_WILLEXPIRENUM]: 'financeLease_detail_leaser_willExpire',
  [DetailModuleType.LESSEE_WILLEXPIRENUM]: 'financeLease_detail_lessee_willExpire',
};

/** 租赁融资-统计分析左侧目录树数据 */
export const sideMenuData: SideMenuData[] = [
  {
    label: '按规模',
    children: [
      {
        label: '投放总量',
        key: 'scaleTotalAmount',
      },
      {
        label: '将到期事件',
        key: 'scaleExpiringEvents',
      },
    ],
  },
];

/** 根据key返回对应的页面组件 */
export const sideMenuMap: SideMenuMap = new Map([
  ['scaleTotalAmount', ScaleTotalAmount],
  ['scaleExpiringEvents', ScaleExpiringEvents],
]);

export const flagSideMenuData = sideMenuData.reduce((total: SideMenuData[], item) => {
  const flag = Array.isArray(item.children)
    ? item.children.map((sub) => ({ ...sub, parentLabel: item.label }))
    : [item];
  return [...total, ...flag];
}, []);

export const isMac = () => {
  let agent = window.navigator.userAgent.toLowerCase();
  let isMac = /macintosh|mac os x/i.test(agent);
  if (isMac) {
    return 1;
  } else {
    return 0;
  }
};

export * from './ctrlModulesConf';
