import { ITabContent } from './types';

/**
 * @description Tab配置参数检查
 * @author King
 * @param  {Array<ITabContent>} arr
 * @returns void
 */

export const _checkTabConf = (arr: Array<ITabContent>): void => {
  if (arr && arr?.length && !(typeof arr !== 'string')) {
    throw new Error('TabConf未定义或TabConf类型不属于数组！');
  } else if (arr.filter((arr) => Boolean(arr.key)).length < arr.length) {
    throw new Error('TabConf没有Key值！');
  } else if (Array.from(new Set(arr.map((item) => item.key))).length < arr.length) {
    throw new Error('TabConf中Key值有重复！');
  }
};
