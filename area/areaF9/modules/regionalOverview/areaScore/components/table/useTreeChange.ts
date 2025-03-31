import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { flatMap, cloneDeep } from 'lodash';

// import useImmer from '@/utils/hooks/useImmer';

const useTreeChange = (rowDatas: any, isExpandAll: boolean, isEmptyLineOpen: boolean, gridRef: any) => {
  const data = cloneDeep(rowDatas);
  // const [foldTreeNodes, updateFoldTreeNodes] = useImmer(new Set());
  const foldTreeNodes = useRef(new Set());
  const [newRowData, setNewRowData] = useState<any[]>([]);
  const traverseTree = useMemoizedFn((data: any, level = 1, title = '', isEmptyLineOpen: boolean) => {
    const treeItem = cloneDeep(data);
    return flatMap(treeItem, (item) => {
      const { subIndicList, indicatorName, isEmpty, ...rest } = item;
      /** 一级指标名称 */
      const maxTitle = level === 1 ? indicatorName : title;
      /** 如果节点的 isEmpty 属性为 true，则直接返回空数组，表示跳过该节点 */
      // if (isEmpty && isEmptyLineOpen && areaInfo?.length) return [];
      if (isEmpty && isEmptyLineOpen) return [];

      const curNode = {
        ...rest,
        indicatorName,
        level,
        isEmpty,
        maxTitle,
        children: [],
        hasChildren: false,
        isExpand: false,
      };
      /** 有些节点是没有indexId的，必须手动加上一个indexId，否则ag-grid树层级渲染有问题 */
      if (!curNode.indexId) curNode.indexId = curNode.indicatorName;
      if (foldTreeNodes.current.has(curNode.indexId)) {
        curNode.hasChildren = true;
      } else if (subIndicList?.length > 0) {
        curNode.children = traverseTree(subIndicList, level + 1, maxTitle, isEmptyLineOpen);
        curNode.hasChildren = true;
        curNode.isExpand = true;
      }
      return [curNode, ...(isExpandAll ? curNode.children : [])];
    }).filter(Boolean);
  });
  useEffect(() => {
    const treeNodes = traverseTree(data, 1, '', isEmptyLineOpen);
    setNewRowData(treeNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowDatas, isEmptyLineOpen, traverseTree, isExpandAll]);

  const updateFoldKeys = useMemoizedFn((key) => {
    if (foldTreeNodes.current.has(key)) {
      foldTreeNodes.current.delete(key);
    } else {
      foldTreeNodes.current.add(key);
    }
    const treeNodes = traverseTree(data, 1, '', isEmptyLineOpen);
    setNewRowData([...treeNodes]);

    // gridRef.current?.api.setRowData(cloneDeep(treeNodes));
    gridRef.current?.api.refreshCells({ force: true });
  });
  return {
    rowData: newRowData,
    updateFoldKeys,
  };
};

export default useTreeChange;
