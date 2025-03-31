import { request } from '@/app/libs/request';

export const filterParams = (params: any) => {
  const draft: Record<string, any> = {};
  // 删除无用属性
  Object.entries(params)?.forEach(([key, value]) => {
    // 值为0不过滤
    if (value || value === 0) draft[key] = value;
  });
  return draft;
};

// 属地银行主要财务指标 列表入参
export type LocalBankMainFIListParams = {
  // 银行类型(银行类型，1-政策性银行，2-国有银行，3-股份制银行，4-城商银行，5-农商行，6-农信社，7-村镇银行，8-民营银行，9-其他银行),请求时传数字枚举值
  bankType?: string;
  // 市级代码
  cityCode?: string;
  // 区县代码
  countyCode?: string;
  // 导出标识 true/false
  exportFlag?: boolean;
  // 隐藏空行,默认为false
  hiddenBlankRow?: boolean;
  // 隐藏排名,默认为false
  hiddenRanking?: boolean;
  // 需要查询的指标名集合 (指标名中间用逗号间隔)
  indicNames?: string;
  // 每页大小,默认50
  pageSize?: number;
  // 省份代码
  provinceCode?: string;
  // 年报类型(1-一季报 2-中报 3-三季报 4-年报),请求时传数字枚举值
  reportDateType?: string;
  // 起始值,默认0
  skip: number;
  // 排序 （排序规则，如a:desc，a为字段名）
  sort?: string;
  // 搜索
  text?: string;
  // 年度范围
  year: string;
};

/**
 * @description 属地银行主要财务指标 列表接口
 */
export const getLocalBankMainFinancialIndicList = (params: LocalBankMainFIListParams) =>
  request.post(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getLocalBankMainFinancialIndicList',
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      data: JSON.stringify(params),
      // data: params
    },
  );

// 属地银行主要财务指标 筛选入参
export type LocalBankMainFIStat = {
  // 银行类型(银行类型，1-政策性银行，2-国有银行，3-股份制银行，4-城商银行，5-农商行，6-农信社，7-村镇银行，8-民营银行，9-其他银行),请求时传数字枚举值
  bankType?: string;
  // 市级代码
  cityCode?: string;
  // 区县代码
  countyCode?: string;
  // 省份代码
  provinceCode?: string;
  // 年报类型(1-一季报 2-中报 3-三季报 4-年报),请求时传数字枚举值
  reportDateType?: string;
  // 搜索
  text?: string;
  // 年度范围
  year: string;
};

export const getLocalBankMainFinancialIndicStat = (params: LocalBankMainFIStat) =>
  request.get(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getLocalBankMainFinancialIndicStat',
    {
      params: filterParams(params),
    },
  );

type CreditEnterpriseCommon = {
  // 银行类型(银行类型，1-政策性银行，2-国有银行，3-股份制银行，4-城商银行，5-农商行，6-农信社，7-村镇银行，8-民营银行，9-其他银行),请求时传数字枚举值
  bankType?: string;
  //企业类型
  enterpriseType?: string;
  // 市级代码
  cityCode?: string;
  // 区县代码
  countyCode?: string;
  // 省份代码
  provinceCode?: string;
  // 排序字段-中台处理排序时使用
  sortKey?: string;
  // 排序规则-中台处理排序时使用
  sortRule?: string;
  // 搜索
  text?: string;
  // 年度范围
  year: string;
};

// 银行区域授信规模/获授信企业明细/获本行授信企业（发债主体）明细 共用的筛选接口
export interface ICreditEnterpriseStat extends CreditEnterpriseCommon {
  // 企业类型   1-央企、2-省属国企、3-国企、4-民企、5-城投、6-城投子公司、7-央企子公司、20-高新技术企业、21-专精特新“小巨人”企业、22-专精特新中小企业、23-创新型中小企业、24-科技型中小企业、25-国家级企业技术中心、26-省级企业技术中心
  enterpriseType?: string;
  // 页面区分标志 1 获授信企业明细、2 银行区域授信规模、3 获本行授信企业（发债主体）明细
  pageFlag: number;
  // 主体评级   AAA、AA+、AA、AA-、A+、A、其他
  rate?: string;
}

export const getCreditEnterpriseStat = (params: ICreditEnterpriseStat) =>
  request.get('/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditEnterpriseStat', {
    params,
  });

export interface ICreditEnterpriseList extends CreditEnterpriseCommon {
  exportFlag?: boolean;
  pageSize?: number;
  skip?: number;
}

export const getBankRegionalCreditScaleList = (params: ICreditEnterpriseList) =>
  request.get(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getBankRegionalCreditScaleList',
    {
      // params: filterParams(params),
      params,
    },
  );

export interface ICreditDetailEnterpriseList {
  // 市级代码
  cityCode?: string;
  // 区县代码
  countyCode?: string;
  // 省份代码
  provinceCode?: string;
  // 企业类型   1-央企、2-省属国企、3-国企、4-民企、5-城投、6-城投子公司、7-央企子公司、20-高新技术企业、21-专精特新“小巨人”企业、22-专精特新中小企业、23-创新型中小企业、24-科技型中小企业、25-国家级企业技术中心、26-省级企业技术中心
  enterpriseType?: string;
  exportFlag?: boolean;
  pageSize?: number;
  // 主体评级   AAA、AA+、AA、AA-、A+、A、其他
  rate?: string;
  skip?: number;
  // 排序 （排序规则，如a:desc，a为字段名）
  sort?: string;
  // 搜索
  text?: string;
  // 报告期
  year: string;
}

// 获授信企业明细 列表接口
export const getCreditEnterpriseList = (params: ICreditDetailEnterpriseList) =>
  request.get('/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditEnterpriseList', {
    params,
  });

export interface ICreditInstitutionDetail {
  exportFlag?: boolean;
  itCode2: string;
  pageSize: number;
  skip: number;
  // 排序 （排序规则，如a:desc，a为字段名）
  sort?: string;
  // 搜索
  text?: string;
  year: string;
}

// 获授信企业明细 授信机构明细
export const getCreditInstitutionDetail = (params: ICreditInstitutionDetail) =>
  request.get(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditInstitutionDetail',
    {
      params,
    },
  );

// 获本行授信企业(发债主体)明细 列表接口
export type IDebtIssuerDetail = {
  // 市级代码
  cityCode?: string;
  // 区县代码
  countyCode?: string;
  // 省份代码
  provinceCode?: string;
  // 授信额度  1-10亿以下、2-10-100亿、3-100-1000亿、4-1000亿以上
  creditLimit?: string;
  exportFlag?: boolean;
  itCode2: string;
  pageSize?: number;
  rate?: string;
  sortRule?: string;
  sortKey?: string;
  year: string;
  // 搜索
  text?: string;
};

export const getDebtIssuerDetail = (params: IDebtIssuerDetail) =>
  request.get('/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getDebtIssuerDetail', {
    params,
  });

// 银行区域授信规模 授信规模历年趋势接口
export type ICreditScaleHistoricalTrend = {
  cityCode?: string;
  countyCode?: string;
  provinceCode?: string;
  itCode2: string;
  pageSize?: number;
  skip: number;
};

export const getCreditScaleHistoricalTrend = (params: ICreditScaleHistoricalTrend) =>
  request.get(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getCreditScaleHistoricalTrend',
    {
      params,
    },
  );
