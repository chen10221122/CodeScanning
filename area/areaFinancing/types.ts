export interface SideMenuData {
  label: string;
  key?: string;
  children?: SideMenuData[];
  title?: string;
  [K: string]: any;
}

/** 股权融资年份菜单枚举 */
export enum EquityYearsEnums {
  /** 区域A股融资统计 */
  AreaStockA = '1',
  /** 区域上市平台统计 */
  AreaPlatform = '2',
  /** 区域IPO储备企业 */
  AreaIpo = '3',
  /** 区域港股融资统计 */
  AreaStockHK = '4',
  /** 区域新三板融资统计 */
  AreaStockThird = '5',
  /** 区域创投融资统计 */
  AreaVc = '6',
}

/** 弹窗类型枚举 */
export enum DetailModalTypeEnum {
  StockA = '区域A股融资统计明细',
  AreaPlatform = '区域上市平台统计明细',
  Ipo = '区域IPO储备企业明细',
  HK = 'H股融资明细',
  HK2 = 'H股融资明细',
  StockThirdPriority = '优先股详情',
  StockThirdPlus = '定向增发详情',
  Vc = '创投融资明细',
}

/** 一级菜单标题枚举 */
export enum TitleNameEnums {
  'resource',
  'bn' /** 债券融资(非金融企业) */,
  'bf' /** 债券融资(金融企业) */,
  'lease' /** 租赁融资 */,
  'equity' /** 股权融资 */,
}

/** 二级菜单key枚举 */
export enum SubTitleKeyEnums {
  /** 区域A股融资统计 */
  AreaStockA = 'AreaStockA',
  /** 区域上市平台统计 */
  AreaPlatform = 'AreaPlatform',
  /** 区域IPO储备企业 */
  AreaIpo = 'AreaIpo',
  /** 区域港股融资统计 */
  AreaStockHK = 'AreaStockHK',
  /** 区域新三板融资统计 */
  AreaStockThird = 'AreaStockThird',
  /** 区域创投融资统计 */
  AreaVc = 'AreaVc',

  /** 租赁融资-投放总量 */
  AreaLeaseTotalInvest = 'AreaTotalInvest',
  /** 租赁融资-地区流向 */
  AreaLeaseFlow = 'AreaFlow',
  /** 租赁融资-将到期事件 */
  AreaLeaseExpirationEvent = 'AreaExpirationEvent',

  /** 债券融资(非金融企业)-债券存量 */
  AreaBondNormalInventory = 'AreaBondNormalInventory',
  /** 债券融资(非金融企业)-债券净融资 */
  AreaBondNormalFinancing = 'AreaBondNormalFinancing',
  /** 债券融资(非金融企业)-债券发行 */
  AreaBondNormalIssue = 'AreaBondNormalIssue',
  /** 债券融资(非金融企业)-债券偿还 */
  AreaBondNormalReturn = 'AreaBondNormalReturn',

  /** 债券融资(金融企业)-债券存量 */
  AreaBondFinancialInventory = 'AreaBondFinancialInventory',
  /** 债券融资(金融企业)-债券净融资 */
  AreaBondFinancialFinancing = 'AreaBondFinancialFinancing',
  /** 债券融资(金融企业)-债券发行 */
  AreaBondFinancialIssue = 'AreaBondFinancialIssue',
  /** 债券融资(金融企业)-债券偿还 */
  AreaBondFinancialReturn = 'AreaBondFinancialReturn',

  /**@description 区域存贷款规模 */
  LoanScale = 'LoanScale',
  /**@description 区域银行分布 */
  BankDistribution = 'BankDistribution',
}

