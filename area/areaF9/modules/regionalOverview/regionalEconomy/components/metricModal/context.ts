import { Key, useLayoutEffect } from 'react';

import { cloneDeep } from 'lodash';

import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { tipInfo } from '@/components/transferSelect';
import createContext from '@/utils/createContext';
// import { SearchResItem } from './search';
import { CommonResponse } from '@/utils/utility-types';

import { IChoiceParamMap } from '../../hooks';
import { CardDefaultChoiceIndexIds, IParam, ListDefaultChoiceIndexIds, ModalType, SelectItem } from '../../types';
import { getDefault } from '../../utils';
import { SearchResItem } from './search';

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
  /** 是否开启拖拽，默认开启 */
  drag: boolean;
}

export const defaultCtxState = {
  isDefault: true,
  showReset: true,
  modalType: ModalType.CARD,
  maxSelect: 50,
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
  drag: true,
};

export const [useCtx, Provider] = createContext<State>(defaultCtxState);

export interface IInitData {
  indicatorList: SelectItem[];
  treeLoading: boolean;
  defaultChoice: IChoiceParamMap;
  paramLoading: boolean;
  paramData:
    | CommonResponse<{
        indicList: IParam[];
        restoreDefault: 0 | 1 | '0' | '1';
      }>
    | undefined;
}
export function useInitCtx({
  modalType,
  initData,
  visible,
  drag,
}: {
  modalType: ModalType;
  initData: IInitData;
  visible: boolean;
  drag: boolean;
}) {
  const { update } = useCtx();
  const { indicatorList, treeLoading, defaultChoice, paramLoading, paramData } = initData;
  // const { indicatorList, cardDefaultChoice, listDefaultChoice, treeLoading } = useIndicatorTree();
  // const defaultChoice = useMemo(
  //   () => (modalType === ModalType.CARD ? cardDefaultChoice : listDefaultChoice),
  //   [cardDefaultChoice, listDefaultChoice, modalType],
  // );
  // const { getParam, paramLoading, paramData } = useChoiceParam();

  useLayoutEffect(() => {
    // 确保指标树和缓存数据已经请求到了
    if (!paramLoading && !treeLoading && indicatorList.length) {
      let defaultSelects: SelectItem[] = [];
      let selectedNodes: SelectItem[] = [];
      let parentKeys: Key[] = [];
      let checkAllNodes: SelectItem[] = [];
      const _indicatorList = cloneDeep(indicatorList),
        _def_indicatorList = cloneDeep(indicatorList);
      const { indicList, restoreDefault } = paramData?.data || {};
      const selectDefaultParamIndexIds = indicList?.map((item: { indexId: any }) => item?.indexId) || [];
      const selectDPMap = (() => {
        if (indicList?.length) {
          const map: Record<string, IParam> = {};
          indicList?.forEach((item) => {
            if (item?.indexId) map[item.indexId] = { indexId: item.indexId, paramMap: item.paramMap };
          });
          return map;
        }
        return {};
      })();
      getDefault(_indicatorList, selectedNodes, parentKeys, checkAllNodes, selectDefaultParamIndexIds, []);
      getDefault(
        _def_indicatorList,
        defaultSelects,
        parentKeys,
        checkAllNodes,
        modalType === ModalType.CARD ? CardDefaultChoiceIndexIds : ListDefaultChoiceIndexIds,
        [],
      );
      update((d) => ({
        ...d,
        maxSelect: modalType === ModalType.CARD ? 20 : 50,
        defaultSelect: defaultSelects,
        defaultSelectParam: defaultChoice,
        selectedNodes: indicList?.length ? selectedNodes : defaultSelects,
        selectedNodeParam: indicList?.length ? selectDPMap : defaultChoice,
        isDefault: indicList?.length ? !!+restoreDefault! : true,
        formatTreeData: indicList?.length ? _indicatorList : _def_indicatorList,
        allParentKey: parentKeys,
        checkAllNodes: checkAllNodes,
        editModalVisible: visible,
        drag,
      }));
    }
  }, [defaultChoice, indicatorList, modalType, paramData, paramLoading, treeLoading, update, visible, drag]);

  // useEffect(() => {
  //   getParam({ pageCode: modalType });
  // }, [getParam, modalType]);
}
