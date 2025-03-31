import { Options, ScreenType } from '@dzh/screen';
import dayJs from 'dayjs';

import BadImg from '@/pages/area/areaF9/modules/regionalOverview/areaScore/imgs/bad.png';
import GoodImg from '@/pages/area/areaF9/modules/regionalOverview/areaScore/imgs/good.png';
import { MAXSCORE } from '@/pages/area/areaF9/types';

// 获取当前年份
export const currentYear = dayJs().year() - 1;
export const currentYearString = currentYear.toString();
// export const currentYearString = '2023';

// 计算近五年的年份
const lastFiveYears: any[] = [];
for (let i = 0; i < 5; i++) {
  let cur = (currentYear - i).toString();

  lastFiveYears.push({ name: cur, value: cur });
}

export const yearArr = lastFiveYears;

export const rankTypes = [
  { name: '全国排名', value: '0' },
  { name: '全省排名', value: '1' },
];

export const dataConfig: Options[] = [
  {
    formatTitle: (selectedRows) => {
      // console.log("selectedRows", selectedRows)
      if (selectedRows.length === 0) return currentYearString;
      return selectedRows[0].name;
    },
    title: '年份',
    option: {
      type: ScreenType.SINGLE,
      children: lastFiveYears,
      default: lastFiveYears[0],
    },
  },
];

export const rankConfig: Options[] = [
  {
    formatTitle: (selectedRows) => {
      // console.log("selectedRows", selectedRows)
      if (selectedRows.length === 0) return rankTypes[0].name;
      return selectedRows[0].name;
    },
    title: '排名类型',
    option: {
      type: ScreenType.SINGLE,
      children: rankTypes,
      default: rankTypes[0],
    },
  },
];

export const tagList = [
  { color: '#FE813B', show: false, img: BadImg, className: 'bad' },
  { color: '#FFDB49', show: false, img: BadImg, className: 'bad' },
  { color: '#BCEC7A', show: false, img: GoodImg, className: 'good' },
  { color: '#37C572', show: false, img: GoodImg, className: 'good' },
];

export const pointText = '该指标原数据缺失，采用过往数据，同行政级别均值等进行代替。';

export const indiMap = [
  // { text: '综合得分', max: MAXSCORE, axisLabel: { show: false }, indi: 'comprehensiveScore', avg: 'avgComprehensiveScore' },
  {
    text: '经济实力',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'economicStrength',
    tenIndi: 'tenGradeEconomicStrength',
    avg: 'avgEconomicStrength',
    tenAvg: 'tenGradeAvgEconomicStrength',
  },
  {
    text: '财政实力',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'financialQuality',
    tenIndi: 'tenGradeFinancialQuality',
    avg: 'avgFinancialQuality',
    tenAvg: 'tenGradeAvgFinancialQuality',
  },
  {
    text: '债务压力',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'debtPressure',
    tenIndi: 'tenGradeDebtPressure',
    avg: 'avgDebtPressure',
    tenAvg: 'tenGradeAvgDebtPressure',
  },
  {
    text: '金融资源',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'financialResource',
    tenIndi: 'tenGradeFinancialResource',
    avg: 'avgFinancialResource',
    tenAvg: 'tenGradeAvgFinancialResource',
  },
  {
    text: '信用风险',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'creditRisk',
    tenIndi: 'tenGradeCreditRisk',
    avg: 'avgCreditRisk',
    tenAvg: 'tenGradeAvgCreditRisk',
  },
  // { text: '营商环境', max: MAXSCORE, axisLabel: { show: false }, indi: 'business', avg: 'avgBusiness' },
  {
    text: '科创能力',
    max: MAXSCORE,
    axisLabel: { show: false },
    indi: 'technologicalCapability',
    tenIndi: 'tenGradeTechnologicalCapability',
    avg: 'avgTechnologicalCapability',
    tenAvg: 'tenGradeAvgTechnologicalCapability',
  },
];
