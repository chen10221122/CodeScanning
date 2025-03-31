import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import { CategoryItem, getAreaRankList, getRankCategory, RankItem } from '@pages/area/areaRank/api';
import { SortType, useContextHelper } from '@pages/area/areaRank/provider';

import { dateFilter } from '@/utils/date';

export function useInit() {
  const { fullLoading, updateCategoryList, updateHotRankList, updateRankList, updateFullLoading } = useContextHelper();
  const [hotCount, setHotCount] = useState(null);
  const { data: categoryData, loading: categoryLoading } = useRequest(getRankCategory, {
    onSuccess(res: { data: CategoryItem[] }) {},
  });

  useEffect(() => {
    if (hotCount !== null && categoryData && categoryData.data) {
      const result = categoryData.data;
      result[0].code = 'all';
      result.splice(1, 0, { code: 'hot', name: '热门', number: hotCount });
      updateCategoryList(result);
    }
  }, [categoryData, hotCount, updateCategoryList]);
  const { loading: hotLoading } = useRequest(getAreaRankList, {
    defaultParams: [{ isHotList: 1 }],
    onSuccess(res: any) {
      if (res.data) {
        setHotCount(res.data.total);
        updateHotRankList(res.data.data);
      }
    },
  });
  const { loading, data } = useRequest(getAreaRankList, {
    defaultParams: [{ category: '', skip: 0, sortKey: 'announcementDate', sortRule: SortType.Desc }],
    onSuccess(res: any, params) {
      if (res.data.data) {
        const data = res.data.data;
        updateRankList(
          data.map((o: RankItem, i: number) => ({
            index: params[0].skip + i + 1,
            key: i,
            ...o,
            announcementDate: dateFilter(o.announcementDate),
          })),
          res.data.total,
        );
      }
    },
  });
  useEffect(() => {
    if (fullLoading && !loading && !hotLoading && !categoryLoading && data) {
      updateFullLoading(false);
    }
  }, [loading, fullLoading, hotLoading, updateFullLoading, data, categoryLoading]);
}
