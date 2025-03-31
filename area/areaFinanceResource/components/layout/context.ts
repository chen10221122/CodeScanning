import createContext from '@/utils/createContext';

export interface Context {
  /**@description 请求接口参数 */
  condition: Record<string, any>;
  /**@description 是否第一次加载 */
  isFirstLoad: boolean;
  /**@description 控制明细弹窗显示隐藏 */
  visible?: boolean;
  /**@description 弹窗名称 */
  modalTitle: string;
  /**@description 表格数据页码,用于序号列宽度计算 */
  page: number;
  /**@description 错误码 */
  error?: { returncode: number };
  /**@description 区域存贷款规模中的地区级别 */
  reginLevel: string;
  /**@description 表格数据总条数 */
  total: number;
  /**@description 表格数据 */
  tableData: any[];
  /**@description 表格loading */
  tableLoading: boolean;
  /**@description 表格是否进行请求 */
  ready: boolean;
  /**@description 是否溯源 */
  isOpenSource?: boolean;
  /**@description 弹窗请求参数 */
  modalRequestParams: any;
  /**@description 弹窗请求Api  */
  modalRequestApi: (params: any) => any;
  modalColumns: any[];
  modalExport: string;
  tableExport: string;
  exportName: string;
  hiddenBlankColumn?: boolean;
  fullData: any[];
  /**@description 弹窗表格导出的sheetName  */
  sheetNames?: object;
  endYear?: string;
  /**@description 弹窗导出的地区名称   */
  area?: string;
}
const defaultContext = {
  condition: {
    skip: 0,
    pageSize: 50,
  },
  isFirstLoad: true,
  page: 1,
  modalTitle: '明细',
  tabFilterCache: {},
  reginLevel: 'province',
  total: 0,
  tableData: [],
  tableLoading: true,
  ready: false,
  isOpenSource: undefined,
  modalRequestParams: {
    pageSize: 50,
    skip: 0,
  },
  modalRequestApi: () => {},
  modalColumns: [],
  modalExport: '',
  tableExport: '',
  exportName: '',
  hiddenBlankColumn: undefined,
  fullData: [],
  sheetNames: undefined,
  endYear: undefined,
  area: undefined,
};

export const [useConditionCtx, Provider] = createContext<Context>(defaultContext);
