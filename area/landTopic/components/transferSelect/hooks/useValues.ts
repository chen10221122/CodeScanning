import { Key, useEffect, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isUndefined, cloneDeep } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import { DefaultPlan } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { SelectItem } from '@pages/area/landTopic/components/transferSelect/types';
import { filterTree, getNodeByKey, getKey } from '@pages/area/landTopic/components/transferSelect/utils';

interface Props {
  data: SelectItem[];
  onChange?: (selectedRows: SelectItem[], selectedTree: SelectItem[]) => void;
}

export default function useValues({ data, onChange }: Props) {
  const hasReturnRef = useRef(false); // 首次加载是否返回了指标
  const initCheckRef = useRef(false); // 是否初始化过选中
  const {
    state: { defaultSelect, allPlan, hasGetPlanFlag, controlledRows, formatTreeData },
    update,
  } = useCtx();

  /** 确认操作，并将选中指标对应的原始数据返回给使用者 */
  const confirmChange = useMemoizedFn((confirmData: SelectItem[]) => {
    let sourceData = cloneDeep(data);
    const checkNodes: SelectItem[] = [];

    /** 将data根据lists的顺序排序的方法 */
    const sortByLists = (data: SelectItem[], lists = checkNodes) => {
      data.sort(
        (a, b) =>
          lists.findIndex((item) => getKey(item) === getKey(a) || item.parentKey?.includes(getKey(a))) -
          lists.findIndex((item) => getKey(item) === getKey(b) || item.parentKey?.includes(getKey(b))),
      );
    };
    getNodeByKey(
      formatTreeData,
      confirmData.map(({ key }) => key!),
      checkNodes,
    );
    sortByLists(checkNodes, confirmData);

    let flatResult: SelectItem[] = []; // 扁平化，没有树结构的返回结果
    const allParentKeys = checkNodes.reduce((pre, { parentKey }) => [...pre, ...(parentKey as Key[])], [] as Key[]);
    const parentKeys = Array.from(new Set(allParentKeys));
    /** 过滤掉未选中的叶子结点 */
    const filterRes = filterTree(sourceData, (item) => {
      const itemKey = getKey(item);
      if (parentKeys.includes(itemKey!)) return true;
      else return checkNodes.some((checkedItem) => checkedItem?.key === itemKey);
    });

    /** 给树递归排序的方法 */
    const sortTree = (data: SelectItem[]) => {
      sortByLists(data);
      data.forEach((item) => item.children && sortTree(item.children));
    };
    sortTree(filterRes);

    /* 获取每一个叶子节点 */
    const getFlatRes = (data: SelectItem[]) => {
      data.forEach((item) => {
        if (item.children) getFlatRes(item.children);
        else flatResult.push(item);
      });
    };
    getFlatRes(filterRes);

    /* 将叶子节点数据按confirmData对应的顺序排列 */
    sortByLists(flatResult);
    onChange?.(flatResult, filterRes);
    update((draft) => {
      draft.confirmSelected = [...flatResult];
    });
  });
  /* 初始化defaultSelect */
  useEffect(() => {
    if (!initCheckRef.current) {
      update((draft) => {
        draft.confirmSelected = isUndefined(controlledRows) ? defaultSelect : controlledRows;
      });
      initCheckRef.current = true;
    }
  }, [controlledRows, defaultSelect, update]);

  /* 受控值变化时更新选中项 */
  useEffect(() => {
    if (!isUndefined(controlledRows)) {
      update((draft) => {
        draft.confirmSelected = controlledRows;
      });
    }
  }, [controlledRows, update]);

  /** 初始化返回默认值,有默认模板就返回默认模板指标，否则就返回系统默认模板 */
  useEffect(() => {
    if (!hasReturnRef.current && hasGetPlanFlag) {
      const defaultPlan = allPlan.find((item) => item.remark === DefaultPlan.IsDefault);
      /* 有自定义默认模板时，要把该模板选中 */
      if (allPlan.length > 0) {
        if (defaultPlan) {
          update((draft) => {
            draft.curSelectPlanId = defaultPlan.planId;
          });
        }
        confirmChange(
          allPlan.length > 1 && defaultPlan
            ? defaultPlan.content ?? []
            : isUndefined(controlledRows)
            ? defaultSelect
            : controlledRows,
        );
        hasReturnRef.current = true;
      }
    }
  }, [allPlan, confirmChange, controlledRows, defaultSelect, hasGetPlanFlag, update]);

  return { confirmChange };
}
