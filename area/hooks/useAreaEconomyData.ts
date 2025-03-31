import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { get } from 'lodash';

import { getTblData } from '@/apis/area/areaDebt';
import { useRequest } from '@/utils/hooks';

import IndexList, { IndexListType } from '../configs/indexList';

interface IParams {
  startDate?: string;
  endDate?: string;
  indicName?: string;
  regionCode: string;
}

const filterData = (data: any, indexList: IndexListType) => {
  const list = get(data, 'data.data', []);
  // 指标对象集合
  const indexObj: any = {};
  list.forEach((item: any) => {
    const { indicatorList, endDate } = item;
    indicatorList.forEach((indicator: any) => {
      const { mValue, guid, indicName, isMissVCA } = indicator;
      if (!indexObj[indicName]) {
        indexObj[indicName] = {
          [endDate]: { mValue, guId: guid, indicName, isMissVCA },
        };
      } else {
        indexObj[indicName][endDate] = { mValue, guId: guid, indicName, isMissVCA };
      }
    });
  });
  const indexArr = indexList.map((item: any) => {
    const { name, child } = item;
    return {
      name,
      child: child.map((childItem: any) => {
        const { value } = childItem;
        return { ...childItem, value: indexObj[value] || {} };
      }),
    };
  });
  // console.log(indexObj, 'indexObj=====', indexArr);
  return { data: indexArr };
};

export const getIndicName = (list: IndexListType) =>
  list
    .map((item) => item.child.map((it) => it.value))
    .flat()
    .join();

interface IData {
  indexList?: IndexListType;
}

const useAreaEconomyData = (initData?: IData) => {
  const { indexList = IndexList } = initData || {};

  const { data, run, loading: pending, error } = useRequest(getTblData, { manual: true });
  const execute = useMemoizedFn(async (params: IParams) => {
    const { startDate = '*', endDate = '*', regionCode } = params;
    const data = {
      regionCode,
      endDate: `[${startDate},${endDate})`,
      indicName: getIndicName(indexList),
    };
    return await run(data);
  });
  const list = useMemo(() => filterData(data, indexList), [data, indexList]);

  return { data: list, execute, pending, error };
};

export default useAreaEconomyData;
