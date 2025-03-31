import { useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { uniq } from 'lodash';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import useCommonScreen, {
  ExtraOptionType,
  isHead,
  marketLayer,
  plate,
} from '@pages/area/areaFinancing/hooks/useCommonScreen';
import usePage from '@pages/area/areaFinancing/hooks/usePage';
import { DetailModalTypeEnum, SortMap } from '@pages/area/areaFinancing/types';

import { useImmer } from '@/utils/hooks';

const PAGE_SIZE = 50;
// state: 1-辅导期，2-在审，3-已过会待注册，4-已注册待发行
/** 不同弹窗筛选条件及导出 */
export const modalScreenMap = new Map([
  [
    DetailModalTypeEnum.StockA,
    {
      condition: {
        regionCode: '',
        statType: 'ipoType',
        regionLevel: '',
        from: 0,
        sortKey: 'EQ0062_005',
        sortRule: 'desc',
        size: PAGE_SIZE,
        plate: '',
      },
      screen: [plate],
    },
  ],
  [
    DetailModalTypeEnum.AreaPlatform,
    {
      condition: {
        regionCode: '',
        statType: 'ipoPlate',
        regionLevel: '',
        financeType: '',
        plate: '',
        entType: '',
        industryType: '',
        from: 0,
        sortKey: 'EQ0062_006',
        sortRule: 'desc',
        size: PAGE_SIZE,
      },
      screen: [plate],
    },
  ],
  [
    DetailModalTypeEnum.Ipo,
    {
      condition: {
        regionCode: '',
        state: '',
        regionLevel: '1',
        sortKey: 'IT0074_004',
        sortRule: 'desc',
        from: 0,
        size: PAGE_SIZE,
      },
      screen: [],
    },
  ],
  [
    DetailModalTypeEnum.HK,
    {
      condition: {
        regionCode: '',
        regionLevel: '',
        plate: '',
        financeType: '',
        sortKey: 'HK0015_003',
        sortRule: 'desc',
        from: 0,
        size: PAGE_SIZE,
      },
      screen: [],
    },
  ],
  [
    DetailModalTypeEnum.StockThirdPlus,
    {
      condition: {
        regionCode: '',
        regionLevel: '',
        year: '',
        date: '',
        layer: '',
        financeType: '',
        sortKey: 'EQ0064_002',
        sortRule: 'desc',
        from: 0,
        size: PAGE_SIZE,
      },
      screen: [marketLayer],
    },
  ],
  [
    DetailModalTypeEnum.StockThirdPriority,
    {
      condition: {
        regionCode: '',
        regionLevel: '',
        year: '',
        date: '',
        layer: '',
        financeType: '',
        sortKey: 'EQ0064_002',
        sortRule: 'desc',
        from: 0,
        size: PAGE_SIZE,
      },
      screen: [marketLayer],
    },
  ],
  [
    DetailModalTypeEnum.Vc,
    {
      condition: {
        regionCode: '',
        regionLevel: '',
        industryOne: '',
        industryTwo: '',
        isTop: '', //是否品牌
        from: 0,
        year: '',
        date: '',
        size: PAGE_SIZE,
        sortKey: 'PPE0001_005',
        sortRule: 'desc',
      },
      screen: [isHead],
    },
  ],
]);

export default function useCommonModalScreen() {
  const {
    state: {
      visible,
      detailModalConfig: { defaultCondition, modalType },
    },
  } = useConditionCtx();
  const isInitRef = useRef(false);
  const { page, setPage, handleChangePage } = usePage();

  const [condition, setCondition] = useImmer<Record<string, any>>({});
  const [screenValues, setScreenValues] = useState<any[]>([]);

  const { screenConfig, vcTreeData } = useCommonScreen({
    defaultOption: modalScreenMap.get(modalType || DetailModalTypeEnum.StockA)?.screen,
    extra: modalType === DetailModalTypeEnum.Vc ? { type: ExtraOptionType.RaceTree } : undefined,
  });

  // 额外判断screen是否需要的条件(需求变更，上市平台后2个tab需要上市板块筛选)
  const hasScreen = useMemo(() => {
    if (modalType !== DetailModalTypeEnum.AreaPlatform) return true;
    return modalType === DetailModalTypeEnum.AreaPlatform && defaultCondition?.statType !== 'ipoPlate';
  }, [defaultCondition?.statType, modalType]);

  const handleReset = useMemoizedFn(() => {
    if (defaultCondition) {
      setCondition((d) => {
        Object.keys(defaultCondition).forEach((o) => {
          d[o] = defaultCondition[o];
        });
      });
      const keys = screenConfig.map((o: any) => o.key);
      const values = keys.map((o) => {
        return defaultCondition?.[o]?.split(',') || [''];
      });
      setScreenValues(values);
      setPage(1);
    }
  });
  const handleMenuChange = useMemoizedFn((allData: Record<string, any>[], i: number) => {
    /* if (isInitRef.current) {
      isInitRef.current = false;
      return;
    }*/
    // 多选未选
    if (!allData.length) {
      const item = screenConfig[0] as Record<string, any>;
      if (item?.key) {
        const keys = item.key;
        keys.split(',').forEach((key: string) => {
          setCondition((d: Record<string, any>) => {
            d[key] = '';
          });
        });
      }
    } else {
      const keys = uniq(allData.map((o) => o.key));
      // 特殊处理行业赛道
      if (allData.some((o) => o.multipleKey)) {
        allData[0].multipleKey.forEach((o: string) => {
          setCondition((d: Record<string, any>) => {
            d[o] = allData
              .filter((item) => item.key === o)
              .map((item) => item.value)
              .join(',');
          });
        });
      } else {
        keys.forEach((o) => {
          setCondition((d: Record<string, any>) => {
            if (Object.keys(condition).includes(o)) {
              d[o] = allData
                .filter((item) => item.key === o)
                .map((item) => item.value)
                .join(',');
            }
          });
        });
      }
    }
    setScreenValues((d) => {
      d[i] = allData.map((item) => item.value);
      return [...d];
    });
    setPage(1);
  });
  /** 弹窗数据初始化 */
  useEffect(() => {
    if (visible && defaultCondition) {
      isInitRef.current = true;
      if ((modalType === DetailModalTypeEnum.Vc && vcTreeData) || modalType !== DetailModalTypeEnum.Vc) {
        handleReset();
      }
    }
  }, [defaultCondition, handleReset, modalType, vcTreeData, visible]);

  /** 排序 */
  const handleTableSortChange = useMemoizedFn((pagination, filters, sorter, extra) => {
    if (extra.action === 'sort') {
      const { order, field } = sorter;
      setCondition((d) => {
        d.sortKey = order ? field : '';
        d.sortRule = order ? SortMap[order] : '';
      });
    }
  });

  return {
    page,
    setPage,
    condition,
    screenConfig: hasScreen ? screenConfig : [],
    handleMenuChange,
    screenValues,
    handleChangePage,
    handleTableSortChange,
    handleReset,
  };
}
