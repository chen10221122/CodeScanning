import { StatisticsScopeType } from '@/pages/area/areaF9/modules/regionalLand/const';
import createContext from '@/utils/createContext';
import { shortId } from '@/utils/share';

export const DEFAULT_SORT = { sortKey: 'dealPublicityStartDate', sortRule: 'desc' };

interface CommonState {
  type: number;
  total: number;
  currentPage: number;
  headerHeight: number;
  dateFilter: {
    transferDate?: string;
    contractSignDate?: string;
    dealDate?: string;
  };
  otherFilter: {
    provinceCode?: string;
    cityCode?: string;
    countyCode?: string;
    landUsageFirstType?: string;
    landUsageSecondType?: string;
    enterpriseType?: string;
    supplyMode?: string;
    stage?: string;
    planDevelopCycle?: string;
    landArea?: string;
    landDealTotalPrice?: string;
  };
  statisticsScope: string;
  sortKey?: string;
  sortRule?: string;
  keyword?: string;
  holdRatio: string;
  loading: boolean;
  screenKey: string;
  headInfo: string[];
}

export const [useCtx, Provider] = createContext<CommonState>({
  type: 1,
  currentPage: 1,
  total: 0,
  dateFilter: {},
  otherFilter: {},
  loading: true,
  holdRatio: '3',
  ...DEFAULT_SORT,
  screenKey: shortId(),
  keyword: '',
  headInfo: [],
  statisticsScope: StatisticsScopeType.HAS_CHILDREN,
  headerHeight: 36,
} as CommonState);
