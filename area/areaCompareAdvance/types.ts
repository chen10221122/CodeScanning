import { ColumnTypeEnums } from '@/pages/bond/chineseDollarBondStatistics/types';

export interface RowConfig {
  /** 唯一值，用于row的key */
  id?: string;
  /** 显示名称 */
  name?: string;
  /** 唯一字段 */
  key?: string;
  /** 控制增量，标记当前是否脏数据 */
  _dirty?: boolean;
  /** 企业类型 */
  type?: string;
  /** 当存在sortIndex时，优先使用sortIndex的值进行排序 */
  sortIndex?: number;
  /** 额外的字段信息，对于不同的业务而言，可能出现的字段不一致 */
  extraProperties?: {
    /**
     * 单元格的特定显示类型。
     * 以区域数据浏览器为例，有的数据可能会存在近一周更新的数据，这些数据在显示的方式上会和其他数据有一些区别（包含特殊的背景色），那么通过单元格的类型，可以用于标识这些特殊的单元格。
     */
    type: string;
    /**
     * 还可以定义一些额外字段来单元格添加一些额外信息，比如，指标类型为链接的时候，这里可能会定义一个url字段。
     */
    [key: string]: any;
  };
  [k: string]: any;
}

export type ContextState = {
  count: {
    [p: string]: number;
  };
  /** 切换地区的下标值,用于地区切换弹窗 */
  areaChangeIndex: number;
  level: number;
  limited: number;
  remainCount: number;
  selectAreaModalVisible: boolean;
  /** 带有省本级的选中地区数据 */
  selectedAreaDataWithSelfLevel: any;
  inViewport: boolean;
  /** 指标弹窗开关 */
  chartModalVisible: boolean;
  indicator: string;
  indicatorName: string;
  /** 已选指标id集合 */
  indexIds: string[];
  /** 已选指标树 */
  indicatorTree: any[];
  /** 年份 */
  date: string;
  /** 列 */
  columnDefs: any[];
  /** ag-grid表格 */
  grid: any;
  /** 当前模块最外层容器ref */
  wholeModuleWrapperRef?: HTMLElement | HTMLDivElement | null;
  /** 溯源按钮状态 */
  openSource: boolean;
  /** 打开计算指标弹窗 */
  handleOpenModal: Function;
  /** 页面头部是否可筛选 */
  isToolOpen: boolean;
  /** 是否展示权限不足弹窗 */
  showModal?: boolean;
  /** 指标总数 */
  indicatorLen?: number;
  /** 页面跳转的地区code */
  jumpCodes?: string[];
  /** 是否展示权限付费用户上限弹窗 */
  showPayLimit?: boolean;
  areaInfo: any[];
  areaSelectType: AreaSelectModalType;
  isOpenMax: boolean;
  isOpenMin: boolean;
  isEmptyLineOpen: boolean;
  recordVisible: boolean;
  areaSelectCode: string;
  isCompare: boolean;
  isCompareHistory: boolean;

  screenLoading: boolean;
  firstMainLoading: boolean;
  isExpandAll: boolean;

  indicatorModalVisible: boolean;
  indicatorParams: any;
  isAddAreaFixed: boolean;
  preSelectAreaRef: any;
  rowDatas: any;
  indicatorDetailParams: Record<string, any>;
  // 科技型企业弹窗参数
  setTechnologyInnovationTitle: (value: React.SetStateAction<string>) => void;
  setTechnologyInnovationVisible: (value: React.SetStateAction<boolean>) => void;
  setTechnologyInnovationParams: (value: any) => void;
  setTechnologyInnovationType: (value: React.SetStateAction<string>) => void;
  // 中资美元债弹窗
  setModalType: React.Dispatch<React.SetStateAction<ColumnTypeEnums>>;
  handleClick: ({
    type,
    info,
    updateDate,
    bondType,
    pageParam,
    isFrequency,
  }: {
    type?: ColumnTypeEnums;
    info: any;
    updateDate?: any;
    bondType?: any;
    pageParam: any;
    isFrequency?: boolean;
  }) => void;
};

export enum TableCellType {
  /** 指标数据 */
  Indicator = 'indicator',
  /** 指标明细 */
  IndicatorDetail = 'IndicatorDetail',
  /** 地区综合评分 */
  AreaScope = 'areaScope',
  /** 地区数据 */
  Area = 'area',
  /** 科创类 */
  Technology = 'technology',
  /** 中资美元债 */
  DollorBond = 'dollorBond',
  /** 区域对比-地区综合评分 */
  CompareArea = 'compareArea',
}

export enum AreaSelectModalType {
  ADD_AREA,
  REPLACE_AREA,
}
