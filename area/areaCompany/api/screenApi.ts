import { request } from '@/app/libs/request';
import { REGIONAL_PAGE, API_MAP, CompanyScreenParamsType, ScreenParamsType } from '@/pages/area/areaCompany/configs';

import { prefix } from './regionFinancingApi';

/** 区域融资 获取筛选项数据 */
export const getScreenData = ({ pageId, params }: { pageId: REGIONAL_PAGE; params: ScreenParamsType }) => {
  return request.get(API_MAP.get(pageId) || '', {
    params,
  });
};

const GET_THE_CHILD_OF_CURRENT_AREA =
  prefix + '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getAreaTreeFilters';
const GET_INDUSTRY = prefix + '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getIndustryTreeFilters';
const GET_MOREFILTER = prefix + '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-common-filter';

/** 获取地区树 */
export const getAreaSideBarOption = () => {
  return request.get(GET_THE_CHILD_OF_CURRENT_AREA, {
    params: {
      specialSort: '1',
    },
  });
};

/** 区域企业-获取国标行业筛选项 */
export const getIndustryInfo = () => {
  return request.get(GET_INDUSTRY, {
    params: {
      level: 4,
    },
  });
};

/** 区域企业-获取更多筛选项 */
export const getMoreScreenInfo = (params: CompanyScreenParamsType) => {
  return request.get(GET_MOREFILTER, {
    params,
  });
};

export interface BondFilterParams {
  orgType: string; // 企业分类：1 - 金融企业；0 - 非金融企业
  pageType: string; //页面分类：1 - 债券存量；2 - 债券净融资；3 - 债券发行；4 - 债券偿还；5 - 企业偿债压力；6 - 债券发行列表
  tabType: string; // tab切换分类：1-按类型；2-按年份；3-按地区
  /** 是否是表头筛选： 1-是 */
  titleFilter?: string;
}

/** 区域融资-债券融资 筛选项数据 */
export const getBondFilterData = (params: BondFilterParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-financing-filter', { params });
};

export interface PrivateFilterProps {
  /** 排行榜tab,全球榜单-200001，综合榜单-200002，民营榜单-200003.领域榜单-200004 */
  codeFirst: string;
  /** 列表接口返回-弹窗用 */
  boardCode?: string;
  /** 列表接口返回-弹窗用 */
  tagYear?: string;
  regionCode?: string;
}
/** 区域重点入榜名企筛选项接口 */
export const getPrivateFilter = (params: PrivateFilterProps) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/enterprise-ranking/getEnterpriseRankFilter', {
    params,
  });
};
