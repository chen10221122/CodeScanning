import { useEffect, useMemo } from 'react';

import { isCity, isProvince, isCounty } from '@/pages/area/areaEconomy/common';
import { useCtx as useAreaCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';

import { getStatistics } from '../api';
import { useCtx } from '../provider/ctx';
import { IAreaTreeItem } from '../types';

export const useGetCardInfo = () => {
  const {
    state: { enterpriseStatus, selectedAreaList },
    update,
  } = useCtx();

  const {
    state: { code: regionCode },
  } = useAreaCtx();

  /** 构造参数 */
  const cardParams = useMemo(() => {
    if (enterpriseStatus === 2) {
      return {
        statisticType: 1,
        /** 被撤销固定传参 */
        techType: 2,
        tagCode2: 'TAG218,TAG2121,TAG5345,TAG687,TAG130019,TAG6193,TAG720',
        /** override */
        ...areaParam(selectedAreaList, enterpriseStatus, regionCode),
      };
    } else {
      return {
        statisticType: 1,
        /** 固定传参 */
        techType: 1,
        /** override */
        ...areaParam(selectedAreaList, enterpriseStatus, regionCode),
      };
    }
  }, [enterpriseStatus, selectedAreaList, regionCode]);

  const { loading, data, run } = useRequest(getStatistics, {
    manual: true,
    onSuccess(res: any) {
      if (res?.totalSize) {
        update((d) => {
          d.emptyStatus = false;
        });
      } else {
        update((d) => {
          d.emptyStatus = true;
        });
      }
    },
    formatResult(res: { data: any }) {
      return res?.data;
    },
  });

  useEffect(() => {
    run(cardParams);
  }, [cardParams, run]);

  return { loading, data, run };
};

enum Area {
  /** 市级代码筛选,多个逗号隔开 */
  CITY = 2,
  /** 区县代码筛选,多个逗号隔开 */
  COUNTRY = 3,
  /** 省份代码筛选 */
  PROVINCE = 1,
}

const areaParam = (selectedAreaList: IAreaTreeItem[], enterpriseStatus: 1 | 2, regionCode: string) => {
  const areaParams = {
    cityCode: '' /** 市级代码筛选,多个逗号隔开 */,
    countryCode: '' /** 区县代码筛选,多个逗号隔开 */,
    provinceCode: '' /** 省份代码筛选 */,
    competency: '' /** 国家级-1 省级-2 多个逗号隔开*/,
  };
  if (regionCode) {
    areaParams.countryCode = isCounty(regionCode) ? regionCode : '';
    areaParams.cityCode = isCity(regionCode) ? regionCode : '';
    areaParams.provinceCode = isProvince(regionCode) ? regionCode : '';
    areaParams.competency = '1,2';
    return areaParams;
  }
  if (selectedAreaList?.length === 1 && selectedAreaList?.[0]?.value === '100000') {
    areaParams.competency = '1';
    return areaParams;
  } else {
    selectedAreaList.forEach((i) => {
      switch (i.key) {
        case Area.CITY:
          areaParams.cityCode = i.value;
          break;
        case Area.COUNTRY:
          areaParams.countryCode = i.value;
          break;
        case Area.PROVINCE:
          areaParams.provinceCode = i.value;
          break;
      }
    });
    /** 有最小级别之传最小级别的地区代码，因为中台那边取并集不取交集，传了上一级别地区返回结果为整个 省/市 并不能精确到区 */
    if (areaParams.countryCode) {
      areaParams.provinceCode = '';
      areaParams.cityCode = '';
    } else if (areaParams.cityCode) {
      areaParams.provinceCode = '';
    }
    areaParams.competency = '1,2';
    return areaParams;
  }
};
