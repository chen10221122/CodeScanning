// 服务器数据 RawSimilarList 类型
// const basicTableTemplate = [
//   { title: 'GDP相似', key: '1', region0: { region: '', value: '' }, ... },
//   { title: 'GDP增速相似', key: '2' },
//   { title: '人均GDP相似', key: '3' },
//   { title: '人口相似', key: '4' },
//   { title: '城镇居民人均可支配收入相似', key: '5' },
//   { title: '一般公共预算收入相似', key: '6' },
//   { title: '政府性债务余额相似', key: '7' },
// ];
import { formatNumber } from '@/utils/format';

// 可供分享的参数类型
export interface AreaShareParams {
  year: string;
  codes: string[];
  areas: string[];
}

// 地区数据
interface RegionDataObject {
  name: string;
  value: string;
  code: number;
  year: string;
}
export type RegionData = RegionDataObject | null;
// 地区数据指标
export interface RenderableIndicator {
  [other: string]: RegionData | string;
}
// 可渲染数据列表
export type RenderableSimilarList = Array<RenderableIndicator>;

// 服务器取回的生数据类型
interface RawIndicator {
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
  r = list.data.map((indicator, i) => {
    let t: RenderableIndicator = {
      key: i + '',
      title: indicator.key,
    };
    indicator.val.forEach((region, i) => {
      if (region.regionName4 && region.mvalue && region.displayCunit && region.regionCode4)
        t[`region${i}`] = {
          name: region.regionName4,
          value: `${formatNumber(region.mvalue)}${region.displayCunit}`,
          code: region.regionCode4,
          year: y,
        } as RegionData;
      else t[`region${i}`] = null;
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
