import createContext from '@/utils/createContext';
import { shortId } from '@/utils/share';

export const DEFAULT_SORT = { sortKey: 'dealPublicityStartDate', sortRule: 'desc' };

interface CommonState {
  total: number;
  currentPage: number;
  dateFilter: {
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
    statisticsScope: string;
  };
  sortKey?: string;
  sortRule?: string;
  keyword?: string;
  holdRatio: string;
  firstLoading?: boolean;
  screenKey: string;
  headInfo: string[];
}

export const [useCtx, Provider] = createContext<CommonState>({
  currentPage: 1,
  total: 0,
  dateFilter: {},
  otherFilter: { statisticsScope: '1' },
  firstLoading: true,
  holdRatio: '3',
  ...DEFAULT_SORT,
  screenKey: shortId(),
  keyword: '',
  headInfo: [],
} as CommonState);
