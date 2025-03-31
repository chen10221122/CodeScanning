import { useCallback } from 'react';

import { CategoryItem, RankDetailItem, RankItem } from '@/pages/area/areaF9/modules/regionalOverview/areaRank/api';
import createContext from '@/utils/createContext';
export enum SortType {
  Desc = 'desc',
  Asc = 'asc',
}
export const mapOrder = (v: string) => {
  switch (v) {
    case 'ascend':
      return SortType.Asc;
    case 'descend':
      return SortType.Desc;
    default:
      return '';
  }
};
export interface ScreenCondition {
  skip: number;
  year: string;
  department: string;
  keyWord?: string;
  sortKey: 'announcementDate' | 'category' | 'year' | 'department' | 'dataSource' | '';
  sortRule?: '' | SortType;
  /** 恢复默认 */
  resetScreenFlag: number;
}
interface Context {
  wholeModuleWrapperRef?: HTMLElement | HTMLDivElement | null;
  /** 滚动到此处的ref */
  scrollTargetRef?: HTMLElement | HTMLDivElement | null;
  /** 热门榜单 */
  hotRankList?: RankItem[];
  /** 当前选中的分类 */
  activeCategory?: string;
  /** 榜单分类 */
  categoryList?: CategoryItem[];
  /** 榜单loading */
  categoryLoading?: boolean;
  /** 首次加载loading */
  fullLoading: boolean;
  /** 明细弹窗 */
  // detailModalVisible: boolean;
  /** 明细弹窗所需基本信息 */
  activeDetailInfo: RankItem & { dataList?: RankDetailItem[] };
  /** 榜单列表 */
  rankList?: RankItem[];
  rankCount?: number;
  permissionModalVisible?: boolean;
  /** 列表筛选参数 */
  screenCondition: ScreenCondition;
}

export const [useCtx, Provider, ctx] = createContext<Context>({
  // detailModalVisible: false,
  screenCondition: {
    skip: 0,
    resetScreenFlag: 1,
    sortKey: 'announcementDate',
    sortRule: SortType.Desc,
  },
  activeCategory: 'all',
  categoryLoading: false,
  activeDetailInfo: {},
  fullLoading: true,
} as Context);

ctx.displayName = 'areaRankContext';
export function useContextHelper() {
  const { state, update } = useCtx();
  const updateActiveCategory = useCallback(
    (v) => {
      update((d) => {
        d.activeCategory = v;
      });
    },
    [update],
  );
  const updateCategoryList = useCallback(
    (v) => {
      update((d) => {
        d.categoryList = v;
      });
    },
    [update],
  );
  const updateHotRankList = useCallback(
    (v) => {
      update((d) => {
        d.hotRankList = v;
      });
    },
    [update],
  );
  const updateRankList = useCallback(
    (list, count) => {
      update((d) => {
        d.rankList = list;
        d.rankCount = count;
      });
    },
    [update],
  );
  const updateCategoryLoading = useCallback(
    (v) => {
      update((d) => {
        d.categoryLoading = v;
      });
    },
    [update],
  );
  const updateFullLoading = useCallback(
    (v) => {
      update((d) => {
        d.fullLoading = v;
      });
    },
    [update],
  );
  const updateScreenCondition = useCallback(
    (v) => {
      update((d) => {
        d.screenCondition = v;
      });
    },
    [update],
  );
  const resetScreen = useCallback(() => {
    update((d) => {
      d.screenCondition = {
        skip: 0,
        year: '',
        department: '',
        keyWord: '',
        sortKey: 'announcementDate',
        sortRule: SortType.Desc,
        resetScreenFlag: ++d.screenCondition.resetScreenFlag,
      };
    });
  }, [update]);

  return {
    ...state,
    updateActiveCategory,
    updateCategoryList,
    updateHotRankList,
    updateRankList,
    updateCategoryLoading,
    updateFullLoading,
    updateScreenCondition,
    resetScreen,
  };
}
