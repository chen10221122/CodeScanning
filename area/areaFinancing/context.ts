// import createMiniStore from '@/utils/createMiniStore';
import createContext from '@/utils/createContext';

export interface Context {
  openKeys: string[];
  tabKey: string;
  fullLoading: boolean;
  /** 滚动/弹窗挂载容器 */
  wrapperRef: any;
  /** 通用地区树数据 */
  screenAreaData?: Record<string, any>;
  /** 权限弹窗 */
  powerDialogVisible?: boolean;
  dynamicColumnTitle?: Record<string, any>[];
  [K: string]: any;
}
const defaultContext = {
  fullLoading: true,
  tabKey: '',
  currentNode: '',
  wrapperRef: null,
  // 左侧菜单栏
  sideMenu: [],
  /** 展开左侧菜单栏 */
  openKeys: [],
  powerDialogVisible: false,
};

export const [useCtx, Provider] = createContext<Context>(defaultContext);
