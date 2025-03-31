import createContext from '@/utils/createContext';

export interface Context {
  /** 请求接口参数 */
  condition?: Record<string, any>;
  /** 是否ready,可以初始化,防止screen默认change事件导致多次请求 */
  isFirstLoad?: boolean;
  /** 控制明细弹窗显示隐藏 */
  visible?: boolean;
  /** 控制弹框的tabs显示隐藏 */
  showTabs?: boolean;
  type?: string;
  /** 明细弹窗可变配置 */
  detailModalConfig: {
    defaultCondition?: Record<string, any>;
    title: string;
    modalType: any;
    modalTitle?: string;
    [key: string]: any;
  };
  /** 表格数据页码,用于序号列宽度计算 */
  page: number;
  /** 错误码 */
  error?: { returncode: number };
  // 模块是否隐藏
  hideModule: {
    riskMonitoring: boolean;
    bondNetFinancing: boolean;
    bondRepaymentPressure: boolean;
    leaseFinancing: boolean;
    receivableAccountsFinancing: boolean;
    trustFinancing: boolean;
    loansScale: boolean;
    bankResources: boolean;
    enterpriseCreditDistribution: boolean;
    stockMarket: boolean;
    listedCompanyDistribution: boolean;
    pevcFinancing: boolean;
    pevcTop: boolean;
  };
  //首次加载
  firstLoading: {
    financingScaleLoading: boolean;
    riskMonitoringLoading: boolean;
    bondNetFinancingLoading: boolean;
    bondRepaymentPressureLoading: boolean;
    leaseFinancingLoading: boolean;
    receivableAccountsFinancingLoading: boolean;
    trustFinancingLoading: boolean;
  };
}
const defaultContext = {
  condition: undefined,
  isFirstLoad: true,
  page: 1,
  detailModalConfig: {
    title: '明细',
    modalTitle: '',
    modalType: '',
  },
  hideModule: {
    riskMonitoring: false,
    bondNetFinancing: false,
    bondRepaymentPressure: false,
    leaseFinancing: false,
    receivableAccountsFinancing: false,
    trustFinancing: false,
    loansScale: false,
    bankResources: false,
    enterpriseCreditDistribution: false,
    stockMarket: false,
    listedCompanyDistribution: false,
    pevcFinancing: false,
    pevcTop: false,
  },
  firstLoading: {
    financingScaleLoading: true,
    riskMonitoringLoading: true,
    bondNetFinancingLoading: true,
    bondRepaymentPressureLoading: true,
    leaseFinancingLoading: true,
    receivableAccountsFinancingLoading: true,
    trustFinancingLoading: true,
  },
};

export const [useConditionCtx, Provider] = createContext<Context>(defaultContext);
