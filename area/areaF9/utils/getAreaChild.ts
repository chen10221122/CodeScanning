import * as ls from 'local-storage';
import { isUndefined } from 'lodash';

import { AREA_ECONOMY_AREA_TREE_DATA } from '@/configs/localstorage';

import { getLevel } from '.';
import { Level } from './index';

type IItem = { value: string; children?: IItem[] };
type IArea = IItem[];

const flattenChildren = (area: IArea | undefined): any[] => {
  return Array.isArray(area)
    ? area.reduce((total: IArea, item: IItem) => {
        const { children, ...rest } = item;
        total.push(rest);
        if (item.children) {
          total.push(...flattenChildren(item.children));
        }
        return total;
      }, [])
    : [];
};

// 获取省级
const getProvice = (areaTreeData: IArea, code: string) => {
  const province: IArea = areaTreeData.find((item) => item.value === code)?.children || [];
  return province;
};

// 获取市级
const getCity = (areaTreeData: IArea, code: string) => {
  let city: IArea = [];
  areaTreeData.find((item: IItem) =>
    item?.children?.length
      ? item.children.find((child: IItem) => (child.value === code ? (city = child?.children || []) : false))
      : false,
  );
  return city;
};

// 获取地区子级
export const getAreaChild = (code: string, level?: Level): IArea => {
  const areaTreeData: IArea = ls.get(AREA_ECONOMY_AREA_TREE_DATA) || [];
  let area: IArea = [];
  if (isUndefined(level)) {
    level = getLevel(code);
  }
  if (level === Level.PROVINCE) {
    area = getProvice(areaTreeData, code);
  } else if (level === Level.CITY) {
    area = getCity(areaTreeData, code);
  }
  return area;
};

// 获取地区子集code列表
export const getAreaChildCodes = (code: string, level?: Level): string =>
  flattenChildren(getAreaChild(code, level))
    ?.map((item) => item.value)
    .join(',');
