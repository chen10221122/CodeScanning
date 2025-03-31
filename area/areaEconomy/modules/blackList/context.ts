import { ConditionProps } from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetListData';
import createContext from '@/utils/createContext';

import { TabEnum } from './constant';

export interface CtxProps {
  /** 当前tab */
  activeTab: TabEnum;
  /** tab右侧栏相关信息 表格数量以及选中数据 */
  tabRightInfo: {
    count: number;
    selectRow: any;
  };
  /** 高级搜索参数 */
  searchParams?: Record<string, any>;
  /** 表格相关搜索参数 */
  tableParams?: Pick<ConditionProps, 'pageSize' | 'sort' | 'skip'>;
  /** 选中地区相关 选中数量 选中地区的所有父级code */
  areaCodeTotalAndList?: [number, string[]];
  /** 是否单选区县级 */
  areaNoTopTen?: boolean;
  /** 搜索关键字 */
  keyword?: string;
  /** 自选组合刷新页面 */
  refresh?: () => void;
}

const defaultContext = {
  activeTab: TabEnum.List,
  tabRightInfo: {
    count: 0,
    selectRow: [],
  },
};

export const [useCtx, Provider] = createContext<CtxProps>(defaultContext);
