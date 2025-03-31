import { mapRequest, request } from '@/app/libs/request';
import { QUERY_GUID_INFO } from '@/configs/idMap';

export interface PlanListRequest {
  regionCode: string;
}

export interface ProductListProp {
  /** 产业详情 */
  industryDetail: string;
  /** 产业类型名称 */
  industryTypeName: string;
  /** 产业类型代码 */
  industryTypecode: string;
  /**溯源代码 */
  guid: string;
}

export interface SourceListProp {
  /** 数据来源 */
  dataSource: string;
  /** 溯源 */
  guidInfo: string;
  /** 发布时间 */
  time: string;
  /** 标题 */
  title: string;
}

export interface PlanListResponse {
  data: {
    /** 产业类型集合 */
    industryProductList: ProductListProp[];
    /** 来源集合 */
    industrySourceList: SourceListProp[];
  };
  returncode: number;
}

export const getPlanList = (data: PlanListRequest) =>
  request.post<PlanListResponse>('/finchinaAPP/v1/finchina-economy/v1/area/industry/plan-list', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getSource = (condition: Record<string, any>) =>
  mapRequest.get(QUERY_GUID_INFO, {
    params: condition,
  });
