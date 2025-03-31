import dayjs from 'dayjs';

import { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { FinancingLeaseEventListParams } from '@/pages/finance/financingLease/apis';
import { RequestParamsCommonType } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/types';

const currentDay = dayjs();

/** 承租人、出租人默认的通用请求参数 */
export const defaultParams: RequestParamsCommonType = {
  from: 0,
  size: PAGESIZE,
  statisticType: 'total',
  containExpire: 1,
  registerStartDateFrom: currentDay.subtract(1, 'year').format('YYYY-MM-DD'),
  registerStartDateTo: currentDay.format('YYYY-MM-DD'),
  sortKey: 'leaseEventNum',
  sortType: 'desc',
};
/** 出租人默认请求参数 */
export const leaserDefaultParams: RequestParamsCommonType = {
  ...defaultParams,
  dimension: 'leaser',
};
/** 承租人默认请求参数 */
export const tenantDefaultParams: RequestParamsCommonType = {
  ...defaultParams,
  dimension: 'lessee',
};

export const expireDefaultParams: FinancingLeaseEventListParams & { isLatest: string } = {
  skip: '0',
  pageSize: String(PAGESIZE),
  sortKey: 'endDate',
  sortType: 'asc',
  isLatest: '1',
  endDateFrom: currentDay.format('YYYY-MM-DD'),
  endDateTo: currentDay.add(1, 'year').format('YYYY-MM-DD'),
  informationSource: '1',
};

/** 承租人筛选key */
export const tenantFilterKeys = [
  'registerStartDateFrom',
  'registerStartDateTo',
  'lesseeType',
  'containExpire',
  'text',
  'regionCode',
  'cityCode',
  'countryCode',
];
/** 出租人筛选key */
export const leaserFilterKeys = [
  'registerStartDateFrom',
  'registerStartDateTo',
  'leaserType',
  'containExpire',
  'enterpriseType',
  'text',
  'regionCode',
  'cityCode',
  'countryCode',
];
/** 将到期时间筛选key */
export const exipreFilterKeys = [
  'endDateFrom',
  'endDateTo',
  'keyWord',
  'areaRegionCodeLessee',
  'areaCityCodeLessee',
  'areaCountyCodeLessee',
];

export const specialParamKeyMap = new Map([
  [TemplateKeyEnums.sortKey, TemplateKeyEnums.sortKey],
  [TemplateKeyEnums.sortType, TemplateKeyEnums.sortType],
  [TemplateKeyEnums.regionCode, 'registrationProvinceCode'],
  [TemplateKeyEnums.cityCode, 'registrationCityCode'],
  [TemplateKeyEnums.countryCode, 'registrationDistrictCode'],
]);

export const expireSpecialParamKeyMap = new Map([
  [TemplateKeyEnums.sortKey, TemplateKeyEnums.sortKey],
  [TemplateKeyEnums.sortType, TemplateKeyEnums.sortType],
  [TemplateKeyEnums.from, 'skip'],
  [TemplateKeyEnums.keyWord, 'text'],
  [TemplateKeyEnums.areaRegionCodeLessee, 'registrationProvinceCode'],
  [TemplateKeyEnums.areaCityCodeLessee, 'registrationCityCode'],
  [TemplateKeyEnums.areaCountyCodeLessee, 'registrationDistrictCode'],
]);

export const paramsNeedList = ['regionCode|cityCode|countryCode'];
export const expireParamsNeedList = ['areaRegionCodeLessee|areaCityCodeLessee|areaCountyCodeLessee'];

export const DetailModalExportType: Record<string, string> = {
  // 新增租赁事件数
  leaseEventNum: 'region_financeLease_detail_leaseEventNum ',
  // 出租人明细
  leaserNum: 'region_financeLease_detail_leaser ',
  // 承租人明细
  lesseeNum: 'region_financeLease_detail_lessee ',
};

/** 枚举承租人、出租人类型，增强代码可读性 */
// export enum LesseeTag {
//   // @ts-ignore
//   '上市' = 3,
//   // @ts-ignore
//   '上市' = 4,
//   // @ts-ignore
//   '上市' = 7,
//   '央企' = 1,
//   '国企' = 2,
//   '央企子公司' = 14,
//   '民企' = 8,
//   '发债人' = 5,
//   '城投子公司' = 9,
//   '城投' = 6,
//   '高新技术企业' = 10,
//   '科技型中小企业' = 11,
//   '专精特新小巨人' = 12,
//   '专精特新中小企业' = 13,
// }
export const LesseeTags = [
  null,
  '央企',
  '国企',
  '上市',
  '上市',
  '发债',
  '城投',
  '上市',
  '民企',
  '城投子公司',
  '高新技术企业',
  '科技型中小企业',
  '专精特新小巨人',
  '专精特新中小企业',
  '央企子公司',
];
// export enum LeaserTag {
//   '国企' = 2,
//   '民企' = 8,
//   '发债人' = 5,
//   // @ts-ignore
//   '上市' = 3,
//   // @ts-ignore
//   '上市' = 4,
//   // @ts-ignore
//   '上市' = 7,
// }
export const LeaserTags = [null, null, '国企', '上市', '上市', '发债', null, '上市', '民企'];
