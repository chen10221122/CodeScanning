import { Key } from 'react';

import { isUndefined } from 'lodash';
import shortid from 'shortid';

import { SearchResItem } from '@/components/transferSelect/modules/templateModal/search';
import { formatNumber, divisionNumber } from '@/utils/format';

import { SelectItem, ignoreConfigIndexIds, ignoreConfigTitles } from './types';

/**
 * 获取每一项的key
 * @param item
 * @returns
 */
export const getKey = (item: SelectItem) => item?.indexId ?? item?.key ?? item.title ?? item?.value;

/**
 * 初始化数据
 * @param data 原始数据
 * @param hasSelectAll 每个子树下是否有全部选项
 * @param leafNodeSort 叶子节点的顺序信息，会将该信息写进每个叶子结点
 * @param parentTitle 父节点的title
 * @param parentKey 父节点的key
 * @param parentCheckable 父节点是否显示复选框
 */
export function initData(
  data: SelectItem[],
  hasSelectAll: boolean,
  leafNodeSort: { sort: number },
  parentTitle: Key[],
  parentKey: Key[],
  parentCheckable?: boolean,
  nodeCallback?: (node: SelectItem) => void,
) {
  data.forEach((item) => {
    /* 添加父节点信息 */
    item.parent = [...parentTitle];
    item.parentKey = [...parentKey];
    // if (parentTitle.length) {
    //   ignoreConfigTitles.includes(parentTitle[0] + '') && (item.needConfig = false);
    //   parentTitle[1] && ignoreConfigTitles.includes(parentTitle[1] + '') && (item.needConfig = false);
    // }
    if (ignoreConfigTitles.includes(parentTitle[0] + '') || ignoreConfigTitles.includes(parentTitle[1] + '')) {
      item.needConfig = false;
    }
    if (ignoreConfigIndexIds.includes(item.indexId + '')) item.needConfig = false;
    /* 没有key就生成一个key */
    item.key = getKey(item);
    if (item?.children?.length) {
      const children = item.children;
      /* 父节点复选框显隐 */
      item.checkable = parentCheckable ?? false;
      /* 父节点存在复选框 */
      if (parentCheckable) {
        item.isSelectAll = true;
        item.brotherNodes = getAllChildNodes(item, false);
      }
      /* 递归处理子节点 */
      initData(
        children,
        hasSelectAll,
        leafNodeSort,
        [...parentTitle, item.title],
        [...parentKey, item.key],
        parentCheckable,
        nodeCallback,
      );
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
            brotherNodes: children.map((child) => child),
          });
        }
      }
    } else {
      /* 是叶子结点就写入排序信息 */
      leafNodeSort.sort++;
      item.leafNodeSort = { ...leafNodeSort };
      if (parentTitle.includes('常用指标')) {
        item.associatedKey = [item.key];
        item.key = 'use_' + item.key;
      } else {
        const isCustom = item?.canAdd || item?.isCustom;
        item.defaultParamMap = item?.param ?? item?.defaultParamMap;
        item.associatedKey = isCustom ? [] : ['use_' + item.key];
      }
      if (nodeCallback) nodeCallback(item);
    }
  });
  return data;
}

/**
 * 遍历数组获取所有子节点
 * @param parentNode 原始数据
 * @param containSub 是否包含子层级节点，为 false 时仅包含叶子节点
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
 * @param choiceIndexIds 选中节点indexId列表
 */
export function getDefault(
  data: SelectItem[],
  defaultSelect: SelectItem[],
  parentKeys: Key[],
  checkAllNodes: SelectItem[],
  choiceIndexIds: string[],
  hasCheckedIndexIds: string[],
) {
  data.forEach((item) => {
    if (item?.indexId && choiceIndexIds.includes(item.indexId)) item.active = true;
    if (item?.indexId && item?.active && !item?.ignoreIndicator) {
      if (!hasCheckedIndexIds.includes(item.indexId) && !item.parent?.includes('常用指标')) {
        defaultSelect.push(item);
        hasCheckedIndexIds.push(item.indexId);
      }
    }
    if (item?.isSelectAll) checkAllNodes.push(item);
    if (item?.children) {
      parentKeys.push(item?.key!);
      getDefault(item.children, defaultSelect, parentKeys, checkAllNodes, choiceIndexIds, hasCheckedIndexIds);
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
        fromRank: parent?.join('/') || '',
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

/**
 * 格式化经济速览的数据
 * @param unit 指标单位
 * @param value 指标值
 */
export function formatValue(unit: any, value: any) {
  return !isUndefined(value)
    ? unit
      ? ['宗', '家', '只', '个'].includes(unit) // 家数、只数、个数类指标无需两位小数
        ? divisionNumber(value)
        : formatNumber(value)
      : value // 没有单位直接展示，文字要展示 比如所属省份
    : '-';
}

/** 获取柱形图渐变方向
 * [左，下，右，上]
 */
export function getLinearGradientDirection(value: number): [number, number, number, number] {
  return value > 0 ? [0, 0, 0, 1] : [0, 1, 0, 0];
}

/** 是否是自定义指标 */
function isCustomValue(indexId: string) {
  return indexId.includes('CALCULATE_INDEX');
}

export enum CustomValueType {
  BOOLEANSTRING, // TRUE/FALSE 字符串
  PERCENTAGESTRING, // 百分比字符串
  NUMBERSTRING, // 数值字符串
}

function getCustomValueType(value: string) {
  if (value === 'TRUE' || value === 'FALSE') return CustomValueType.BOOLEANSTRING;
  if (value?.includes('%')) return CustomValueType.PERCENTAGESTRING;
  return CustomValueType.NUMBERSTRING;
}

export function getValueDes(indexId: string, values: { mValue: string }[]) {
  const isCustom = indexId && isCustomValue(indexId);
  let customValueType = undefined;
  const value = Object.values(values);
  if (value.length) {
    customValueType = getCustomValueType(value[0].mValue);
  }
  return { isCustom, customValueType };
}

/**
 *
 * @param flag 是否隐藏空行
 * @param list 表格原始数据
 */
export const getNewTableData = (flag: boolean, list: Record<string, any>) => {
  if (flag) return list.filter((d: any) => (d?.specialTitle && d?.hasDataFlags) || d?.currentHasData);
  return list;
};
