import { useEffect, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { IParam, SelectItem } from '../../../types';
import { useCtx } from '../context';

interface Props {
  defaultNodes: SelectItem[];
  checkedNodes: SelectItem[];
  defaultNodeParamMap: Record<string, IParam | undefined>;
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
  selectNodeParamMap: Record<string, IParam | undefined>;
  setSelectNodeParamMap: React.Dispatch<React.SetStateAction<Record<string, IParam | undefined>>>;
}

export default function useRightList({
  defaultNodes,
  checkedNodes,
  defaultNodeParamMap,
  selectNodeParamMap,
  setCheckedNodes,
  setSelectNodeParamMap,
}: Props) {
  const { update } = useCtx();
  const resetFlag = useMemo(
    () => !(JSON.stringify(defaultNodeParamMap) === JSON.stringify(selectNodeParamMap)),
    [defaultNodeParamMap, selectNodeParamMap],
  );
  useEffect(() => {
    update((d) => {
      d.resetFlag = resetFlag;
    });
  }, [resetFlag, update]);

  /** 重置成默认选项 */
  const onReset = useMemoizedFn(() => {
    if (resetFlag) {
      setCheckedNodes && setCheckedNodes([...defaultNodes]);
      setSelectNodeParamMap && setSelectNodeParamMap({ ...defaultNodeParamMap });
      update((d) => {
        d.selectedNodes = [...defaultNodes];
        d.selectedNodeParam = { ...defaultNodeParamMap };
      });
    }
  });

  /** 清空所有选项 */
  const onDeleteAll = useMemoizedFn(() => {
    setCheckedNodes([]);
    setSelectNodeParamMap && setSelectNodeParamMap({});
    update((d) => {
      d.selectedNodes = [];
      d.selectedNodeParam = {};
    });
  });

  /** 批量删除项 */
  const onDelete = useMemoizedFn((nodes: SelectItem[]) => {
    const deleteNodeParamMap: Record<string, IParam | undefined> = {};
    nodes.forEach((item) => {
      if (item?.indexId) deleteNodeParamMap[item.indexId] = undefined;
    });
    setCheckedNodes(checkedNodes.filter((item) => !nodes.find(({ key }) => key === item.key)));
    setSelectNodeParamMap((d) => ({ ...d, ...deleteNodeParamMap }));
    update((d) => {
      d.selectedNodes = checkedNodes.filter((item) => !nodes.find(({ key }) => key === item.key));
      d.selectedNodeParam = { ...d.selectedNodeParam, ...deleteNodeParamMap };
    });
  });

  /** 拖拽结束触发 */
  const onDragEnd = useMemoizedFn((result) => {
    if (!result?.destination || !result?.source) return;
    if (result.destination.index !== result.source.index) {
      const preSelecting = cloneDeep(checkedNodes);
      let [d] = preSelecting.splice(result.source.index, 1);
      preSelecting.splice(result.destination.index, 0, d);
      setCheckedNodes(preSelecting);
      update((d) => {
        d.selectedNodes = preSelecting;
      });
    }
  });

  return { resetFlag, onReset, onDeleteAll, onDelete, onDragEnd };
}
