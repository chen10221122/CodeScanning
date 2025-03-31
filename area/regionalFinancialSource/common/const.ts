import { ScreenType } from '@/components/screen';

import { PLATFORM } from '../../financialResources/components/const';
import { FilterType, PageFlag } from './type';

// 筛选默认参数
export const filterDefaultParams = {
  // 管理基金规模   1-100亿以下、2-100-500亿、3-500-1000亿、4-1000-5000亿、5-5000亿及以上
  fundManageScale: '',
  // 保险公司类型   1-财险、2-寿险、3-综合保险、4-再保险、5-资产管理、6-互助社、7-其他
  insureCompanyType: '',
  // 上市发债信息   1-主板、2-创业板、3-科创板、4-北交所、5-新三板、6-港股、7-发债、8-其他
  listAndBondIssueInfo: '',
  // 净利润   1-1亿以下、2-1亿-5亿、3-5-10亿、4-10亿及以上
  netProfit: '',
  // 营业收入   1-1亿以下、2-1亿-10亿、3-10-100亿、4-100亿及以上
  operatingRevenue: '',
  // 评级   A-A类、B-B类、C-C类、D-D类、E-E类、其他-其他
  rate: '',
  // 注册资本   1-1亿以下、2-1亿-5亿、3-5-10亿、4-10亿及以上
  registerCapital: '',
  // 股东类型   1-银行系、2-券商系、3-信托系、4-保险系、5-私募系、6-期货系、7-地产系、8-互联网金融系、9-个人系、10-其他
  stockholder: '',
  // 搜索
  text: '',
  // 总资产   1-1亿以下、2-1亿-10亿、3-10-100亿、4-100亿及以上
  totalAsset: '',
};

// 列表默认入参
export const listDefaultParams = {
  ...filterDefaultParams,
  skip: 0,
  pageSize: 50,
};

export const resetExceptField = ['pageFlag', 'pageSize', 'regionCode'];

// 筛选key对应的name
export const filterKeyMap: Record<FilterType, string> = {
  fundManageScale: '基金管理规模',
  insureCompanyType: '保险公司类型',
  listAndBondIssueInfo: '上市发债信息',
  netProfit: '净利润',
  operatingRevenue: '营业收入',
  rate: '评级',
  registerCapital: '注册资本',
  stockholder: '股东类型',
  totalAsset: '总资产',
};

export enum FilterKey {
  fundManageScale = 'fundManageScale',
  insureCompanyType = 'insureCompanyType',
  listAndBondIssueInfo = 'listAndBondIssueInfo',
  netProfit = 'netProfit',
  operatingRevenue = 'operatingRevenue',
  rate = 'rate',
  registerCapital = 'registerCapital',
  stockholder = 'stockholder',
  totalAsset = 'totalAsset',
}

export enum pageFlag {
  SEC = 1,
  FUND = 2,
  FUTURES = 3,
  INSURANCEINSURANCE = 4,
}

// 对应页面的添加到数据浏览器平台
export const dataViewPlatform: Record<pageFlag, keyof typeof PLATFORM> = {
  [pageFlag.SEC]: 'finance',
  [pageFlag.FUND]: 'finance',
  [pageFlag.FUTURES]: 'finance',
  [pageFlag.INSURANCEINSURANCE]: 'finance',
};

// 对应页面的导出module_type
export const moduleType: Record<pageFlag, string> = {
  [pageFlag.SEC]: 'regionalFinancialResource_securityCompany',
  [pageFlag.FUND]: 'regionalFinancialResource_fundCompany',
  [pageFlag.FUTURES]: 'regionalFinancialResource_forwardCompany',
  [pageFlag.INSURANCEINSURANCE]: 'regionalFinancialResource_insureCompany',
};

// pageFlag 对应的页面名称
export const pageTitle: Record<pageFlag, string> = {
  [pageFlag.SEC]: '证券公司',
  [pageFlag.FUND]: '基金公司',
  [pageFlag.FUTURES]: '期货公司',
  [pageFlag.INSURANCEINSURANCE]: '保险公司名录',
};

// 公共的 筛选更多配置项
const more: { key: FilterType; type: ScreenType }[] = [
  {
    key: FilterKey.registerCapital,
    type: ScreenType.MULTIPLE_TILING,
  },
  {
    key: FilterKey.operatingRevenue,
    type: ScreenType.MULTIPLE_TILING,
  },
  {
    key: FilterKey.totalAsset,
    type: ScreenType.MULTIPLE_TILING,
  },
  {
    key: FilterKey.netProfit,
    type: ScreenType.MULTIPLE_TILING,
  },
];

// 筛选配置，根据这里的配置和数据生成筛选配置项
export const filterConfig: Record<string, { key: FilterType; type: ScreenType }[]> = {
  [pageFlag.SEC]: [
    {
      key: FilterKey.listAndBondIssueInfo,
      type: ScreenType.MULTIPLE,
    },
    {
      key: FilterKey.rate,
      type: ScreenType.MULTIPLE,
    },
    ...more,
  ],
  [pageFlag.FUND]: [
    {
      key: FilterKey.fundManageScale,
      type: ScreenType.MULTIPLE,
    },
    {
      key: FilterKey.stockholder,
      type: ScreenType.MULTIPLE,
    },
    ...more,
  ],
  [pageFlag.FUTURES]: [
    {
      key: FilterKey.listAndBondIssueInfo,
      type: ScreenType.MULTIPLE,
    },
    {
      key: FilterKey.rate,
      type: ScreenType.MULTIPLE,
    },
    ...more,
  ],
  [pageFlag.INSURANCEINSURANCE]: [
    {
      key: FilterKey.insureCompanyType,
      type: ScreenType.MULTIPLE,
    },
    {
      key: FilterKey.listAndBondIssueInfo,
      type: ScreenType.MULTIPLE,
    },
    {
      key: FilterKey.rate,
      type: ScreenType.MULTIPLE,
    },
    ...more,
  ],
};

// 首次点击默认升序的字段名
export const ascColumns = ['registerCapital', 'latestManageScale'];

const commonPrev = ['index', 'enterpriseInfo'];
// columns配置
export const commonColumn = [
  'legalRepresentative',
  'registerCapital',
  'establishDate',
  'registerArea',
  'rate',
  'reportPeriod',
  'operatingRevenue',
  'totalAsset',
  'netProfit',
];
export const columnsConfig: Record<PageFlag, string[]> = {
  [pageFlag.SEC]: [...commonPrev, ...commonColumn],
  [pageFlag.FUND]: [
    'index',
    'enterpriseInfo',
    'latestFundNumber',
    'latestManageScale',
    'stockholder',
    'legalRepresentative',
    'registerCapital',
    'establishDate',
    'registerArea',
    'reportPeriod',
    'operatingRevenue',
    'totalAsset',
    'netProfit',
  ],
  [pageFlag.FUTURES]: [...commonPrev, ...commonColumn],
  [pageFlag.INSURANCEINSURANCE]: [...commonPrev, 'insureCompanyType', ...commonColumn],
};
