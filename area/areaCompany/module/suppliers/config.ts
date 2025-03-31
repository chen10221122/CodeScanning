import { SupplierListParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

export const pageModuleMap: Map<
  string,
  {
    treeNode: string;
    pageType: REGIONAL_PAGE;
    title: string;
  }
> = new Map([
  [
    'central',
    {
      treeNode: '900851',
      pageType: REGIONAL_PAGE.COMPANY_SUPPLIERS,
      title: '央企供应商',
    },
  ],
  [
    'listedCompany',
    {
      treeNode: '900859',
      pageType: REGIONAL_PAGE.COMPANY_SUPPLIERS,
      title: '上市公司供应商',
    },
  ],
  [
    'government',
    {
      treeNode: '900860',
      pageType: REGIONAL_PAGE.COMPANY_SUPPLIERS,
      title: '政府单位供应商',
    },
  ],
]);

export const defaultCondition: SupplierListParams = {
  // 首页列表默认按照最新公告日期降序排列，再按照报告期、注册资本降序展示
  sortKey: 'publishDate,reportDate,registeredCapital',
  sortRule: 'desc,desc,desc',
  from: 0,
  size: PAGESIZE,
};

export const filterKeyLists = [
  'dataSource',
  'enterpriseNature',
  'establishmentDate',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'listingOrIssuance',
  'regionCode',
  'registeredCapital',
  'text',
];

export const specialParamKeyMap = new Map([
  [TemplateKeyEnums.sortKey, 'sortKey'],
  [TemplateKeyEnums.sortType, 'sortRule'],
]);
