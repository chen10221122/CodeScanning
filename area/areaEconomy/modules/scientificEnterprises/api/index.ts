import { request } from '@/app/libs/request';

/** 网关转发地址前缀 */
const addPrefix = (addr: string) => '/finchinaAPP/v1' + addr;

const GET_TARGET_NAME = addPrefix(
  '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getTechEnterpriseTagNames',
);

/**
 * API :
 * 地区所有下属子级查询 */
const GET_THE_CHILD_OF_CURRENT_AREA = addPrefix(
  '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getAreaTreeFilters',
);
/**
 * get anything
 */
const GET_ANYTHING = addPrefix('/finchina-enterprise/v1/enterprise/technologicalEnterprise/getTechEnterpriseDetails');
/**
 * @description 查询科技型企业统计分布
 */
const GET_STATISTICS = addPrefix(
  '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getTechEnterpriseStatistics',
);
/**
 * @description 行业信息
 */
const GET_INDUSTRY = addPrefix('/finchina-enterprise/v1/enterprise/technologicalEnterprise/getIndustryTreeFilters');

/**
 * @description 根据地区代码获取子级，不传代码则返回所有地区信息
 * @param {string|number} regionCode
 * @returns {Promise<any>}
 *
 */
export const getAreaOrChildByRegionCode = (regionCode: string | number = '') => {
  return request.get(GET_THE_CHILD_OF_CURRENT_AREA, {
    params: {
      regionCode,
    },
  });
};

/**
 * @description 查询科技型企业统计分布
 */
export const getStatistics = (queryParams: any) => {
  return request.get(GET_STATISTICS, {
    params: {
      ...queryParams,
    },
  });
};

/**
 * @description 获取侧边筛选栏数据
 */
export const getAreaSideBarOption = () => {
  return request.get(GET_THE_CHILD_OF_CURRENT_AREA, {
    params: {
      specialSort: '1',
    },
  });
};

/**
 * @description 榜单数据获取
 */
export const getLoopList = () => {
  return request.get(GET_STATISTICS, {
    params: {
      statisticType: '4',
      techType: '1',
      competency: '1,2',
    },
  });
};

/**
 * @description 获取Modal列表数据
 */
export const getModalData = ({ tagCode_s, skip }: { tagCode_s: string; skip: number | string }) => {
  return request.post(GET_ANYTHING, {
    data: {
      sortRule: 'desc',
      sortKey: 'CR0001_005_yuan',
      tagCode_s,
      skip,
      pageSize: '10',
      techType: '1',
    },
    requestType: 'json',
  });
};

/**
 * @description 表格数据获取
 */
export const getTableData = (condition: any) => {
  return request.post(GET_ANYTHING, {
    data: condition,
    requestType: 'json',
  });
};

/**
 * @description 行业信息获取
 */
export const getIndustryInfo = (level: number | string = '') => {
  return request.get(GET_INDUSTRY, {
    params: {
      level,
    },
  });
};

/**
 * @description 标签名称/其它称号查询
 */
export const getTargetNames = (tagCodes: string) => {
  return request.get(GET_TARGET_NAME, {
    params: {
      tagCodes,
    },
  });
};
