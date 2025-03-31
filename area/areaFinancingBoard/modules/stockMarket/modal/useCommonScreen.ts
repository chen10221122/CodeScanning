import { useCreation, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getVcRaceTree } from '@pages/area/areaFinancing/api';

import { Options, ScreenType } from '@/components/screen';

/** 上市板块 */
export const plate = {
  title: '全部',
  label: '上市板块',
  key: 'listingSector',
  option: {
    type: ScreenType.MULTIPLE,
    cancelable: false,
    children: [
      { name: '沪市主板', key: 'listingSector', value: '沪市主板' },
      { name: '深市主板', key: 'listingSector', value: '深市主板' },
      { name: '创业板', key: 'listingSector', value: '创业板' },
      { name: '科创板', key: 'listingSector', value: '科创板' },
      { name: '北交所', key: 'listingSector', value: '北交所' },
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

/** 融资类型 */
export const equityType = {
  title: '全部',
  label: '融资类型',
  key: 'equityType',
  option: {
    type: ScreenType.MULTIPLE,
    cancelable: false,
    children: [
      { name: '定向增发', key: 'equityType', value: '定向增发' },
      { name: '公开增发', key: 'equityType', value: '公开增发' },
      { name: '配股', key: 'equityType', value: '配股' },
    ],
  },
};

/** 市场分层 */
export const marketLayer = {
  title: '全部',
  key: 'listingSector',
  label: '市场分层',
  option: {
    type: ScreenType.MULTIPLE,
    cancelable: false,
    children: [
      { name: '创新层', key: 'listingSector', value: '1' },
      { name: '基础层', key: 'listingSector', value: '2' },
    ],
  },
};

/** 是否品牌 */
export const isHead = {
  title: '全部',
  label: '是否品牌',
  key: 'top',
  option: {
    type: ScreenType.SINGLE,
    // cancelable: false,
    children: [
      { name: '全部', key: 'top', value: '' },
      { name: '是', key: 'top', value: 'true' },
      { name: '否', key: 'top', value: 'false' },
    ],
  },
};
interface CommonScreenProps {
  defaultOption?: any[];
  /** 接口返回的option */
  extra?: { type: ExtraOptionType };
}
export enum ExtraOptionType {
  Year,
  RaceTree,
  Area,
}

export default function useCommonScreen(props?: CommonScreenProps) {
  const { defaultOption, extra } = props || {};
  const { data: vcTreeData, loading } = useRequest(getVcRaceTree, {
    ready: !isEmpty(extra) && extra?.type === ExtraOptionType.RaceTree,
    onError: () => {},
  });
  // 少写了依赖项extra，故使用useCreation
  const screenConfig: Options[] = useCreation(() => {
    if (vcTreeData && extra?.type === ExtraOptionType.RaceTree) {
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
  }, [defaultOption, vcTreeData]);

  return { screenConfig, vcTreeData, loading };
}
