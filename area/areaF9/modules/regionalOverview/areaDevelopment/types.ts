import { Key } from 'react';

export interface selectItem {
  /** 选项的显示名称 */
  title: string | Element;
  /** 选项的value */
  value?: string;
  /** 树节点的唯一标识，传入的话用传入的，没传则用value，,value也没传就用title，请确保根据改规则取的key唯一 */
  key?: Key;
  /** 默认选中配置 */
  active?: boolean;
  /** 子级数据 */
  children?: selectItem[];

  /** 你可以在每一个选项节点中自定义任意属性 */
  [p: string]: any;
}

export interface indicatorsItem extends selectItem {
  /** 名称 */
  title: string | Element;
  /** 列宽 */
  width?: number;
  /** 取值 */
  value?: string;
  /** 是否是默认值 */
  active?: boolean;
  /** 是否有排序，以及排序的key值（与value取值不一定一样） */
  sortKey?: string;
  /** 指标自身的key值 */
  selfKey?: string;
  /** 说明文本 */
  description?: string;
  /** 单位 */
  unit?: string;
  /** 子指标 */
  children?: indicatorsItem[];
  /** 是否具有跳转链接的标志，及跳转的code(跳转f9默认是company) */
  jumpCode?: string;
  /** 跳转f9的模块 */
  jumpModule?: string;
  /** 跳转f9的页面 */
  jumpPage?: string;
}

export interface tableEl {
  [a: string]: any;
}
