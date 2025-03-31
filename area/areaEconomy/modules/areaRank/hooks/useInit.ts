import { useEffect } from 'react';

import { useRequest } from 'ahooks';

import {
  CategoryItem,
  getAreaRankList,
  getRankCategory,
  RankItem,
} from '@/pages/area/areaEconomy/modules/areaRank/api';
import { SortType, useContextHelper } from '@/pages/area/areaEconomy/modules/areaRank/provider';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { dateFilter } from '@/utils/date';

export function useInit() {
  const {
    state: { code: regionCode },
  } = useCtx();
  const { fullLoading, updateCategoryList, updateHotRankList, updateRankList, updateFullLoading } = useContextHelper();
  const { loading: categoryLoading } = useRequest(getRankCategory, {
    onSuccess(res: { data: CategoryItem[] }) {
      if (res.data) {
        res.data[0].code = 'all';
        updateCategoryList(res.data);
      }
    },
  });
  const { loading: hotLoading } = useRequest(getAreaRankList, {
    defaultParams: [{ isHotList: 1 }],
    onSuccess(res: any) {
      if (res.data) {
        updateHotRankList(res.data.data);
      }
    },
  });
  const { loading } = useRequest(getAreaRankList, {
    defaultParams: [
      { category: '', skip: 0, sortKey: 'announcementDate', sortRule: SortType.Desc, region: regionCode },
    ],
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
    if (fullLoading && !loading && !hotLoading && !categoryLoading) {
      updateFullLoading(false);
    }
  }, [loading, fullLoading, hotLoading, updateFullLoading, categoryLoading]);
}
