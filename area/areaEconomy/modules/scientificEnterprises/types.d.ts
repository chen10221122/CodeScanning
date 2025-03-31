interface IAreaTreeItem {
  key?: number;
  value: string;
  name: string;
  shortName?: string;
  children?: IAreaTreeItem[];
  _fullName?: string;
  _index?: number;
}

export interface ITechEnterpriseContext {
  /** 地区树 */
  areaTree: Array<IAreaTreeItem>;
  /** 榜单循环列表 */
  loopList: Array<any>;
  /** 是否撤销 */
  enterpriseStatus: 1 | 2;
  /** 选中节点列表 => [爷爷，爸爸，我] */
  selectedAreaList: Array<IAreaTreeItem>;
  /** 当前激活标签 */
  selectedTarget: ICardInfo | undefined;
  /** 地图数据加载 */
  chartLoading: boolean;
  /** 全局加载 */
  fullLoading: boolean;
  /** 卡片加载/地区切换 */
  areaChangeLoading?: boolean;
  /** 地区或者标签切换后的蒙层加载 */
  areaOrTagChangeMaskLoading: boolean;
  /** 空状态 */
  emptyStatus: boolean;
  /** 卡片区域高度，双滚动条手动计算使用 */
  cardContainerHeight?: number;
}

export interface ICardInfo {
  TagCode2?: string;
  TagCode?: string;
  doc_count?: number;
  title?: string;
  titleLevel?: string;
}

/**
 * @description eCharts图数据类型
 */
export namespace Charts {
  interface Item {
    doc_count: number;
    title: string;
  }

  /**
   * @description 地图数据类型
   *
   */
  export interface AreaChartItem extends Item {
    RegionCode: number;
    fullTitle: string;
    regionCode: string;
  }

  /**
   * @description 玫瑰图数据类型
   */
  export interface RoseChartItem extends Item {
    CR0242_012: string;
  }
}
