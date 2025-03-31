import type { RequestParams, screenType } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/type';

// 筛选请求参数
export interface ScreenParams extends RequestParams {
  from: number; //起始位置
  page: number; //当前页
  size: number; //分页数量
  devZoneCode?: string; //园区Code
  enterpriseNature: string; //企业类型
  industryCode1: string; //一级行业
  industryCode2: string; //二级行业
  industryCode3: string; //三级行业
  industryCode4: string; //四级行业
  regCapital: string; //注册资本
  regStatus: string; //企业状态
  havePhone: string; //电话
  likeStr: string; //搜索词
  parkFlag: string; //固定参数
}

export type baseScreenParams = Omit<ScreenParams, 'devZoneCode' | 'likeStr'>;

// 筛选接口返回结果
export type screenApiResult = {
  enterpriseNature: screenType[]; //企业类型
  industryCodeAgg: screenType[]; //行业
  capitalMapAgg: screenType[]; //注册资本
  enterpriseStatus: screenType[]; //企业状态
  havePhone: screenType[]; //电话
};

//列表
export interface TableData {
  affiliationArea: string; //所属园区名
  affiliationAreaCode: string; //所属园区code
  businessRange: string; //经营范围
  city: string; //市
  companyName: string; //园区企业名称
  county: string; //区
  email: string; //企业邮箱
  enterpriseNature: string; //企业类型
  establishDate: string; //成立日期
  industryLevel1: string; //国标行业一级
  industryLevel2: string;
  industryLevel3: string;
  industryLevel4: string;
  itCode2: string; //园区企业code
  legalRepresent: string; //法定代表人
  levelStr: string; //园区级别
  phoneNumber: string; //联系电话
  province: string; //省
  regAddress: string; //注册地址
  regCapital: string; //注册资本
  regCapitalUnit: string; //注册资本币种
  regStatus: string; //企业状态
  tags: { name: string; color: string; backGroundColor: string }[]; //标签
}

// 列表返回结果
export interface ListResult {
  infoBeans: TableData[];
  total: number;
}
