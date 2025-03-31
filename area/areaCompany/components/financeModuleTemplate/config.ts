import dayJs from 'dayjs';

import { ScreenValues } from '@/components/screen';
import { BondFicancialParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

const FORMATDAY = 'YYYY-MM-DD';
const curDay = dayJs().format(FORMATDAY);

/** 金融企业表格默认入参 */
const financeInitParam = {
  frequency: 'y',
  orgType: '1',
  tabType: '3',
  bondCategory: "2,3,4,5,6,7,8,11",
  changeDate: `[${dayJs().subtract(9, 'year').startOf('year').format(FORMATDAY)},${curDay}]`,
  from: 0,
  size: PAGESIZE,
};

/** 非金融企业表格默认入参 */
const notFinanceInitParam = {
  frequency: 'y',
  orgType: '0',
  tabType: '3',
  bondCategory: "6,7,8,9,10",
  changeDate: `[${dayJs().subtract(9, 'year').startOf('year').format(FORMATDAY)},${curDay}]`,
  from: 0,
  size: PAGESIZE,
};


/** 债券融资模块 - 默认筛选项 */
export const getFilterDefault = (pageType: REGIONAL_PAGE) => {
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
      return [['y0'], [], [], ['00']] as ScreenValues;
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
      return [['y0'], [], ['00']] as ScreenValues;
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY:
      return [[], [], ['00']] as ScreenValues;
    default:
      return [['y0'], [], [], []] as ScreenValues;
  }
};

/** 债券融资模块调用的方法，判断是不是金融企业 */
export const isFinancialEnterprice = (pageType: REGIONAL_PAGE) => {
  return (
    pageType >= REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK &&
    pageType <= REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE_LIST
  );
};

/** 债券融资模块 - 页面表格默认参数 */
export const getDefaultParam = (pageType?: REGIONAL_PAGE): BondFicancialParams => {
  const startYear = dayJs().startOf('year').format(FORMATDAY);
  const endYear = dayJs().endOf('year').format(FORMATDAY);
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE:
      return financeInitParam;
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE:
      return {
        ...financeInitParam,
        changeDate: `[${dayJs().subtract(9, 'year').startOf('year').format(FORMATDAY)},${endYear}]`
      };
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
      return {
        ...financeInitParam,
        sCaliber: '0',
        changeDate: `[${startYear},${dayJs().add(9, 'year').endOf('year').format(FORMATDAY)}]`
      };

    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE:
      return {
        ...notFinanceInitParam,
        changeDate: `[${dayJs().subtract(9, 'year').startOf('year').format(FORMATDAY)},${endYear}]`
      };
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
      return {
        ...notFinanceInitParam,
        sCaliber: '0',
        changeDate: `[${startYear},${dayJs().add(9, 'year').endOf('year').format(FORMATDAY)}]`
      };
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY:
      return {
        orgType: '0',
        tabType: '3',
        sCaliber: '0',
        from: 0,
        size: PAGESIZE,
        sortKey: `${curDay}至${endYear}_amount`,
        sortRule: 'desc',
        bondCategory: "6,7,8,9,10",
        changeDate: `[${curDay},${dayJs().add(4, 'year').endOf('year').format(FORMATDAY)}]`
      };
    default:
      return notFinanceInitParam;
  }
};

/** 债券融资模块-明细弹窗标题后缀 */
export const getDetailTitle = (pageType: REGIONAL_PAGE) => {
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE:
      return '净融资明细';
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE:
      return '发行明细';
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
      return '偿还明细';
    default:
      return '存量明细';

  }
}

/** 债券融资模块-明细弹窗底部说明文字 */
export const getBottomRemark = (pageType: REGIONAL_PAGE) => {
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
      return '注：同一只债券出现多次偿还时，债券明细中会多次展示该只债券。';
    default:
      return '';

  }
};

/** 债券融资模块 - 明细弹窗的默认排序字段 */
export const getSortKey = (pageType: REGIONAL_PAGE) => {
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK:
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_STOCK:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE:
      return 'issueDate';
    default:
      return 'changeDate';
  }
};

/** 债券融资模块-明细弹窗导出 */
export const getDetailModalType = (pageType?: REGIONAL_PAGE) => {
  let exportInfo = { moduleType: 'bond_financing_common_stat', types: '' };
  switch (pageType) {
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE:
      exportInfo.types = '2';
      break;
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE:
      exportInfo.types = '3';
      break;
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_REPAY:
    case REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY:
      exportInfo.types = '4';
      break;
    case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY:
      exportInfo.types = '5';
      exportInfo.moduleType = 'bond_financing_debt_repay_stat';
      break;
    default:
      exportInfo.types = '1';
  }
  return exportInfo;
};

const compareDate = (pageType: REGIONAL_PAGE, range: string[]) => {
  const curDay = dayJs().format('YYYYMMDD');
  const start = range[0];
  const end = range[1];
  const dateRange = `[${dayJs(start).format(FORMATDAY)},${dayJs(end).format(FORMATDAY)}]`;
  // 当天在时间段内
  if (start <= curDay && curDay <= end) {
    switch (pageType) {
      /** 债券净融资 取时间段的开始时间到当天*/
      case REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE:
      case REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE:
        return `[${dayJs(start).format(FORMATDAY)},${dayJs(curDay).format(FORMATDAY)}]`;
      default:
        /** 债券发行 直接取开始时间和结束时间 */
        return dateRange;
    }
  }

  return dateRange;
}

export const dateFormat = (date: string, pageType: REGIONAL_PAGE) => {
  const dateLen = date.length;
  const year = date.split('-')[0];
  const dateUnit = date.split('-')[1];

  switch (dateLen) {
    // 整年
    case 4: return compareDate(pageType, [year + '0101', year + '1231']);
    // 具体时间（债券净融资取开始时间到当天）
    case 10: return `[${dayJs(date).startOf('year').format(FORMATDAY)},${dayJs(date).format(FORMATDAY)}]`;
    // 半年、季、月
    default:
      switch (dateUnit) {
        case 'H1': return compareDate(pageType, [year + '0101', year + '0630']);
        case 'H2': return compareDate(pageType, [year + '0701', year + '1231']);
        case 'Q1': return compareDate(pageType, [year + '0101', year + '0331']);
        case 'Q2': return compareDate(pageType, [year + '0401', year + '0630']);
        case 'Q3': return compareDate(pageType, [year + '0701', year + '0930']);
        case 'Q4': return compareDate(pageType, [year + '1001', year + '1231']);
        default: return compareDate(pageType, [dayJs(date).startOf('month').format('YYYYMMDD'), dayJs(date).endOf('month').format('YYYYMMDD')]);
      }
  }
}
