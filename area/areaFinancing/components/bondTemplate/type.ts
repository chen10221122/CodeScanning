import {
  getAreaBondFinancingDetail,
  getAreaBondInventoryDetail,
  getAreaBondIssueDetail,
  getAreaBondReturnDetail,
} from '@pages/area/areaFinancing/api';

export enum BondFinancingColumnType {
  NormalInventoryByType = 1,
  NormalInventoryByYear,
  NormalFinancingByType,
  NormalFinancingByYear,
  NormalIssueByType,
  NormalIssueByYear,
  NormalReturnByType,
  NormalReturnByYear,

  FinancialInventoryByType,
  FinancialInventoryByYear,
  FinancialFinancingByType,
  FinancialFinancingByYear,
  FinancialIssueByType,
  FinancialIssueByYear,
  FinancialReturnByType,
  FinancialReturnByYear,
}

/**
 * 债券融资弹窗类型
 */
export enum BondModalType {
  NormalInventory,
  NormalFinancing,
  NormalIssue,
  NormalReturn,
  FinancialInventory,
  FinancialFinancing,
  FinancialIssue,
  FinancialReturn,
}
export const BondModalTypeMap: any = new Map([
  [BondFinancingColumnType.NormalInventoryByType, BondModalType.NormalInventory],
  [BondFinancingColumnType.NormalInventoryByYear, BondModalType.NormalInventory],
  [BondFinancingColumnType.NormalFinancingByType, BondModalType.NormalFinancing],
  [BondFinancingColumnType.NormalFinancingByYear, BondModalType.NormalFinancing],
  [BondFinancingColumnType.NormalIssueByType, BondModalType.NormalIssue],
  [BondFinancingColumnType.NormalIssueByYear, BondModalType.NormalIssue],
  [BondFinancingColumnType.NormalReturnByType, BondModalType.NormalReturn],
  [BondFinancingColumnType.NormalReturnByYear, BondModalType.NormalReturn],
  [BondFinancingColumnType.FinancialInventoryByType, BondModalType.FinancialInventory],
  [BondFinancingColumnType.FinancialInventoryByYear, BondModalType.FinancialInventory],
  [BondFinancingColumnType.FinancialFinancingByType, BondModalType.FinancialFinancing],
  [BondFinancingColumnType.FinancialFinancingByYear, BondModalType.FinancialFinancing],
  [BondFinancingColumnType.FinancialIssueByType, BondModalType.FinancialIssue],
  [BondFinancingColumnType.FinancialIssueByYear, BondModalType.FinancialIssue],
  [BondFinancingColumnType.FinancialReturnByType, BondModalType.FinancialReturn],
  [BondFinancingColumnType.FinancialReturnByYear, BondModalType.FinancialReturn],
]);

/**
 * 债券融资明细导出枚举
 */
export const BondDetailModalInfoMap = new Map([
  [
    BondModalType.NormalInventory,
    {
      title: '债券存量明细',
      exportInfo: { filename: '债券存量明细', module_type: 'non_financing_bond_stock_detail' },
      apiName: getAreaBondInventoryDetail,
    },
  ],
  [
    BondModalType.NormalFinancing,
    {
      title: '债券净融资明细',
      exportInfo: { filename: '债券净融资明细', module_type: 'non_financing_bond_net_financing_detail' },
      apiName: getAreaBondFinancingDetail,
    },
  ],
  [
    BondModalType.NormalIssue,
    {
      title: '债券发行明细',
      exportInfo: { filename: '债券发行明细', module_type: 'bond_not_financing_issue_detail' },
      apiName: getAreaBondIssueDetail,
    },
  ],
  [
    BondModalType.NormalReturn,
    {
      title: '债券偿还明细',
      exportInfo: { filename: '债券偿还明细', module_type: 'bond_not_financing_repay_detail' },
      apiName: getAreaBondReturnDetail,
    },
  ],
  [
    BondModalType.FinancialInventory,
    {
      title: '债券存量明细',
      exportInfo: { filename: '债券存量明细', module_type: 'financing_bond_stock_detail' },
      apiName: getAreaBondInventoryDetail,
    },
  ],
  [
    BondModalType.FinancialFinancing,
    {
      title: '债券净融资明细',
      exportInfo: { filename: '债券净融资明细', module_type: 'financing_bond_net_financing_detail' },
      apiName: getAreaBondFinancingDetail,
    },
  ],
  [
    BondModalType.FinancialIssue,
    {
      title: '债券发行明细',
      exportInfo: { filename: '债券发行明细', module_type: 'bond_financing_issue_detail' },
      apiName: getAreaBondIssueDetail,
    },
  ],
  [
    BondModalType.FinancialReturn,
    {
      title: '债券偿还明细',
      exportInfo: { filename: '债券偿还明细', module_type: 'bond_financing_repay_detail' },
      apiName: getAreaBondReturnDetail,
    },
  ],
]);

export interface TableDataItem {
  code: string;
  name: string;
  valueList: Record<string, any>[];
  [k: string]: any;
}
