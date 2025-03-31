import { Key, useEffect, useLayoutEffect } from 'react';

import { cloneDeep } from 'lodash';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { tipInfo } from '@/components/transferSelectNew';
import createContext from '@/utils/createContext';

import { useCtx as useGlobalContext } from '../../context';
import { useCtx2 as useGlobalContext2 } from '../../context2';
import { useChoiceParam, useIndicatorTree } from './hooks';
import { SearchResItem } from './search';
import { IParam, ModalType, SelectItem, DefaultChoiceIndexIds } from './types';
import { getDefault, initDefaultSelectObject } from './utils';
interface State {
  /** 是否为默认指标 */
  isDefault: boolean;
  /** 恢复默认是否展示 */
  showReset: boolean;
  modalType: ModalType;
  /** 最多选中的指标数量，默认50 */
  maxSelect: number;
  /** 处理之后的树节点数据 */
  formatTreeData: SelectItem[];
  /** 最终确认的选择指标 */
  confirmSelected: SelectItem[];

  /** 初始默认选择的指标 */
  defaultSelect: SelectItem[];
  /** 初始默认选中指标的参数 */
  defaultSelectParam: Record<string, IParam | undefined>;
  /** 所有的全选节点 */
  checkAllNodes: SelectItem[];
  /** 当前选中的全选项key */
  checkAllKeys: Key[];
  /** 所有的父节点key */
  allParentKey: Key[];

  /** 选中的节点 */
  selectedNodes: SelectItem[];
  /** 选中节点的参数 */
  selectedNodeParam: Record<string, IParam | undefined>;

  /** 子树下的节点都没有子节点时，是否有全部选项，默认true */
  hasSelectAll?: boolean;
  /** 是否有一键展开收起按钮，默认true */
  hasExpandedAll?: boolean;

  /** 搜索结果是要关键字全匹配还是分字匹配，默认关键字全匹配-false */
  fuzzySearch: boolean;
  /** 搜索结果 */
  searchRes: SearchResItem[];
  /** 搜索loading状态 */
  searchLoading: boolean;
  /** 提示信息 */
  tipInfo?: tipInfo;

  /** 编辑模板弹窗可见性 */
  editModalVisible: boolean;

  /** 关闭下拉弹窗的方法 */
  // hide: () => void;
  onCancel?: () => void;
  /** 受控的选中节点 */
  controlledRows?: SelectItem[];
  checkMaxLimit?: boolean;
  hasPay?: boolean;
  noPayDialogVisible?: boolean;
  resetFlag: boolean;
  // 记住后编辑过指标
  hasEditTreeNodes: boolean;
  /** 常用指标 */
  originalDefaultNodes?: SelectItem[];
  originalDefaultNodesParams?: Record<string, IParam | undefined>;
}
const originParam: Record<string, IParam | undefined> = {};
DefaultChoiceIndexIds.forEach((i) => {
  originParam[i] = {
    indexId: i,
    paramMap: {},
  };
});

export const defaultCtxState = {
  isDefault: true,
  showReset: true,
  modalType: ModalType.CARD,
  maxSelect: 30,
  checkMaxLimit: true,
  fuzzySearch: false,
  title: '',
  data: [],
  formatTreeData: [],
  confirmSelected: [],
  defaultSelect: [],
  defaultSelectParam: {},
  selectedNodes: [],
  selectedNodeParam: {},
  checkAllNodes: [],
  checkAllKeys: [],
  allParentKey: [],
  hasSelectAll: true,
  hasExpandedAll: true,
  searchRes: [],
  searchLoading: false,
  tipInfo: {
    visible: false,
    type: TipType.error,
    text: '',
  },
  editModalVisible: false,
  forbidEmptyCheck: false,
  onCancel: () => {},
  resetFlag: false,
  hasEditTreeNodes: false,
  originalDefaultNodes: [],
  originalDefaultNodesParams: originParam,
};

export const [useCtx, Provider] = createContext<State>(defaultCtxState);

export function useInitCtx(returnDefaultParams: Function) {
  const { update } = useCtx();
  const { indicatorList, defaultChoice } = useIndicatorTree();
  const { getParam, paramLoading, paramData } = useChoiceParam();
  const { update: updateGlobalCtx } = useGlobalContext();
  const { update: updateGlobalCtx2 } = useGlobalContext2();

  useLayoutEffect(() => {
    // 确保指标树和缓存数据已经请求到了
    if (!paramLoading) {
      updateGlobalCtx((d) => {
        d.defaultIndicatorLoading = false;
      });
      updateGlobalCtx2((d) => {
        d.defaultIndicatorLoading = false;
      });

      let parentKeys: Key[] = [];
      let checkAllNodes: SelectItem[] = [];
      const _indicatorList = cloneDeep(indicatorList),
        _def_indicatorList = cloneDeep(indicatorList);

      const indicList: string[] = paramData?.data?.split(',') || [];
      const selectDPMap = (() => {
        if (indicList?.length) {
          const map: Record<string, IParam> = {};
          indicList?.forEach((item: string) => {
            map[item] = { indexId: item, paramMap: {} };
          });
          return map;
        }
        return {};
      })();
      let indicMap = initDefaultSelectObject(indicList);
      let defaultMap = initDefaultSelectObject(DefaultChoiceIndexIds);

      getDefault(true, _indicatorList, indicMap, parentKeys, checkAllNodes, indicList, []);
      getDefault(false, _def_indicatorList, defaultMap, parentKeys, checkAllNodes, DefaultChoiceIndexIds, []);

      let defaultSelectItemsByOrder: SelectItem[] = [];
      (indicList?.length ? indicMap : defaultMap).forEach((value, _key) => {
        defaultSelectItemsByOrder.push(value);
      });

      // 数据在组件里请求的，需要将初始化选中信息返回到模块里，进行初始化
      returnDefaultParams(defaultSelectItemsByOrder);
      update((d) => ({
        ...d,
        defaultSelect: defaultSelectItemsByOrder,
        defaultSelectParam: defaultChoice,
        selectedNodes: [...defaultSelectItemsByOrder],
        selectedNodeParam: indicList?.length ? selectDPMap : defaultChoice,
        // isDefault: indicList?.length ? !!+restoreDefault! : true,
        isDefault: !!indicList?.length,
        formatTreeData: indicList?.length ? _indicatorList : _def_indicatorList,
        allParentKey: parentKeys,
        checkAllNodes: checkAllNodes,
        originalDefaultNodes: Array.from(defaultMap.values()),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChoice, indicatorList, paramData, paramLoading, update]);

  useEffect(() => {
    getParam();
  }, [getParam]);
}
