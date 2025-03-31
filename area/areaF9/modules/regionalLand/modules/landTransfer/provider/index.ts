import createContext from '@/utils/createContext';
import { shortId } from '@/utils/share';

export const LAND_TOPIC_OVERVIEW_MAIN_EXPORT = 'land-topic-overview-main-export';
export const WHOLE_COUNTRY_CODE = '100000';
export const WHOLE_COUNTRY_NAME = '全国';

export const WHOLE_COUNTRY_OPTION = {
  name: WHOLE_COUNTRY_NAME,
  value: WHOLE_COUNTRY_CODE,
  code: WHOLE_COUNTRY_CODE,
  province: true,
  areaLevel: 1,
};

export enum AreaType {
  EMPTY = 'empty',
  WHOLE = '0',
  PROVINCE = '1',
  CITY = '2',
  COUNTY = '3',
  CUSTOM = '4',
}

export interface AreaItem {
  // 地区名称
  name: string;
  // 地区等级
  areaLevel: number;
  // 地区编码
  value: string;
  children?: AreaItem[];
  under?: AreaItem[];
}
export interface AreaFilter {
  // 省级地区代码
  provinceCode: string;
  // 市级地区代码
  cityCode: string;
  // 区县级地区代码
  countyCode: string;
}

interface CommonState {
  // 口径日期类型
  dateFilter: { dealDate?: string; contractSignDate?: string; transferDate?: string };
  otherFilter: {
    // 土地用途一级筛选
    landUsageFirstType?: string;
    // 土地用途二级筛选
    landUsageSecondType?: string;
    // 供应方式
    supplyMode?: string;
    // 是否含下属辖区
    statisticsScope?: string;
    // 时间筛选:年月季、半年
    timeStatisticsType?: string;
  };
  firstLoading?: boolean;
  /** 行选中地区 */
  checkRowArea: { areaName?: string; areaCode?: string; areaLevel?: string };
  /** 地区筛选配置项，从接口拿的 */
  areaLists: {
    areaProvince: AreaItem[];
    areaCity: AreaItem[];
    areaCounty: AreaItem[];
    provinceCodes: string;
    cityCodes: string;
    countyCodes: string;
  };
  areaFilter: Partial<AreaFilter>;
  /** 增量请求的地区信息 */
  incrementAreaCodes: Partial<AreaFilter>;
  areaType: AreaType;
  // 权限，用于遮挡
  hasPay?: boolean;
  topEmpty: boolean;
  // 筛选项重置用
  screenKey: string;
  /** 重置地区筛选标志 */
  resetArea?: string;
  // 明细弹窗导出参数
  conditionDetails: any;
  // 图表类型,用于按土地用途页面带筛选项的图
  chartType: any;
}

const { name, code, areaLevel } = WHOLE_COUNTRY_OPTION;

export const DEFAULT_CHECK_ROW_AREA = { areaName: name, areaCode: code, areaLevel: `${areaLevel}` };

export const [useCtx, Provider] = createContext<CommonState>({
  currentPage: 1,
  dateFilter: {},
  otherFilter: {},
  firstLoading: true,
  checkRowArea: { areaName: WHOLE_COUNTRY_NAME, areaCode: WHOLE_COUNTRY_CODE, areaLevel: '1' },
  areaLists: { areaProvince: [], areaCity: [], areaCounty: [], provinceCodes: '', cityCodes: '', countyCodes: '' },
  areaFilter: {},
  areaType: AreaType.WHOLE,
  incrementAreaCodes: {},
  hasPay: false,
  topEmpty: false,
  screenKey: shortId(),
  resetArea: shortId(),
  conditionDetails: {},
  chartType: [],
} as CommonState);
