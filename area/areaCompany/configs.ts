import dayjs, { Dayjs } from 'dayjs';

/** FINANCING_是区域融资页面，COMPANY_是区域企业页面。
 * 此处枚举顺序不要轻易改动，枚举值和业务逻辑是相关的
 */
export enum REGIONAL_PAGE {
  FINANCING_IPO = 0,
  /** 再融资-增发 */
  FINANCING_ADDITIONAL_ISSUE = 1,
  /** 再融资-配股 */
  FINANCING_ADDITIONAL_ALLOTMENT = 2,
  /** IPO储备 */
  FINANCING_IPO_RESERVE = 3,
  FINANCING_PEVC = 4,
  /** 租赁融资-承租人 */
  FINANCING_LEASING_LESSEE = 5,
  /** 租赁融资-出租人 */
  FINANCING_LEASING_LEASER = 6,
  /** 租赁融资-将到期事件 */
  FINANCING_LEASING_EXPIRATION_EVENT = 7,

  /** 吊销/注销企业 */
  COMPANY_REVODE = 8,
  /** 新成立企业 */
  COMPANY_ESTABLISH = 9,

  /** 黑名单 */
  COMPANY_BLACKLISTED = 10,
  /** 国有企业节点 */
  COMPANY_STATEOWNED = 11,
  /** 供应商 */
  COMPANY_SUPPLIERS = 12,
  /** 科创 */
  COMPANY_SCIENCE_TECHNOLOGY = 13,
  /** 企业信用评级 */
  COMPANY_CREDIT_RATING = 14,
  /** 上市/发债 除ipo储备企业之外的其他节点 */
  COMPANY_LISTED_ENTERPRISE = 15,
  /** 上市/发债-ipo储备企业-ipo储备 */
  COMPANY_LISTED_IPO = 16,
  /** 上市/发债-ipo储备企业-上市后备*/
  COMPANY_LISTED_RESERVE,

  /** 债券融资(非金融企业)-债券存量 */
  FINANCING_NOTFINANCIAL_BOND_STOCK,
  /** 债券融资(非金融企业)-债券净融资 */
  FINANCING_NOTFINANCIAL_NET_FINANCE,
  /** 债券融资(非金融企业)-债券发行 */
  FINANCING_NOTFINANCIAL_BOND_ISSUE,
  /** 债券融资(非金融企业)-债券偿还 */
  FINANCING_NOTFINANCIAL_BOND_REPAY,
  /** 债券融资(非金融企业)-企业偿债压力 */
  FINANCING_NOTFINANCIAL_DEBT_REPAY,
  /** 债券融资(非金融企业)-债券发行列表 */
  FINANCING_NOTFINANCIAL_BOND_ISSUE_LIST,
  /** 债券融资(金融企业)-债券存量 */
  FINANCING_FINANCIAL_BOND_STOCK,
  /** 债券融资(金融企业)-债券净融资 */
  FINANCING_FINANCIAL_NET_FINANCE,
  /** 债券融资(金融企业)-债券发行 */
  FINANCING_FINANCIAL_BOND_ISSUE,
  /** 债券融资(金融企业)-债券偿还 */
  FINANCING_FINANCIAL_BOND_REPAY,
  /** 债券融资(金融企业)-债券发行列表 */
  FINANCING_FINANCIAL_BOND_ISSUE_LIST = 28,

  /** 入榜民企 */
  COMPANY_PRIVATE_ENTERPIRSES,
}

/** 区间范围中‘无限’需要传空的页面，比如十年以上，传[,xxxxx),不在该配置中的页面传[*,xxxxx) */
export const InfiniteIntervalIsEmpty = [
  /** 科创 */
  REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY,
  /** 供应商 */
  REGIONAL_PAGE.COMPANY_SUPPLIERS,
];

/** 日期传参格式为YYYY-MM-DD的页面，不在该配置中的页面日期格式为 YYYYMMDD */
export const NeedFormatDatePage = [
  /** 科创 */
  REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY,
  /** 国有企业 */
  REGIONAL_PAGE.COMPANY_STATEOWNED,
  /** 上市/发债 */
  REGIONAL_PAGE.COMPANY_LISTED_ENTERPRISE,
  REGIONAL_PAGE.COMPANY_LISTED_RESERVE,
  REGIONAL_PAGE.COMPANY_LISTED_IPO,
  /** 供应商 */
  REGIONAL_PAGE.COMPANY_SUPPLIERS,
  /** 信用评级 */
  REGIONAL_PAGE.COMPANY_CREDIT_RATING,
];

