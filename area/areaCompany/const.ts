/** 筛选区域的高度 */
// export const FILTERHEIGHT = 26
// export const SUBFILTERHEIGHT = 24
/** 刚好漏表头的scrolltop高度 */
export const NOTITLESCROLLTOP = 36;
/** 表格sticky高度 */
// 间距和筛选高度28+间距8
export const TABLESTICKY = 38;
// 12+副标题高度20+间距和筛选高度28+间距12
export const SUBTABLESTICKY = 72;

/** 单模块表格一页的条数 */
export const PAGESIZE = 50;
/** 多模块表格一页的条数 */
export const SUBPAGESIZE = 12;

export const sortMap = new Map([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);
export const sortReverseMap = new Map([
  ['ascend', 'desc'],
  ['descend', 'asc'],
]);

export const reverseSortMap = new Map([
  ['asc', 'ascend'],
  ['desc', 'descend'],
]);
