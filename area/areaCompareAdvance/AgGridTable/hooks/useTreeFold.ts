import { useMemo, MutableRefObject, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { flatMap, cloneDeep } from 'lodash';

import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import useImmer from '@/utils/hooks/useImmer';

const useTreeFold = (data: any[], gridRef: MutableRefObject<any>) => {
  const {
    state: { isEmptyLineOpen, areaInfo, isExpandAll },
  } = useCtx();

  const [foldTreeNodes, updateFoldTreeNodes] = useImmer(new Set());
  /** 平铺树级结构并添加levle层级、隐藏空行、一级指标名称等 */
  const rowData = useMemo(() => {
    function traverseTree(data: any, level = 1, title = '', isEmptyLineOpen: boolean) {
      const treeItem = cloneDeep(data);
      return flatMap(treeItem, (item) => {
        const { children, name, isEmpty, ...rest } = item;
        /** 一级指标名称 */
        const maxTitle = level === 1 ? name : title;
        /** 如果节点的 isEmpty 属性为 true，则直接返回空数组，表示跳过该节点 */
        if (isEmpty && isEmptyLineOpen && areaInfo?.length) return [];

        const curNode = {
          ...rest,
          name,
          level,
          isEmpty,
          maxTitle,
          children: [],
          hasChildren: false,
          isExpand: false,
        };
        /** 有些节点是没有indexId的，必须手动加上一个indexId，否则ag-grid树层级渲染有问题 */
        if (!curNode.indexId) curNode.indexId = curNode.name;
        if (foldTreeNodes.has(curNode.indexId)) {
          curNode.hasChildren = true;
        } else if (children?.length > 0) {
          curNode.children = traverseTree(children, level + 1, maxTitle, isEmptyLineOpen);
          curNode.hasChildren = true;
          curNode.isExpand = true;
        }
        return [curNode, ...curNode.children];
      }).filter(Boolean);
    }
    const treeNodes = traverseTree(data, 1, '', isEmptyLineOpen);

    return treeNodes;
  }, [areaInfo?.length, data, foldTreeNodes, isEmptyLineOpen]);

  useEffect(() => {
    updateFoldTreeNodes((draft) => {
      data?.forEach((item) => {
        isExpandAll ? draft.delete(item.name) : draft.add(item.name);
      });
    });
  }, [data, isExpandAll, updateFoldTreeNodes]);

  const updateFoldKeys = useMemoizedFn((key) => {
    updateFoldTreeNodes((d) => {
      foldTreeNodes.has(key) ? d.delete(key) : d.add(key);
      // gridRef.current?.api.setRowData(data);
    });
  });

  return {
    rowData,
    foldTreeNodes,
    updateFoldKeys,
  };
};

export default useTreeFold;
