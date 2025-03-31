import { request } from '@/app/libs/request';

// 证券公司、基金公司、期货公司、保险公司 筛选项接口筛选入参
export type IBondAndInsureStat = {
  // 综合地区代码
  regionCode?: string;
  // 管理基金规模   1-100亿以下、2-100-500亿、3-500-1000亿、4-1000-5000亿、5-5000亿及以上
  fundManageScaleStat?: string;
  // 保险公司类型   1-财险、2-寿险、3-综合保险、4-再保险、5-资产管理、6-互助社、7-其他
  insureCompanyType?: string;
  // 上市发债信息   1-主板、2-创业板、3-科创板、4-北交所、5-新三板、6-港股、7-发债、8-其他
  listAndBondIssueInfo?: string;
  // 净利润   1-1亿以下、2-1亿-5亿、3-5-10亿、4-10亿及以上
  netProfit?: string;
  // 营业收入   1-1亿以下、2-1亿-10亿、3-10-100亿、4-100亿及以上
  operatingRevenue?: string;
  // 页面区分标志 1 证券公司、2 基金公司、3 期货公司、4 保险公司
  pageFlag: 1 | 2 | 3 | 4;
  // 评级   A-A类、B-B类、C-C类、D-D类、E-E类、其他-其他
  rate?: string;
  // 注册资本   1-1亿以下、2-1亿-5亿、3-5-10亿、4-10亿及以上
  registerCapital?: string;
  // 股东类型   1-银行系、2-券商系、3-信托系、4-保险系、5-私募系、6-期货系、7-地产系、8-互联网金融系、9-个人系、10-其他
  stockholder?: string;
  // 搜索
  text?: string;
  // 总资产   1-1亿以下、2-1亿-10亿、3-10-100亿、4-100亿及以上
  totalAsset?: string;
};

export const getBondAndInsureStat = (params: IBondAndInsureStat) =>
  request.get('/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getBondAndInsureStat', {
    params,
  });

// 证券公司、基金公司、期货公司、保险公司 列表接口
export interface IBondAndInsureFinancialResourceList extends IBondAndInsureStat {
  exportFlag?: boolean;
  skip: number;
  pageSize?: number;
}

// 获授信企业明细 列表接口
export const getBondAndInsureFinancialResourceList = (params: IBondAndInsureFinancialResourceList) =>
  request.get(
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/regionalFinancialResourceF9/getBondAndInsureFinancialResourceList',
    {
      params,
    },
  );
