import { omit } from 'lodash';

import { request } from '@/app/libs/request';

const addPreFix = (str: string) => '/finchinaAPP/v1/finchina-economy/v1/area/regionalFinancialResourceF9' + str;
const GET_STOCK_A_DISTRIBUTION_DETAIL = addPreFix('/getAListedCompanyDistributionInfo');
const GET_STOCK_A_SHARE_EQUITY_DETAIL = addPreFix('/getAShareEquityFinancingInfo');

const GET_NEW_THIRD_COUNT_DETAIL = addPreFix('/getNewThreeBoardListedCompanyInfo');
const GET_NEW_THIRD_ADD_DETAIL = addPreFix('/getNewThreeBoardEquityFinancingInfo');

const GET_AREA_FINANCING_VC_DETAIL = addPreFix('/getVentureCapitalFinancingInfo');

const GET_AREA_FINANCING_RACE_TREE = addPreFix('/regionFinance/getRaceTree.action');

/** 接口参数 */
export interface IParamProps {
  year?: string; // 年份
  date?: string; // 日期期间，如[20220101,*)
  sort?: string; // 排序字段
  skip?: string | number;
  size?: number;
}
const pageSize = 50;
function joinStrings(str1: string, str2: string) {
  if (str1 && str2) {
    // 检查两个字符串是否都不为空
    return str1 + ',' + str2;
  } else {
    return str1 || str2; // 返回不为空的字符串，如果都为空则返回空字符串
  }
}
export const transformParams = (params: any) => {
  // 行业赛道
  let raceCode = '';

  if (params.industryOne || params.industryTwo) {
    raceCode = joinStrings(params.industryOne, params.industryTwo);
  }
  return { ...omit(params, ['sortKey', 'sortRule']), pageSize, sort: `${params.sortKey}:${params.sortRule}`, raceCode };
};
/** 区域融资-股权融资-A股上市公司分布明细 */
export const getStockADistributionDetail = (params: any) =>
  request.get(GET_STOCK_A_DISTRIBUTION_DETAIL, {
    params,
  });

/** 区域融资-股权融资-新三板挂牌家数明细 */
export const getNewThirdCountDetail = (params: IParamProps) =>
  request.get(GET_NEW_THIRD_COUNT_DETAIL, {
    params,
  });

/** 股权融资-A股IPO融资明细 */
export const getStockAIpoDetail = (params: IParamProps) => request.get(GET_STOCK_A_SHARE_EQUITY_DETAIL, { params });
/** 股权融资-A股再融资明细 */
export const getStockARefinanceDetail = (params: IParamProps) =>
  request.get(GET_STOCK_A_SHARE_EQUITY_DETAIL, {
    params,
  });
/** 股权融资-新三板定增明细 */
export const getNewThirdAddDetail = (params: IParamProps) => request.get(GET_NEW_THIRD_ADD_DETAIL, { params });

/** 股权融资-区域创投企业-行业赛道筛选 */
export const getVcRaceTree = () => request.get(GET_AREA_FINANCING_RACE_TREE);
/** 股权融资-创投融资明细 */
export const getAreaVcDetail = (params: IParamProps) => request.get(GET_AREA_FINANCING_VC_DETAIL, { params });
