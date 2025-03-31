import { useEffect, useMemo } from 'react';

import { useSelector } from '@pages/area/areaF9/context';

import { getAreaTopList } from '@/apis/area/areaEconomy';
// import { getAreaCityCircle } from '@/apis/area/areaEconomy';
import { formateTag } from '@/pages/area/areaF9/components/header-content/Tag/config';
import { useCityData } from '@/pages/area/areaF9/components/header-content/typeTag/useCityData';
import useMemoizedFn from '@/pages/dataView/components/dzhTable/hooks/useMemoizedFn';
import useRequest from '@/utils/ahooks/useRequest';

export const useTypeTag = ({
  data,
  populationSize,
  cityParty,
}: {
  data?: any;
  populationSize?: any;
  cityParty?: any;
}) => {
  const areaInfo = useSelector((store) => store.areaInfo);

  const { data: largeCityData, run } = useRequest(getAreaTopList, {
    manual: true,
  });

  const { data: cityCircleData, run: cityRun1 } = useCityData();
  const { data: cityPartyData, run: cityRun2 } = useCityData();

  const cityCircleCode = data?.cityCircle?.[0]?.code || '';
  const cityPartyCode = cityParty?.[0]?.code || '';

  const cityCircleParams = useMemo(() => ({ code: cityCircleCode, type: 'plateArea', gdpFlag: 1 }), [cityCircleCode]);

  const cityPartyParams = useMemo(() => ({ code: cityPartyCode, type: 'plateArea', gdpFlag: 1 }), [cityPartyCode]);

  const largeCityParams = useMemo(() => ({ cityPop: populationSize }), [populationSize]);

  useEffect(() => {
    if (populationSize) {
      run(largeCityParams);
    }
  }, [largeCityParams, populationSize, run]);

  useEffect(() => {
    if (cityCircleCode) {
      cityRun1(cityCircleParams);
    }
  }, [cityCircleCode, cityCircleParams, cityRun1]);

  useEffect(() => {
    if (cityPartyCode) {
      cityRun2(cityPartyParams);
    }
  }, [cityPartyCode, cityPartyParams, cityRun2]);

  const formateCityData = useMemoizedFn((data) => {
    return data.map((item: any) => ({ key: item?.name, ...item }));
  });

  const list = useMemo(() => {
    let res: any = [];
    if (data) {
      const data1 = data?.cityCircle;
      // const data2 = data?.cityParty;
      const title1 = data1?.[0]?.name;
      // const title2 = data2?.[0]?.name;
      const obj1 = {
        title: title1,
        data: cityCircleData,
        condition: cityCircleParams,
        children: data1?.length > 1 ? formateCityData(data1) : null,
      };
      // const obj2 = {
      //   title: title2,
      //   data: cityPartyData,
      //   condition: cityPartyParams,
      //   children: data2?.length > 1 ? formateCityData(data2) : null,
      // };
      if (title1) res.push(obj1);
      // if (title2) res.push(obj2);
    }
    const rate = formateTag(areaInfo?.regionName || '');
    if (rate) {
      res.unshift({ title: rate, data: [], noPopver: true, children: null });
    }
    return res;
  }, [areaInfo?.regionName, cityCircleData, cityCircleParams, data, formateCityData]);

  return { list, largeCityData: largeCityData?.data, largeCityParams, cityPartyData, cityPartyParams };
};
