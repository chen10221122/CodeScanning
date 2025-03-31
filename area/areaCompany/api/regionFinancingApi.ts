import { mapRequest, request } from '@/app/libs/request';
import { GET_MAIN_RATING_ACTION, GET_DEFAULT_COMPLETE_DEFAULT_BOND, GET_DEFAULT_ENTITY_DETAIL } from '@/configs/idMap';
import { removeObjectNil } from '@/utils/share';

export const prefix = '/finchinaAPP/v1';

/** IPO/再融资 列表数据 */
export interface IPOListRequestProps {
  /** 企业性质   1-央企、2-央企子公司、3-国企、4-民企、5-城投、6-城投子公司、7-发债 */
  enterpriseNature?: string;
  /** 融资类型   IPO;公开增发;定向增发;配股 */
  financingType?: string;
  /** 上市板块   沪市主板,深市主板,创业板,科创板,北交所 */
  listingPlate?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 搜索 */
  text?: string;
  /** 起始值 */
  from?: number;
  /** 每页大小 */
  size?: number;
  /** 排序字段,排序规则，如declareDate:desc,多个逗号分割 */
  sort?: string;
}
export const getIPOListData = (params: IPOListRequestProps) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-financing-type-list', {
    params,
  });
};

export const getIPORvList = (params: any) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-list', {
    params,
  });
};

/** IPO储备 列表数据 */
export interface IPOStoreListRequestProps {
  /** 企业性质   1-央企、2-央企子公司、3-国企、4-民企、5-城投、6-城投子公司、7-发债 */
  enterpriseNature?: string;
  /** 发行状态   1-辅导期，2-在审，3-已过会待注册，4-已注册待发行 */
  releaseStatus?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 搜索 */
  text?: string;
  /** 每页大小 */
  size?: number;
  /** 排序字段,排序规则，如declareDate:desc,多个逗号分割 */
  sort?: string;
  /** 起始值 */
  from?: number;
  /** 导出标识 true/false */
  exportFlag?: boolean;
}
export const getIPOStoreListData = (params: IPOStoreListRequestProps) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-ipo-reserve-list', {
    params,
  });
};

export interface PevcListRequestProps {
  /** 披露日期 */
  disclosureDate?: string;
  /** 投资机构 */
  investorCode?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 一,二级赛道code */
  trackCode?: string;
  /** 搜索 */
  text?: string;
  /** 每页大小 */
  size?: number;
  /** 排序字段,排序规则，如declareDate:desc,多个逗号分割 */
  sort?: string;
  /** 起始值 */
  from?: number;
  /** 导出标识 true/false */
  exportFlag?: boolean;
}

export const getPevcListData = (params: PevcListRequestProps) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-pevc-list', {
    params,
  });
};

export interface RevokeListParams {
  /** 搜索 */
  keyWord?: string;
  /** 排序名称,中台约定排序规则是sort:排序名称:排序规则 */
  sort?: string;
  /** 分页起始位置 */
  skip?: string;
  /** 分页条数 */
  pagesize?: string;
  /** 行业 */
  industryCodeLevel1?: string;
  industryCodeLevel2?: string;
  industryCodeLevel3?: string;
  industryCodeLevel4?: string;
  /** 地区 */
  registrationProvinceCode?: string;
  registrationCityCode?: string;
  registrationDistrictCode?: string;
  /** 注册资本 */
  registerCapital?: string;
  /** 注销日期 */
  revocationAndCancelledDate?: string;
  /** 企业状态 */
  status?: string;
}
/** 吊销/注销企业列表获取 */
export const getRevokeEnterprises = (data: any) => {
  return request.post(
    prefix + '/finchina-enterprise/v1/enterprise/newOrRevocation/getRevocationOrCancelledEnterprises',
    {
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    },
  );
};

/** 新成立企业列表获取 */
export const getNewRegisteredEnterprises = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/newOrRevocation/getNewRegisteredEnterprises', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 失信被执行人 列表获取 */
export const getDishonestData = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-dishonest-executor-list', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 假冒国企 列表获取 */
export const getCounterfeitingData = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-counterfeiting-enter-list', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 黑名单企业 列表获取 */
export const getBlackList = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-black-enter-list', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};
/** 科创企业 */
export const getTechCoList = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/technologicalEnterprise/getTechEnterpriseDetails', {
    data,
    requestType: 'json',
  });
};
/** 上市发债企业 */
export const getListedOrIssuseList = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-list', {
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
};

