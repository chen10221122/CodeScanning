import { Service } from 'ahooks/lib/useRequest/src/types';

type ModuleType = 'riskMonitoring' | 'leaseFinancing' | 'receivableAccountsFinancing' | 'trustFinancing';

//列表
export interface ModuleListProps {
  listApiFunction: Service<Record<string, any>, any[]>;
  type: ModuleType;
}

//详情
export interface ModuleDetailProps {
  detailListApiFunction: Service<Record<string, any>, any[]>;
}

export interface DefaultCondition {
  from: number;
  size: number;
  sortRule: string;
  sortKey: string;
}

export interface DetailColumnsProps {
  curPage: number;
  tableRef?: any;
  data?: any;
  type?: any;
  branchType?: any;
}

//企业融资规模
export interface FinancingScaleList {
  financeType: string; //融资类型
  financeNum: string; //融资次数
  financeAmount: string; //融资额
  percent: string; //占比
  dataType: string; //数据类型
}

//风险监测
export interface RiskMonitoringList {
  riskType: string; //风险类型
  companyNum: string; //涉公司家数
  eventNum: string; //事件总量
  amount: string; //涉及金额(亿元)
  dataType: string; //数据类型
}

//债券净融资
export interface BondNetFinancingList {
  date: string; //日期
  netFinanceAmount: string; //净融资额(亿)
  totalIssueAmount: string; //总发行额(亿)
  totalRepayAmount: string; //总偿还额(亿)
  bondNum: number; //新发行债券只数
  weightedAverageCoupon: number; //加权平均票面利率(%)
  nationalWeightedAverageCoupon: string; //全国加权平均票面利率(%)
  ignoreCurDay?: boolean; //是否忽略当天日期
}

//债券偿还压力
export interface BondRepaymentList {
  year: string; //年度
  totalRepayAmount: string; //总偿还(亿元)
  expireAmount: string; //到期(亿元)
  soldAmount: string; //回售(亿元)
  redeemAmount: string; //赎回(亿元)
  preRepayAmount: string; //提前偿还(亿元)
  otherAmount: string; //其他(亿元)
}

//租赁融资
export interface LeaseFinancingList {
  registStartDate: string; //登记起始日期
  financeEventNum: string; //新增租赁事件数
  financeAmount: string; //融资总额(亿元)
}

//应收账款融资
export interface ReceivableAccountsList {
  financeAmount: string; //融资额（万元）
  financeEventNum: string; //新增融资事件数
  registStartDate: string; //登记起始日
}

//信托融资
export interface TrustFinancingLsit {
  startDate: string; //起始日
  financeEventNum: string; //新增融资事件数
  totalFinanceAmount: string; //融资总额(亿元)
}
