import { useRef } from 'react';

import { useCreation, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty, uniq } from 'lodash';

import { getAreaFinancingYears, getVcRaceTree } from '@pages/area/areaFinancing/api';
import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import { EquityYearsEnums } from '@pages/area/areaFinancing/types';

import { Options, quickAreaOptions, ScreenType } from '@/components/screen';
import { isMunicipality } from '@/pages/area/areaEconomy/common';

const { getRootSelected } = quickAreaOptions;

/** 按区域 */
export const areaLevelOption = {
  title: '',
  key: 'regionLevel',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '省级', key: 'regionLevel', value: '1', active: true },
      { name: '市级', key: 'regionLevel', value: '2' },
      { name: '区县级', key: 'regionLevel', value: '3' },
      // { name: '百强县', key: 'regionLevel', value: '4' },
    ],
  },
};
/** 上市板块 */
export const plate = {
  title: '全部',
  label: '上市板块',
  key: 'plate',
  option: {
    type: ScreenType.MULTIPLE,
    cancelable: false,
    children: [
      // { name: '全部', key: 'plate', value: '', active: true },
      { name: '沪市主板', key: 'plate', value: '沪市主板' },
      { name: '深市主板', key: 'plate', value: '深市主板' },
      { name: '创业板', key: 'plate', value: '创业板' },
      { name: '科创板', key: 'plate', value: '科创板' },
      { name: '北交所', key: 'plate', value: '北交所' },
    ],
  },
};

/** 企业性质 */
export const entType = {
  title: '',
  label: '企业性质',
  key: 'entType',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'entType', value: '', active: true },
      { name: '国企', key: 'entType', value: '国有企业' },
      { name: '民企', key: 'entType', value: '民营企业' },
      { name: '其他', key: 'entType', value: '其他' },
    ],
  },
};
/** 产业类别 */
export const industryType = {
  title: '',
  label: '产业类别',
  key: 'industryType',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'industryType', value: '', active: true },
      { name: '第一产业', key: 'industryType', value: '1' },
      { name: '第二产业', key: 'industryType', value: '2' },
      { name: '第三产业', key: 'industryType', value: '3' },
    ],
  },
};
/** 融资类型 */
export const financeType = {
  title: '',
  label: '融资类型',
  key: 'financeType',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'financeType', value: '', active: true },
      { name: '首发', key: 'financeType', value: '1' },
      { name: '配股', key: 'financeType', value: '3' },
      { name: '增发', key: 'financeType', value: '4' },
    ],
  },
};
/** 市场分层 */
export const marketLayer = {
  title: '',
  key: 'layer',
  label: '市场分层',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'layer', value: '', active: true },
      { name: '创新层', key: 'layer', value: '1' },
      { name: '基础层', key: 'layer', value: '2' },
    ],
  },
};

/** 是否品牌 */
export const isHead = {
  title: '',
  label: '是否品牌',
  key: 'isTop',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'isTop', value: '', active: true },
      { name: '是', key: 'isTop', value: '1' },
      { name: '否', key: 'isTop', value: '0' },
    ],
  },
};
interface CommonScreenProps {
  defaultOption?: any[];
  /** 接口返回的option */
  extra?: { params?: { type?: EquityYearsEnums }; type: ExtraOptionType };
}
export enum ExtraOptionType {
  Year,
  RaceTree,
  Area,
}
export enum CustomScreenType {
  AreaGroup,
}
const TopCountyValue = '百强县';
// 地区树
let tree: any[] = [];
const formatTitle = (rows: any[]) => {
  return getRootSelected(
    tree,
    rows.map((o: Record<string, any>) => o.value),
  )
    .map((d: Record<string, any>) => d.name)
    .toString();
};

