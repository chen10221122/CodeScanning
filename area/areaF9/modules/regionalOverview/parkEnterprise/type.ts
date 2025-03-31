import type {
  baseScreenParams,
  screenApiResult,
} from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/type';
import type { screenType } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/type';

// 筛选请求参数
export type screenParams = baseScreenParams & {
  areaCode?: string; //地区code
  parkKeywords: string; //搜索关键词
  parkIndustryCode: string; //特色产业
  areaRange: string; //园区面积
};

// 筛选接口返回结果
export type areaScreenApiResult = screenApiResult & {
  industryAgg: screenType[]; //特色产业
  areaRange: screenType[]; //园区面积
};
