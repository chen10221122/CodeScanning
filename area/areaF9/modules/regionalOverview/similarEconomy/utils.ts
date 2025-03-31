import { isNil } from 'lodash';

import { formatNumber } from '@/utils/format';

// 可供分享的参数类型
export interface AreaShareParams {
  year: string;
  codes: string[];
  areas: string[];
}

// 地区数据
interface RegionDataObject {
  deviateDegree: any;
  name: string;
  value: string;
  code: number;
  year: string;
}
export type RegionData = RegionDataObject | null;
// 地区数据指标
export interface RenderableIndicator {
  [other: string]: RegionData | string | boolean;
}
// 可渲染数据列表
export type RenderableSimilarList = Array<RenderableIndicator>;

// 服务器取回的生数据类型
interface RawIndicator {
  deviateDegree?: number;
  key: string;
  val: any[];
}
export interface RawSimilarList {
  reportDate: string;
  data: RawIndicator[];
}

/**
 * 将生数据转换为特定类型的熟数据
 * @param list 服务器取得的数据列表
 */
export const handleRawSimilarList = (list: RawSimilarList | undefined): RenderableSimilarList => {
  if (!list) return [];
  const y = list.reportDate;
  let r: RenderableSimilarList = [];
  r = list?.data?.map((indicator, i) => {
    let t: RenderableIndicator = {
      key: i + '',
      title: indicator.key,
      hasMore: indicator.val.length > 6,
    };
    indicator.val.forEach((region, i) => {
      if (!isNil(region.regionName4) && !isNil(region.mvalue) && !isNil(region.regionCode4)) {
        t[`name${i}`] = region.regionName4;
        t[`value${i}`] = `${formatNumber(region.mvalue)}${region.displayCunit || ''}`;
        t[`code${i}`] = region.regionCode4;
        t[`year${i}`] = y;
        t[`deviateDegree${i}`] = region.deviateDegree;
        t[`indicName2`] = region.indicName2;
        t[`regionSimpleName${i}`] = region.regionSimpleName;

        // t[`region${i}`] = {
        //   name: region.regionName4,
        //   indicName2: region.indicName2,
        //   value: `${formatNumber(region.mvalue)}${region.displayCunit || ''}`,
        //   code: region.regionCode4,
        //   year: y,
        //   deviateDegree: region.deviateDegree as number,
        // } as RegionData;
      }
      // else {
      //   t[`region${i}`] = null
      // }
    });
    return t;
  });
  return r;
};

const AreasReg = /.+?(省|市|自治区|自治州|县|区|旗|盟)/g;
/**
 * 将地区字符串转为地区数组，按省市县等进行分割
 * @param areas 地区数组
 */
export const getAreasListFromString = (areas: string): Array<string> => {
  const t = areas.match(AreasReg);
  return t ? t : [];
};

// getSimilarEconomy 函数签名
export type getSimilarEconomyFuc = (params: IFilterProps) => Promise<RawSimilarList>;

export enum EFlag {
  TRUE = 1, // 是
  FALSE = 0, // 否
}

export enum PAGE_SIZE {
  /** 主表格pagesize */
  MAIN_PAGE_SIZE = 6,
  /** 弹窗pagesize */
  MODAL_PAGE_SIZE = 50,
}

export type IFilterProps = {
  skip: number;
  pageSize: number;
  code: string;
  /** 年份 */
  year?: number;
  /** 偏离值 */
  deviate?: string;
  /**数值偏离度区间范围 */
  deviationRange?: string;
  /** 同行政级别*/
  sameRegionLevel?: EFlag;
  /** 只看省内 */
  onlyProvince?: EFlag;
  /** 指标 */
  indicName?: any;
};

export type IFilterProps2 = {
  // skip?: number;
  from: number;
  size: number;
  // pageSize?: number;
  // code: string;
  /** 年份 */
  year?: number;
  /** 偏离值 */
  deviate?: string;
  /**数值偏离度区间范围 */
  deviationRange?: string;
  /** 同行政级别-标记*/
  sameRegionLevel?: EFlag;
  /** 只看省内-标记 */
  onlyProvince?: EFlag;
  /** 指标 */
  indicName?: any;
  /** 行政级别 */
  administrationLevel?: any;
  /** 只看省内 */
  provinceCode?: any;
  /** 指标代码 */
  indicatorCode?: any;
  /** 指标原始值 */
  originIndicatorValue?: any;
  /** 地区代码 */
  regionCode?: any;
};
