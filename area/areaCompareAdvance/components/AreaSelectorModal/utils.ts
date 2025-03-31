import { AreaCompare } from '@/apis/area/type.define';
import { ThirdSelectWithParentRowItem } from '@/components/screen/items/types';

const AREA_DIVIDER = '/';

// 基础带有 AlertRef 的组件 prop

export interface SearchAreaInfoResult {
  data: AreaCompare.searchItem[];
  key: any;
  returncode: number;
}

/**
 * 从 AreaItem[] 中获得地区 value
 * @param areaItem
 * @returns
 */
export function getValueFromAreaItem(areaItem?: AreaCompare.areaItem[]): string {
  if (areaItem && areaItem.length) {
    return areaItem[areaItem.length - 1].value;
  }
  return '';
}

/**
 * 组合地区对象数组中的 label 字段
 * @param array 地区对象数组
 * @returns
 */
function joinNamesFromAreaItemArray(array: AreaCompare.areaItem[]): string {
  return array.map((area) => area.label).join(AREA_DIVIDER);
}

/**
 * 将 地区数据数组 格式转化为 Select Options 格式
 * @param data 地区数据项目数组
 * @returns
 */
export function AreaItemsArrayToOptionTypeArray(data: AreaCompare.areaItem[][]) {
  return data.map((areaItem) => ({
    key: parseInt(areaItem[areaItem.length - 1].value),
    label: joinNamesFromAreaItemArray(areaItem),
    value: parseInt(areaItem[areaItem.length - 1].value),
  }));
}

/**
 * 将已选择的数据转换为不完整的地区数据
 * @param data 已选中的数据
 */
export function convertSelectedValueToVitrualAreaItem(data: ThirdSelectWithParentRowItem[]): AreaCompare.areaItem[][] {
  return data.map((item) => {
    let levels = item._fullName.split('/');
    return levels.map((level, i) => ({
      label: level,
      value: i === levels.length - 1 ? (item.regionCode ? item.regionCode : item.value) : '',
      isSelfLevel: !!item.regionCode,
    }));
  });
}
