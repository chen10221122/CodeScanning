/** context保存的数据 */
export interface Context {
  loading: boolean;
  error: boolean;
  pageLoaded: boolean;
  key?: string;
  activeAll?: any;

  /** 地区列是否需要特殊处理，用于区域债券融资专题 */
  showFullAreaName?: boolean;
}

/** 各tab下接口入参类型 */

/** 承租人-投放总量 */
export interface RequestParamsCommonType<T = string> {
  /** 承租人tab的标识 */
  dimension?: T;
  /** 分页起始位置 */
  from?: number;
  /** 分页条数 */
  size?: number;
  /** 排序名称 */
  sortKey?: T;
  /** 排序规则 */
  sortType?: T;
  /** 搜索文本 */
  text?: T;
  /** 公开披露开始日期 */
  disclosureDateFrom?: T;
  /** 公开披露结束日期 */
  disclosureDateTo?: T;
  /** 登记日期开始时间 */
  endDateFrom?: T;
  /** 登记日期结束时间 */
  endDateTo?: T;
  /** 承租人类型 */
  lesseeType?: T;
  /** 行业代码 */
  industryCode?: T;
  /** 二级行业代码 */
  secondIndustryCode?: T;
  /** 省级代码 */
  regionCode?: T;
  /** 市级代码 */
  cityCode?: T;
  /** 区级代码 */
  countryCode?: T;
  /** 统计类型 */
  statisticType?: T;
  /** 含到期事件 */
  containExpire?: number;
  registerStartDateFrom?: T;
  registerStartDateTo?: T;
}
