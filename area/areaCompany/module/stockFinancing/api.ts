import { request } from '@/app/libs/request';

const addPreFix = (str: string) => '/finchinaAPP/v1/finchina-economy/v1/area' + str;

const GET_STOCK_DISTRIBUTION = addPreFix('/regionalFinancialResourceF9/getListedCompanyDistributionStat');
const GET_STOCK_SCALE = addPreFix('/regionalFinancialResourceF9/getEquityFinancingScaleStat');

/** 接口参数 */
export interface IParamProps {
  from?: string | number;
  size?: number;
}

/** 区域融资-股权融资-上市公司分布 */
export const getStockDistribution = (params: any) => request.get(GET_STOCK_DISTRIBUTION, { params });
/** 区域融资-股权融资-股权融资规模 */
export const getStockScale = (params: any) => request.get(GET_STOCK_SCALE, { params });
