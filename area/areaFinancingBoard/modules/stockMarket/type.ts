import { ScreenType } from '@/components/screen';
import { getStockDistribution, getStockScale } from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal/api';
/*import {
  customDateRangeRender,
  customDateRender,
  YearOptionEnum,
} from '@pages/area/areaCompany/module/stockFinancing/templatePage/config';*/
const size = 50;
export enum TableColumnType {
  /** 按平台 */
  Plate = 'plate',
  /** 按企业性质 */
  Nature = 'nature',
  /** 按行业 */
  Industry = 'industry',
  /** 股权融资规模统计 */
  Scale = 'scale',
}
/** 融资筛选枚举 */
export enum FilterEnum {
  /* 年度筛选 */
  Year = 'year',
  /* 企业性质 */
  EnterpriseNature = 'enterpriseNature',
  /* 年度排序 */
  YearSort = 'YearSort',
  /* 报告期排序 */
  DateSort = 'DateSort',
}
const currentYear = new Date().getFullYear();
/** 企业性质 */
export const entType = {
  title: '',
  label: '企业性质',
  key: 'companyType',
  option: {
    type: ScreenType.SINGLE,
    cancelable: false,
    children: [
      { name: '全部', key: 'companyType', value: '', active: true },
      { name: '国企', key: 'companyType', value: '国有企业' },
      { name: '民企', key: 'companyType', value: '民营企业' },
      { name: '其他', key: 'companyType', value: '其他' },
    ],
  },
};

export const TableInfoMap: Map<any, any> = new Map([
  [
    TableColumnType.Plate,
    {
      apiName: getStockDistribution,
      exportInfo: {
        filename: '上市公司分布-按板块 ',
        module_type: 'regionalFinancial_listed_company_distribution_stat_ipoType',
      },
      defaultCondition: {
        sortKey: '-1_amount',
        sortRule: 'desc',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        moduleType: 'ipoPlate',
        startYear: currentYear - 19,
        endYear: currentYear,
        from: 0,
        size,
      },
      screenOptions: [
        { type: FilterEnum.Year, options: [] },
        { type: FilterEnum.DateSort, options: [] },
      ],
    },
  ],
  [
    TableColumnType.Nature,
    {
      apiName: getStockDistribution,
      exportInfo: {
        filename: '上市公司分布-按企业性质 ',
        module_type: 'regionalFinancial_listed_company_distribution_stat_entType',
      },
      defaultCondition: {
        sortKey: '-1_amount',
        sortRule: 'desc',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        moduleType: 'entType',
        startYear: currentYear - 19,
        endYear: currentYear,
        from: 0,
        size,
      },
      screenOptions: [
        { type: FilterEnum.Year, options: [] },
        { type: FilterEnum.DateSort, options: [] },
      ],
    },
  ],
  [
    TableColumnType.Industry,
    {
      apiName: getStockDistribution,
      exportInfo: {
        filename: '上市公司分布-按产业 ',
        module_type: 'regionalFinancial_listed_company_distribution_stat_industryType',
      },
      defaultCondition: {
        sortKey: '-1_amount',
        sortRule: 'desc',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        moduleType: 'industryType',
        startYear: currentYear - 19,
        endYear: currentYear,
        from: 0,
        size,
      },
      screenOptions: [
        { type: FilterEnum.Year, options: [] },
        { type: FilterEnum.EnterpriseNature, options: [entType] },
        { type: FilterEnum.DateSort, options: [] },
      ],
    },
  ],
  [
    TableColumnType.Scale,
    {
      apiName: getStockScale,
      exportInfo: { filename: '股权融资规模统计', module_type: 'regionalFinancial_equity_financing_scale_stat' },
      defaultCondition: {
        sort: 'desc',
        cityCode: '',
        countyCode: '',
        provinceCode: '',
        startYear: currentYear - 19,
        endYear: currentYear,
        skip: 0,
      },
      screenOptions: [
        { type: FilterEnum.Year, options: [] },
        { type: FilterEnum.EnterpriseNature, options: [entType] },
        { type: FilterEnum.YearSort, options: [] },
      ],
    },
  ],
]);

// 排序
export const SortMap: Record<string, string> = {
  ascend: 'asc',
  descend: 'desc',
};
