import { Service } from 'ahooks/lib/useRequest/src/types';

import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

export enum TemplateKeyEnums {
  from = 'from',
  sort = 'sort',
  sortKey = 'sortKey',
  sortType = 'sortType',
  regionCode = 'regionCode',
  areaCode = 'areaCode',
  // 对筛选组件暴露出来的key进行转化的话，可以在这里加
  // filterKeyLists中要有对应的key，然后specialParamKeyMap添加入参=>筛选暴露出的key的映射
  keyWord = 'keyWord',
  likeStr = 'likeStr',
  itName = 'itName',
  cityCode = 'cityCode',
  countryCode = 'countryCode',
  provinceCode = 'provinceCode',
  establishmentTime = 'establishmentTime',
  areaRegionCodeLessee = 'areaRegionCodeLessee',
  areaCityCodeLessee = 'areaCityCodeLessee',
  areaCountyCodeLessee = 'areaCountyCodeLessee',
}

export const defaultSpecialParamKeyMap = new Map([
  [TemplateKeyEnums.from, 'from'],
  [TemplateKeyEnums.sort, 'sort'],
  [TemplateKeyEnums.regionCode, 'regionCode'],
]);
export const defaultParamsNeedLists = ['regionCode'];

export const CONTIAINERID = 'area-company-index-container';
export const SUBCONTIAINERID = 'area-company-container';
export const SPLITSORTREG = new RegExp(/[:,]/);
export const sortKeyList = ['sortKey', 'key', 'dataIndex'];

export interface FilterHookRet {
  /** 筛选组件 */
  filter: JSX.Element;
  /** 筛选请求的第一次loading */
  filterFistLoading: boolean;
  /** 筛选处理后的结果 */
  filterResult: Record<string, any>;
  /** 清空筛选 */
  onClearFilter: () => void;
}

export interface TemplateProps {
  /** 标题，单模块时仅用到定位id中，所以注意不要有特殊字符如/等，最好用英文 */
  title: string;
  /** 筛选组件需要的pageid */
  pageType: REGIONAL_PAGE;
  /** 列表请求中的筛选key */
  filterKeyLists: string[];
  /** 列表请求api */
  listApiFunction: Service<Promise<Record<string, any>>, any[]>;
  /** 默认列表请求参数 */
  defaultCondition: Record<string, any>;
  /** 导出的moduleType */
  moduleType: string;
  /** 获取表格columns的hook */
  useColumnsHook: (props: any) => Record<string, any>[];
  /** 请求成功的处理，默认是将res.data.data作为表格数据 */
  handleSuccess?: (res?: Record<string, any>) => {
    /** 处理后的表格数据 */
    data: Record<string, any>[];
    /** 总条数 */
    totalCount: number;
  };
  /** loading结束之后执行 */
  handleLoaded?: (title: string) => void;
  /** 请求失败的处理 */
  handleError?: Function;
  /** 是否是子模块 */
  isSubModuleItem?: boolean;
  /** 子模块的icon路径 */
  iconPath?: string;
  /** 一些特殊值的映射 */
  specialParamKeyMap?: Map<TemplateKeyEnums, string>;
  /** content元素的id */
  id?: string;
  /** 请求必须要有的参数key 默认只有regionCode */
  paramsNeedLists?: string[];
  /** 改变则刷新页面 */
  refreshPageKey?: string;
  /** 样式覆盖 */
  specialStyleStr?: string;
  /** 是否有默认筛选 多模块时传，判断页面第一次无数据使用 */
  hasDefaultFilter?: boolean;
  /** 是否需要默认表格列样式；默认为true，外部无法复写的遗留样式，通过此字段控制不使用 */
  needColumnCustomStyle?: boolean;
  /** 自定义的筛选 覆盖useTemplateFilter */
  useFilterHook?: (props: Record<string, any>) => FilterHookRet;
  /** 参数控制module_type */
  getModuleTypeByCondition?: (condition: Record<string, any>) => string;
}
