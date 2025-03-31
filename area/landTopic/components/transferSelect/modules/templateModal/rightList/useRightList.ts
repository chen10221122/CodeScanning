import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { SelectItem } from '@pages/area/landTopic/components/transferSelect';

interface Props {
  defaultNodes: SelectItem[];
  checkedNodes: SelectItem[];
  setCheckedNodes: React.Dispatch<React.SetStateAction<SelectItem[]>>;
}

export default function useRightList({ defaultNodes, checkedNodes, setCheckedNodes }: Props) {
  const resetFlag = useMemo(
    () =>
      !(
        defaultNodes.length === checkedNodes.length && defaultNodes.every((item, i) => item.key === checkedNodes[i].key)
      ),
    [checkedNodes, defaultNodes],
  );

  /** 重置成默认选项 */
  const onReset = useMemoizedFn(() => resetFlag && setCheckedNodes([...defaultNodes]));

  /** 清空所有选项 */
  const onDeleteAll = useMemoizedFn(() => setCheckedNodes([]));

  /** 批量删除项 */
  const onDelete = useMemoizedFn((nodes: SelectItem[]) =>
    setCheckedNodes(checkedNodes.filter((item) => !nodes.find(({ key }) => key === item.key))),
  );

  /** 拖拽结束触发 */
  const onDragEnd = useMemoizedFn((result) => {
    if (!result?.destination || !result?.source) return;
    if (result.destination.index !== result.source.index) {
      const preSelecting = cloneDeep(checkedNodes);
      let [d] = preSelecting.splice(result.source.index, 1);
      preSelecting.splice(result.destination.index, 0, d);
      setCheckedNodes(preSelecting);
    }
  });

  return { resetFlag, onReset, onDeleteAll, onDelete, onDragEnd };
}
