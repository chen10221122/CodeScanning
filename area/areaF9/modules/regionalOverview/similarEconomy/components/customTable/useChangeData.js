import { useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

const useChangeData = (rowsData) => {
  const tempData = cloneDeep(rowsData);
  const [newRowData, setNewRowData] = useState([]);
  // const foldTreeNodes = useRef(new Set());

  const traverseTree = useMemoizedFn((data, level) => {
    return data.map((item) => {
      const { subIndicList, indicatorName, weight, score, similarScoreList, ...rest } = item;

      item = {
        ...rest,
        weight: weight,
        level,
        indent: level === 1 ? 1 : 2,
        key: rest.indicatorCode,
        rowIndex: rest.indicatorCode,
        head: indicatorName,
        score: score,
        hasChildren: !!subIndicList && subIndicList.length > 0,
        isExpand: false,
      };

      if (Array.isArray(similarScoreList) && similarScoreList.length > 0) {
        similarScoreList.forEach((sitem, i) => {
          item[`compareRegionName${i}`] = sitem.regionName;
          item[`compareRegionCode${i}`] = sitem.regionCode;
          item[`score${i}`] = sitem.score;
          item[`deviation${i}`] = sitem.deviation;
          item[`regionShortName${i}`] = sitem.regionShortName;
        });
      }
      if (subIndicList && subIndicList.length > 0) {
        item.children = traverseTree(subIndicList, level + 1);
      }

      // if (foldTreeNodes.current.has(item.key)) {
      //   item.isExpand = true;
      // } else {
      //   item.isExpand = false;
      // }

      return item;
    });
  });

  useEffect(() => {
    if (Array.isArray(rowsData)) {
      const treeNodes = traverseTree(tempData, 1);
      setNewRowData(treeNodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsData, traverseTree]);

  return {
    changeData: newRowData,
  };
};

export default useChangeData;
