import createContext from '@/utils/createContext';

export interface Context {
  /** 切换Tab时需要同步地区 */
  condition?: Record<string, any>;
  tabFilterCache: {
    // 用于切换tab时同步请求接口
    yearRange?: string;
    [key: string]: any;
  };
}
const defaultContext = {
  condition: undefined,
  isFirstLoad: true,
  page: 1,
  detailModalConfig: {
    title: '明细',
  },
  tabFilterCache: {},
};

export const [useConditionCtx, Provider] = createContext<Context>(defaultContext);