export const SubTitleNameMap = new Map([
  /** 地区分布 */
  [SubTitleKeyEnums.AreaStockA, 'A股融资统计'],
  [SubTitleKeyEnums.AreaPlatform, '上市平台统计'],
  [SubTitleKeyEnums.AreaIpo, 'IPO储备企业'],
  [SubTitleKeyEnums.AreaStockHK, 'H股融资统计'],
  [SubTitleKeyEnums.AreaStockThird, '新三板融资统计'],
  [SubTitleKeyEnums.AreaVc, '创投融资统计'],

  [SubTitleKeyEnums.AreaLeaseTotalInvest, '投放总量'],
  [SubTitleKeyEnums.AreaLeaseFlow, '地区流向'],
  [SubTitleKeyEnums.AreaLeaseExpirationEvent, '将到期事件'],

  [SubTitleKeyEnums.AreaBondNormalInventory, '债券存量'],
  [SubTitleKeyEnums.AreaBondNormalFinancing, '债券净融资'],
  [SubTitleKeyEnums.AreaBondNormalIssue, '债券发行'],
  [SubTitleKeyEnums.AreaBondNormalReturn, '债券偿还'],

  [SubTitleKeyEnums.AreaBondFinancialInventory, '债券存量'],
  [SubTitleKeyEnums.AreaBondFinancialFinancing, '债券净融资'],
  [SubTitleKeyEnums.AreaBondFinancialIssue, '债券发行'],
  [SubTitleKeyEnums.AreaBondFinancialReturn, '债券偿还'],

  /** 区域银行业金融资源 */
  [SubTitleKeyEnums.LoanScale, '存贷款规模'],
  [SubTitleKeyEnums.BankDistribution, '银行分布'],
]);

export enum ExportTableEnum {
  AShare,
  AShareHistory,
  AreaPlatformPlate,
  AreaPlatformEntType,
  AreaPlatformIndustry,
  IPO,
  HK,
  ThirdBoard,
  Vc,
}
/**
 * 股权融资列表导出枚举
 */
export const ExportTableMap = new Map([
  [ExportTableEnum.AShare, { filename: 'A股融资统计', sheetIndex: '0' }],
  [ExportTableEnum.AShareHistory, { filename: 'A股历史融资统计', sheetIndex: '1' }],
  [ExportTableEnum.AreaPlatformPlate, { filename: '上市平台统计-按板块', sheetIndex: '3' }],
  [ExportTableEnum.AreaPlatformEntType, { filename: '上市平台统计-按企业性质', sheetIndex: '4' }],
  [ExportTableEnum.AreaPlatformIndustry, { filename: '上市平台统计-按产业', sheetIndex: '5' }],
  [ExportTableEnum.IPO, { filename: 'IPO储备企业', sheetIndex: '7' }],
  [ExportTableEnum.HK, { filename: 'H股融资', sheetIndex: '9' }],
  [ExportTableEnum.ThirdBoard, { filename: '新三板融资', sheetIndex: '11' }],
  [ExportTableEnum.Vc, { filename: '创投融资', sheetIndex: '14' }],
]);

/**
 * 股权融资明细导出枚举
 */
export const DetailModalExportMap = new Map([
  [DetailModalTypeEnum.StockA, { filename: 'A股融资统计明细', sheetIndex: '2' }],
  [DetailModalTypeEnum.AreaPlatform, { filename: '上市平台统计明细', sheetIndex: '6' }],
  [DetailModalTypeEnum.Ipo, { filename: 'IPO储备企业统计明细', sheetIndex: (v: string) => (v === '1' ? '8' : '16') }],
  [DetailModalTypeEnum.HK, { filename: 'H股融资明细', sheetIndex: (v: string) => (v === '1' ? '10' : '17') }],
  [DetailModalTypeEnum.StockThirdPlus, { filename: '新三板融资-定向增发明细', sheetIndex: '12' }],
  [DetailModalTypeEnum.StockThirdPriority, { filename: '新三板融资-优先股明细', sheetIndex: '13' }],
  [DetailModalTypeEnum.Vc, { filename: '创投融资明细', sheetIndex: '15' }],
]);
// 排序
export const SortMap: Record<string, string> = {
  ascend: 'asc',
  descend: 'desc',
};