interface Props {
  announceId: string;
  companyId: string;
  companyType: string;
}
/** 失信被执行人详情 */
export const getDishonestExecutorDetail = ({ announceId, companyId, companyType }: Props) => {
  return request.get(prefix + '/finchina-information/v1/dishonestExecutor/detail', {
    params: {
      companyId,
      announceId,
      companyType,
      type: 8,
    },
  });
};

/** 所属司法案件 */
export const getCaseOverview = (caseId: string) => {
  return request.get(prefix + '/finchina-information/case/caseOverview', {
    params: {
      caseId,
    },
  });
};

/** 上市、发债弹窗接口 '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-detail' */
export const getListedOrIssueOrgDetailList = (params: any) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-detail', {
    params,
  });
};

/** 区域企业 - IPO储备 - 详情弹窗 */
export const getIPODetailModalData = (params: any) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/get-listing-stock-information', {
    params,
  });
};

export interface SupplierListParams {
  /** 数据来源,多个逗号隔开 */
  dataSource?: string;
  /** 企业性质（供应商类型）,多个逗号隔开 */
  enterpriseNature?: string;
  /** 成立日期，区间(min,max];(min,] */
  establishmentDate?: string;
  /** 起始值 */
  from?: number;
  /** 行业一级分类代码筛选,多个逗号隔开 */
  industryCodeLevel1?: string;
  /** 行业二级分类代码筛选,多个逗号隔开 */
  industryCodeLevel2?: string;
  /** 行业三级分类代码筛选,多个逗号隔开 */
  industryCodeLevel3?: string;
  /** 行业四级分类代码筛选,多个逗号隔开 */
  industryCodeLevel4?: string;
  /** 企业代码 */
  itCode?: string;
  /** 上市/发债,多个逗号隔开 */
  listingOrIssuance?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 注册资金,区间(min,max];(min,] */
  registeredCapital?: string;
  /** 每页大小 */
  size?: number;
  /** 排序字段 */
  sortKey?: string;
  /** 排序规则:desc/asc */
  sortRule?: string;
  /** 搜索 */
  text?: string;
  /** 区域企业节点  12-央企供应商；13-上市公司供应商；14-政府事业单位供应商 */
  treeNode?: string;
}

/** 供应商企业 */
export const getSuppliersListData = (data: SupplierListParams) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-supplier-list', {
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
};

/** 企业信用评级 */
export const getCreditEnterprise = (data: any) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-credit-rating-list', {
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
};

export interface RegionEnterpriseListParams {
  /** 实控人控制比例(*,max] */
  actualControllerRatio?: string;
  /** 企业层级1,2,3... */
  enterpriseLevel?: string;
  /** 企业性质（企业类型）,多个逗号隔开 */
  enterpriseNature?: string;
  /** 成立日期，区间(*,2023-01-01] */
  establishmentDate?: number;
  /** 第一大股东持股比例(*,max] */
  firstShareholderRatio?: number;
  /** 所属上市公司控制比例/所属城投控制比例/所属发债企业控制比例/所属央企控股比例, 区间 */
  indirectControllerRatio?: number;
  /** 行业一级分类代码筛选,多个逗号隔开 */
  industryCodeLevel1?: string;
  /** 行业二级分类代码筛选,多个逗号隔开 */
  industryCodeLevel2?: string;
  /** 行业三级分类代码筛选,多个逗号隔开 */
  industryCodeLevel3?: string;
  /** 行业四级分类代码筛选,多个逗号隔开 */
  industryCodeLevel4?: string;
  /** 市场分层 基础层/创新层 */
  marketLevel?: string;
  /** 上市/发债,多个逗号隔开 */
  listingOrIssuance?: string;
  /** 地区代码 */
  regionCode?: string;
  /** 最新状态 */
  newStatus?: string;
  /** 注册资金,区间(*,max] */
  registeredCapital?: string;
  /** 起始值 */
  from?: number;
  /** 每页大小 */
  size?: number;
  /** 排序字段 排序字段,如declareDate:desc,多个逗号分割 */
  sort?: string;
  /** 搜索 */
  text?: string;
  /**
   * 区域企业节点 900836-中央企业；900837-央企子公司；900838-省属国企；900839-省属国企子公司；900840-国有企业；
   * 900841-上市企业；900842-IPO储备企业；900843-新三板企业；900844-发债企业；900845-发债企业子公司；900846-城投企业；900847-城投子公司；900848-参控上市公司企业；900849-参控金融机构企业；900850-上市公司子公司
   */
  treeNode?: string;
}

