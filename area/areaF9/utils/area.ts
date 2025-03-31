//省市区 级别枚举
export enum Level {
  PROVINCE = 1, // 省级
  CITY = 2, // 市级
  COUNTY = 3, // 县级
}

// 通过年份获取上一年
export const getLastYear = (year: number | string) => {
  return Number(year) - 1;
};

//  下一帧执行
export const nextTick = (fn: (val: any) => void) => Promise.resolve().then(fn);

/*
    判断是否是区县级，只根据接口判断的不准，因为存在省直辖县级行政区的情况，例如湖北省仙桃市
    最后两位不为00，第三位=9的地区，是产品给的省直辖县级行政区判断条件
  */
export const isMunicipality = (regionCode: string | undefined) =>
  regionCode && regionCode.substring(regionCode.length - 2) !== '00' && regionCode.charAt(2) === '9';

/** 区县判断逻辑 */
export const isCounty = (regionCode: string | undefined) =>
  regionCode && regionCode.substring(regionCode.length - 2) !== '00';

/** 市级判断逻辑 */
export const isCity = (regionCode: string | undefined) =>
  regionCode &&
  regionCode.substring(regionCode.length - 2) === '00' &&
  regionCode.substring(regionCode.length - 4) !== '0000';

/** 省级判断逻辑 */
export const isProvince = (regionCode: string | undefined) =>
  regionCode && regionCode.substring(regionCode.length - 4) === '0000';

/** regionCode 行政级别 */
export const getLevel = (regionCode: string | undefined) => {
  if (isProvince(regionCode)) {
    return Level.PROVINCE;
  } else if (isCity(regionCode)) {
    return Level.CITY;
  } else if (isCounty(regionCode)) {
    return Level.COUNTY;
  }
  return Level.COUNTY;
};

/**
 * @description 根据 targetValue 返回地区 1、2、3 级节点
 * @example
 * @returns
 * @param arr
 * @param targetValue
 * @param path
 */
export function findElementByValue<T = any>(arr: T[], targetValue: string, path: T[] = []): T[] | null {
  for (let i = 0; i < arr.length; i++) {
    const item: any = arr[i];
    if (item.value.includes(targetValue)) {
      return [...path, item];
    } else if (Array.isArray(item?.children)) {
      const subPath: any[] | null = findElementByValue(item.children, targetValue, [...path, arr[i]]);
      if (subPath) {
        return subPath;
      }
    }
  }
  return null;
}
