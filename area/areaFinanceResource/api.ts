import { request } from '@/app/libs/request';
import { CommonResponse } from '@/utils/utility-types';

const api_prefix = '/finchinaAPP/v1';

const GET_FILTER_YEAR = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResource/getEndDateFilters`;
const GET_SCALE_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResource/getRegionalDepositAndLoanScaleList`;
const GET_SCALE_MODAL_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getDepositAndLoanScaleList`;
const GET_BANK_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResource/getAreaBankDistributionByAreaStat`;
const GET_BANK_MODAL_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionInfo`;

// 区域存贷款规模 获取筛选年份
export const getFilterYear = (regionLevel: string) => {
  return request.get<CommonResponse<Record<string, string>[]>>(GET_FILTER_YEAR, {
    params: {
      regionLevel: regionLevel,
    },
  });
};

// 区域存贷款规模列表
export const getScaleList = (params: any) => {
  return request.post<CommonResponse<Record<string, string>[]>>(GET_SCALE_LIST, {
    data: params,
    requestType: 'json',
  });
};

// 区域存贷款规模弹窗列表
export const getScaleModalList = (params: any) => {
  return request.get<CommonResponse<Record<string, string>[]>>(GET_SCALE_MODAL_LIST, {
    params,
  });
};

export const getBankList = (params: any) => {
  return request.post<CommonResponse<Record<string, string>[]>>(GET_BANK_LIST, {
    data: params,
    requestType: 'json',
  });
};

export const getBankModalList = (params: any) => {
  return request.get<CommonResponse<Record<string, string>[]>>(GET_BANK_MODAL_LIST, {
    params,
  });
};
