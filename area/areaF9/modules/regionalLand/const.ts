export enum ScreeTimeType {
  YEAR = 'y',
  HALF_YEAR = 'h',
  QUARTER = 'q',
  MONTH = 'm',
  WEEK = 'w',
}

export enum StatisticsScopeType {
  /** 本级*/
  THIS_lEVEL = '0',
  /** 含下属辖区*/
  HAS_CHILDREN = '1',
}

export interface ColumnsParams {
  setModalVisible: (visible: boolean) => void;
  setModalData: (data: any) => void;
  currentPage: number;
  dateWidth: number;
}

export const LAND_TRANSFER_CHARTDATA = ['date', 'landArea', 'landDealPrice', 'landDealTotalArea'];
export const LAND_USE_CHARTDATA = [
  'date',
  /** 按成交金额*/
  'landDealTotalPrice',
  'landDealTotalPriceResidential',
  'landDealTotalPriceBusiness',
  'landDealTotalPriceMining',
  'landDealTotalPriceOther',
  /** 按成交金额*/
  'landDealTotalArea',
  'landDealTotalAreaResidential',
  'landDealTotalAreaBusiness',
  'landDealTotalAreaMining',
  'landDealTotalAreaOther',
  /** 按成交数量*/
  'landDealTotalCount',
  'landDealTotalCountResidential',
  'landDealTotalCountBusiness',
  'landDealTotalCountMining',
  'landDealTotalCountOther',
];
export const LAND_BUSINESS_TYPE_CHARTDATA = [
  'date',
  'landDealTotalPrice',
  'centralLandDealAmount',
  'centralLandDealAmountRatio',
  'stateLandDealAmount',
  'stateLandDealAmountRatio',
  'privateLandDealAmount',
  'privateLandDealAmountRatio',
  'urbanLandDealAmount',
  'urbanLandDealAmountRatio',
  'listingLandDealAmount',
  'listingLandDealAmountRatio',
  'realEstateLandDealAmount',
  'realEstateLandDealAmountRatio',
];
