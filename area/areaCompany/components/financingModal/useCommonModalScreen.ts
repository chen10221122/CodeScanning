import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { uniq } from 'lodash';

import { useImmer } from '@/utils/hooks';

import { DetailModalInfoMap, DetailModalTypeEnum, SortMap } from './type';
import useCommonScreen, { ExtraOptionType } from './useCommonScreen';

export default function useCommonModalScreen({ visible, detailModalConfig = {}, setPage, searchRef }: any) {
  const { defaultCondition, modalType = DetailModalTypeEnum.StockAIpo } = detailModalConfig;

  const [condition, setCondition] = useImmer<Record<string, any>>({});
  const [screenValues, setScreenValues] = useState<any[]>([]);

  const { screenConfig, vcTreeData } = useCommonScreen({
    defaultOption: DetailModalInfoMap.get(modalType)?.screen,
    extra: modalType === DetailModalTypeEnum.VC ? { type: ExtraOptionType.RaceTree } : undefined,
  });

  const handleReset = useMemoizedFn(() => {
    if (defaultCondition) {
      setCondition((d) => {
        Object.keys({ ...DetailModalInfoMap.get(modalType)?.condition, ...defaultCondition }).forEach((o) => {
          d[o] = defaultCondition[o];
        });
      });
      // 根据condition中是否有默认选中项，同步筛选受控
      const keys = screenConfig.map((o: any) => o.key);
      const values = keys.map((o) => {
        return defaultCondition?.[o]?.split(',') || [''];
      });
      setScreenValues(values);
      setPage(1);
    }
    setCondition((d) => {
      if (d.keyWord) d.keyWord = '';
    });
    searchRef?.current?.clearValue();
  });
  const onClear = () => {
    setCondition((d) => {
      d.keyWord = '';
    });
  };
  const handleSearch = (v: string) => {
    setCondition((d) => {
      d.keyWord = v;
    });
  };

  const handleMenuChange = useMemoizedFn((allData: Record<string, any>[], i: number) => {
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
      if ((modalType === DetailModalTypeEnum.VC && vcTreeData) || modalType !== DetailModalTypeEnum.VC) {
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
    condition,
    screenConfig,
    handleMenuChange,
    screenValues,
    handleTableSortChange,
    handleReset,
    searchConfig: DetailModalInfoMap.get(modalType)?.searchConfig,
    onClear,
    handleSearch,
  };
}
