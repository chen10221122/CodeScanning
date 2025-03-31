import { useEffect, useRef } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';

import { getAreaRankList, RankItem } from '@pages/area/areaRank/api';
import { useContextHelper } from '@pages/area/areaRank/provider';

import { dateFilter } from '@/utils/date';

export function useTable() {
  const { screenCondition, activeCategory, updateRankList, updateCategoryLoading, resetScreen } = useContextHelper();
  const isFirstLoadRef = useRef(true);
  /** 排序与表格切换加载loading不一致 */
  const isSortOrPageRef = useRef(false);
  const { loading, run } = useRequest(getAreaRankList, {
    manual: true,
    onSuccess(res: any, params) {
      if (res.data.data) {
        const data = res.data.data;
        updateRankList(
          data.map((o: RankItem, i: number) => ({
            index: params[0].skip + i + 1,
            ...o,
            key: i,
            announcementDate: dateFilter(o.announcementDate),
          })),
          res.data.total,
        );
      }
    },
    onError() {
      updateRankList([], 0);
    },
    onFinally() {
      updateCategoryLoading(false);
      isSortOrPageRef.current = false;
    },
  });
  const handleReset = useMemoizedFn(() => {
    resetScreen();
  });
  useEffect(() => {
    if (!isFirstLoadRef.current && screenCondition) {
      const hotParam = activeCategory === 'hot' ? { isHotList: 1, category: '' } : {};
      run({ ...screenCondition, category: activeCategory === 'all' ? '' : activeCategory, ...hotParam });
    }
    if (isFirstLoadRef.current) isFirstLoadRef.current = false;
  }, [activeCategory, run, screenCondition]);
  return { loading, handleReset, isSortOrPageRef };
}
