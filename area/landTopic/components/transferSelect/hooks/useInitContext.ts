import { useEffect, useLayoutEffect, Key } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { cloneDeep, isUndefined } from 'lodash';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';
import { SelectItem, TransferSelectProps } from '@pages/area/landTopic/components/transferSelect/types';
import { initData, getDefault, getNodeByKey, getKey } from '@pages/area/landTopic/components/transferSelect/utils';

interface Props extends TransferSelectProps {
  hide: () => void;
}

export default function useInitContext({
  title,
  data,
  moduleCode,
  pageCode,
  parentCheckable = false,
  hasSelectAll = true,
  hasExpandedAll = true,
  maxSelect = 100,
  maxPlan = 10,
  tipDelay = 3000,
  fuzzySearch = false,
  forbidEmptyCheck = false,
  hideSaveTemplate,
  values,
  checkMaxLimit = true,
  noPlan = false,
  hide,
  defaultExpandKes,
}: Props) {
  const { update } = useCtx();
  const selectedData = useSelector((store: any) => store?.user?.info, shallowEqual);

  useEffect(() => {
    update((draft) => {
      draft.hasPay = selectedData.havePay;
    });
  }, [selectedData.havePay, update]);

  useEffect(() => {
    if (isUndefined(values)) {
      update((draft) => {
        draft.controlledRows = undefined;
      });
    } else {
      const controlledNodes: SelectItem[] = [];
      const controlledKeys = values?.map((item) => (typeof item === 'object' ? getKey(item) : item));
      getNodeByKey(data, controlledKeys, controlledNodes);
      controlledNodes.sort(
        (a, b) =>
          controlledKeys.findIndex((item) => item === getKey(a)) -
          controlledKeys.findIndex((item) => item === getKey(b)),
      );
      update((draft) => {
        draft.controlledRows = controlledNodes;
      });
    }
  }, [data, update, values]);

  /* 初始化data,context数据 */
  useLayoutEffect(() => {
    let leafNodeSort = { sort: 0 }; // 叶子节点的顺序信息用对象而不直接用number是为了保证每次递归leafNodeSort都是同一个
    let defaultSelects: SelectItem[] = [];
    let parentKeys: Key[] = [];
    let checkAllNodes: SelectItem[] = [];
    const initTreeData = initData(cloneDeep(data), hasSelectAll, leafNodeSort, [], [], parentCheckable, maxPlan);
    getDefault(initTreeData, defaultSelects, parentKeys, checkAllNodes);
    update((draft) => ({
      ...draft,
      title,
      data,
      formatTreeData: initTreeData,
      moduleCode,
      pageCode,
      hasExpandedAll,
      maxSelect,
      maxPlan,
      tipDelay,
      fuzzySearch,
      allParentKey: parentKeys,
      defaultSelect: defaultSelects,
      checkAllNodes,
      forbidEmptyCheck,
      hideSaveTemplate,
      checkMaxLimit,
      hide,
      noPlan,
      defaultExpandKes,
    }));
  }, [
    update,
    hide,
    title,
    data,
    moduleCode,
    pageCode,
    hasExpandedAll,
    maxSelect,
    maxPlan,
    tipDelay,
    fuzzySearch,
    hasSelectAll,
    forbidEmptyCheck,
    hideSaveTemplate,
    checkMaxLimit,
    parentCheckable,
    noPlan,
    defaultExpandKes,
  ]);
}
