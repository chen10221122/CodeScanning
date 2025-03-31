import { useState, useEffect, useMemo } from 'react';

import { useRequest } from 'ahooks';

import { getIndicatorTree, getIndicatorModuleConfig, getIndicatorsModuleConfig } from '@dataView/api';
import { PagePlatform } from '@dataView/provider';

import { getConfig } from '@/app';
import useCustomIndicator from '@/components/transferSelectNew/modules/customModal/useCustomIndicator';

import { getEconomyChoiceParam } from './api';
import { IParam, SelectItem, CardDefaultChoiceIndexIds, ListDefaultChoiceIndexIds } from './types';
import { initData } from './utils';

const hideAreaDebtCoustomIndex = getConfig((d) => d.modules.hideAreaDebtCoustomIndex);

export type IChoiceParamMap = Record<string, IParam>;
export function useIndicatorTree() {
  const [treeLoading, setTreeLoading] = useState(true);
  const [indicatorList, setIndicatorList] = useState<SelectItem[]>([]);
  const [indicatorTypeMap, setIndicatorTypeMap] = useState<Record<string, string>>({});
  const [cardDefaultChoice, setCardDefaultChoice] = useState<IChoiceParamMap>({});
  const [listDefaultChoice, setListDefaultChoice] = useState<IChoiceParamMap>({});
  const [indicatorNeedConfigMap, setIndicatorNeedConfigMap] = useState<Record<string, boolean>>({});

  const {
    customIndicator,
    modal,
    setModal,
    deleteModal,
    setDeleteModal,
    onDeletdOk,
    editModal,
    setEditModal,
    getUserCustomAreaIndicators,
  } = useCustomIndicator();

  const { data: listRes, run } = useRequest(getIndicatorTree, {
    manual: true,
    defaultParams: [PagePlatform.AreaF9],
  });

  const treeList = useMemo(() => [customIndicator, ...(listRes?.data ?? [])], [customIndicator, listRes]);

  useEffect(() => {
    if (treeList.length) {
      const typeMap: Record<string, string> = {};
      const cardMap: IChoiceParamMap = {};
      const listMap: IChoiceParamMap = {};
      const needConfigMap: Record<string, boolean> = {};
      const notType: Set<string> = new Set([]);
      const list = initData(treeList as any as SelectItem[], false, { sort: 0 }, [], [], true, (node) => {
        if (node?.indexId) {
          if (node?.extraProperties?.type) typeMap[node.indexId] = node.extraProperties.type;
          else notType.add(node.indexId + ': ' + node?.parent?.join('/') + '/' + node.title);
          const cI = CardDefaultChoiceIndexIds.indexOf(node.indexId),
            lI = ListDefaultChoiceIndexIds.indexOf(node.indexId);
          if (cI !== -1)
            cardMap[node.indexId] = {
              indexId: node.indexId,
              paramMap: node?.defaultParamMap,
              // title: node.title,
            };
          if (lI !== -1)
            listMap[node.indexId] = {
              indexId: node.indexId,
              paramMap: node?.defaultParamMap,
              // title: node.title,
            };
          needConfigMap[node.indexId] = node.needConfig ?? false;
        }
      });
      const finalList = hideAreaDebtCoustomIndex ? list.filter((d) => d.key !== 'custom_parent_key') : list;
      // console.log('keys', Array.from(notType));
      setIndicatorList(finalList);
      setIndicatorTypeMap(typeMap);
      setCardDefaultChoice(cardMap);
      setListDefaultChoice(listMap);
      setIndicatorNeedConfigMap(needConfigMap);
      setTreeLoading(false);
    }
  }, [treeList]);

  useEffect(() => {
    run(PagePlatform.AreaF9);
    getUserCustomAreaIndicators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    indicatorList,
    indicatorTypeMap,
    cardDefaultChoice,
    listDefaultChoice,
    indicatorNeedConfigMap,
    treeLoading,
    customParam: {
      customIndicator,
      modal,
      setModal,
      deleteModal,
      setDeleteModal,
      onDeletdOk,
      editModal,
      setEditModal,
      getUserCustomAreaIndicators,
    },
  };
}

export function useChoiceParam() {
  const { runAsync, run, data, loading } = useRequest(getEconomyChoiceParam, { manual: true });
  return {
    getParamAsync: runAsync,
    getParam: run,
    paramData: data,
    paramLoading: loading,
  };
}

export function useMetricEditParam() {
  const {
    runAsync,
    // loading,
    // error,
  } = useRequest(getIndicatorModuleConfig, {
    manual: true,
    onSuccess: () => {},
    onError: (e: any) => {
      console.error(e);
    },
    loadingDelay: 300,
  });
  return { getMetricEditParamAsync: runAsync };
}

export function useIndicatorsModuleConfig() {
  const { runAsync: batchRequest } = useRequest(getIndicatorsModuleConfig, {
    manual: true,
  });
  return {
    batchRequest,
  };
}
