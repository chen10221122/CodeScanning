import { request } from '@/app/libs/request';
import {
  GET_FINANCING_LEASE_STATISTIC_ANALYSIS_TAB,
  GET_FINANCING_LEASE_STATISTIC_ANALYSIS_SCREEN,
  GET_FINANCING_LEASE_STATISTIC_ANALYSIS_DETAIL,
} from '@/configs/idMap';

const toJson = (params: any) => JSON.stringify(params);

// 获取租赁融资-统计分析-各tab筛选接口数据
export const getCensusAnalyseScreenData = (params: Record<string, any>) => {
  return request.get(GET_FINANCING_LEASE_STATISTIC_ANALYSIS_SCREEN, { params });
};

// 获取租赁融资-统计分析-各tab筛选表格数据
export const getCensusAnalyseTabData = (params: Record<string, any>) => {
  return request.post(GET_FINANCING_LEASE_STATISTIC_ANALYSIS_TAB, {
    data: toJson(params),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

// 获取租赁融资-统计分析-各tab筛选表格数据
export const getCensusAnalyseDetailData = (params: Record<string, any>) => {
  return request.post(GET_FINANCING_LEASE_STATISTIC_ANALYSIS_DETAIL, {
    data: toJson(params),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 将所有对象中的键值置空 */
export const clearValue = (obj: Record<string, any>, excludedArray?: string[]) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == 'object') {
      clearValue(obj[key], excludedArray);
    } else {
      if (!excludedArray?.includes(key)) {
        obj[key] = '';
      }
    }
  });
};
