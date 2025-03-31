import { Key } from 'react';

export enum ModalType {
  CARD, // 自定义指标卡
  LIST, // 指标列表
}

/** 指标节点的配置 */
export interface SelectItem {
  /** 选项的显示名称 */
  title: string;
  /** 选项的value */
  value?: string;
  /** 树节点的唯一标识，传入的话用传入的，没传则用value，,value也没传就用title，请确保根据该规则取的key唯一 */
  key?: Key;
  indexId?: string;
  /** 默认选中配置 */
  active?: boolean;
  /** 关联选中key,可关联多个，点击该项时也会将associatedKey对应的指标们选中或取消选中 */
  associatedKey?: Key[];
  /**
   * 忽略指标，通常与associatedKey配合使用，该项配置为true时，默认选中的active属性会失效，该指标不管选中与否都不会已选列表展示，且不会在onChange事件中返回，
   * 搜索中也不可搜索到， 在树中不可点击选中取消选中（但可被关联选中,也可关联选中其他指标!）
   */
  ignoreIndicator?: boolean;
  /** 子级数据 */
  children?: SelectItem[];
  hasVipIcon?: boolean;
  /** 父级数据 */
  parent?: Key[];
  parentKey?: Key[];
  /** 全选节点的数据 */
  brotherNodes?: SelectItem[];
  isSelectAll?: boolean;
  /** 指标参数是否可编辑 true:可编辑 */
  editable?: boolean;
  defaultParamMap?: IParam;

  ename?: any;
  flag?: number;
  createTime?: string;
  headName?: string;
  /** 描述 */
  indexNote?: string;
  updateTime?: string;
  /** 接口控制排序的枚举内容 */
  sortList?: any[];
  resultType?: number;
  /** 是否有参数模板配置 */
  needConfig?: boolean;
  pkey?: number;
  sort?: number;
  desc?: string;
  /** 单位信息，在resultType为5时，会返回此单位，用于前端拼接显示 */
  unit?: string;
  /** 是否可排序，0不可排，1可以，2先升后降，3先降后升 */
  canSort?: 0 | 1 | 2 | 3;
  /** 是否可点击查看详情,0不可以，1可以 */
  canViewDetails?: 0 | 1;
  /** 是否需要VIP,0不需要，1需要 */
  needPrivilege?: 0 | 1;
  /** 是否是VIP节点,页面通过树生成 */
  isVip?: boolean;
  extraProperties?: Record<string, any>;

  /** 你可以在每一个选项节点中自定义任意属性 */
  [p: string]: any;
}

export type IParam = {
  indexId: string;
  paramMap?: Record<string, any>;
  title?: string;
};

export const DefaultChoiceIndexIds: string[] = [
  '地区生产总值',
  '地区生产总值增速:同比',
  '人均地区生产总值',
  '人口1',
  '城镇居民人均可支配收入',
  '一般公共预算收入',
  '税收收入',
  '政府性基金收入',
  '地方政府债务余额',
  '债务率2',
];

// 宫格和列表的默认指标indexId
export const CardDefaultChoiceIndexIds: string[] = [
  'REGION_10000017',
  'REGION_10000018',
  'REGION_10000048',
  'REGION_10000083',
  'REGION_10000276',
  'REGION_10000409',
  'REGION_10000297',
];
export const ListDefaultChoiceIndexIds: string[] = [
  'REGION_10000017',
  'REGION_10000018',
  'REGION_10000019',
  'REGION_10000020',
  'REGION_10000021',
  'REGION_10000022',
  'REGION_10000047',
  'REGION_10000056',
  'REGION_10000057',
  'REGION_10000059',
  'REGION_10000060',
  'REGION_10000070',
  'REGION_10000061',
  'REGION_10000064',
  'REGION_10000065',
  'REGION_10000054',
  'REGION_10000074',
  'REGION_10000083',
  'REGION_10000084',
  'REGION_10000086',
  'REGION_10000093',
  'REGION_10000094',
  'REGION_10000106',
  'REGION_10000202',
  'REGION_10000204',
  'REGION_10000216',
  'REGION_10000514',
  'REGION_10000257',
  'REGION_10000276',
  'REGION_10000277',
  'REGION_10000278',
  'REGION_10000279',
  'REGION_10000297',
  'REGION_10000079',
  'REGION_10000299',
  'REGION_10000300',
  'REGION_10000301',
  'REGION_10000302',
];

/** 忽略参数编辑的指标的一二级指标分类，对应处理后的指标树中的parent中保存的内容 */
export const ignoreConfigTitles = [
  'GDP',
  '人口与收入',
  '工业、投资和贸易',
  '批发和零售业',
  '金融业',
  '房地产',
  '价格指数',
  '城市建设',
  '财政与债务',
  '地区社会融资规模', // 融资情况下的二级分类
];
/** 常用指标下忽略参数编辑的指标 indexId，原本 needConfig 为 false 的指标不包含在这里，比如区域属性下的指标 */
export const ignoreConfigIndexIds = [
  'REGION_10000017',
  'REGION_10000018',
  'REGION_10000019',
  'REGION_10000020',
  'REGION_10000021',
  'REGION_10000022',
  'REGION_10000047',
  'REGION_10000048',
  'REGION_10000049',
  'REGION_10000050',
  'REGION_10000051',
  'REGION_10000052',
  'REGION_10000053',
  'REGION_10000054',
  'REGION_10000056',
  'REGION_10000057',
  'REGION_10000059',
  'REGION_10000060',
  'REGION_10000061',
  'REGION_10000062',
  'REGION_10000063',
  'REGION_10000064',
  'REGION_10000066',
  'REGION_10000067',
  'REGION_10000070',
  'REGION_10000074',
  'REGION_10000079',
  'REGION_10000082',
  'REGION_10000083',
  'REGION_10000084',
  'REGION_10000086',
  'REGION_10000087',
  'REGION_10000088',
  'REGION_10000089',
  'REGION_10000093',
  'REGION_10000094',
  'REGION_10000104',
  'REGION_10000105',
  'REGION_10000202',
  'REGION_10000203',
  'REGION_10000204',
  'REGION_10000205',
  'REGION_10000216',
  'REGION_10000217',
  'REGION_10000253',
  'REGION_10000257',
  'REGION_10000276',
  'REGION_10000277',
  'REGION_10000278',
  'REGION_10000279',
  'REGION_10000280',
  'REGION_10000281',
  'REGION_10000297',
  'REGION_10000298',
  'REGION_10000299',
  'REGION_10000300',
  'REGION_10000301',
  'REGION_10000302',
  'REGION_10000459',
  'REGION_10000460',
  'REGION_10000461',
];

// 列表参数详情 tip 浮窗中要过滤的指标参数名称
export const ignoreParamName = ['发布年份', '年份', '截止年份', '发行日期', '偿还日期', '截止日期', '日期', '榜单日期'];
