import { useRef, useEffect, useCallback } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';

import { isCity, isProvince, isCounty } from '@/pages/area/areaEconomy/common';
import { useCtx as useAreaCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { getTableData } from '../api';
import { useCtx } from '../provider/ctx';

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

// const keyMap = new Map<number, string>([
//   [1, 'provinceCode'],
//   [2, 'cityCode'],
//   [3, 'countryCode'],
// ]);

export const useTableData = ({ selectedTarget }: any) => {
  const {
    state: { selectedAreaList, enterpriseStatus },
  } = useCtx();
  const {
    state: { code: regionCode },
  } = useAreaCtx();
  /** SORT_REF */
  const sortRef = useRef<{ sort: string }>({ sort: 'DeclareDate' });
  /** 上次请求的参数 */
  const requestParamsRef = useRef<string>();
  /** 地区或者tag 是否变动 */
  const areaAndTagRef = useRef<Record<'selectedAreaList' | 'selectedTarget', any>>();
  /** 参数信息 */
  const [params, update] = useImmer({
    cityCode: '', //	 市级代码筛选,多个逗号隔开
    companyType: '', //	 企业类型筛选:a-央企,b-国企,c-沪深京上市,d-香港上市,e-新三板,f-发债人,g-城投企业
    countryCode: '', //	 区县代码筛选,多个逗号隔开
    declareDate: '', //	 公告时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
    establishmentTime: '', //	 成立时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
    industryCodeLevel1: '', //	 行业一级分类代码筛选,多个逗号隔开
    industryCodeLevel2: '', //	 行业二级分类代码筛选,多个逗号隔开
    industryCodeLevel3: '', //	 行业三级分类代码筛选,多个逗号隔开
    industryCodeLevel4: '', //	 行业四级分类代码筛选,多个逗号隔开
    itName: '', //	 企业名称模糊筛选
    pageSize: '10', //	每页大小
    provinceCode: '', //	省份代码筛选,多个逗号隔开
    registeredCapital: '', //	注册资金(单位-元，区间查询, [min,max])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
    skip: '0', //	起始index
    sortKey: 'DeclareDate', //	排序字段:ITName-企业名称;DeclareDate-公告日期;CR0001_004-法定代表人;companyTypeCode-上市/发债(特殊处理代码);CR0001_002-成立日期;CR0001_005_yuan-注册资本(统一单位元);otherTagCodesCount-其他称号数量
    sortRule: 'desc', //	排序规则:desc/asc
    tagCode: '', //	标签代码筛选,多个逗号隔开
    tagCode2: '', //	被撤销页面 标签代码筛选,多个逗号隔开
    techType: enterpriseStatus, //	必填 榜单类型:1-未撤销;2-已撤销
  });

  useEffect(() => {
    update((o) => {
      o.techType = enterpriseStatus;
    });
  }, [enterpriseStatus, update]);

  /** 当最外层地区/卡片筛选改变时 下方表格数据重置并且使用外层地区/筛选数据 */
  useEffect(() => {
    if (
      JSON.stringify({ selectedAreaList, selectedTarget }) !== JSON.stringify(areaAndTagRef.current) &&
      selectedTarget?.TagCode
    ) {
      update((o) => {
        if (enterpriseStatus === 1) {
          o.tagCode = selectedTarget.TagCode as string;
        } else {
          o.tagCode2 = selectedTarget.TagCode as string;
        }
        if (selectedAreaList.length === 1 && selectedAreaList[0].value === '100000') {
          o.provinceCode = '';
          o.cityCode = '';
          o.countryCode = '';
        } else if (selectedAreaList.length === 1 && selectedAreaList[0].value !== '100000') {
          o.provinceCode = selectedAreaList[0].value;
          o.cityCode = '';
          o.countryCode = '';
        } else if (selectedAreaList.length > 1) {
          /** 找出最后一位 */
          const goal = selectedAreaList.find((_, idx, arr) => {
            return idx === arr.length - 1;
          });
          if (goal) {
            if (goal?.key === 2) {
              o.cityCode = goal.value;
              o.provinceCode = '';
              o.countryCode = '';
            } else if (goal?.key === 3) {
              o.countryCode = goal.value;
              o.cityCode = '';
              o.provinceCode = '';
            }
          }
        }
        o.skip = '0';
        o.industryCodeLevel1 = '';
        o.industryCodeLevel2 = '';
        o.industryCodeLevel3 = '';
        o.industryCodeLevel4 = '';
        o.registeredCapital = '';
        o.companyType = '';
        o.establishmentTime = '';
        o.declareDate = '';
        o.itName = '';
      });
      areaAndTagRef.current = {
        selectedAreaList,
        selectedTarget,
      };
    }
  }, [selectedTarget, selectedAreaList, enterpriseStatus, update]);

  useEffect(() => {
    if (regionCode) {
      update((o) => {
        o.countryCode = isCounty(regionCode) ? regionCode : '';
        o.cityCode = isCity(regionCode) ? regionCode : '';
        o.provinceCode = isProvince(regionCode) ? regionCode : '';
      });
    }
  }, [regionCode, update]);

  /** 页码改变 */
  const pageChange = useMemoizedFn(({ type, payload }) => {
    update((o) => {
      o.skip = (payload - 1) * 10 + '';
    });
  });

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
          o.skip = '0';
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
          o.skip = '0';
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
      o.skip = '0';
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
      o.skip = '0';
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
      o.skip = '0';
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
      o.skip = '0';
    });
  });

  /** 排序改变 */
  const sortChange = useMemoizedFn(({ type, payload }: { type: string; payload: Record<'extra' | 'sorter', any> }) => {
    if (payload.extra.action === 'sort') {
      const sort = payload.sorter.columnKey;
      // const order = payload.sorter.order;
      update((o) => {
        /** 如果变化是排序，先重置页数 */
        o.skip = '0';
        /** 排序字段改变 */
        if (sort !== sortRef.current?.sort && sort && sortRef.current) {
          o.sortKey = sort;
          o.sortRule = 'desc';
          /** 排序规则改变 */
        } else {
          if (params.sortRule === 'desc') {
            o.sortRule = 'asc';
          } else if (params.sortRule === 'asc') {
            o.sortRule = 'desc';
          }
        }
        sortRef.current = { sort };
      });
    }
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

  const { loading, data, run } = useRequest(getTableData, {
    //XXX 好像是这样的,但是类型会报错
    debounceWait: 300,
    manual: true,
  });

  useEffect(() => {
    if (
      requestParamsRef.current !== JSON.stringify(params) /** 确定参数发生改变 */ &&
      (params.tagCode || params.tagCode2)
    ) {
      // 当筛选项变化后重新请求参数
      run(params);
      requestParamsRef.current = JSON.stringify(params);
    }
  }, [params, run]);

  return {
    change: {
      areaChange,
      industryChange,
      amountChange,
      otherChange,
      searchChange,
      pageChange,
      sortChange,
      resetChange,
    },
    data,
    params,
    loading,
  };
};

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
