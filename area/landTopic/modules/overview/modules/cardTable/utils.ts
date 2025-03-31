import { WHOLE_COUNTRY_CODE } from '@pages/area/landTopic/modules/overview/provider';

import { shortId } from '@/utils/share';

interface Lists {
  areaCode: string;
  areaName: string;
  areaLevel: string;
  parentCode: string;
  children?: Lists[];
  key?: string;
  [key: string]: any;
}

export const getRowData = (obj: Lists, addChild: boolean) => {
  const { areaCode, areaLevel } = obj;
  const result: any = { key: areaCode, ...obj };
  if (addChild && areaLevel !== '3' && areaCode !== WHOLE_COUNTRY_CODE) result.children = [{ key: shortId() }];
  return result;
};

export const buildTree = (nodes: Lists[], node: Lists) => {
  const { parentCode } = node;
  if (parentCode) {
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      const { areaCode, areaLevel } = item;
      if (areaCode) {
        if (areaCode === parentCode) {
          if (item.children?.length) item.children.push(node);
          else item.children = [node];
          break;
        } else {
          const start = (+areaLevel - 1) * 2;
          if (areaCode.slice(start, start + 2) === parentCode.slice(start, start + 2)) {
            buildTree(item.children || [], node);
          }
        }
      }
    }
  }
};

/**
 * 递归同层级排序
 * @param lists 排序树
 * @param sortKey 排序键值
 * @param sortRule 排序规则
 * @param keepWholeTop 是否保持全国始终第一个
 */
export const sortData = (lists: Lists[], sortKey: string, sortRule: string, keepWholeTop: boolean) => {
  if (sortKey && sortRule) {
    lists.sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];
      if (keepWholeTop) {
        if (a.areaCode === WHOLE_COUNTRY_CODE) {
          return 0;
        } else if (b.areaCode === WHOLE_COUNTRY_CODE) {
          return 1;
        }
      }
      // 都没值保持原先顺序
      if (!aValue && !bValue) return 0;
      // 只有一个有值，把有值的换到前面
      if (aValue && !bValue) return -1;
      if (!aValue && bValue) return 1;
      // 两个都有值正常排序
      return sortRule === 'asc' ? aValue - bValue : bValue - aValue;
    });
    lists.forEach((item) => {
      if ((item.children?.length || 0) > 1) {
        sortData(item.children!, sortKey, sortRule, keepWholeTop);
      }
    });
  }
};

/** 根据code找到对应的地区item,若getFather为true就是找到code的父级,regionAry是接口查到的所有地区树 */
export const getRegion = (regionAry: any[], regionCode: string, loopCount: number, getFather?: boolean): any => {
  for (let i = 0; i < regionAry.length; i++) {
    const element = regionAry[i];
    if (element?.value === regionCode) {
      return getFather ? regionAry : element;
    } else {
      if (
        //如果前2 * loopCount位的code相等才进行递归
        element?.value?.substring(0, 2 * loopCount) === regionCode.substring(0, 2 * loopCount) &&
        element?.children?.length
      ) {
        return getRegion(element?.children, regionCode, loopCount + 1, getFather);
      }
    }
  }
};
