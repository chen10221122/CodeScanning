import { mapValues, mapKeys, forEach, includes, cloneDeep } from 'lodash';

/** 无需比较最大值和最小值的指标 */
const NO_COMPARE_INDICATORS = [
  //地区代码
  'REGION_10000003',
  //上级地区代码
  'REGION_10000005',
  //所属省份代码
  'REGION_10000007',
  //所属地级市代码
  'REGION_10000009',
  //所属区县代码
  'REGION_10000469',
];

export function flatDefaultIndexParam(treeData, indexIds, curYear, isFlat = true) {
  return treeData?.reduce((results, node) => {
    const traverseTree = (node) => {
      if (includes(indexIds, node.indexId)) {
        const modifiedNode = cloneDeep(node);
        let { defaultParamMap, indexId } = modifiedNode;
        const [date] = curYear;
        defaultParamMap = { ...defaultParamMap, auditYear: curYear, date: [`${date}-12-31`] };
        isFlat && results.push({ indexId, paramMap: defaultParamMap });
      }
      if (node?.children?.length > 0) {
        forEach(node.children, (child) => {
          traverseTree(child);
        });
      }
    };
    traverseTree(node);
    return results;
  }, []);
}

export function generateResultTree(tree, resData) {
  const { indexIdList, data } = resData;

  if (!indexIdList) return [];

  return tree?.reduce((resultTree, node) => {
    const { title, indexId, children, ...rest } = node;
    const resultNode = { name: title, ...rest };

    /** 递归树结构 */
    if (children) resultNode.children = generateResultTree(children, resData);

    /** 找到indexIdList中每项对应的节点，返回本节点及所有父级节点 */
    if (indexIdList.includes(indexId)) {
      const listIdx = indexIdList.indexOf(indexId);
      let maxMValue = -Infinity;
      let minMValue = Infinity;
      let isEmptyNode = true;
      const result = mapValues(data, (arr) => {
        if (arr) {
          const currentMValue = arr[listIdx]?.value;
          if (currentMValue === '无权限') isEmptyNode = true;
          else if (currentMValue) {
            maxMValue = Math.max(maxMValue, currentMValue);
            minMValue = Math.min(minMValue, currentMValue);
            isEmptyNode = false;
          }
          return mapKeys(arr[listIdx], (_, key) => {
            if (key === 'value') return 'mValue';
            return key;
          });
        } else {
          return null;
        }
      });
      resultTree.push({
        indexId,
        ...result,
        ...resultNode,
        value: result,
        maxValue: !NO_COMPARE_INDICATORS.includes(indexId) && maxMValue,
        minValue: !NO_COMPARE_INDICATORS.includes(indexId) && minMValue,
        isEmpty: isEmptyNode,
      });
    } else if (resultNode.children?.length) {
      resultTree.push(resultNode);
    }

    return resultTree;
  }, []);
}

export function flatDetailData(Tdata) {
  const { area, data } = Tdata;
  return area?.reduce((results, node) => {
    const { regionName, regionCode } = node;
    results.push({ area: regionName, date: data[regionCode][0].value, regionCode });
    return results;
  }, []);
}

export function flatDeepTree(treeData) {
  return treeData?.reduce((results, node) => {
    const traverseTree = (node) => {
      results.push(node);
      if (node?.children?.length > 0) {
        forEach(node.children, (child) => {
          traverseTree(child);
        });
      }
    };
    traverseTree(node);
    return results;
  }, []);
}

export const updateAuditYear = (indicatorParams, newAuditYear) => {
  return {
    ...indicatorParams,
    data: {
      ...indicatorParams.data,
      defaultParamMap: {
        ...indicatorParams.data.defaultParamMap,
        auditYear: newAuditYear,
      },
    },
  };
};

export const updateAtIndex = (array, index, value) => {
  return array.map((item, i) => (i === index ? value : item));
};

export const addDisableProperty = (tree, target) => {
  return tree.reduce((result, node) => {
    const newNode = cloneDeep(node);
    if (includes(target.split(','), node.regionCode || node.value)) {
      newNode.disabled = true;
    }
    if (newNode.children) {
      newNode.children = addDisableProperty(newNode.children, target);
    }
    result.push(newNode);
    return result;
  }, []);
};

export const getIndicAndUnit = (indicNames) => {
  const unit = indicNames.match(/\(([^)]+)\)[^)]*$/)?.[1];
  const newIndicName = indicNames.replace(`(${unit})`, '');
  return unit ? { indicName: newIndicName, unit: `(${unit})` } : { indicName: indicNames, unit: '' };
};
