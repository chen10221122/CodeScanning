import { Key } from 'react';

import { cloneDeep } from 'lodash';

import { specialIndicList, ChangeIndicNameMap } from '@/pages/area/areaDebt/components/updateTip/specialConf';

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
  indexName?: string; // 用户自己创建的自定义指标的指标名
  paramMap?: Record<string, any>;
  title?: string;
};

/** 宫格的默认指标 indexId */
export const CardDefaultChoiceIndexIds: string[] = [
  'REGION_10000017', // GDP
  'REGION_10000018', // GDP增速
  'REGION_10000048', // 常住人口
  'REGION_10000083', // 一般公共预算收入
  'REGION_10000202', // 政府性基金收入
  'REGION_10000079', // 财政自给率
  'REGION_10000276', // 地方政府债务余额
  'REGION_10000297', // 城投平台有息债务
  'REGION_10000302', // 债务率(宽口径)
];
/** 列表的默认指标 indexId */
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
  '自定义指标',
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
  'REGION_10000328',
  'REGION_10000581',
  'REGION_10000582',
  'REGION_10000583',
  'REGION_10000584',
  'REGION_10000585',
  'REGION_10000586',
  'REGION_10000587',
  'REGION_10000588',
  'REGION_10000589',
  'REGION_10000590',
  'REGION_10000591',
  'REGION_10000592',
  'REGION_10000593',
  'REGION_10000594',
  'REGION_10000595',
  'REGION_10000596',
  'REGION_10000597',
  'REGION_10000598',
  'REGION_10000599',
  'REGION_10000600',
  'REGION_10000601',
  'REGION_10000602',
  'REGION_10000603',
  'REGION_10000604',
  'REGION_10000605',
  'REGION_10000606',
  'REGION_10000607',
  'REGION_10000608',
  'REGION_10000609',
  'REGION_10000610',
  'REGION_10000611',
  'REGION_10000612',
  'REGION_10000613',
  'REGION_10000614',
  'REGION_10000615',
  'REGION_10000616',
  'REGION_10000617',
  'REGION_10000618',
  'REGION_10000619',
  'REGION_10000620',
  'REGION_10000621',
  'REGION_10000622',
  'REGION_10000623',
  'REGION_10000624',
  'REGION_10000625',
  'REGION_10000626',
  'REGION_10000627',
  'REGION_10000628',
  'REGION_10000629',
];

/**
 * 不允许用户修改的指标参数名称
 * 列表参数详情 tip 浮窗中要过滤的指标参数名称
 */
export const ignoreParamName = [
  '发布年份',
  '年份',
  '截止年份',
  '发行日期',
  '偿还日期',
  '截止日期',
  '日期',
  '榜单日期',
  '频度',
];
export const ignoreParamKey = ['auditYear', 'date'];

/** 默认指标中 不在指标树里的指标 的name映射 */
export const indicNameMap = new Map([
  ['常住人口城镇化率', '常住人口:城镇化率'],
  ['居民人均可支配收入增速', '居民人均可支配收入增速'],
  ['城镇居民人均可支配收入增速', '城镇居民人均可支配收入增速'],
  ['农村居民人均可支配收入增速', '农村居民人均可支配收入增速'],
  ['工业增加值增速', '工业增加值增速'],
  ['进出口总额增速', '进出口总额增速'],
  ['城镇新增就业', '城镇新增就业人员'],
  ['城镇调查失业率', '城镇登记失业率'],
]);

export const Suffix = '(预警通口径)';

/** 全部的计算指标 */
export const AreaF9SpecialIndicList = [...specialIndicList, ...specialIndicList.map((item) => item + Suffix)];

const list = Array.from(ChangeIndicNameMap.entries());
/** 计算指标中，传参和显示不一样的指标集合 */
export const AreaF9ChangeIndicNameMap = new Map([
  ...cloneDeep(list),
  ...cloneDeep(list).reduce((res, cur) => {
    res.push([cur[0] + Suffix, cur[1]]);
    return res;
  }, [] as [string, string][]),
]);

/** 图表类型 */
export const ChartType: Record<string, any> = {
  '1': 'line',
  '2': 'bar',
};

/** 恢复默认按钮模式 */
export enum ResetBtnType {
  NONE = 'none', // 无恢复默认功能
  CARD = 'card', // 仅宫格
  LIST = 'list', // 仅列表
  CAL = 'card-list', // 宫格和列表均恢复默认
}
