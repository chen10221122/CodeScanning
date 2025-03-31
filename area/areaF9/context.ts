import { OpenDataSourceDrawer, IDataSourceDrawerInfoType } from '@/components/dataSource';
import { ScreenAreaTreeData } from '@/components/screen';
import { MenuItemProps } from '@/components/sideMenuF9/types';
import { SideMenuProps } from '@/pages/area/areaF9/components/sideBarLayout/sideMenu';
import createContext from '@/utils/createContext';
import createMiniStore from '@/utils/createMiniStore';

type MenuItemConfig = Pick<SideMenuProps, 'menus'>['menus'];

/** 溯源弹窗 */
export type InfoType = {
  /** 地区code */
  regionCode: string;
  /** 人口规模类型 */
  cityPop: string;
  /** 城区常住人口 */
  totalValue: string;
  /** 弹窗标题 */
  title: string;
  /** 年份列 */
  year: string;
};
export interface Context {
  /** 地区相关信息 */
  areaInfo?: { regionCode: string; regionName: string } & Record<string, any>;
  /** 最新年份 */
  lastYear?: string;
  /** 查看地区f9次数超限 */
  viewTimesOver: boolean;
  /** 超限提示文字 */
  viewPowerTip: string;
  /** 是否外部转入 */
  outIn: boolean;
  /** 地区跳转次数 无权限弹窗 */
  showPowerDialog?: boolean;
  /** 模块没有权限弹窗 */
  showPayPowerDialog?: boolean;
  /** 更多指标没有权限弹窗 */
  showMoreIndicDialog?: boolean;
  /** 含权类型弹窗 */
  cumRightModalVisable: boolean;
  cumRightInfo: { termContent: string; termType: string; termNum: string }[];
  /** 权限提示文字信息 */
  regionEconomyCheckInfo?: string;
  selectedYear?: string;
  /** 未付费用户调用此函数进行权限弹窗提示 */
  payCheck?: () => boolean;
  /* 是否付费 */
  havePay?: boolean;
  /** 选中节点的下一个节点 */
  nextNode: MenuItemConfig[0] | null;
  /** 全国地区树，用于下属辖区筛选项配置 */
  areaTree?: any[];
  /** 区域f9头部地区筛选树 */
  econmyAreaTree: ScreenAreaTreeData[];
  /** 请求地区树的loading */
  areaTreeLoading: boolean;
  /** 国标行业筛选项 */
  industryInfo?: any[];
  /** 请求国标行业的loading */
  industryLoading: boolean;
  /** 当前节点id */
  curNodeBranchId: string;
  /** 当前节点name */
  curNodeBranchName: string;
  curModuleFirstLoading?: boolean;
  /** 地区评分loading */
  loading: boolean;
  /** 下属地区的code拼接 */
  jurisdictionCode: string;

  /** 地区f9顶部10宫格部分数据 */
  areaDataInfo?: any;
  /** 经济速览表格数据 */
  areaTableInfo?: any;
  rankModalVisible: boolean;
  rankModalCurData: Record<string, any>;
  rankModalDom: HTMLDivElement | HTMLElement | null | undefined;
  /**目录树收藏节点 */
  collectionData: MenuItemProps[];
  // 右侧 pdf
  openDataSource?: OpenDataSourceDrawer;
  // 右侧 pdf 信息
  dataSourceInfo?: IDataSourceDrawerInfoType;
  /** 超大、特大城市计算指标溯源弹窗 */
  tranceModalInfo: { info: InfoType; visible: boolean };

  /** 目录树点击跳转前的pathname */
  pathFrom?: string;
}

const defaultContext = {
  nextNode: null,
  curNodeBranchId: '',
  curNodeBranchName: '',
  areaTreeLoading: true,
  industryLoading: true,
  curModuleFirstLoading: true,
  cumRightModalVisable: false,
  loading: true,
  cumRightInfo: [],
  jurisdictionCode: '',

  rankModalVisible: false,
  rankModalCurData: {},
  rankModalDom: null,
  econmyAreaTree: [],
  areaDataInfo: {},
  areaTableInfo: {},
  collectionData: [],
  tranceModalInfo: { info: { regionCode: '', cityPop: '', totalValue: '', title: '', year: '' }, visible: false },
  viewTimesOver: false,
  viewPowerTip: '',
  outIn: false,
};

export const { Provider, useDispatch, useSelector } = createMiniStore<Context>(defaultContext);

interface RefContext {
  /** 当前模块最外层容器ref */
  wholeModuleWrapperRef?: HTMLElement | HTMLDivElement | null;
}

export const [useRefCtx, RefProvider, refCtx] = createContext<RefContext>({} as RefContext);

refCtx.displayName = 'refContext';
