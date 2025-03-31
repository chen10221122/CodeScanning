import { Key } from 'react';

import { TabsProps } from 'antd';

export interface ITabsCpn<T> extends TabsProps {
  /** tab栏是否需要吸顶，以及吸顶的距离 */
  stickyTop?: number;
  /** Tab配置 */
  tabConf: Array<T>;
  /** 右侧导出 */
  rightContent?: JSX.Element | undefined;
  /** 支持: 'RGB' 'RGBA' and Normal Color  */
  activedColor?: '#0171F6' | string;
  /** 支持: 'RGB' 'RGBA' and Normal Color  */
  lineColor?: string;
  /** tabPane的hover处理方法 */
  onTabPaneHover?: (hoverItem: ITabContent) => void;
  /** 是否有下拉目录，注意，如果配了这个参数，activeKey将完全由组件控制，外部传入的不会生效 */
  hasMemu?: boolean;
  /** 下拉目录可用性变化 */
  onMenuVisibleChange?: (visible: boolean) => void;
  /** 内层tab切换事件 */
  onInnerTabChange?: (activeKey: (Key | undefined)[]) => void;

  handleTabChange?: (key: string | number) => void;
  [key: string]: any;
}

/* Tab 配置项 */
export interface ITabContent {
  /* Tab名 */
  name: JSX.Element | string;
  /* Tab对应正文 */
  content?: JSX.Element | string | null;
  /* Tab 对应唯一Key值 */
  key: Key;
  /* 是否显示 */
  show?: boolean;
  /* 是否禁用 */
  disabled?: boolean;
  /** 是否有 N 图标 */
  isNew?: boolean;
  /** 是否待上线 */
  isWait?: boolean;
  /* 二级tab的配置，有了innerTabCfg后，content将不会生效 */
  innerTabCfg?: ITabsCpn<ITabContent>;
  /** 同一个 tab  */
  innerTabContent?: JSX.Element | string;
  /** 是否是快捷定位 */
  isQuick?: boolean;
}
