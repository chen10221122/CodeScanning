import { useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { flatMap, cloneDeep } from 'lodash';

const useFlat = (rowsData) => {
  const tempData = cloneDeep(rowsData);
  const [newRowData, setNewRowData] = useState([]);

  const traverseTree = useMemoizedFn((data, level = 1, title = '', parentWeight) => {
    const treeItem = cloneDeep(data);
    return flatMap(treeItem, (item) => {
      const { subIndicList, indicatorName, weight, ...rest } = item;

      const maxTitle =
        level === 1
          ? weight
            ? indicatorName + `(${weight})`
            : indicatorName
          : parentWeight
          ? title + `(${parentWeight})`
          : title;

      const curNode = {
        ...rest,
        weight: weight,
        level,
        name: indicatorName,
        partName: maxTitle,
        children: [],
        hasChildren: false,
      };
      if (subIndicList?.length > 0) {
        curNode.children = traverseTree(subIndicList, level + 1, indicatorName, weight);
        curNode.hasChildren = true;
      }
      return [curNode, ...curNode.children];
    }).filter(Boolean);
  });

  useEffect(() => {
    const treeNodes = traverseTree(tempData, 1, '', '');
    setNewRowData(treeNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsData, traverseTree]);

  return {
    flatData: newRowData,
  };
};

export default useFlat;
