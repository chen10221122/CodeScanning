import { createContext } from 'react';
import { fixContext } from 'react-activation';

import type { TableData } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/type';
import type { BaseContext } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/type';

import type { screenParams, areaScreenApiResult } from './type';

export interface Context extends BaseContext {
  /* 筛选条件 */
  condition: screenParams;
  /* 表格数据 */
  tableData: TableData[];
  debounceScreenHeadHeight: number | undefined;
  option: areaScreenApiResult;
}

const ParkEnterpriseContext = createContext<Context>({} as Context);

fixContext(ParkEnterpriseContext);

export default ParkEnterpriseContext;
