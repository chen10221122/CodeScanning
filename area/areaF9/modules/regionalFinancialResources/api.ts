import { request } from '@/app/libs/request';
import { CommonResponse } from '@/utils/utility-types';

const api_prefix = '/finchinaAPP/v1';

const GET_FILTER_YEAR = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResource/getEndDateFilters`;
const GET_SCALE_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getDepositAndLoanScaleList`;
const GET_DISTRIBUTE_BY_TYPE_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionStat`;
const GET_DISTRIBUTE_MODAL = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionInfo`;
const GET_DISTRIBUTE_BY_BANK_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionByBankList`;
const GET_DISTRIBUTE_BY_BANK_FILTER = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionFilterStat`;
const GET_NONEBANKE_FILTER = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getNonBankInstitutionStat`;
const GET_NONEBABKE_LIST = `${api_prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getNonBankInstitutionList`;

// 存贷款规模 获取筛选年份
export const getFilterYear = (regionLevel: string) => {
  return request.get<CommonResponse<Record<string, string>[]>>(GET_FILTER_YEAR, {
    params: {
      regionLevel: regionLevel,
    },
  });
};

// 区域存贷款规模列表
export const getScaleList = (params: any) => {
  return request.get<CommonResponse<{ data: any[]; total: number }>>(GET_SCALE_LIST, {
    params,
  });
};

// 辖区银行分布(按类型)列表
export const getDistributionByTypeList = (params: any) => {
  return request.get<CommonResponse<{ data: any[]; total: number }>>(GET_DISTRIBUTE_BY_TYPE_LIST, {
    params,
  });
};

// 辖区/区域 银行分布 明细列表弹窗（按类型/按银行 共用此接口）
export const getDistributionModal = (params: any) => {
  return request.get<
    CommonResponse<{
      data: Record<string, string>[];
      total: number;
    }>
  >(GET_DISTRIBUTE_MODAL, {
    params,
  });
};

//区域银行分布 列表接口
export const getDistributionByBankList = (params: any) => {
  return request.get<CommonResponse<{ data: any[]; total: number }>>(GET_DISTRIBUTE_BY_BANK_LIST, {
    params,
  });
};

//辖区银行分布（按银行） 筛选项统计接口
export const getDistributionByBankFilter = (params: any) => {
  return request.get<CommonResponse<Record<string, any[]>>>(GET_DISTRIBUTE_BY_BANK_FILTER, {
    params,
  });
};

export const getNoneBankFilter = (params: any) => {
  return request.get<CommonResponse<Record<string, any[]>>>(GET_NONEBANKE_FILTER, {
    params,
  });
};

export const getNoneBankList = (params: any) => {
  return request.get<CommonResponse<{ data: any[]; total: number }>>(GET_NONEBABKE_LIST, {
    params,
  });
};
