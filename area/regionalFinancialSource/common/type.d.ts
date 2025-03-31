// 中台区分页面的flag
export type PageFlag = 1 | 2 | 3 | 4;

// 所有的筛选字段
export type FilterType =
  | 'fundManageScale'
  | 'insureCompanyType'
  | 'listAndBondIssueInfo'
  | 'netProfit'
  | 'operatingRevenue'
  | 'rate'
  | 'registerCapital'
  | 'stockholder'
  | 'totalAsset';

// useMenu 入参类型
export interface IMenuConfig {
  // 基金管理规模
  fundManageScale: any[];
  // 保险公司类型
  insureCompanyType: any[];
  // 上市发债信息
  listAndBondIssueInfo: any[];
  // 净利润
  netProfit: any[];
  // 营业收入
  operatingRevenue: any[];
  // 评级
  rate: any[];
  // 注册资本
  registerCapital: any[];
  // 股东类型
  stockholder: any[];
  // 总资产
  totalAsset: any[];
}
