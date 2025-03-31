import { useEffect, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { useCtx as useGlobalContext } from '../../../context';
import { useCtx } from '../context';
import { IParam, SelectItem } from '../types';

interface Props {
  defaultNodes: SelectItem[];
  checkedNodes: SelectItem[];
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
  setSelectNodeParamMap: React.Dispatch<React.SetStateAction<Record<string, IParam | undefined>>>;
}

export default function useRightList({ checkedNodes, setCheckedNodes, setSelectNodeParamMap }: Props) {
  const {
    update,
    state: { originalDefaultNodes, originalDefaultNodesParams },
  } = useCtx();
  const { update: updateGlobalCtx } = useGlobalContext();

  const resetFlag = useMemo(
    () => !(JSON.stringify(originalDefaultNodes) === JSON.stringify(checkedNodes)),
    [checkedNodes, originalDefaultNodes],
  );
  useEffect(() => {
    update((d) => {
      d.resetFlag = resetFlag;
    });
  }, [resetFlag, update]);

  /** 重置成默认选项 */
  const onReset = useMemoizedFn(() => {
    if (resetFlag) {
      setCheckedNodes && setCheckedNodes([...(originalDefaultNodes as SelectItem[])]);
      setSelectNodeParamMap && setSelectNodeParamMap({ ...originalDefaultNodesParams });
      update((d) => {
        d.selectedNodes = [...(originalDefaultNodes as SelectItem[])];
        d.selectedNodeParam = { ...originalDefaultNodesParams };
      });
    }
  });

  updateGlobalCtx((d) => {
    d.resetIndicators = onReset;
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
    const calcCheckedNodes = cloneDeep(checkedNodes).filter((item) => !nodes.find(({ key }) => key === item.key));
    setCheckedNodes(calcCheckedNodes);
    setSelectNodeParamMap((d) => ({ ...d, ...deleteNodeParamMap }));
    update((d) => {
      d.selectedNodes = calcCheckedNodes;
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
