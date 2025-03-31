import { request } from '@/app/libs/request';
import { CommonResponse } from '@/utils/utility-types';

export const prefix = '/finchinaAPP/v1';

const GET_YEAR_CONFIG = `/finchinaAPP/regionFinanceBoard/getYearConfig.action`;
const GET_SCALE_LIST = `${prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getDepositAndLoanScaleList`;
const GET_DISTRIBUTE_BY_TYPE_LIST = `/finchinaAPP/regionFinanceBoard/bankDistribute.action`;
const GET_CREDIT_ENTERPRISE_STAT = `${prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditEnterpriseStat`;
const GET_CREDIT_COMPANY_DISTRIBUTE = `/finchinaAPP/regionFinanceBoard/creditCompanyDistribute.action`;
const GET_STOCK_SCALE = `${prefix}/finchina-economy/v1/area/regionalFinancialResourceF9/getEquityFinancingScaleStat`;
const GET_ASHARE_STATISTIC = '/finchinaAPP/regionFinance/aShareStatistic.action';
const GET_PEVC_STATISTIC = '/finchinaAPP/regionFinance/pevcStatistic.action';
const GET_PEVC_TRACK = '/finchinaAPP/regionFinanceBoard/pevcTrack.action';
const GET_PEVC_EVENT_STATISTIC = '/finchinaAPP/regionFinanceBoard/pevcEventStatistic.action';
const GET_DISTRIBUTE_MODAL = `${prefix}/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getAreaBankDistributionInfo`;

/** 债券融资-债券发行 明细数据 */
export const getCompanyScale = (params: { regionCode: string; year: string }) => {
  return request.get(prefix + '/finchinaAPP/regionFinanceBoard/companyScale.action', {
    params,
  });
};

// 获取最新年度接口
export const getYearConfig = (params: any) => {
  return request.get(GET_YEAR_CONFIG, { params });
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

export const getCreditEnterpriseStat = (params: any) =>
  request.get(GET_CREDIT_ENTERPRISE_STAT, {
    params,
  });

// 企业授信分布
export const getCreditCompanyDistribute = (params: any) =>
  request.get<CommonResponse<{ data: any[]; total: number }>>(GET_CREDIT_COMPANY_DISTRIBUTE, {
    params,
  });

/** 区域融资-股权融资-股权融资规模 */
export const getStockScale = (params: any) => request.get(GET_STOCK_SCALE, { params });

export const getAShareStatistic = (params: any) =>
  request.post<CommonResponse<any[]>>(GET_ASHARE_STATISTIC, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: params,
  });

export const getPevcStatistic = (params: any) => request.get(GET_PEVC_STATISTIC, { params });

export const getPevcTrack = (params: any) => request.get(GET_PEVC_TRACK, { params });

export const getPevcEventStatistic = (params: any) => request.get(GET_PEVC_EVENT_STATISTIC, { params });

// 辖区/区域 银行分布 明细列表弹窗（按类型/按银行 共用此接口）
export const getDistributionModal = (params: any) => {
  return request.get(GET_DISTRIBUTE_MODAL, {
    params,
  });
};

// 获授信企业明细 列表接口
export const getCreditEnterpriseList = (params: any) =>
  request.get('/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditEnterpriseList', {
    params,
  });
