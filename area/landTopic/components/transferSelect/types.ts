import { CSSProperties, Key, ReactNode } from 'react';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';

/** 指标节点的配置 */
export interface SelectItem {
  /** 选项的显示名称 */
  title: string;
  /** 选项的value */
  value?: string;
  /** 树节点的唯一标识，传入的话用传入的，没传则用value，,value也没传就用title，请确保根据该规则取的key唯一 */
  key?: Key;
  /** 默认选中配置 */
  active?: boolean;
  /** 关联选中key,可关联多个，点击该项时也会将associatedKey对应的指标们选中或取消选中 */
  associatedKey?: Key[];
  /**
   * 忽略指标，通常与associatedKey配合使用，该项配置为true时，默认选中的active属性会失效，该指标不管选中与否都不会已选列表展示，且不会在onChange事件中返回，
   * 搜索中也不可搜索到， 在树中不可点击选中取消选中（但可被关联选中,也可关联选中其他指标!）
   */
  ignoreIndicator?: boolean;
  /** 子级数据 */
  children?: SelectItem[];
  hasVipIcon?: boolean;

  /** 你可以在每一个选项节点中自定义任意属性 */
  [p: string]: any;
}

export interface selectItem extends SelectItem {}

/** 提示信息 */
export interface tipInfo {
  /** 提示的类型 */
  type: TipType;
  /** 提示的内容 */
  text: string;
  /** 提示的可见性 */
  visible: boolean;
  /** 弹窗的位置是否在Dropdown内部，默认在 */
  outDropdown?: boolean;
}

export type Values = SelectItem[] | Key[];

export interface TransferSelectProps {
  /** 标题节点  */
  title: ReactNode;
  /** 数据配置  */
  data: SelectItem[];
  /** 模块代码，我的模板用，和pageCode一起确定页面对应的模板  */
  moduleCode: string;
  /** 页面代码，我的模板用，和moduleCode一起确定页面对应的模板  */
  pageCode: string;
  /**
   * 当操作筛选项变更时会触发此事件
   * @param selectedRows 所有选中的节点对象,没有层级关系的
   * @param selectedTree 所有选中的节点对象,带有层级关系的树结构，并且是按照selectedRows排过序的
   */
  onChange?: (selectedRows: SelectItem[], selectedTree: SelectItem[]) => void;
  /** 选中的指标树，是否按照selectedRows的顺序返回，默认为 true */
  isSortByConfirm?: boolean;
  /* 父节点是否允许选中 */
  parentCheckable?: boolean;
  /** 子树下的节点都没有子节点时，是否有全部选项，默认true, parentCheckable为false生效*/
  hasSelectAll?: boolean;
  /** 是否有一键展开收起按钮，默认true */
  hasExpandedAll?: boolean;
  /** 最多选中的指标数量，默认100 */
  maxSelect?: number;
  /** 最多自定义我的模板数量，默认10 */
  maxPlan?: number;
  /** 提示信息的显示时间 */
  tipDelay?: number;
  /** 自定义dropdown弹出位置 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  className?: string;
  style?: CSSProperties;
  /** 搜索结果是要关键字全匹配还是分字匹配，默认关键字全匹配-false */
  fuzzySearch?: boolean;
  /**
   * 格式化标题，回调的第一个参数为所有选中的节点,
   * 本组件默认会在有选中指标时把title换成选中指标，选中模板时把title换成模板名称！
   */
  formatTitle?: (selectedRows: SelectItem[]) => ReactNode;
  /** 控制标题文字超出多少个字显示省略号，默认为8个字 */
  ellipsis?: number;
  /** 指标一个不选时，临时查看按钮是否可用，默认为false */
  forbidEmptyCheck?: boolean;
  /** 控制下拉菜单是否显示 */
  dropdownVisible?: boolean;
  /** 下拉菜单显示与隐藏变化会触发此回调 */
  onDropdownVisibleChange?: (visible: boolean) => void;
  /** 隐藏另存模板，默认显示 */
  hideSaveTemplate?: boolean;
  /** 传入的当前选中项,受控值,慎用，没好好测试过，可能含有未知bug…… */
  values?: Values;
  /** 指标选中是否有上限，默认为 true */
  checkMaxLimit?: boolean;

  /** 不需要保存模板，只需要选择指标弹窗的情况,配合下方三个使用 */
  noPlan?: boolean;
  /** 选择指标弹窗显隐 */
  selectedModalVisible?: boolean;
  /** 选择指标自定义头部 */
  selectedModalTitle?: ReactNode;
  /** 选择指标弹窗显隐变化会触发此回调 */
  onSelectedModalVisibleChange?: (visible: boolean) => void;
  /** 默认展开 */
  defaultExpandKes?: string[];
}
