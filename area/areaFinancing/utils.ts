// 无效值判断
import { isArray } from 'lodash';
// 通用表格设计稿宽度
export const staticTableWidth = 1038; //1280 -190-40-12

export const formatDetailModalData = (data: Record<string, any>[], skip: number) => {
  return data.map((o, i) => {
    return { ...o, rowIndex: skip + i + 1 };
  });
};

export const handleData = (data: any[], { pathValue, pathNumber, pathName }: any) => {
  if (isArray(data)) {
    return data.map((item, i) => {
      item.pathValue = pathValue?.length ? [...pathValue, item.value] : [item.value];
      item.values = item?.pathValue.join('_');
      item.pathNumber = pathNumber?.length ? [...pathNumber, i] : [i];
      item.pathName = pathName?.length ? [...pathName, item.name] : [item.name];
      // item.pathAppName = pathAppName?.length ? [...pathAppName, item.appName] : [item.appName];
      if (isArray(item?.children)) {
        item.children =
          handleData(item.children as any[], {
            pathValue: item.pathValue,
            pathNumber: item.pathNumber,
            pathName: item.pathName,
            // pathAppName: item.pathAppName,
          }) || [];
      }
      return item;
    });
  }
};
export const calcPercentage = (num: number, restTableWidth = staticTableWidth) => {
  return `${(num / restTableWidth) * 100}%`;
};
