/**
 * area/:key 子路由声明
 * 路径配置
 * 该配置用于跳转F9分类的地址，例如地区经济为/area/areaEconomy/regionEconomy
 * 这里配置的为地址的最后一个路径
 */

const BASE_URL = '/area/';

interface ChildPath {
  [key: string]: string;
}

/**
 * :key 对应的子路由
 */
export const Path: ChildPath = {
  REGION_ECONOMY: 'regionEconomy',
  SIMILAR_ECONOMY: 'similarEconomy',
  UNDER_AREA: 'underArea',
  AREA_SPREADS: 'areaSpreads',
  PLATFORMS: 'platforms',
  LOCAL_DEBT_ISSUE: 'localDebtIssue',
  SPECIAL_DEBT_PROJECTS: 'specialDebtProjects',
  REGION_SOCIAL_FINANCE: 'regionSocialFinance',
  INDUSTRY_STRUCTURE: 'industryStructure', // 产业结构
  AREA_VIEWPOINT: 'areaViewpoint', // 区域观点
  AREA_PUBLISH: 'areaPublish', //区域舆情
  FINANCIAL_INSTITUTIONS: 'financialInstitutions', // 金融机构
  FINANCIAL_INSTITUTIONS_BANK: 'financialInstitutions#bank', // 金融机构 - 银行
  FINANCIAL_INSTITUTIONS_BOND: 'financialInstitutions#bond', // 金融机构 - 证券公司
  FINANCIAL_INSTITUTIONS_INSURANCE: 'financialInstitutions#insurance', // 金融机构 - 保险公司
  FINANCIAL_INSTITUTIONS_TRUST: 'financialInstitutions#trust', // 金融机构 - 信托公司
  FINANCIAL_INSTITUTIONS_RENT: 'financialInstitutions#rent', // 金融机构 - 租赁公司
  FINANCIAL_INSTITUTIONS_FUND: 'financialInstitutions#fund', // 金融机构 - 基金公司
  SCIENTIFIC_ENTERPRISES: 'scientificEnterprises', // 科技型企业
  BLACK_LIST: 'blackList', // 黑名单
  REGIONAL_LIST: 'regionalList', // 地区榜单
};

let LongPathMap: ChildPath = {};

/**
 * 为所有子路由添加父级路由地址
 */
Object.keys(Path).forEach((key: string) => {
  LongPathMap[key] = `${BASE_URL}${Path[key]}`;
});

export default LongPathMap;
