import createContext from '@/utils/createContext';
export type AreaCodeType = { [a: string]: string };

export interface TblEl {
  [a: string]: any;
}

export type conditionType = {
  [a: string]: any;
};

export type tblDataItem = {
  endDate: number;
  guId: null | string;
  indicCode: number;
  indicName: string;
  indicNameOnly: string;
  mValue?: number;
  regionCode4: string;
  regionName: string;
  regionName2: string;
  unit: string;
  indicator: string;
  indicName_old?: string;
  indicatorList: TblEl[];
  /** 是否是固定行 */
  isFixdRow?: boolean;
  /** 是否是统计值行 */
  isStatistics?: boolean;
};

export type ScrollSetting = { x?: number; y?: number };

export type CommonState = {
  condition: conditionType;
  areaCodeRelation: AreaCodeType;
  openSource: boolean;
  infoDetail: TblEl;
  indicator: string;
  /** 原始指标名 */
  realIndicator?: string;
  year: string;
  tblData: TblEl[];
  sortName?: string;
  container: HTMLDivElement | null;
  current: number;
  requestNum: string;
  total: number;
  tableLoading: boolean;
  requestParams: conditionType;
  tableError?: any;
  reloadData?: () => void;
  /** 溯源弹窗 */
  traceModalInfo: any;
  /** 数据更新弹窗 */
  updateModalInfo: any;
  /** 更新提示开关 */
  openUpdate: boolean;
  sortData: any;
  /**默认以第一列为排序，兼容所有指标 */
  defaultSortOrder: any;
  scrollLeft: number;
  selectedRowKeys: string[];
  /**所有已选指标集合 */
  indicatorAllAttribute?: any[];
  /**自定义指标头部弹起来统计图时候把整个指标内容扔过来 */
  customIndicator: any;
  /**自定义指标的排序字段 */
  indexSort?: string;
  /*为了兼容把弹窗整个initYear抽出来供专题所有地方来用 */
  filterInitYearLoading?: boolean;
  /**接口拉回来的数据 */
  filterInitYear?: string;
  customallCustomIndicator?: any[];
};
/**废弃 22822新增自定义之后。不能按照这个默认排序 */
export const defaultOrder = {
  columnKey: 'GDP',
  order: 'descend',
};
export const defaultAreaMap = {
  '110000': '北京市',
  '120000': '天津市',
  '130000': '河北省',
  '140000': '山西省',
  '150000': '内蒙古自治区',
  '210000': '辽宁省',
  '220000': '吉林省',
  '230000': '黑龙江省',
  '310000': '上海市',
  '320000': '江苏省',
  '330000': '浙江省',
  '340000': '安徽省',
  '350000': '福建省',
  '360000': '江西省',
  '370000': '山东省',
  '410000': '河南省',
  '420000': '湖北省',
  '430000': '湖南省',
  '440000': '广东省',
  '450000': '广西壮族自治区',
  '460000': '海南省',
  '500000': '重庆市',
  '510000': '四川省',
  '520000': '贵州省',
  '530000': '云南省',
  '540000': '西藏自治区',
  '610000': '陕西省',
  '620000': '甘肃省',
  '630000': '青海省',
  '640000': '宁夏回族自治区',
  '650000': '新疆维吾尔自治区',
};
export const [useCtx, Provider] = createContext<CommonState>({
  condition: {},
  tblData: [],
  openSource: false,
  areaCodeRelation: defaultAreaMap,
  infoDetail: {},
  year: '',
  indicator: '',
  realIndicator: '',
  sortName: '',
  container: null,
  current: 1,
  requestNum: '',
  total: 0,
  tableLoading: true,
  requestParams: {},
  traceModalInfo: {},
  updateModalInfo: {},
  openUpdate: true,
  sortData: defaultOrder,
  defaultSortOrder: defaultOrder,
  scrollLeft: 0,
  selectedRowKeys: [],
  indicatorAllAttribute: [],
  customIndicator: undefined,
});
