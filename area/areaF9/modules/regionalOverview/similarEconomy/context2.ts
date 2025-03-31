import createContext from '@/utils/createContext';

import { IFilterProps, PAGE_SIZE } from './utils';

interface IContext {
  /** 筛选表单 */
  params: IFilterProps;
  /** 是否打开更多弹窗 */
  isOpenModals: boolean;
  /** 弹窗行具体信息 */
  modalRow?: IModalRow;
  /**地区code */
  code: string;
  /** 年份加载 */
  yearLoading?: boolean;
  /**初始年份 */
  initYear?: string;
  /**会员权限 */
  hasPay: boolean;
  /** 初始化指标加载 */
  defaultIndicatorLoading: boolean;
  /** 筛选项变动 */
  isFilterChanged: boolean;
  /** 范围显示文本 */
  rangeDisplayText: string;
  /** 默认shaixuanxi */
  resetIndicators: () => void;
  firstTimeLoading: boolean;
}

interface IModalRow {
  title: string;
  indicName2: string;
  indicatorCode: string;
  originIndicatorValue: string;
  regionName: any;
  regionCode: any;
  score: any;
}

const defaultContext: IContext = {
  params: {
    pageSize: PAGE_SIZE.MAIN_PAGE_SIZE,
    skip: 0,
    code: '',
    deviationRange: '[0,5]',
  },
  defaultIndicatorLoading: true,
  isOpenModals: false,
  code: '',
  yearLoading: true,
  initYear: '',
  hasPay: false,
  isFilterChanged: false,
  rangeDisplayText: '5%',
  resetIndicators: () => {},
  firstTimeLoading: true,
};

export const [useCtx2, Provider2] = createContext<IContext>(defaultContext);
