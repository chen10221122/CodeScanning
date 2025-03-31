import { useEffect, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

/* 
  // 单选
  SINGLE,
  // 多选
  MULTIPLE,
  // 三级多选
  MULTIPLE_THIRD,
  // 三级单选
  SINGLE_THIRD,
  // 多选平铺
  MULTIPLE_TILING, 
  
  // 水平单选
  const HORIZONTAL_SINGLE = 0;
  // 水平多选
  const HORIZONTAL_MULTIPLE = 1;
  // 垂直单选
  const VERTICAL_SINGLE = 3;
  // 垂直多选
  const VERTICAL_MULTIPLE = 4;
  // 日期选择
  const DATEPICKER = 5;
  // 水平布局
  const HORIZONTAL = 6;
  // 垂直布局
  const VERTICAL = 7;  
  */

export default function useBabelFilter(data, mapping) {
  const [newConfig, setNewConfig] = useState([]);

  const fmtOpt = useMemoizedFn((data, type) => {
    let newItem;
    if (data.list.length <= 1) {
      newItem = {
        title: data.name || '-',
        option: {
          type: type,
          children: data.list[0].list?.map((o) => ({ ...o, key: data.list[0].key })) || [],
        },
      };
    } else {
      newItem = { title: data.name || '-', option: { type: type, children: [] } };
      data.list.forEach((item) => {
        const normalData = item.list.map((o) => ({ ...o, key: item.key }));
        if (item?.name !== '市场' && item.list.length === 2) {
          const allValue = item.list.map((o) => o.value).join(',');
          normalData.unshift({
            name: '全部',
            value: allValue,
            key: item.key,
          });
        }

        newItem.option.children.push({
          title: item.name,
          data: normalData,
          ...mapping[item.name],
        });
      });
    }
    return newItem;
  });

  useEffect(() => {
    setNewConfig(data.map((item) => fmtOpt(item, mapping[item.name].type)));
  }, [data, fmtOpt, mapping]);

  return useMemo(() => [newConfig], [newConfig]);
}

/**
 * 分组
 */
export const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key] === 'subInfo' ? 'subId' : item[key]]: [
        ...(result[item[key] === 'subInfo' ? 'subId' : item[key]] || []),
        item,
      ],
    }),
    {},
  );

/**
 * 参数
 */
export const keyMap = (obj) => {
  return Object.keys(obj)
    .map((k) => ({
      [k]: obj[k].map((o) => o.value).join(','),
    }))
    .reduce((pre, next) => ({ ...pre, ...next }), {});
};
