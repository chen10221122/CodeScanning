import dayjs from 'dayjs';

/** 表格头部高度 */
export const HEADER_HEIGHT = 36;
/** 筛选默认高度 */
export const FILTER_DEFAULT_HEIGHT = 46;

export enum BondIssueOrgType {
  /** 非金融债券发行列表 */
  BOND_ISSUE_LIST_NOT_FINANCE = 0,
  /** 金融债券发行列表 */
  BOND_ISSUE_LIST_FINANCE = 1,
}
/** 表格列我的方案moduleCode */
export enum BondIssueModuleCode {
  /** 非金融债券发行列表moduleCode */
  BOND_ISSUE_LIST_NOT_FINANCE = 'area-bond-list-not-finance',
  /** 金融债券发行列表moduleCode */
  BOND_ISSUE_LIST_FINANCE = 'area-bond-list-finance',
}

/** 搜索入参枚举 */
export enum SearchFiled {
  BAND_NAME_CODE = 'BD0202_003,Symbol',
  ISSUER = 'BD0202_047',
}

const today = dayjs().format('YYYY-MM-DD');
const TODAY_RANGE = `[${today},${today}]`;

const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
const TOMORROW_RANGE = `[${tomorrow},${tomorrow}]`;

const oneWeekAgo = dayjs().subtract(1, 'week').add(1, 'day').format('YYYY-MM-DD');
const WEEK_RANGE = `[${oneWeekAgo},${today}]`;

export const dateRange = { TODAY_RANGE, TOMORROW_RANGE, WEEK_RANGE };
