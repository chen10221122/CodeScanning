import { useCreation, useRequest } from 'ahooks';

import { getAreaFinancingYears } from '@pages/area/areaFinancing/api';

import { quickAreaOptions, ScreenType } from '@/components/screen';
import { isMunicipality } from '@/pages/area/areaEconomy/common';

const { getRootSelected } = quickAreaOptions;

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

export default function useCommonScreen() {
  const { data } = useRequest(getAreaFinancingYears, {
    defaultParams: [{ regionLevel: '1' }],
    onError: () => {},
    onFinally: () => {
      // loadedRef.current = true;
    },
  });

  // 少写了依赖项extra，故使用useCreation
  const screenConfig: any[] = useCreation(() => {
    if (data) {
      let areaItem;
      const areaData = (data as any).data.area;
      if (areaData) {
        // 处理地区筛选项数据
        areaData.forEach((a: any) => {
          a.key = a.name === '百强县' ? 'countyCode' : 'provinceCode';
          // 百强县因受控组件问题，使用原value值作为values数组会重复，故特殊处理
          if (a.name === '百强县') {
            a.realValue = a.value;
            a.value = TopCountyValue;
          }
          if (a.children?.length) {
            a.children.forEach((b: any) => {
              // 直辖市无市级 直辖区县也为countyCode
              b.key =
                ['110000', '120000', '310000', '500000', '999999'].includes(a.value) || isMunicipality(b.value)
                  ? 'countyCode'
                  : 'cityCode';
              if (b.children?.length) {
                b.children.forEach((c: any) => {
                  c.key = 'countyCode';
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

      return [areaItem] as any;
    }
  }, [data]);

  return { screenConfig };
}
