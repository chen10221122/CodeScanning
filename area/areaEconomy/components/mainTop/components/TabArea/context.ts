import { Key } from 'react';

import createContext from '@/utils/createContext';

export type regionLevelType = '0' | '1' | '2' | '3';
export type breadcrumbInfoType = { code: string; name: string; childrenCode?: string }[];
export type allCodeType = { provinceCityCode: string; countiesCode: string; allCode: string };

interface CommonState {
  /** 当前地区代码 */
  regionCode: string;
  /** 当前地区名称 */
  regionName: string;
  /** 当前地区分类 */
  regionType: RegionType;
  /** 当前地区的第一个子级code拼接起来的字符串 */
  childrenRegionCode: string;
  /** 当前选中地区的所有下属辖区code，provinceCityCode：省级和市级code，countiesCode区县级code, allCode:包含当前层级及以下所有code(用于区域舆情接口传参) */
  allSelectCode: allCodeType;
  /** 当前地区的兄弟地区，如当前为合肥市时，brotherRegionCode就是安徽省下所有的地级市code。全国时为空字符串 */
  brotherRegionCode: string;
  /** 当前的年份 */
  selectYear: string;
  /** 中国地图和散点图的最新年份 */
  mapLastYear: string;
  /** 所选地区层级 */
  regionLevel: regionLevelType;
  /** 主页面dom */
  container: HTMLDivElement | null;
  /** 面包屑的信息 */
  breadcrumbInfo: breadcrumbInfoType;
  /** 主要指标最新年份，由接口获取 */
  lastYear: string;
  /** 主页面加载状态，首次进入和头部筛选变更时为true，中国地图和其右侧模块加载完成后为false */
  mainLoading: boolean;
  /** 主页面加载是否失败 */
  mainError: boolean;
  /** 地区树信息 */
  regionTreeData: any;
  /** 当前展示的外层tab，用于切换tab时echarts及时resize */
  activeTab: string;
  /** 当前展示的内层tab，用于切换tab时echarts及时resize */
  activeinnerTab: (Key | undefined)[];
  /** tab目录是否展开 */
  tabMenuVisible: boolean;
  /** 已查看次数 */
  requestNum?: string;
  /** 是否显示权限弹窗 */
  showLimitModal?: boolean;
}

/** 当前选中地区分类枚举 */
export enum RegionType {
  /** 全国 */
  WholeNation,
  /** 除直辖市的省级，直辖市也算省级的，如果要单独判断是否是省级可以用(regionLevel === '1'),或者用(regionType === Province || regionType === DirectlyCity)   */
  Province,
  /** 直辖市（北京-110000、上海-310000、重庆-500000、天津-120000） */
  DirectlyCity,
  /** 计划单列市（大连-210200、青岛-370200、宁波-330200、厦门-350200、深圳-440300） */
  SeparateCity,
  /** 除计划单列市外的普通地级市，如果要单独判断是否是市级，可用 (regionType === SeparateCity || regionType === City) */
  City,
  /** 区县 */
  County,
}

/** 全国的地区code */
export const WHOLE_NATION_CODE = '100000';

const defaultContext: CommonState = {
  regionCode: WHOLE_NATION_CODE, //默认全国
  regionName: '全国',
  regionType: RegionType.WholeNation,
  //默认所有省和直辖市
  childrenRegionCode:
    '110000,120000,130000,140000,150000,210000,220000,230000,310000,320000,330000,340000,350000,360000,370000,410000,420000,430000,440000,450000,460000,500000,510000,520000,530000,540000,610000,620000,630000,640000,650000',
  allSelectCode: { provinceCityCode: '', countiesCode: '', allCode: '' },
  brotherRegionCode: '',
  selectYear: '',
  mapLastYear: '',
  regionLevel: '0',
  container: null,
  breadcrumbInfo: [{ code: WHOLE_NATION_CODE, name: '全国' }],
  lastYear: '',
  mainLoading: true,
  mainError: false,
  regionTreeData: [],
  activeTab: '1',
  activeinnerTab: [],
  tabMenuVisible: false,
  showLimitModal: false,
};

export const [useCtx, Provider] = createContext<CommonState>(defaultContext);
