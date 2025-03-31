import { omit } from 'lodash';

import { isCity, isCounty, isProvince } from '@pages/area/areaF9/utils';

import { request } from '@/app/libs/request';

const GET_NEW_THIRD_ADD_DETAIL =
  '/finchinaAPP/v1/finchina-economy/v1/area/regionalFinancialResourceF9/getNewThreeBoardEquityFinancingInfo';
export const transformCondition = (condition: Record<string, any>) => {
  const regionCode = condition.regionCode;
  let provinceCode = '',
    cityCode = '',
    countyCode = '';
  if (isProvince(regionCode)) {
    provinceCode = regionCode;
  }
  if (isCity(regionCode)) {
    cityCode = regionCode;
  }
  if (isCounty(regionCode)) {
    countyCode = regionCode;
  }
  const sort = condition.sortKey ? `${condition.sortKey}:${condition.sortRule}` : condition.sort;

  return {
    ...omit(condition, ['sortKey', 'sortRule', 'regionCode', 'from']),
    skip: condition.from,
    provinceCode,
    cityCode,
    countyCode,
    pageSize: condition.pageSize || 50,
    sort,
  };
};
/** 股权融资-新三板定增明细 */
export const getNewThirdAddDetail = (params: Record<string, any>) => {
  return request.get(GET_NEW_THIRD_ADD_DETAIL, {
    params: transformCondition(params),
  });
};
