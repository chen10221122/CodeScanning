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
    modalType: any;
    [key: string]: any;
  };
  /** 表格数据页码,用于序号列宽度计算 */
  page: number;
  /** 错误码 */
  error?: { returncode: number };
}
const defaultContext = {
  condition: undefined,
  isFirstLoad: true,
  page: 1,
  detailModalConfig: {
    title: '明细',
    modalType: '',
  },
};

export const [useConditionCtx, Provider] = createContext<Context>(defaultContext);
