export const COL_WIDTH = 134;
export const PAGESIZE = 50;
export const MODAL_PAGESIZE = 50;

export enum E_CHANGE_TYPE {
  AREA_TYPE = 'areaType',
  AREA = 'area',

  /** 时间周期 */
  STATISTIC_TIME = 'statisticTime',

  RANGE_PICK = 'rangePick',
  RANGE_PICKER = 'rangePicker',
  INDUSTRY = 'industry',
  INDUSTRY_TYPE = 'industryType',
  /** 统计口径 */
  STATISTIC_TYPE = 'statisticType',
  /** 承租人分类 */
  TYPE = 'type',
  SORT = 'sort',
  MODAL = 'modal',
}

export const seasonMap = new Map([
  ['01', '一季度'],
  ['04', '二季度'],
  ['07', '三季度'],
  ['10', '四季度'],
]);

export const modalTitleMap = new Map([
  ['leaseEventNum', '租赁事件明细'],
  ['lesseeNum', '承租人明细'],
  ['leaserNum', '出租人明细'],
]);

export const _modalTitleMap = new Map([
  ['leaseWillExpireEventNum', '租赁事件明细'],
  ['lesseeWillExpireNum', '承租人明细'],
  ['leaserWillExpireNum', '出租人明细'],
]);

export const DETAIL_PARAMS_MAP: Record<string, string> = {
  leaseEventNum: 'leaseEventDetail',
  leaserNum: 'leaserDetail',
  lesseeNum: 'lesseeDetail',
};

export const _DETAIL_PARAMS_MAP: Record<string, string> = {
  leaseWillExpireEventNum: 'leaseEventDetail',
  leaserWillExpireNum: 'leaserDetail',
  lesseeWillExpireNum: 'lesseeDetail',
};