/** 区域融资-不同页面筛选接口配置 */
export const API_MAP = new Map([
  [
    REGIONAL_PAGE.FINANCING_IPO,
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/region/get-financing-type-statistic',
  ],
  [
    REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE,
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/region/get-financing-type-statistic',
  ],
  [
    REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT,
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/region/get-financing-type-statistic',
  ],
  [
    REGIONAL_PAGE.FINANCING_IPO_RESERVE,
    '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/region/get-ipo-reserve-statistic',
  ],
  [REGIONAL_PAGE.FINANCING_PEVC, '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/region/get-pevc-statistic'],
]);

export type ContainExpireType = '0' | '1' | undefined;

/** 区域融资-获取筛选项参数 */
export type ScreenParamsType = {
  /** 地区代码 */
  regionCode: string;
  /** 省市区 */
  registrationProvinceCode: string;
  registrationCityCode: string;
  registrationDistrictCode: string;
  /** 企业性质: 1-央企、2-央企子公司、3-国企、4-民企、5-城投、6-城投子公司、7-发债 */
  enterpriseNature: string;
  /** 上市板块: 沪市主板,深市主板,创业板,科创板,北交所 */
  listingPlate: string;
  /** 发行状态: 1-辅导期，2-在审，3-已过会待注册，4-已注册待发行 */
  releaseStatus: string;
  /** 搜索 */
  text: string;
  /** 披露日期 */
  disclosureDate: string;
  /** 投资机构 */
  investorCode: string;
  /** 行业赛道 */
  trackCode: string;
  /** 融资类型: IPO;公开增发;定向增发;配股 */
  financingType: string;
  /** 含到期租赁 */
  containExpire: ContainExpireType;
  /** 承租人/出租人 日期范围 */
  registerStartDateFrom: string;
  registerStartDateTo: string;
  /** 将到期事件 日期范围 */
  endDateFrom: string;
  endDateTo: string;
  [key: string]: any;
};

export const initScreenParams = {
  regionCode: '',
  registrationProvinceCode: '',
  registrationCityCode: '',
  registrationDistrictCode: '',
  enterpriseNature: '',
  financingType: '',
  listingPlate: '',
  releaseStatus: '',
  disclosureDate: '',
  investorCode: '',
  trackCode: '',
  text: '',
  containExpire: undefined,
  registerStartDateFrom: '',
  registerStartDateTo: '',
  endDateFrom: '',
  endDateTo: '',
};

/** 区域企业-获取筛选项参数 */
export type CompanyScreenParamsType = {
  regionCode: string;
  /** 科创企业的标签类型 */
  tagCode: string;
  /** 区域企业节点 TreeNodeMap映射的值|目录树节点branchId */
  treeNode: string;
  /** 上市发债企业-》ipo储备企业-》区分ipo储备 -1 /上市后备 -2 */
  tabType: any;
};

export const IPOEnterpriseTabTypeMap = new Map([
  [REGIONAL_PAGE.COMPANY_LISTED_IPO, 1],
  [REGIONAL_PAGE.COMPANY_LISTED_RESERVE, 2],
]);

/** 区域企业treeNode参数 */
export const TreeNodeMap = new Map([
  // [REGIONAL_PAGE.COMPANY_CENTRAL, '1'],
  // [REGIONAL_PAGE.COMPANY_CENTRAL_SUBSIDIARY, '2'],
  // [REGIONAL_PAGE.COMPANY_PROVINCIAL_STATEOWNED, '3'],
  // [REGIONAL_PAGE.COMPANY_PROVINCIAL_STATEOWNED_SUBSIDIARY, '4'],
  // [REGIONAL_PAGE.COMPANY_STATEOWNED, '5'],
  // [REGIONAL_PAGE.COMPANY_REVODE_DISHONEST, '9'],
  // [REGIONAL_PAGE.COMPANY_COUNTERFEITING_STATEOWNED, '10'],
  // [REGIONAL_PAGE.COMPANY_BLACKLISTED, '11'],
  // [REGIONAL_PAGE.COMPANY_CENTRAL_SUPPLIERS, '12'],
  // [REGIONAL_PAGE.COMPANY_LISTED_SUPPLIERS, '13'],
  // [REGIONAL_PAGE.COMPANY_GOVERMENT_SUPPLIERS, '14'],
  [REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY, '900800'],
  // [REGIONAL_PAGE.COMPANY_ESTABLISH, '16'],
]);

