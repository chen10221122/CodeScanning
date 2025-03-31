import { Key } from 'react';

import shortid from 'shortid';

import { SearchResItem } from '@pages/area/landTopic/components/transferSelect/modules/templateModal/search';

import { SelectItem } from './types';

/**
 * 获取每一项的key
 * @param item
 * @returns
 */
export const getKey = (item: SelectItem) => item?.key ?? item?.value ?? item.title;

/**
 * 初始化数据
 * @param data 原始数据
 * @param hasSelectAll 每个子树下是否有全部选项
 * @param leafNodeSort 叶子节点的顺序信息，会将该信息写进每个叶子结点
 * @param parentTitle 父节点的title
 * @param parentKey 父节点的title
 * @param parentCheckable 父节点是否显示复选框
 * @param maxPlan 最多自定义我的模板数量，默认10
 */
export function initData(
  data: SelectItem[],
  hasSelectAll: boolean,
  leafNodeSort: { sort: number },
  parentTitle: string[],
  parentKey: Key[],
  parentCheckable?: boolean,
  maxPlan?: number,
) {
  data.forEach((item) => {
    /* 添加父节点信息 */
    item.parent = [...parentTitle];
    item.parentKey = [...parentKey];
    /* 没有key就生成一个key */
    item.key = getKey(item);
    item.associatedKey = [
      ...(item.associatedKey || []),
      ...(item.key?.toString().includes('custom_')
        ? []
        : new Array(maxPlan).fill(item.key).map((n, idx) => `custom_${idx}_${n}`)),
      // @ts-ignore
      ...(item.associatedKey || []).reduce((prev, cur) => {
        return [...prev, ...new Array(maxPlan).fill(cur).map((n, idx) => `custom_${idx}_${n}`)];
      }, []),
    ].filter((key) => item.key !== key);

    if (item?.children?.length) {
      const children = item.children;
      /* 父节点去掉复选框 */
      item.checkable = parentCheckable || false;

      /* 递归处理子节点 */
      initData(
        children,
        hasSelectAll,
        leafNodeSort,
        [...parentTitle, item.title],
        [...parentKey, item.key],
        parentCheckable || false,
        maxPlan,
      );

      /* 父节点存在复选框的情况 */
      if (parentCheckable) {
        item.isSelectAll = true;
        item.brotherNodes = getAllChildNodes(item, false);
      }

      /* 添加全部选项逻辑 */
      if (hasSelectAll && !parentCheckable) {
        /* 检查是否每个兄弟节点都没有子节点 */
        const everyBrotherHasNoChild = children.every((child) => !child?.children?.length);
        if (everyBrotherHasNoChild) {
          const selectAllKey = shortid();
          /* 给每个节点加上对应的全选项key */
          children.forEach((child) => (child.selectAllKey = selectAllKey));
          /* 在第一个位置插入全选项 */
          children.unshift({
            title: '全选',
            parent: [...parentTitle],
            parentKey: [...parentKey],
            isSelectAll: true, // 是否是全选标识
            key: selectAllKey,
            value: selectAllKey,
            brotherNodes: children.map((child) => child), // 兄弟节点的集合
          });
        }
      }
    } else {
      /* 是叶子结点就写入排序信息 */
      leafNodeSort.sort++;
      item.leafNodeSort = { ...leafNodeSort };
    }
  });
  return data;
}

/**
 * 遍历数组获取所有子节点
 * @param parentNode 原始数据
 * @param containSub 是否包含多层子节点
 */
export function getAllChildNodes(parentNode: SelectItem, containSub = false) {
  let allChildren: SelectItem[] = [];

  // 递归函数来获取所有子节点
  function getChildren(node: SelectItem) {
    if (node.children && node.children.length > 0) {
      if (containSub) {
        allChildren.push(node);
      }
      node.children.forEach((child) => {
        getChildren(child); // 递归调用
      });
    } else {
      allChildren.push(node);
    }
  }

  getChildren(parentNode); // 从传入的父节点开始遍历
  return allChildren;
}

/**
 * 获取默认选中项及父节点key
 * @param data 原始数据
 * @param defaultSelect 默认选中项数组
 * @param parentKeys 父节点key数组
 * @param checkAllNodes 全选节点集合
 */
export function getDefault(
  data: SelectItem[],
  defaultSelect: SelectItem[],
  parentKeys: Key[],
  checkAllNodes: SelectItem[],
) {
  data.forEach((item) => {
    if (item?.active && !item?.ignoreIndicator) defaultSelect.push(item);
    if (item?.isSelectAll) checkAllNodes.push(item);
    if (item?.children) {
      parentKeys.push(item?.key!);
      getDefault(item.children, defaultSelect, parentKeys, checkAllNodes);
    }
  });
}

/**
 * 获取搜索结果
 * @param sourceData 树节点数据
 * @param searchResults 搜索结果
 * @param keyword 搜索关键字
 * @param fuzzySearch 关键字全字匹配还是分字匹配
 */
export function getSearch(
  sourceData: SelectItem[],
  searchResults: SearchResItem[],
  keyword: string,
  fuzzySearch: boolean,
) {
  const keys = fuzzySearch ? keyword.split('') : [keyword];
  sourceData.forEach((item) => {
    const { title, isSelectAll, children, ignoreIndicator, parent } = item;
    const itemKey = getKey(item);
    const titleKeys = fuzzySearch ? title.split('') : [title];
    /* 去掉全选项、有子节点的项、不包含关键字的项 */
    if (
      !isSelectAll &&
      !children &&
      !ignoreIndicator &&
      keys.some((searchKey) => titleKeys.some((titleKey) => titleKey.includes(searchKey)))
    )
      searchResults.push({
        fromRank: parent?.join('/'),
        key: itemKey as string,
        title: title,
        nodeInfo: { ...item },
      });
    if (children) getSearch(children, searchResults, keyword, fuzzySearch);
  });
}

/**
 * 根据某种条件过滤树节点
 * @param sourceData 树节点数据
 * @param filterFunc 过滤的函数
 */
export function filterTree(sourceData: SelectItem[], filterFunc: (item: SelectItem) => boolean) {
  const newTree = sourceData.filter((item) => filterFunc(item));
  newTree.forEach((item) => item?.children && (item.children = filterTree(item.children, filterFunc)));
  return newTree;
}

/**
 * 根据key值找对应的节点
 * @param sourceData 树节点数据
 * @param keys 要找的key值
 * @param associatedNode 存储找到的指标
 */
export function getNodeByKey(sourceData: SelectItem[], keys: Key[], associatedNode: SelectItem[]) {
  sourceData.forEach((item) => {
    if (keys.includes(item.key!)) associatedNode.push(item);
    if (item?.children) getNodeByKey(item.children, keys, associatedNode);
  });
}
