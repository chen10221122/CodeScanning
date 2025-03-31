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
  name: string;
  areaLevel: number;
  value: string;
  children?: AreaItem[];
  under?: AreaItem[];
}
export interface AreaFilter {
  provinceCode: string;
  cityCode: string;
  countyCode: string;
}

interface CommonState {
  dateFilter: { dealDate?: string; contractSignDate?: string; transferDate?: string };
  otherFilter: {
    landUsageFirstType?: string;
    landUsageSecondType?: string;
    supplyMode?: string;
    statisticsScope?: string;
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
  hasPay?: boolean;
  topEmpty: boolean;
  screenKey: string;
  /** 重置地区筛选标志 */
  resetArea?: string;
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
} as CommonState);
