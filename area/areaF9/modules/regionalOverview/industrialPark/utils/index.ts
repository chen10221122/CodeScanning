import { isEmpty } from 'lodash';

/** 处理接口数据成搜索数据 */
export function handleInterfaceDataToSearchData(data: any[], type?: string): any[] {
  if (!isEmpty(data)) {
    return data.map((d) => {
      let newD: any = Object.assign({}, d);

      newD.key = d.key || type;

      if (d?.name) {
        newD.name = d.name;
      }

      if (d?.value) {
        newD.value = d.value;
      }

      if (typeof d === 'string') {
        newD.name = d;
        newD.value = d;
      }

      if (!isEmpty(d?.children)) {
        newD.children = handleInterfaceDataToSearchData(d.children, type);
      }

      if (isEmpty(d?.children)) {
        delete newD.children;
      }

      return newD;
    });
  }
  return [];
}

/* 将筛选数据转化为请求参数 */
export function handleChose(obj: any, key: string, value: string) {
  obj[key] = !obj[key] ? value : obj[key] + ',' + value;
}