/** 国有企业+上市/发债列表数据 */
export const getRegionEnterpriseList = (data: RegionEnterpriseListParams) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/region/get-region-enterprise-list', {
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
};

/** 债券融资模块的接口参数 */
export interface BondFicancialParams {
  /** 债券大类筛选,2-商业银行债、3-同业存单、4-大额存单、5-非银行金融债、9-城投债、10-产业债、6-ABS、7-可转换债券、8-可交换债券,多个逗号隔开 */
  bondCategory?: string;
  /** 日期筛选 */
  changeDate?: string;
  /** 债项评级筛选, 多个逗号隔开 */
  debtRating?: string;
  /** 企业性质筛选, 多个逗号隔开 */
  enterpriseNature?: string;
  /** 导出标识 true / false */
  // exportFlag?: boolean;
  /** 债券类型一级筛选, 多个逗号隔开 */
  firstBondType?: string;
  /** 企业类型一级筛选, 多个逗号隔开 */
  firstEnterpriseType?: string;
  /** 统计频率: 1 - 年；2 - 半年；3 - 季；4 - 月 */
  frequency?: string;
  /** 起始值 */
  from: number;
  /** 行业筛选, 多个逗号隔开 */
  industryCode?: string;
  /** 企业代码 */
  itCode?: string;
  /** 企业分类：1 - 金融企业；0 - 非金融企业 */
  orgType?: string;
  /** 地区筛选, 多个逗号隔开 */
  regionCode?: string;
  /** 统计范围: 1 - 含下属辖区；2 - 本级 */
  sRange?: string;
  /** 债券类型二级筛选, 多个逗号隔开 */
  secondBondType?: string;
  /** 企业类型二级筛选, 多个逗号隔开 */
  secondEnterpriseType?: string;
  /** 每页大小 */
  size?: number;
  /** 排序字段 */
  sortKey?: string;
  /** 排序规则: desc / asc */
  sortRule?: string;
  /** 主体评级筛选, 多个逗号隔开 */
  subjectRating?: string;
  /** tab切换分类：1 - 按类型；2 - 按年份；3 - 按地区 */
  tabType?: string;
  /** 统计口径：1：考虑行权；0-不考虑行权 */
  sCaliber?: string;
  /** 商业银行债二级筛选,多个逗号隔开 */
  commercialBankBonds?: string;
  /** 非银行金融债二级筛选,多个逗号隔开 */
  nonBankFinancialBonds?: string;
  /** 关键字搜索 */
  text?: string;
}

/** 债券融资-债券存量 列表数据 */
export const getStockBondList = (data: BondFicancialParams) => {
  return request.post(prefix + '/finchina-bond/v1/bond/financing/get-bond-stock-stat.action', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 债券融资-债券净融资 列表数据 */
export const getNetFinancingList = (data: BondFicancialParams) => {
  return request.post(prefix + '/finchina-bond/v1/bond/financing/get-bond-net-financing-stat', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 债券融资-债券发行 列表数据 */
export const getBondIssueList = (data: BondFicancialParams) => {
  return request.post(prefix + '/finchina-bond/v1/bond/financing/get-bond-issue-stat', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 债券融资-债券偿还 列表数据 */
export const getBondRepayList = (data: BondFicancialParams) => {
  return request.post(prefix + '/finchina-bond/v1/bond/financing/get-bond-repay-stat', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 债券融资-企业偿债压力 列表数据 */
export const getEnterpriceDebtRepayList = (data: BondFicancialParams) => {
  return request.post(prefix + '/finchina-bond/v1/bond/financing/get-bond-debt-repay-stat', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
};

/** 债券融资-债券发行列表 列表数据 */
export const getBondIssueListData = (params: BondFicancialParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-issue-list', {
    params,
  });
};

/** 债券融资-债券存量 明细数据 */
export const getStockBondDetailList = (params: BondFicancialParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-stock-detail', {
    params,
  });
};

/** 债券融资-债券净融资 明细数据 */
export const getNetFinancingDetailList = (params: BondFicancialParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-net-financing-detail', {
    params,
  });
};

/** 债券融资-债券发行 明细数据 */
export const getBondIssueDetailList = (params: BondFicancialParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-issue-detail', {
    params,
  });
};

/** 债券融资-债券偿还 明细数据 */
export const getBondRepayDetailList = (params: BondFicancialParams) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-repay-detail', {
    params,
  });
};

