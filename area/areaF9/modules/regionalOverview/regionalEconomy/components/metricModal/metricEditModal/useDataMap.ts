import { useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isArray } from 'lodash';

import { ConfigType, NormalChildItem, NormalConfig, NormalWithActionConfig } from '@dataView/components/Indicators';

// 处理data数据映射关系
export default function useDataMap(indicatorKey: string, data?: ConfigType) {
  const rebuildData = useMemo(() => cloneDeep(data), [data]);
  // 新数据 -> 原始数据 映射
  const rowToRawRef = useRef(new Map<NormalChildItem, NormalChildItem>());
  // 原始数据 -> 新数据 映射
  const rawToRowRef = useRef(new Map<NormalChildItem, NormalChildItem>());

  // 原始data变化的时候清空map
  useEffect(() => {
    rawToRowRef.current.clear();
    rowToRawRef.current.clear();
  }, [data]);

  const flatArray = useMemoizedFn((originRows: NormalChildItem[], targetRows: NormalChildItem[]) => {
    originRows.forEach((originRow, index) => {
      const targetRow = targetRows[index];
      rowToRawRef.current.set(targetRow, originRow);
      rawToRowRef.current.set(originRow, targetRow);
      if (originRow.children) {
        flatArray(originRow.children, targetRow.children);
      }
    });
  });

  useEffect(() => {
    if (data) {
      if (isArray(data)) {
        flatArray(data, rebuildData as NormalConfig[]);
      } else if (data.actions) {
        const innerClonedData = rebuildData as NormalWithActionConfig;
        const baseOriginConfig = data.configs || [];
        const baseTargetConfig = innerClonedData.configs || [];
        flatArray(baseOriginConfig, baseTargetConfig);
        Object.keys(data.actions).forEach((key) => {
          const originActionConfigs = data.actions[key];
          const targetActionConfigs = innerClonedData.actions[key];
          flatArray(originActionConfigs, targetActionConfigs);
        });
      }
    }
  }, [rebuildData, data, flatArray]);

  const getRaw = useMemoizedFn((row?: NormalChildItem) => {
    if (!row) return undefined;
    return rowToRawRef.current.get(row);
  });

  const getRow = useMemoizedFn((raw?: NormalChildItem) => {
    if (!raw) return undefined;
    const row = rawToRowRef.current.get(raw);
    // if (row) {
    //   // 如果遇到带有突变值的row，应该更新这里的row的value为突变后的值，将更新后的row返回回去
    //   // 其它情况返回原始的row即可
    //   if (mutateParams) {
    //     const mutateParam = mutateParams[indicatorKey];
    //     if (mutateParam) {
    //       const mutateInfo = mutateParam.get(raw);
    //       if (mutateInfo && !mutateInfo._dirty) {
    //         row.value = mutateInfo.mutateValue;
    //       }
    //     }
    //   }
    // }
    return row;
  });

  // 获取内部使用新数据
  const getRows = useMemoizedFn((raws?: NormalChildItem[]): NormalChildItem[] | undefined => {
    if (!raws) return undefined;
    return raws.map(getRow).filter(Boolean) as NormalChildItem[];
  });

  const getRaws = useMemoizedFn((rows?: NormalChildItem[]) => {
    if (!rows) return undefined;
    return rows.map(getRaw).filter(Boolean) as NormalChildItem[];
  });

  return { rebuildData, rawToRowRef, rowToRawRef, getRows, getRaws, getRaw, getRow };
}
