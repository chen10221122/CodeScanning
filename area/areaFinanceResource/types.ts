export interface SideMenuData {
  label: string;
  key?: string;
  children?: SideMenuData[];
  title?: string;
  [K: string]: any;
}

/** 二级菜单key枚举 */
export enum SubTitleKeyEnums {
  /**@description 区域存贷款规模 */
  LoanScale = 'loanScale',
  /**@description 区域银行分布 */
  BankDistribution = 'bankDistribution',
}

export const SubTitleNameMap = new Map([
  /** 地区分布 */
  [SubTitleKeyEnums.LoanScale, '区域存贷款规模'],
  [SubTitleKeyEnums.BankDistribution, '区域银行分布'],
]);

// 排序
export const SortMap: Record<string, string> = {
  ascend: 'asc',
  descend: 'desc',
};
