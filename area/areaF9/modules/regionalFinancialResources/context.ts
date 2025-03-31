import createContext from '@/utils/createContext';

import { pageType, PAGE_SIZE } from './type';

interface CommonState {
  filterOptionsLoading: boolean;
  page: pageType;
  code: string;
  isOpenSource: boolean;
  total: number;
  tableData: any;
  modalVisible: boolean;
  modalTitle: string;
  modalRequestParams: any;
  /** 表格请求参数改变导致的loading */
  conditionChangeLoading: boolean;
  tableCondition: any;
  exportName: string;
  module_type: string;
  firstLoading: boolean;
  filterRequestParams: any;
  searchRef: any;
  resetParams: any;
  tableError: number;
  sheetNames?: object;
}

export const defaultContext: CommonState = {
  filterOptionsLoading: false,
  page: pageType.SCALE,
  code: '',
  isOpenSource: false,
  total: 0,
  tableData: [],
  modalVisible: false,
  modalTitle: '',
  conditionChangeLoading: false,
  tableCondition: {
    pageSize: PAGE_SIZE,
    skip: 0,
  },
  exportName: '',
  module_type: '',
  firstLoading: true,
  filterRequestParams: {},
  modalRequestParams: {},
  searchRef: null,
  resetParams: null,
  tableError: 0,
  sheetNames: undefined,
};

export const [useCtx, Provider] = createContext<CommonState>(defaultContext);