export default function useCommonScreen(props?: CommonScreenProps) {
  const { defaultOption, extra } = props || {};
  const {
    state: { isFirstLoad },
    update,
  } = useConditionCtx();
  const yearRef = useRef('');
  const loadedRef = useRef(false);
  const { data } = useRequest(getAreaFinancingYears, {
    defaultParams: [{ type: extra?.params?.type, regionLevel: '1' }],
    ready: !isEmpty(extra) && [ExtraOptionType.Year, ExtraOptionType.Area].includes(extra!.type),
    onError: () => {},
    onFinally: () => {
      // loadedRef.current = true;
    },
  });
  const { data: vcTreeData } = useRequest(getVcRaceTree, {
    ready: !isEmpty(extra) && extra?.type === ExtraOptionType.RaceTree,
    onError: () => {},
  });
  // 少写了依赖项extra，故使用useCreation
  const screenConfig: Options[] = useCreation(() => {
    if (data) {
      // 更新年份
      yearRef.current = (data as any).data?.years[1];
      loadedRef.current = true;

      const yearItem = {
        title: '',
        cancelable: false,
        option: {
          type: ScreenType.SINGLE,
          children: (data as any).data.years.map((o: string, i: number) => {
            if (i === 1) return { name: `${o}年`, value: `${o}`, active: true, key: 'year' };
            return { name: `${o}年`, value: `${o}`, key: 'year' };
          }),
        },
      };
      let areaItem;
      const areaData = (data as any).data.area;
      if (areaData) {
        // 处理地区筛选项数据
        areaData.forEach((a: any) => {
          a.key = a.name === '百强县' ? 'countryCode' : 'regionCode';
          // 百强县因受控组件问题，使用原value值作为values数组会重复，故特殊处理
          if (a.name === '百强县') {
            a.realValue = a.value;
            a.value = TopCountyValue;
          }
          if (a.children?.length) {
            a.children.forEach((b: any) => {
              // 直辖市无市级 直辖区县也为countryCode
              b.key =
                ['110000', '120000', '310000', '500000', '999999'].includes(a.value) || isMunicipality(b.value)
                  ? 'countryCode'
                  : 'cityCode';
              if (b.children?.length) {
                b.children.forEach((c: any) => {
                  c.key = 'countryCode';
                });
              }
            });
          }
        });
        areaItem = {
          title: '全部',
          formatTitle,
          type: CustomScreenType.AreaGroup,
          limit: 1000,
          option: {
            limit: 1000,
            type: ScreenType.MULTIPLE_THIRD,
            hasSelectAll: true,
            cascade: true,
            ellipsis: 10,
            children: (data as any).data.area,
          },
        };
      }
      tree = (data as any).data.area;

      const draft = defaultOption ? defaultOption : [];

      return ExtraOptionType.Area === extra!.type ? [...draft, areaItem] : [...draft, areaItem, yearItem];
    }
    if (vcTreeData) {
      const traceItem = {
        title: '全部',
        formatTitle: (rows: any) => {
          const industryOne = rows.filter((o: any) => o.key === 'industryOne');
          if (industryOne.length) {
            const singleIndustryTwo = rows.filter(
              (o: any) =>
                !industryOne.map((d: any) => d.name).includes(o._parent?.name) &&
                !industryOne.map((d: any) => d.name).includes(o.name),
            );
            return [...industryOne, ...singleIndustryTwo].map((d: any) => d.name).join(',');
          }
          return rows.map((d: any) => d.name).join(',');
        },
        label: '行业赛道',
        key: 'industryOne,industryTwo',
        cancelable: false,
        option: {
          hasSelectAll: false,
          cascade: true,
          ellipsis: 9,
          type: ScreenType.MULTIPLE_THIRD,
          children: (vcTreeData as any).data.map((o: any) => {
            return {
              ...o,
              name: o.CR0275_002,
              value: o.CR0275_001,
              key: 'industryOne',
              multipleKey: ['industryOne', 'industryTwo'],
              children: o.list
                ?.filter((item2: any) => !isEmpty(item2.CR0275_004))
                .map((item2: any) => {
                  return {
                    name: item2.CR0275_005,
                    value: item2.CR0275_004,
                    key: 'industryTwo',
                    multipleKey: ['industryOne', 'industryTwo'],
                  };
                }),
            };
          }),
        },
      };
      const draft = defaultOption ? defaultOption : [];
      return [traceItem, ...draft];
    }
    return defaultOption || [];
  }, [data, defaultOption, vcTreeData]);

  /** 统计列表筛选变化逻辑 */
  const handleMenuChange = useMemoizedFn((selectedData: Record<string, any>[], allData: Record<string, any>[]) => {
    if (isFirstLoad) return;
    // 选中项为空代表选的是地区
    if (!allData.length) {
      update((d) => {
        ['regionCode', 'cityCode', 'countryCode'].forEach((key) => {
          d.condition![key] = '';
        });
      });
      return;
    }

    update((d) => {
      // 地区百强县，列表需单独处理
      const countyList = allData.filter((item) => item.key === 'countryCode');
      d.selectTopCounty = countyList.length === 1 && countyList[0].name === '百强县';

      if (d.condition) {
        const keys = uniq(allData.map((o) => o.key).filter((o) => o));
        // 选的是地区,需重置具体选项
        if (['regionCode', 'cityCode', 'countryCode', 'regionLevel'].some((o) => keys.includes(o))) {
          ['regionCode', 'cityCode', 'countryCode'].forEach((key) => {
            d.condition![key] = '';
          });
        }
        keys.forEach((o) => {
          d.condition![o] = allData
            .filter((item) => item.key === o)
            .map((item) => (item.value !== TopCountyValue ? item.value : item.realValue))
            .join(',');
        });
      }
    });
  });

  return { screenConfig, handleMenuChange, year: yearRef.current, vcTreeData, loaded: loadedRef.current };
}
