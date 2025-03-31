import { Key } from 'react';

import { TransferSelectProps, SelectItem } from '@pages/area/landTopic/components/transferSelect';
import { SearchResItem } from '@pages/area/landTopic/components/transferSelect/modules/templateModal/search';
import { PlanItem } from '@pages/area/landTopic/components/transferSelect/modules/templateOverlay/usePlanApi';
import { tipInfo } from '@pages/area/landTopic/components/transferSelect/types';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import createContext from '@/utils/createContext';

interface State extends TransferSelectProps {
  /** 最多选中的指标数量，默认100 */
  maxSelect: number;
  /** 最多自定义我的模板数量，默认10 */
  maxPlan: number;
  /** 处理之后的树节点数据 */
  formatTreeData: SelectItem[];
  /** 最终确认的选择指标 */
  confirmSelected: SelectItem[];
  /** 所有的模板数据 */
  allPlan: PlanItem[];
  /** 当前编辑的模板信息 */
  curEditPlan?: PlanItem;
  /** 当前选中的模板planId */
  curSelectPlanId?: string;
  /** 初始默认选择的指标 */
  defaultSelect: SelectItem[];
  /** 所有的全选节点 */
  checkAllNodes: SelectItem[];
  /** 当前选中的全选项key */
  checkAllKeys: Key[];
  /** 所有的父节点key */
  allParentKey: Key[];

  /** 搜索结果是要关键字全匹配还是分字匹配，默认关键字全匹配-false */
  fuzzySearch: boolean;
  /** 搜索结果 */
  searchRes: SearchResItem[];
  /** 搜索loading状态 */
  searchLoading: boolean;
  /** 提示信息 */
  tipInfo: tipInfo;
  /** 添加新模板时，编辑模板名称弹窗可见性 */
  confirmNewPlanModalVisible: boolean;
  editPlanNameModalVisible: boolean;
  /** 编辑模板弹窗可见性 */
  editModalVisible: boolean;
  /** 编辑模板弹窗可见性 */
  addModalVisible: boolean;
  /** 是否获取过模板数据 */
  hasGetPlanFlag: boolean;
  /** 指标一个不选时，临时查看按钮是否可用，默认为false */
  forbidEmptyCheck: boolean;
  /** 关闭下拉弹窗的方法 */
  hide: () => void;
  /** 受控的选中节点 */
  controlledRows?: SelectItem[];
  checkMaxLimit?: boolean;
  hasPay?: boolean;
  noPayDialogVisible?: boolean;

  /* 是否首次打开‘指标筛选’弹窗 */
  isFirstOpenModal?: boolean;
  /* 存储用户所有的‘自定义模板’ */
  customPlan: PlanItem[];
  /** 是否不需要自定义模板 */
  noPlan?: boolean;
  /** 默认展开 */
  defaultExpandKes?: string[];
}

export const [useCtx, Provider] = createContext<State>({
  maxSelect: 100,
  maxPlan: 10,
  fuzzySearch: false,
  title: '我的指标方案',
  data: [],
  allPlan: [],
  moduleCode: '',
  pageCode: '',
  formatTreeData: [],
  confirmSelected: [],
  defaultSelect: [],
  checkAllNodes: [],
  checkAllKeys: [],
  allParentKey: [],
  searchRes: [],
  searchLoading: false,
  tipInfo: {
    type: TipType.error,
    text: '',
    visible: false,
  },
  confirmNewPlanModalVisible: false,
  editPlanNameModalVisible: false,
  editModalVisible: false,
  addModalVisible: false,
  hasGetPlanFlag: false,
  forbidEmptyCheck: false,
  hideSaveTemplate: false,
  hide: () => {},
  isFirstOpenModal: true,
  customPlan: [],
  defaultExpandKes: [],
});