/** 债券融资-企业偿债压力 红点舆情 */
export const getOpinionInfoList = (params: any) => {
  return request.get(prefix + '/finchina-information/v1/information/riskMonitor/getInfoList', {
    params,
  });
};

/** 债券融资-企业偿债压力 偿还趋势 */
export const getRepayTrendList = (params: any) => {
  return request.get(prefix + '/finchina-bond/v1/bond/financing/get-bond-repay-trend', {
    params,
  });
};

/** 入榜民企 */
export interface PrivateListProps {
  /** 排行榜tab,全球榜单-200001，综合榜单-200002，民营榜单-200003.领域榜单-200004 */
  codeFirst: string;
  /** 是否去重 */
  isUnRepeated: boolean;
  /** 企业状态 */
  enterpriseNature?: string;
  /** 成立日期 */
  establishDate?: string;
  /** 地区code */
  provinceCode?: string;
  cityCode?: string;
  countyCode?: string;
  /** 行业 */
  industryCode1?: string;
  industryCode2?: string;
  industryCode3?: string;
  industryCode4?: string;
  /** 上市发债 */
  listingOrIssuance?: string;
  /** 注册资本 */
  regCapital?: string;
  /** 登记类型 */
  regStatus?: string;
  /** 入选榜单名称 */
  tagCode?: string;
  /** 搜索词，匹配公司名字段 */
  likeStr?: string;
  from?: number;
  size?: number;
  sortKey?: string;
  sortRule?: string;
  areaCode?: string;
}
export const getPrivateList = (params: PrivateListProps) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/enterprise-ranking/getWebEnterpriseRankList', {
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
};

/** 入榜民企-弹窗接口 */
export interface PrivateDetailProps {
  /** 上一标签代码 */
  boardCode: string;
  /** 企业code */
  itCode2: string;
  /** 弹窗年份 */
  tagYear: string;
  /** 连续状态 */
  label?: string;
  /** 注册资本 */
  regCapital?: string;
  /** 登记类型 */
  regStatus?: string;
  /** 成立日期 */
  establishDate?: string;
  /** 企业状态 */
  enterpriseNature?: string;
  /** 搜索词，匹配公司名字段 */
  likeStr?: string;
  from?: number;
  size?: number;
  sortKey?: string;
  sortRule?: string;
  /** 是否查询主体公司并置顶，eg:1-是；0-否，默认排序下页面初进来时传1，默认不传为0 */
  isQueryMainCompany?: 1 | 0;
}
export const getPrivateDetail = (params: PrivateDetailProps) => {
  return request.post(prefix + '/finchina-enterprise/v1/enterprise/enterprise-ranking/getWebEnterpriseRankDetail', {
    data: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  });
};

/** 债券违约节点两个tab */
export const getDefaultSubject = (params: any) => {
  return mapRequest.get(GET_DEFAULT_ENTITY_DETAIL, { params: removeObjectNil(params) });
};
export const getDefaultDetail = (params: any) => {
  return mapRequest.get(GET_DEFAULT_COMPLETE_DEFAULT_BOND, { params: removeObjectNil(params) });
};

/** 海外主题评级 */
export const getOverseaEntityRating = (params: any) => {
  return request.get(prefix + '/finchina-enterprise/v1/enterprise/region/risk/overseas-rating-list', { params });
};
/** 主体评级 */
export const getMainRatingList = (params: any) => {
  return mapRequest.post(GET_MAIN_RATING_ACTION, { params: removeObjectNil(params) });
};
