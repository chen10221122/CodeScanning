import { PrivateListProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

export const pageType = REGIONAL_PAGE.COMPANY_PRIVATE_ENTERPIRSES;

export const pageModuleMap: Map<
  string,
  {
    treeNode: string;
    title: string;
  }
> = new Map([
  [
    'global',
    {
      treeNode: '200001',
      title: '全球榜单',
    },
  ],
  [
    'comprehensive',
    {
      treeNode: '200002',
      title: '综合榜单',
    },
  ],
  [
    'private',
    {
      treeNode: '200003',
      title: '民营榜单',
    },
  ],
  [
    'field',
    {
      treeNode: '200004',
      title: '领域榜单',
    },
  ],
]);

export const defaultCondition: PrivateListProps = {
  areaCode: '',
  codeFirst: '',
  // 首页列表默认按照最新公告日期降序排列，再按照报告期、注册资本降序展示
  sortKey: '',
  sortRule: '',
  from: 0,
  size: PAGESIZE,
  isUnRepeated: false,
};

export const filterKeyLists = [
  'regionCode',
  'areaCode',
  'enterpriseNature',
  'establishDate',
  'industryCode1',
  'industryCode2',
  'industryCode3',
  'industryCode4',
  'isUnRepeated',
  'listingOrIssuance',
  'regCapital',
  'regStatus',
  'tagCode',
  'likeStr',
  // 'provinceCode',
  // 'cityCode',
  // 'countyCode',
];

export const specialParamKeyMap = new Map([
  [TemplateKeyEnums.sortKey, 'sortKey'],
  [TemplateKeyEnums.sortType, 'sortRule'],
  // [TemplateKeyEnums.areaCode, 'areaCode'],
  // [TemplateKeyEnums.regionCode, 'regionCode'],
  [TemplateKeyEnums.likeStr, 'keyWord'],
]);

export const paramsNeedLists = ['areaCode|regionCode'];

/** 弹窗描述 */
export interface DescProps {
  /** 认定单位 */
  identityUnit: string;
  /** 数据来源 */
  dataSource: string;
  /** 公布日期 */
  declareDate: string;
  /** 原文 */
  fileUrl: string;
}
export const descMap = new Map([
  ['认定单位', 'identityUnit'],
  ['数据来源', 'dataSource'],
  ['公布日期', 'declareDate'],
  ['原文', 'fileUrl'],
]);