/** 区域企业-筛选结果 */
export type CompanyFilterResultType = {
  /** regionCode:初始状态传头部筛选的地区，筛选下属辖区时把选中的地区code都拼接到里边，不用带上头部的地区code */
  regionCode: string;
  /** 吊销注销企业-下属辖区筛选需要区分省市区 */
  registrationProvinceCode: string;
  registrationCityCode: string;
  registrationDistrictCode: string;
  /** 搜索关键字 */
  text: string;
  /** 国标行业 */
  industryCodeLevel1: string;
  industryCodeLevel2: string;
  industryCodeLevel3: string;
  industryCodeLevel4: string;
  /** 注册资本 */
  registeredCapital: string;
  /** 企业类型 */
  enterpriseType: string;
  /** 新成立企业-》企业类型 */
  businessTypes: string;
  /** 成立日期 */
  establishmentDate: string;
  /** 公布日期 */
  publishDate: string;
  /** 企业状态 */
  status: string;
  /** 上市/发债 */
  ipoType: string;
  /** 登记状态 */
  registrationAggs: string;
  /** 黑名单类型 */
  blackType: string;
  /** 首次发债日期 */
  bondStartDate: string;

  [key: string]: any;
};

export const initCompanyFilter = {
  regionCode: '',
  registrationProvinceCode: '',
  registrationCityCode: '',
  registrationDistrictCode: '',
  text: '',
  industryCodeLevel1: '',
  industryCodeLevel2: '',
  industryCodeLevel3: '',
  industryCodeLevel4: '',
  registeredCapital: '',
  enterpriseType: '',
  establishmentDate: '',
  publishDate: '',
  status: '',
  ipoType: '',
  registrationAggs: '',
  blackType: '',
  businessTypes: '',
  bondStartDate: '',
};

/** 区域企业-国标行业筛选结果入参字段 */
export const IndustryCodeLevelList = [
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
];

export const CodekeyMap = new Map<number, string>([
  [1, 'registrationProvinceCode'],
  [2, 'registrationCityCode'],
  [3, 'registrationDistrictCode'],
]);

/** 接口返回字段和页面筛选信息之间的映射 */
export const ScreenTitleMap = new Map([
  [
    'enterpriseNatureStat',
    {
      name: '企业类型',
      paramsKey: 'enterpriseNature',
    },
  ],
  [
    'releaseStatusStat',
    {
      name: '发行状态',
      paramsKey: 'releaseStatus',
    },
  ],
  [
    'financingTypeStat',
    {
      name: '发行方式',
      paramsKey: 'financingType',
    },
  ],
  [
    'listingPlateStat',
    {
      name: '上市板块',
      paramsKey: 'listingPlate',
    },
  ],
  [
    'trackStat',
    {
      name: '行业赛道',
      paramsKey: 'trackCode',
    },
  ],
  [
    'investorStat',
    {
      name: '投资机构',
      paramsKey: 'investorCode',
    },
  ],
]);

/** 区域融资-各页面所需的筛选 */
export const ScreenListMap = new Map([
  [REGIONAL_PAGE.FINANCING_IPO, ['enterpriseNatureStat', 'listingPlateStat']],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT, ['enterpriseNatureStat', 'listingPlateStat']],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE, ['enterpriseNatureStat', 'financingTypeStat', 'listingPlateStat']],
  [REGIONAL_PAGE.FINANCING_IPO_RESERVE, ['enterpriseNatureStat', 'releaseStatusStat']],
  [REGIONAL_PAGE.FINANCING_PEVC, ['trackStat', 'investorStat']],
]);

/** 获取筛选项需要加默认参数的页面配置 */
export const HasDefaultParamsPageMap = new Map([
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE, '公开增发,定向增发'],
  [REGIONAL_PAGE.FINANCING_IPO, 'IPO'],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT, '配股'],
]);

const lastOneYearRange: [Dayjs, Dayjs] = [
  dayjs(dayjs().subtract(1, 'year').format('YYYY-MM-DD')),
  dayjs(dayjs().format('YYYY-MM-DD')),
];

