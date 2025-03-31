import { mapRequest, request } from '@/app/libs/request';
import { ScreenAreaTreeData } from '@/components/screen';
import { GET_AREA_TREE_ACTION } from '@/configs/idMap';
import { CommonResponse } from '@/utils/utility-types';

const addPreFix = (str: string) => '/finchinaAPP' + str;
const addBondPreFix = (str: string) => '/finchinaAPP/v1/finchina-bond/v1/bond/financing' + str;
const GET_AREA_FINANCING_YEARS = addPreFix('/regionFinance/getSelectParam.action');
const GET_AREA_FINANCING_STATISTIC = addPreFix('/regionFinance/aShareStatistic.action');
const GET_AREA_FINANCING_A_SHARE_DETAIL = addPreFix('/regionFinance/aShareDetail.action');
const GET_AREA_FINANCING_IPO = addPreFix('/regionFinance/ipoStatistic.action');
const GET_AREA_FINANCING_IPO_DETAIL = addPreFix('/regionFinance/ipoDetail.action');
const GET_AREA_FINANCING_HK = addPreFix('/regionFinance/hkStatistic.action');
const GET_AREA_FINANCING_HK_DETAIL = addPreFix('/regionFinance/hkDetail.action');
const GET_AREA_FINANCING_THIRD_BOARD = addPreFix('/regionFinance/thirdBoardStatistic.action');
const GET_AREA_FINANCING_THIRD_BOARD_DETAIL = addPreFix('/regionFinance/thirdboardDetail.action');
const GET_AREA_FINANCING_VC = addPreFix('/regionFinance/pevcStatistic.action');
const GET_AREA_FINANCING_VC_DETAIL = addPreFix('/regionFinance/pevcDetail.action');

const GET_AREA_FINANCING_RACE_TREE = addPreFix('/regionFinance/getRaceTree.action');

/** 地区树 */
const GET_ALL_REGION_DICT_AREA_TREE = addPreFix('/dictAreaTree/getAllRegionDictAreaTree.action');

const GET_BOND_FINANCING_INVENTORY_STATISTIC = addBondPreFix('/get-bond-stock-stat.action');
const GET_BOND_FINANCING_FINANCING_STATISTIC = addBondPreFix('/get-bond-net-financing-stat.action');
const GET_BOND_FINANCING_ISSUE_STATISTIC = addBondPreFix('/get-bond-issue-stat.action');
const GET_BOND_FINANCING_RETURN_STATISTIC = addBondPreFix('/get-bond-repay-stat.action');

const GET_BOND_FINANCING_FILTER = addBondPreFix('/get-bond-financing-filter.action');
const GET_BOND_FINANCING_INVENTORY_DETAIL = addBondPreFix('/get-bond-stock-detail.action');
const GET_BOND_FINANCING_FINANCING_DETAIL = addBondPreFix('/get-bond-net-financing-detail.action');
const GET_BOND_FINANCING_ISSUE_DETAIL = addBondPreFix('/get-bond-issue-detail.action');
const GET_BOND_FINANCING_RETURN_DETAIL = addBondPreFix('/get-bond-repay-detail.action');

/** 区域融资-A股&上市平台接口参数 */
export interface IParamProps {
  regionLevel?: string; // 统计地区级别(1-省级 2-市级 3-区县级 4-百强县)
  statType?: string; // 统计类别(ipoType-按A股统计，ipoPlate-按照上市板块统计，entType-按照企业性质统计，industryType-按照产业类型分类)
  year?: string; // 年份
  date?: string; // 日期期间，如[20220101,*)
  sortKey?: string; // 排序字段
  sortRule?: string; // 排序规则(asc-升序，desc-降序)
  from?: string | number;
  size?: number;
}
/** 区域融资-A股&上市平台,年份获取 */
export const getAreaFinancingYears = ({ type, regionLevel }: { type?: string; regionLevel: string }) => {
  return request.get<CommonResponse<any[]>>(GET_AREA_FINANCING_YEARS, {
    params: { type, regionLevel, hundredCountry: 1 },
  });
};

/** 区域股权融资-A股&上市平台 */
export const getAreaFinancingA = (params: IParamProps) =>
  request.post<CommonResponse<any[]>>(GET_AREA_FINANCING_STATISTIC, { data: params });
/** 区域股权融资-A股&上市平台明细 */
export const getAreaFinancingAShareDetail = (params: any) => request.get(GET_AREA_FINANCING_A_SHARE_DETAIL, { params });
/** 股权融资-区域IPO储备企业 */
export const getAreaIpoStatistic = (params: IParamProps) => request.post(GET_AREA_FINANCING_IPO, { data: params });
/** 股权融资-区域IPO储备企业明细 */
export const getAreaIpoStatisticDetail = (params: IParamProps) =>
  request.get(GET_AREA_FINANCING_IPO_DETAIL, { params });
