import { useRequest } from 'ahooks';
import { isArray } from 'lodash';

import { getCensusAnalyseScreenData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import { useImmer } from '@/utils/hooks';

/** 根据树层级，添加level */
export const addLevel = (data: any, level = 1) => {
  return data?.map((item: Record<string, any>) => {
    item.level = level;
    if (item?.children) {
      item.children = addLevel(item.children, level + 1);
    }
    return item;
  });
};

export const useGetAreaAndIndustryInfo = (hasSpecialOption?: boolean) => {
  const [screenData, update] = useImmer<Record<string, any[] | string>>({
    /** 地区类型 */
    area: [],
    /** 按省 */
    areaType1: [],
    /** 按市 */
    areaType2: [],
    /** 按地区 */
    areaType3: [],
    /** 百强县 info */
    specialArea: '',
    /** 行业类型 */
    industry: [],
    /** 门类 */
    industryType1: [],
    /** 大类 */
    industryType2: [],
    /** 承租人类型 */
    lesseeType: [],
    /** 统计口径 */
    statisticType: [],
  });

  const { loading } = useRequest(getCensusAnalyseScreenData, {
    defaultParams: [{ hundredCountry: hasSpecialOption ? '1' : '' }],
    onSuccess(res: { data: any; returncode: number }) {
      if (res?.data) {
        const draft = res.data;
        /** 接口地区时常出问题，如果用 localStorage 存，第一次加载失败的后面永远看不到数据 */
        // sessionStorage.setItem('financingLeaseStatisticScreenInfo', JSON.stringify(draft))
        update((d) => {
          const area_draft = draft?.area?.children;
          const industry_draft = draft?.industryGB?.children;
          const area = handleData(area_draft, { pathValue: [], pathNumber: [], pathName: [] }) ?? [];
          const industry = addLevel(handleData(industry_draft, { pathValue: [], pathNumber: [], pathName: [] })) ?? [];
          d.area = draft?.areaType?.children ?? [];
          d.areaType1 = area?.filter((i) => i?.name !== '百强县')?.map((i: any) => ({ ...i, children: null })) ?? [];
          d.areaType2 =
            area
              ?.filter((i) => i?.name !== '百强县')
              ?.map((i: any) => {
                return {
                  ...i,
                  children: i?.children?.map((i: any) => ({ ...i, children: null })),
                };
              }) ?? [];
          /** 百强县逻辑 */
          d.areaType3 = area ?? [];
          /** 过滤直辖市 */
          d.filterArea =
            area
              ?.filter((i) => !'110000,120000,310000,500000,999999'.includes(i?.value) && i.name !== '百强县')
              .map((i: any) => {
                return {
                  ...i,
                  children: i?.children?.map((i: any) => ({ ...i, children: null })),
                };
              }) ?? [];

          d.specialArea = area?.filter((i) => i?.name === '百强县')[0]?.value ?? '';

          d.industry = draft?.industryGBType?.children ?? [];
          d.industryType1 = industry?.map((i: any) => ({ ...i, children: null })) ?? [];
          d.industryType2 = industry ?? [];
          /** 承租人分类 */
          d.lesseeType = draft?.lesseeType?.children ?? [];
          /** 统计口径 */
          d.statisticType = draft?.statisticType?.children ?? [];
        });
      }
    },

    onError(e) {},
  });

  return {
    data: screenData,
    loading,
  };
};

export const handleData = (data: any[], { pathValue, pathNumber, pathName }: any) => {
  if (isArray(data)) {
    return data.map((item, i) => {
      item.pathValue = pathValue?.length ? [...pathValue, item.value] : [item.value];
      item.values = item?.pathValue.join('_');
      item.pathNumber = pathNumber?.length ? [...pathNumber, i] : [i];
      item.pathName = pathName?.length ? [...pathName, item.name] : [item.name];
      // item.pathAppName = pathAppName?.length ? [...pathAppName, item.appName] : [item.appName];
      if (isArray(item?.children)) {
        item.children =
          handleData(item.children as any[], {
            pathValue: item.pathValue,
            pathNumber: item.pathNumber,
            pathName: item.pathName,
            // pathAppName: item.pathAppName,
          }) || [];
      }
      return item;
    });
  }
};
