import { Menu, MenuAnchor, MenuItemConfig } from '@/pages/detail/components/menuTabs/types';
import createContext from '@/utils/createContext';

interface IAreaTreeItem {
  key?: number;
  value: string;
  name: string;
  shortName?: string;
  children?: IAreaTreeItem[];
  _fullName?: string;
  _index?: number;
}

export type CommonState = {
  areaInfo: any;
  code: string;
  menus: Record<string, MenuItemConfig[]>;
  tabs: Menu[];
  activeBranch: MenuAnchor;
  tabIndex: number;
  padding: number;
  payCheck: () => Boolean;
  lastYear: string;
  /** 头部接口返回的code */
  topCode: string;
  // 省的code，用于判断是不是省
  provinceCode: string;
  areaName: string;
  // 主数据loading
  mainLoading: boolean;
  /** 已查看地区个数 */
  requestNum?: string;
  /** 是否展示权限弹窗 */
  showPowerDialog?: boolean;
  /** 含下属辖区 或 本机 */
  level?: string;
  /** 选中节点列表 => [爷爷，爸爸，我] */
  selectedAreaList: Array<IAreaTreeItem>;
  /** 地区树 */
  areaTree: Array<IAreaTreeItem>;
};

export const [useCtx, Provider] = createContext<CommonState>({ level: '1' } as CommonState);