/** 股权融资-区域港股企业 */
export const getAreaHkStatistic = (params: IParamProps) => request.post(GET_AREA_FINANCING_HK, { data: params });
/** 股权融资-区域港股企业明细 */
export const getAreaHkStatisticDetail = (params: IParamProps) => request.get(GET_AREA_FINANCING_HK_DETAIL, { params });
/** 股权融资-区域新三板企业 */
export const getAreaThirdBoardStatistic = (params: IParamProps) =>
  request.post(GET_AREA_FINANCING_THIRD_BOARD, { data: params });
/** 股权融资-区域新三板企业明细 */
export const getAreaThirdBoardDetail = (params: IParamProps) =>
  request.get(GET_AREA_FINANCING_THIRD_BOARD_DETAIL, { params });

/** 股权融资-区域创投企业-行业赛道筛选 */
export const getVcRaceTree = () => request.get(GET_AREA_FINANCING_RACE_TREE);
/** 股权融资-区域创投企业 */
export const getAreaVcStatistic = (params: IParamProps) => request.post(GET_AREA_FINANCING_VC, { data: params });
/** 股权融资-区域创投企业明细 */
export const getAreaVcDetail = (params: IParamProps) => request.get(GET_AREA_FINANCING_VC_DETAIL, { params });

/** 债券融资筛选
 *
 * titleFilter  否
 * 是否返回所有筛选项：1-是，0-返回地区，默认返回所有
 *
 * orgType  是
 * 企业分类：1-金融企业；2-非金融企业
 * pageType  是
 * 页面分类：1-债券存量；2-债券净融资；3-债券发行；4-债券偿还
 * tabType  是
 * tab切换分类：1-按类型；2-按年份
 **/
export const getBondFinancingFilter = ({
  titleFilter,
  orgType,
  pageType,
  tabType,
}: {
  titleFilter: string;
  orgType: string;
  pageType: string;
  tabType: string;
}) => {
  return request.get<CommonResponse<any[]>>(GET_BOND_FINANCING_FILTER, {
    params: { titleFilter, orgType, pageType, tabType },
  });
};

/**
 * 获取行政区地区树
 * @param code
 * @param type
 * @returns {any}
 */
export const getAdminDistrict = () => {
  return mapRequest.get<{ data: ScreenAreaTreeData[] }>(GET_AREA_TREE_ACTION, {
    params: {
      isIncludingSameLevel: true,
      // 是否包含全部，默认false
      isIncludingSelf: false,
      // 是否去除全国，默认false
      isExcludeingNational: true,
      // 是否去除特殊三省
      isIncludingThreeSpecialCity: true,
    },
  });
};
/**
 * 获取城市圈、都市圈、百强县等地区树
 * @param code
 * @param type
 * @returns {any}
 */
export const getAllRegionDictAreaTree = ({ code, type }: { code?: string; type: string }) => {
  return request.get<CommonResponse<any[]>>(GET_ALL_REGION_DICT_AREA_TREE, {
    params: { code, type },
  });
};

/** 债券融资-债券存量统计 */
export const getAreaBondInventoryStatistic = (params: IParamProps) =>
  request.post(GET_BOND_FINANCING_INVENTORY_STATISTIC, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(params),
  });
/** 债券融资-债券净融资统计 */
export const getAreaBondFinancingStatistic = (params: IParamProps) =>
  request.post(GET_BOND_FINANCING_FINANCING_STATISTIC, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(params),
  });
/** 债券融资-债券发行统计 */
export const getAreaBondIssueStatistic = (params: IParamProps) =>
  request.post(GET_BOND_FINANCING_ISSUE_STATISTIC, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(params),
  });
/** 债券融资-债券偿还统计 */
export const getAreaBondReturnStatistic = (params: IParamProps) =>
  request.post(GET_BOND_FINANCING_RETURN_STATISTIC, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: JSON.stringify(params),
  });

/** 债券融资-债券存量明细 */
export const getAreaBondInventoryDetail = (params: IParamProps) =>
  request.get(GET_BOND_FINANCING_INVENTORY_DETAIL, { params });
/** 债券融资-债券净融资明细 */
export const getAreaBondFinancingDetail = (params: IParamProps) =>
  request.get(GET_BOND_FINANCING_FINANCING_DETAIL, { params });
/** 债券融资-债券发行明细 */
export const getAreaBondIssueDetail = (params: IParamProps) => request.get(GET_BOND_FINANCING_ISSUE_DETAIL, { params });
/** 债券融资-债券偿还明细 */
export const getAreaBondReturnDetail = (params: IParamProps) =>
  request.get(GET_BOND_FINANCING_RETURN_DETAIL, { params });
