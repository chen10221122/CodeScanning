import { mapRequest, request } from '@/app/libs/request';
import { GET_FIN_CREDIT_DETAIL_UNCOMBINED_ACTION } from '@/configs/idMap';
import { CommonResponse } from '@/utils/utility-types';

export interface Modal1RowItem {
  bondAbbreviation: string;
  trCode: string;
  bondCode: string;
  bondType: string;
  firstBondType: string;
  secondBondType?: any;
  bondMaturity: string;
  couponRate?: any;
  dateExpiry: string;
  debtRating?: any;
  subjectRating: string;
  listedMarket: string;
  issuer: string;
  issuerItCode2: string;
  enterpriseNature: string;
  enterpriseType: string;
  industryName: string;
  isCityInvestment: string;
  province: string;
  city?: any;
  district: string;
  pfAttribution?: any;
  shareholderBackground?: any;
  ctrlLevelProperties?: any;
  pfType?: any;
  pfImportance?: any;
  ownDevZone?: any;
  devZoneCat?: any;
  issueDate: string;
  issueAmount: string;
  issuingPrice: string;
  referenceRate: string;
}

/**
 * 债券融资-债券发行明细
 * @see http://10.17.207.71:3000/project/44/interface/api/26281
 */
export function requestModal1(params: Record<string, any>): Promise<
  CommonResponse<{
    total: number;
    data: Modal1RowItem[];
  }>
> {
  return request.get('/finchinaAPP/v1/finchina-bond/v1/bond/financing/get-bond-issue-detail', { params });
}

export interface Modal2RowItem {
  bondAbbreviation: string;
  trCode: string;
  bondCode: string;
  bondType: string;
  firstBondType: string;
  secondBondType: string;
  bondMaturity: string;
  couponRate: string;
  dateExpiry: string;
  debtRating: string;
  subjectRating: string;
  listedMarket: string;
  issuer: string;
  issuerItCode2: string;
  enterpriseNature: string;
  enterpriseType: string;
  industryName: string;
  isCityInvestment: string;
  province: string;
  city?: any;
  district: string;
  pfAttribution?: any;
  shareholderBackground?: any;
  ctrlLevelProperties?: any;
  pfType?: any;
  pfImportance?: any;
  ownDevZone?: any;
  devZoneCat?: any;
  changeDate: string;
  changeType: string;
  changeAmount: string;
}

/**
 * 债券融资-债券偿还明细
 * @see http://10.17.207.71:3000/project/44/interface/api/26305
 */
export function requestModal2(
  params: Record<string, any>,
): Promise<CommonResponse<{ data: Modal2RowItem[]; total: number }>> {
  return request.get('/finchinaAPP/v1/finchina-bond/v1/bond/financing/get-bond-repay-detail', {
    params,
  });
}

export interface Modal3RowItem {
  bondAbbreviation: string;
  trCode: string;
  bondCode: string;
  bondType: string;
  firstBondType: string;
  secondBondType?: any;
  bondMaturity: string;
  couponRate?: any;
  dateExpiry: string;
  debtRating?: any;
  subjectRating: string;
  listedMarket: string;
  issuer: string;
  issuerItCode2: string;
  enterpriseNature: string;
  enterpriseType: string;
  industryName: string;
  isCityInvestment: string;
  province: string;
  city?: any;
  district: string;
  pfAttribution?: any;
  shareholderBackground?: any;
  ctrlLevelProperties?: any;
  pfType?: any;
  pfImportance?: any;
  ownDevZone?: any;
  devZoneCat?: any;
  issueDate: string;
  issueAmount: string;
  bondBalance: string;
}

/**
 * 债券融资-债券存量明细
 * @see http://10.17.207.71:3000/project/44/interface/api/26317
 */
export function requestModal3(params: Record<string, any>): Promise<
  CommonResponse<{
    total: number;
    data: Modal3RowItem[];
  }>
> {
  return request.get('/finchinaAPP/v1/finchina-bond/v1/bond/financing/get-bond-stock-detail', {
    params,
  });
}

export interface Modal4RowItem {
  creditId: number;
  creditLineUnused: number;
  creditLine: number;
  creditOrgCode: string;
  creditLineUsed: number;
  creditOrgName: string;
}

export function requestModal4(params: Record<string, any>): Promise<CommonResponse<Modal4RowItem[]>> {
  return mapRequest.get(GET_FIN_CREDIT_DETAIL_UNCOMBINED_ACTION, {
    params,
  });
}

export interface Modal5RowItem {
  financingParty: {
    name: string;
    itCode: string;
  };
  relation: string;
  nonStandardType: string;
  financingBalance: string;
  financingRate: string;
  term?: any;
  startDate: string;
  dueDate: string;
  financingAmount?: any;
  creditorInfo: {
    name: string;
    itCode?: any;
  };
  declareDate: string;
  subject: string;
  source: string;
  financingPartyName?: any;
  creditorName?: any;
}

/**
 * 查询非标融资列表
 * @see http://10.17.207.71:3000/project/38/interface/api/19990
 */
export function requestModal5(
  params: Record<string, any>,
): Promise<CommonResponse<{ list: Modal5RowItem[]; totalSize: number }>> {
  return request.get('/finchinaAPP/v1/finchina-economy/v1/area/company/getNonStandardList', { params });
}
