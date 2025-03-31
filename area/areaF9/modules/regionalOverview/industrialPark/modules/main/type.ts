import type { RequestParams, screenType } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/type';

// 筛选请求参数
export interface ScreenParams extends RequestParams {
  skip: number; //起始位置
  page: number; //当前页
  size: number; //分页数量
  areaCode?: string; //地区代码
  industryCode: string; //特色产业
  areaRange: string; //园区面积
  keywords: string; //搜索词
}

// 筛选接口返回结果
export type ScreenApiResult = {
  lowerAgg: screenType[]; //下属辖区
  industryAgg: screenType[]; //特色产业
  areaAgg: screenType[]; //园区面积
};

//列表
export interface TableData {
  centerCoordinates: string; //中心点坐标
  city: string; //园区所属市
  closureCoordinates: string; //四周坐标集
  county: string; //园区所属区
  devZoneArea: string; //园区位置
  devZoneCode: string; //园区Code
  devZoneIndustry: string; //园区特色产业
  devZoneLevel: string; //园区级别
  devZoneName: string; //园区名称
  devZoneSquare: string; //园区面积
  province: string; //园区所属省
  settledNum: string; //入驻企业数
  distance?: string; //离中心点距离
}

// 列表返回结果
export interface ListResult {
  data: TableData[];
  total: number;
}
