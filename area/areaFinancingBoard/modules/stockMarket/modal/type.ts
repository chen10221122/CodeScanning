import {
  getNewThirdCountDetail,
  getStockADistributionDetail,
  getStockAIpoDetail,
  getStockARefinanceDetail,
  getNewThirdAddDetail,
  getAreaVcDetail,
} from './api';
import { equityType, isHead, marketLayer, plate } from './useCommonScreen';

export interface SideMenuData {
  label: string;
  key?: string;
  children?: SideMenuData[];
  title?: string;
  [K: string]: any;
}

/** 弹窗类型枚举 */
export enum DetailModalTypeEnum {
  StockADistribution = 'A股上市公司分布明细',
  StockAIpo = 'A股IPO融资明细',
  StockARefinance = 'A股再融资明细',
  NewThirdAdd = '新三板定增明细',
  VC = '创投融资明细',
  NewThirdCount = '新三板挂牌家数明细',
}

/**
 * 弹窗信息
 */
export const DetailModalInfoMap = new Map([
  [
    DetailModalTypeEnum.StockADistribution,
    {
      title: '',
      exportInfo: {
        filename: 'A股上市公司分布明细',
        module_type: 'regionalFinancial_alisted_company_distribution_info',
      },
      apiName: getStockADistributionDetail,
      condition: {
        countyCode: '',
        cityCode: '',
        provinceCode: '',
        /*企业类型：国有企业、民营企业、其他*/
        companyType: '',
        skip: 0,
        sortKey: 'EQ0062_005',
        sortRule: 'desc',
        /*挂牌日期年份，支持多值和开闭区间筛选*/
        endYear: '',
        /*产业枚举值：1-第一产业 2-第二产业 3-第三产业*/
        industryType: '',
        /*市场分层(按板块)枚举值：1-创新层，2-基础层*/
        listingSector: '',
      },
      screen: [plate],
    },
  ],
  [
    DetailModalTypeEnum.NewThirdCount,
    {
      title: '新三板挂牌家数明细',
      exportInfo: {
        filename: '新三板挂牌家数明细',
        module_type: 'regionalFinancial_newthreeboard_company_distribution_info',
      },
      apiName: getNewThirdCountDetail,
      condition: {
        countyCode: '',
        cityCode: '',
        provinceCode: '',
        /*企业类型：国有企业、民营企业、其他*/
        companyType: '',
        skip: 0,
        sortKey: 'EQ0062_005',
        sortRule: 'desc',
        /*挂牌日期年份，支持多值和开闭区间筛选*/
        endYear: '',
        /*产业枚举值：1-第一产业 2-第二产业 3-第三产业*/
        industryType: '',
        /*市场分层(按板块)枚举值：1-创新层，2-基础层*/
        listingSector: '',
      },
      screen: [marketLayer],
    },
  ],
  [
    DetailModalTypeEnum.NewThirdAdd,
    {
      title: '新三板定增明细',
      exportInfo: { filename: '新三板定增明细', module_type: 'regionalFinancingF9_equity_financing_newthreeboard' },
      apiName: getNewThirdAddDetail,
      condition: {
        regionCode: '',
        regionLevel: '',
        skip: 0,
        sortKey: '',
        sortRule: '',
        listingSector: '',
        keyWord: '',
      },
      screen: [marketLayer],
      searchConfig: {
        dataKey: '新三板定增明细',
      },
    },
  ],
  [
    DetailModalTypeEnum.StockAIpo,
    {
      title: 'A股IPO融资明细',
      exportInfo: { filename: 'A股IPO融资明细', module_type: 'regionalFinancingF9_equity_financing_ashare_ipo' },
      apiName: getStockAIpoDetail,
      condition: {
        regionCode: '',
        statType: 'ipoType',
        listingSector: '',
        regionLevel: '',
        skip: 0,
        sortKey: 'EQ0062_005',
        sortRule: 'desc',
        keyWord: '',
      },
      screen: [plate],
      searchConfig: {
        dataKey: 'A股IPO融资明细',
      },
    },
  ],
  [
    DetailModalTypeEnum.StockARefinance,
    {
      title: 'A股再融资明细',
      exportInfo: { filename: 'A股再融资明细', module_type: 'regionalFinancingF9_equity_financing_ashare_reipo' },
      apiName: getStockARefinanceDetail,
      condition: {
        regionCode: '',
        regionLevel: '',
        skip: 0,
        sortKey: 'EQ0062_005',
        sortRule: 'desc',
        listingSector: '',
        keyWord: '',
      },
      screen: [plate, equityType],
      searchConfig: {
        dataKey: 'A股再融资明细',
      },
    },
  ],
  [
    DetailModalTypeEnum.VC,
    {
      title: '创投融资明细',
      exportInfo: { filename: '创投融资明细', module_type: 'regionalFinancingF9_equity_financing_venture_capital' },
      apiName: getAreaVcDetail,
      condition: {
        regionCode: '',
        regionLevel: '',
        industryOne: '',
        industryTwo: '',
        top: '', //是否品牌
        skip: 0,
        year: '',
        date: '',
        sortKey: '',
        sortRule: 'desc',
        keyWord: '',
      },
      screen: [isHead],
      searchConfig: {
        dataKey: '创投融资明细',
      },
    },
  ],
]);
// 排序
export const SortMap: Record<string, string> = {
  ascend: 'asc',
  descend: 'desc',
};