/** pevc、承租人、出租人 禁用未来时间，将到期禁用过去时间 */
const disableAfterdDate = (date: Dayjs) => date?.isAfter(dayjs());
const disabledBeforeDate = (date: Dayjs) => date?.isBefore(dayjs().subtract(1, 'day'));

/** 获取租赁融资页面筛选项 */
export const DateRangeSelectPage: Map<
  REGIONAL_PAGE,
  {
    rangeSelectInfo: {
      title: string;
      disabledDate: (date: Dayjs) => boolean;
      defaultRange?: [Dayjs, Dayjs];
    };
    filterKey?: string[];
    isSwitch?: boolean;
    rangeKey: string | ['registerStartDateFrom', 'registerStartDateTo'] | ['endDateFrom', 'endDateTo'];
  }
> = new Map([
  [
    REGIONAL_PAGE.FINANCING_PEVC,
    {
      rangeSelectInfo: {
        title: '披露日期',
        defaultRange: lastOneYearRange,
        disabledDate: disableAfterdDate,
      },
      rangeKey: 'disclosureDate',
    },
  ],
  [
    REGIONAL_PAGE.FINANCING_LEASING_LESSEE,
    {
      rangeSelectInfo: {
        title: '登记起始日',
        defaultRange: lastOneYearRange,
        disabledDate: disableAfterdDate,
      },
      filterKey: ['lesseeType'],
      isSwitch: true,
      rangeKey: ['registerStartDateFrom', 'registerStartDateTo'],
    },
  ],
  [
    REGIONAL_PAGE.FINANCING_LEASING_LEASER,
    {
      rangeSelectInfo: {
        title: '登记起始日',
        defaultRange: lastOneYearRange,
        disabledDate: disableAfterdDate,
      },
      filterKey: ['leaserType', 'enterpriseType'],
      isSwitch: true,
      rangeKey: ['registerStartDateFrom', 'registerStartDateTo'],
    },
  ],
  [
    REGIONAL_PAGE.FINANCING_LEASING_EXPIRATION_EVENT,
    {
      rangeSelectInfo: {
        title: '登记到期日',
        defaultRange: [dayjs(dayjs().format('YYYY-MM-DD')), dayjs(dayjs().add(1, 'year').format('YYYY-MM-DD'))],
        disabledDate: disabledBeforeDate,
      },
      rangeKey: ['endDateFrom', 'endDateTo'],
    },
  ],
]);

/** pageid对应的导出名 */
export const exportNameMap: Map<REGIONAL_PAGE, string> = new Map([
  [REGIONAL_PAGE.FINANCING_IPO, 'IPO融资'],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE, '再融资（增发）'],
  [REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT, '再融资（配股）'],
  [REGIONAL_PAGE.FINANCING_IPO_RESERVE, 'IPO储备企业'],
  [REGIONAL_PAGE.FINANCING_PEVC, 'PEVC'],
  [REGIONAL_PAGE.FINANCING_LEASING_LESSEE, '租赁融资（承租人）'],
  [REGIONAL_PAGE.FINANCING_LEASING_LEASER, '租赁融资（出租人）'],
  [REGIONAL_PAGE.FINANCING_LEASING_EXPIRATION_EVENT, '租赁融资（将到期事件）'],
]);

export const isPostExportPages = [
  REGIONAL_PAGE.COMPANY_REVODE,
  REGIONAL_PAGE.COMPANY_ESTABLISH,
  REGIONAL_PAGE.COMPANY_BLACKLISTED,
  REGIONAL_PAGE.COMPANY_STATEOWNED,
  REGIONAL_PAGE.COMPANY_SUPPLIERS,
  REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY,
  REGIONAL_PAGE.COMPANY_CREDIT_RATING,
  REGIONAL_PAGE.COMPANY_LISTED_ENTERPRISE,
  REGIONAL_PAGE.COMPANY_LISTED_RESERVE,
  REGIONAL_PAGE.COMPANY_LISTED_IPO,
];

export const exportTitleIsBranchName = [REGIONAL_PAGE.COMPANY_CREDIT_RATING, REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY];

export const isSamePageBranchNames = [
  REGIONAL_PAGE.COMPANY_SUPPLIERS,
  REGIONAL_PAGE.COMPANY_CREDIT_RATING,
  REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY,
];

