import { useRef, useEffect, useCallback, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';

import { isCity, isProvince, isCounty } from '@/pages/area/areaEconomy/common';
import { useCtx as useAreaCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { getStatistics } from '../api';
import { useCtx } from '../provider/ctx';
import { IAreaTreeItem } from '../types';

type TConstomItem = {
  value: string;
  key: number | string;
  name: string;
  filed?: string;
};

/** 地区key */
enum EAreaLevel {
  /** 省级 */
  PROVINCE = 'provinceCode',
  /** 市 */
  CITY = 'cityCode',
  /** 区县 */
  COUNTRY = 'countryCode',
}

/** 行业Key */
enum EIndustry {
  LEVEL_1 = 'industryCodeLevel1',
  LEVEL_2 = 'industryCodeLevel2',
  LEVEL_3 = 'industryCodeLevel3',
  LEVEL_4 = 'industryCodeLevel4',
}

/** 其它筛选变动 */
enum EOtherType {
  /** 公司类型 */
  CO = 'coType',
  /** 变动日期 */
  CHANGE_TIME = 'changeTime',
  /** 报告日期 */
  REPORT_TIME = 'reportTime',
}

export default function useFilterRequest({ updateFilterParams }: any) {
  const {
    state: { enterpriseStatus, selectedAreaList },
  } = useCtx();

  const {
    state: { code: regionCode },
  } = useAreaCtx();

  // 当前筛选条件下是否为空
  const [empty, setEmpty] = useState(false);
  // 筛选项状态改变的 筛选类型以及筛选数据
  const [currentFilterType, setCurrentFilterType] = useState<string>();
  const [currentFilterValue, setCurrentFilterValue] = useState<any>();

  /** 上次请求的参数 */
  const requestParamsRef = useRef<string>();
  /** 地区或者tag 是否变动 */
  /** 参数信息 */
  const [params, update] = useImmer({
    itName: '', //	 企业名称模糊筛选
    provinceCode: isProvince(regionCode) ? regionCode : '', //	省份代码筛选,多个逗号隔开
    cityCode: isCity(regionCode) ? regionCode : '', //	 市级代码筛选,多个逗号隔开
    countryCode: isCounty(regionCode) ? regionCode : '', //	 区县代码筛选,多个逗号隔开
    industryCodeLevel1: '', //	 行业一级分类代码筛选,多个逗号隔开
    industryCodeLevel2: '', //	 行业二级分类代码筛选,多个逗号隔开
    industryCodeLevel3: '', //	 行业三级分类代码筛选,多个逗号隔开
    industryCodeLevel4: '', //	 行业四级分类代码筛选,多个逗号隔开
    registeredCapital: '', //	注册资金(单位-元，区间查询, [min,max])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
    establishmentTime: '', //	 成立时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
    companyType: '', //	 企业类型筛选:a-央企,b-国企,c-沪深京上市,d-香港上市,e-新三板,f-发债人,g-城投企业
    declareDate: '', //	 公告时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
  });

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

  /** 地区改变 */
  const areaChange = useCallback(
    ({ type, payload }) => {
      const draft: Record<string, any> = {
        provinceCode: '',
        cityCode: '',
        countryCode: '',
      };

      /** 如果是空数组, 则认为用户重置了二级筛选, 使用外层的地区作为参数 */
      if (isEmpty(payload)) {
        update((o) => {
          o.countryCode = isCounty(regionCode) ? regionCode : '';
          o.cityCode = isCity(regionCode) ? regionCode : '';
          o.provinceCode = isProvince(regionCode) ? regionCode : '';
        });
      } else {
        payload.forEach((i: TConstomItem) => {
          if (i.key === 1 && i.value !== '100000') {
            draft[EAreaLevel.PROVINCE] = (draft[EAreaLevel.PROVINCE] ?? '') + `${i.value},`;
          } else if (i.key === 2) {
            draft[EAreaLevel.CITY] = (draft[EAreaLevel.CITY] ?? '') + `${i.value},`;
          } else if (i.key === 3) {
            draft[EAreaLevel.COUNTRY] = (draft[EAreaLevel.COUNTRY] ?? '') + `${i.value},`;
          }
        });
        const goal = trimComma(draft);
        update((o) => {
          o.provinceCode = goal.provinceCode;
          o.cityCode = goal.cityCode;
          o.countryCode = goal.countryCode;
        });
      }
    },
    [regionCode, update],
  );

  /** 行业改变 */
  const industryChange = useMemoizedFn(({ type, payload }) => {
    const draft: Record<string, any> = {
      industryCodeLevel1: '',
      industryCodeLevel2: '',
      industryCodeLevel3: '',
      industryCodeLevel4: '',
    };
    if (isEmpty(payload)) {
      draft[EIndustry.LEVEL_1] = '';
      draft[EIndustry.LEVEL_2] = '';
      draft[EIndustry.LEVEL_3] = '';
      draft[EIndustry.LEVEL_4] = '';
    } else {
      payload.forEach((i: TConstomItem) => {
        switch (i.key) {
          case EIndustry.LEVEL_1:
            draft[EIndustry.LEVEL_1] = (draft[EIndustry.LEVEL_1] ?? '') + `${i.value},`;
            break;
          case EIndustry.LEVEL_2:
            draft[EIndustry.LEVEL_2] = (draft[EIndustry.LEVEL_2] ?? '') + `${i.value},`;
            break;
          case EIndustry.LEVEL_3:
            draft[EIndustry.LEVEL_3] = (draft[EIndustry.LEVEL_3] ?? '') + `${i.value},`;
            break;
          case EIndustry.LEVEL_4:
            draft[EIndustry.LEVEL_4] = (draft[EIndustry.LEVEL_4] ?? '') + `${i.value},`;
            break;
        }
      });
    }
    const goal = trimComma(draft);
    update((o) => {
      o.industryCodeLevel1 = goal.industryCodeLevel1;
      o.industryCodeLevel2 = goal.industryCodeLevel2;
      o.industryCodeLevel3 = goal.industryCodeLevel3;
      o.industryCodeLevel4 = goal.industryCodeLevel4;
    });
  });

  /** 金额改变 */
  const amountChange = useMemoizedFn(({ type, payload }) => {
    const draft: Record<string, any> = {
      registeredCapital: '',
    };
    if (isEmpty(payload)) {
      draft.registeredCapital = '';
    } else {
      payload.forEach((i: TConstomItem) => {
        draft.registeredCapital += `${i.value};`;
      });
    }
    const goal = trimComma(draft);
    update((o) => {
      o.registeredCapital = goal.registeredCapital;
    });
  });

  /** 更多选项改变 */
  const otherChange = useMemoizedFn(({ type, payload }) => {
    const draft: Record<string, any> = {
      companyType: '',
      establishmentTime: '',
      declareDate: '',
    };
    if (isEmpty(payload)) {
      draft['companyType'] = '';
      draft['establishmentTime'] = '';
      draft['declareDate'] = '';
    } else {
      payload.forEach((i: TConstomItem) => {
        switch (i.filed) {
          case EOtherType.CO:
            draft['companyType'] = (draft['companyType'] ?? '') + `${i.value},`;
            break;
          case EOtherType.CHANGE_TIME:
            if (Array.isArray(i.value)) {
              const [s, e] = [formatToNormalDate(i.value?.[0]), formatToNormalDate(i.value?.[1])];
              draft['establishmentTime'] = (draft['establishmentTime'] ?? '') + `[${s},${e})`;
            } else {
              draft['establishmentTime'] = (draft['establishmentTime'] ?? '') + `${i.value},`;
            }
            break;
          case EOtherType.REPORT_TIME:
            if (Array.isArray(i.value)) {
              const [s, e] = [formatToNormalDate(i.value?.[0]), formatToNormalDate(i.value?.[1])];
              draft['declareDate'] = (draft['declareDate'] ?? '') + `[${s},${e})`;
            } else {
              draft['declareDate'] = (draft['declareDate'] ?? '') + `${i.value},`;
            }
            break;
        }
      });
    }
    const goal = trimComma(draft);
    update((o) => {
      o.companyType = goal.companyType;
      o.establishmentTime = goal.establishmentTime;
      o.declareDate = goal.declareDate;
    });
  });

  /** 搜索改变 */
  const searchChange = useMemoizedFn(({ type, payload }) => {
    const draft: Record<string, any> = {
      itName: '',
    };
    draft['itName'] = payload;
    update((o) => {
      o.itName = draft.itName;
    });
  });

  // 重置请求
  const resetChange = useMemoizedFn(() => {
    // 重置 地区
    areaChange({ payload: [] });
    // 重置 行业
    industryChange({ payload: [] });
    // 重置 金额
    amountChange({ payload: [] });
    // 重置 其他选项
    otherChange({ payload: [] });
    // 重置筛选
    searchChange({ payload: '' });
  });

  const changeFilter = useCallback(
    (type, value) => {
      setCurrentFilterType(type);
      setCurrentFilterValue(value);
      switch (type) {
        case 'areaChange':
          areaChange({ payload: value });
          break;
        case 'industryChange':
          industryChange({ payload: value });
          break;
        case 'amountChange':
          amountChange({ payload: value });
          break;
        case 'otherChange':
          otherChange({ payload: value });
          break;
        case 'searchChange':
          searchChange({ payload: value });
          break;
        case 'clearCondition':
          resetChange();
          break;
        default:
      }
    },
    [amountChange, areaChange, industryChange, otherChange, resetChange, searchChange],
  );

  const { data, run } = useRequest(getStatistics, {
    manual: true,
    onSuccess(res: any) {
      updateFilterParams((d: any) => {
        d.filterType = currentFilterType;
        d.filterValue = currentFilterValue;
      });
      if (res?.totalSize) {
        setTimeout(() => {
          setEmpty(false);
        }, 2000);
      } else {
        setEmpty(true);
      }
    },
    formatResult(res: { data: any }) {
      return res?.data;
    },
  });

  useEffect(() => {
    /** 确定参数发生改变 */
    if (requestParamsRef.current !== JSON.stringify(params)) {
      // 当筛选项变化后重新请求参数
      run({ ...cardParams, ...params });
      requestParamsRef.current = JSON.stringify(params);
    }
  }, [cardParams, params, run]);

  return {
    changeFilter,
    data,
    empty,
  };
}

const formatToNormalDate = (d: Date) => {
  return dayJs(d).format('YYYY-MM-DD');
};

const trimComma = (o: Record<string, string>) => {
  const obj = cloneDeep(o);
  Object.keys(obj).forEach((i) => {
    if (obj[i].endsWith(',')) {
      obj[i] = obj[i].replace(/,$/gi, '');
    } else if (obj[i].endsWith(';')) {
      obj[i] = obj[i].replace(/;$/gi, '');
    }
  });
  return obj;
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
