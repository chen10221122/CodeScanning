import createContext from '@/utils/createContext';

export interface Context {
  /** 请求接口参数 */
  condition?: Record<string, any>;
  /** 是否ready,可以初始化,防止screen默认change事件导致多次请求 */
  isFirstLoad?: boolean;
  /** 控制明细弹窗显示隐藏 */
  visible?: boolean;
  /** 明细弹窗可变配置 */
  detailModalConfig: {
    defaultCondition?: Record<string, any>;
    title: string;
    modalType?: any;
    /** 地区名 */
    areaName?: string;
    [key: string]: any;
  };
  /** 表格数据页码,用于序号列宽度计算 */
  page: number;
  /** 筛选是否选中百强县 */
  selectTopCounty?: boolean;
  /** 错误码 */
  error?: { returncode: number };
  /** 切换Tab时需要同步地区 */
  tabFilterCache: {
    regionCode?: string;
    // 用于切换tab时同步请求接口
    cityCode?: string;
    countryCode?: string;
    regionLevel?: string;
    // 用于控制筛选组件受控
    areaValues?: string;
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
