import { useEffect, useRef } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';

import { getAreaRankList, RankItem } from '@/pages/area/areaEconomy/modules/areaRank/api';
import { useContextHelper } from '@/pages/area/areaEconomy/modules/areaRank/provider';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { dateFilter } from '@/utils/date';

export function useTable() {
  const {
    state: { code: regionCode },
  } = useCtx();
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
      run({ ...screenCondition, region: regionCode, category: activeCategory === 'all' ? '' : activeCategory });
    }
    if (isFirstLoadRef.current) isFirstLoadRef.current = false;
  }, [activeCategory, run, screenCondition, regionCode]);
  return { loading, handleReset, isSortOrPageRef };
}
