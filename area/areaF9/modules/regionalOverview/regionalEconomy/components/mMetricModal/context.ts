import { Key, useLayoutEffect, useMemo } from 'react';

import { cloneDeep } from 'lodash';

import { useCtx, Provider } from '@/components/transferSelectNew/context';
// import { SearchResItem } from './search';
import { CommonResponse } from '@/utils/utility-types';

import { IChoiceParamMap } from '../../hooks';
import { CardDefaultChoiceIndexIds, IParam, ListDefaultChoiceIndexIds, ModalType, SelectItem } from '../../types';
import { getDefault } from '../../utils';

interface IInitData {
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
function useInitCtx({ modalType, initData }: { modalType: ModalType; initData: IInitData }) {
  const {
    state: { confirmSelected },
    update,
  } = useCtx();
  const { indicatorList, treeLoading, defaultChoice, paramLoading, paramData } = initData;

  // 根据指标弹窗的上次保存数据算排序
  const sortObj = useMemo(() => {
    const obj: Record<string, number> = {};
    confirmSelected.forEach((item, index) => {
      obj[item.indexId] = index;
    });
    // console.log('sort', obj);
    return obj;
  }, [confirmSelected]);

  useLayoutEffect(() => {
    // 确保指标树和缓存数据已经请求到了
    if (!paramLoading && !treeLoading && indicatorList.length) {
      let defaultSelects: SelectItem[] = []; // 默认指标
      let selectedNodes: SelectItem[] = []; // 已缓存指标
      let parentKeys: Key[] = []; // 父节点keys
      let checkAllNodes: SelectItem[] = []; // 全选节点
      const _indicatorList = cloneDeep(indicatorList),
        _def_indicatorList = cloneDeep(indicatorList);

      const { indicList, restoreDefault } = paramData?.data || {}; // 已缓存的指标入参
      const selectDefaultParamIndexIds: string[] = []; // 已缓存指标的indexIds
      const choiceMap: Record<string, any> = {}; // 已缓存指标入参的map
      indicList?.forEach((item: IParam) => {
        selectDefaultParamIndexIds.push(item?.indexId);
        if (item?.paramMap) choiceMap[item.indexId] = item.paramMap;
      });

      // 获取已缓存的指标信息
      getDefault(_indicatorList, selectedNodes, parentKeys, checkAllNodes, selectDefaultParamIndexIds, []);
      // 获取默认指标信息
      getDefault(
        _def_indicatorList,
        defaultSelects,
        parentKeys,
        checkAllNodes,
        modalType === ModalType.CARD ? CardDefaultChoiceIndexIds : ListDefaultChoiceIndexIds,
        [],
      );
      selectedNodes.sort((a, b) => (sortObj[a.indexId!] ?? 0) - (sortObj[b.indexId!] ?? 0));
      defaultSelects.sort((a, b) => (sortObj[a.indexId!] ?? 0) - (sortObj[b.indexId!] ?? 0));

      update((d) => {
        d.maxSelect = modalType === ModalType.CARD ? 20 : 50;
        // d.tipDelay = 3;
        d.checkMaxLimit = true;
        d.defaultSelect = defaultSelects;
        d.selectedNodes = indicList?.length ? selectedNodes : defaultSelects;
        d.formatTreeData = indicList?.length ? _indicatorList : _def_indicatorList;
        d.allParentKey = parentKeys;
        d.checkAllNodes = checkAllNodes;
        d.resetFlag = !+(restoreDefault ?? 0);
        d.selectedNodeParamMap = choiceMap;
      });
    }
  }, [defaultChoice, indicatorList, modalType, paramData, paramLoading, sortObj, treeLoading, update]);
}

export { useCtx, Provider, useInitCtx };
export type { IInitData };
