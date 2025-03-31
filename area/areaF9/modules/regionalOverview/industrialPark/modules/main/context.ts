import { createContext } from 'react';
import { fixContext } from 'react-activation';

import type { BaseContext } from '../../type';
import type { ScreenParams, TableData, ScreenApiResult } from './type';

export interface Context extends BaseContext {
  /* 筛选条件 */
  condition: ScreenParams;
  /* 表格数据 */
  tableData: TableData[];
  filterFirstLoading: boolean;
  option: ScreenApiResult;
}

const MainContext = createContext<Context>({} as Context);

fixContext(MainContext);

export default MainContext;
