import shortid from 'shortid';

import createContext from '@/utils/createContext';

interface CommonState {
  condition: any;
  openSource: boolean;
  infoDetail: any;
  indicator: string;
  /** 原始指标名 */
  realIndicator?: string;
  year: string;
  tblData: any[];
  sortName?: string;
  container: HTMLDivElement | null;
  current: number;
  requestNum: string;
  total: number;
  tableLoading: boolean;
  requestParams: any;
  tableError?: any;
  reloadData?: () => void;
  /** 溯源弹窗 */
  traceModalInfo: any;
  /** 数据更新弹窗 */
  updateModalInfo: any;
  /** 更新提示开关 */
  openUpdate: boolean;
  scrollLeft: number;
  screenKey: string;
}

export const defaultContext: CommonState = {
  condition: {},
  tblData: [],
  openSource: false,
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
  scrollLeft: 0,
  screenKey: shortid(),
};

export const [useCtx, Provider] = createContext<CommonState>(defaultContext);
