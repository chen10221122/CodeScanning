import { IFormatterCheckReturn } from '../../financialResources/module/common/type';

export const joinPrefix = '--';

// 筛选处理
export function formatterCheck(arr: any[], fartherKey: string, prefix?: boolean): IFormatterCheckReturn[] {
  return arr.map((item: any) => {
    const { name, value } = item;
    return {
      name: name,
      oldName: name,
      value: prefix ? `${fartherKey}${joinPrefix}${value}` : value,
      key: fartherKey,
    };
  });
}
