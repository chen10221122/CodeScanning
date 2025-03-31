import createContext from '@/utils/createContext';
import { shortId } from '@/utils/share';

import { StatisticsScopeType } from '../../../const';

interface CommonState {
  /** 页面加载状态*/
  loading: boolean;
  /** 总数*/
  total: number;
  sortKey?: string;
  sortRule?: string;
  currentPage: number;
  /**含下属辖区：1，本级：0 */
  statisticsScope: string;
  /**contractSignDate：合同签订日，dealDate：成交起始日 */
  dateFilter: { dealDate?: string; contractSignDate?: string };
  otherFilter: {
    /**土地用途一级目录 */
    landUsageFirstType?: string;
    /**土地用途二级目录 */
    landUsageSecondType?: string;
    /**供应方式 */
    supplyMode?: string;
    /**筛选项之一，y:年，h:半年，q:季，m:月 */
    timeStatisticsType?: string;
  };
  topEmpty: boolean;
  screenKey: string;
  fileBase64?: string;
  chartData: any;
}
export const DEFAULT_SORT = { sortKey: '', sortRule: '' };

export const [useCtx, Provider] = createContext<CommonState>({
  total: 0,
  currentPage: 1,
  dateFilter: {},
  statisticsScope: StatisticsScopeType.HAS_CHILDREN,
  otherFilter: {},
  loading: true,
  topEmpty: false,
  screenKey: shortId(),
  ...DEFAULT_SORT,
  fileBase64: '',
  chartData: {},
} as CommonState);
