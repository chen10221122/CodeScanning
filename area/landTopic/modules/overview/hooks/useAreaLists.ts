import { useRequest } from 'ahooks';

import { getAreaFinancingYears } from '@pages/area/areaFinancing/api';
import { useCtx, AreaItem, WHOLE_COUNTRY_CODE } from '@pages/area/landTopic/modules/overview/provider';

import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';

/**
 * 获取表头地区筛选配置，里面有百强县
 */
export default function useAreaLists() {
  const {
    state: { areaLists },
    update,
  } = useCtx();

  useRequest(getAreaFinancingYears, {
    defaultParams: [{ type: '1', regionLevel: '1' }],
    ready: !areaLists.provinceCodes.length,
    onSuccess: ({ data }: any) => {
      const lists: AreaItem[] = data?.area;
      if (lists?.length) {
        // 所有的省市区 code 一起统计
        const provinceCodes: string[] = [WHOLE_COUNTRY_CODE];
        const cityCodes: string[] = [];
        const countyCodes: string[] = [];

        const normalLists = lists.filter((i) => i?.name !== '百强县') || [];
        /** 省级 */
        const areaProvince = normalLists.map((i: any) => ({ ...i, children: null, under: i.children })) ?? [];
        /** 市级 */
        const areaCity =
          lists
            ?.filter((i) => !'110000,120000,310000,500000,999999'.includes(i?.value) && i.name !== '百强县')
            .map((i: any) => {
              return {
                ...i,
                children: i?.children?.map((i: any) => ({ ...i, children: null })),
              };
            }) ?? [];
        /** 区县级 */
        const areaCounty = lists ?? [];

        const getCodes = (data: AreaItem[]) => {
          data.forEach(({ children, value }) => {
            const level = getAreaLevel(`${value}`);
            if (level === '1') provinceCodes.push(value);
            else if (level === '2') cityCodes.push(value);
            else countyCodes.push(value);
            if (children) getCodes(children);
          });
        };
        getCodes(normalLists);
        update((draft) => {
          draft.areaLists = {
            areaProvince,
            areaCity,
            areaCounty,
            provinceCodes: provinceCodes.join(','),
            cityCodes: cityCodes.join(','),
            countyCodes: countyCodes.join(','),
          };
        });
      }
    },
  });
}