/** 更多筛选->普通单选/多选的名称集合 */
export const InMoreOrdinaryTitleList = [
  '企业性质',
  '企业类型',
  '上市/发债',
  '企业层级',
  '最新状态',
  '市场分层',
  '拟上市板块',
  '上市板块',
  '供应商类型',
  '数据来源',
  '评级公司',
  '主体评级',
  '登记状态',
  '黑名单类型',
  '组织形式',
  '联系电话',
  '参控金融机构类型',
];

/** 更多筛选->时间类筛选的名称集合 */
export const InMoreTimeTitleList = ['成立日期', '公布日期', '评级日期', '首次发债日期'];

/** 更多筛选->可以自定义范围的筛选的名称集合 */
export const InMoreCustomRangeTitleList = [
  '所属央企控制比例',
  '第一大股东持股比例',
  '所属国企控制比例',
  '实控人控制比例',
  '所属发债企业控制比例',
  '所属城投控制比例',
  '所属上市公司控制比例',
  '参控上市公司比例',
  '注册资本',
];

/** 6.19变更 ：注册资本筛选和更多筛选的某一项互换位置 */
export const ReplaceAmountScreenMap: Map<string, string[]> = new Map([
  ['900843', ['marketLevel', 'registeredCapital']], // 新三板->市场分层和注册资本换位置
  ['900842', ['newStatus', 'registeredCapital']], // IPO储备企业->最新状态和注册资本换位置
  ['900855', ['mainRating', 'registeredCapital']], // AA-级及以下企业->主体评级和注册资本换位置
  // ['900849', ['financialOrgType', 'registeredCapital']], // 参控金融机构企业->参控金融机构类型和注册资本换位置
  // ['900848', ['indirectControllerRatio', 'registeredCapital']], // 参控上市公司企业-》参控上市公司比例和注册资本换位置
]);

/** 注册资本筛选需要改名字的branchId集合 */
export const NeedReplaceAmountName = [
  '900836', //中央企业
  '900838', //省属国企
  '900840', //国有企业
  '900844', //发债企业
  '900846', //城投企业
  '900848', //参控上市公司企业
  '900849', //参控金融机构企业
  '900851', //央企供应商
  '900859', //上市公司供应商
  '900860', //政府事业单位供应商
];

/** 企业分类 */
enum OrgTypeEnum {
  /** 非金融企业 */
  NOTFINANCE = '0',
  /** 金融企业 */
  FINANCE = '1',
}

/** 页面分类 */
enum PageTypeEnum {
  /** 债券存量 */
  STOCK = '1',
  /** 债券净融资 */
  NET_FINANCE = '2',
  /** 债券发行 */
  BOND_ISSUE = '3',
  /** 债券偿还 */
  BOND_REPAY = '4',
  /** 企业偿债压力 */
  ENTERPRICE_DEBT_REPAY = '5',
  /** 债券发行列表 */
  BOND_ISSUE_LIST = '6',
}

/** 债券融资筛选项入参 */
export const BondParamMap = new Map([
  [REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK, { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.STOCK }],
  [
    REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE,
    { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.NET_FINANCE },
  ],
  [
    REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE,
    { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.BOND_ISSUE },
  ],
  [
    REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY,
    { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.BOND_REPAY },
  ],
  [
    REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY,
    { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.ENTERPRICE_DEBT_REPAY, tabType: '' },
  ],
  [
    REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE_LIST,
    { orgType: OrgTypeEnum.NOTFINANCE, pageType: PageTypeEnum.BOND_ISSUE_LIST },
  ],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK, { orgType: OrgTypeEnum.FINANCE, pageType: PageTypeEnum.STOCK }],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE, { orgType: OrgTypeEnum.FINANCE, pageType: PageTypeEnum.NET_FINANCE }],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE, { orgType: OrgTypeEnum.FINANCE, pageType: PageTypeEnum.BOND_ISSUE }],
  [REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY, { orgType: OrgTypeEnum.FINANCE, pageType: PageTypeEnum.BOND_REPAY }],
  [
    REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE_LIST,
    { orgType: OrgTypeEnum.FINANCE, pageType: PageTypeEnum.BOND_ISSUE_LIST },
  ],
]);
