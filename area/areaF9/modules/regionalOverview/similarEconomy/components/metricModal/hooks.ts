import { useMemo, useState } from 'react';

import { useRequest } from 'ahooks';

import { getEconomySimilarChoiceParam } from '@/apis/area/areaEconomy';

import { indicators } from '../filter/indicator';
import { IParam } from './types';
import { initData } from './utils';
type IChoiceParamMap = Record<string, IParam>;

export function useIndicatorTree() {
  const indicatorList = initData(indicators, false, { sort: 0 }, [], []);

  const defaultChoice: IChoiceParamMap = useMemo(() => {
    let defaultIndicators: IChoiceParamMap = {};
    indicators[0].children.forEach((i) => {
      if (i.indexId) {
        defaultIndicators[i.indexId] = {
          indexId: i.indexId,
          paramMap: {},
        };
      }
    });
    return defaultIndicators;
  }, []);

  return {
    indicatorList,
    defaultChoice,
  };
}

export function useChoiceParam() {
  const [choiceParamsLoading, setChoiceParamsLoading] = useState(true);
  const { runAsync, run, data } = useRequest(getEconomySimilarChoiceParam, {
    manual: true,
    onFinally() {
      setChoiceParamsLoading(false);
    },
  });
  return {
    getParamAsync: runAsync,
    getParam: run,
    paramData: data,
    paramLoading: choiceParamsLoading,
  };
}
