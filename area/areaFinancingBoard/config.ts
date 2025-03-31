import dayJs from 'dayjs';

import { formatNumber } from '@/utils/format';

export enum REGIONAL_MODAL {
  //债券融资
  BOND_FINANCING = 'bondFinancing',
  // 信托融资
  TRUST_FINANCING = 'trustFinancing',
  LEASE_FINANCING = 'leaseFinancing',
  // 应收账款融资明细
  RECEIVE_FINANCING = 'receive_financing',
  //净融资额
  NET_FINANCING_AMOUNT = 'netFinancingAmount',
  //新发行债券只数
  BOND_ISSUED = 'bondIssued',
  //债券偿还压力
  BOND_REPAY_PRESSURE = 'bondRepayPressure',
}

export enum MODAL_TYPE {
  STOCKMARKET = 'stockMarket',
  PEVCFINANCING = 'PEVCFinancing',
  COMPANYDISTRIBUTION = 'listedCompanyDistribution',
  FINANCINGSCALE = 'FinancingScale',
}

const FORMATDAY = 'YYYY-MM-DD';

const compareDate = (range: string[], ignoreCurDay?: boolean) => {
  const curDay = dayJs().format('YYYYMMDD');
  const start = range[0];
  const end = range[1];
  const dateRange = `[${dayJs(start).format(FORMATDAY)},${dayJs(end).format(FORMATDAY)}]`;
  // 当天在时间段内
  if (start <= curDay && curDay <= end && !ignoreCurDay) {
    return `[${dayJs(start).format(FORMATDAY)},${dayJs(curDay).format(FORMATDAY)}]`;
  }

  return dateRange;
};

export const dateFormat = (date: string, ignoreCurDay?: boolean) => {
  if (!date) return undefined;
  const dateLen = date.length;
  const year = date.split('-')[0];
  const dateUnit = date.split('-')[1];

  switch (dateLen) {
    // 整年
    case 4:
      return compareDate([year + '0101', year + '1231'], ignoreCurDay);
    // 具体时间（债券净融资取开始时间到当天）
    case 10:
      return `[${dayJs(date).startOf('year').format(FORMATDAY)},${dayJs(date).format(FORMATDAY)}]`;
    // 半年、季、月
    default:
      switch (dateUnit) {
        case 'H1':
          return compareDate([year + '0101', year + '0630'], ignoreCurDay);
        case 'H2':
          return compareDate([year + '0701', year + '1231'], ignoreCurDay);
        case 'Q1':
          return compareDate([year + '0101', year + '0331'], ignoreCurDay);
        case 'Q2':
          return compareDate([year + '0401', year + '0630'], ignoreCurDay);
        case 'Q3':
          return compareDate([year + '0701', year + '0930'], ignoreCurDay);
        case 'Q4':
          return compareDate([year + '1001', year + '1231'], ignoreCurDay);
        default:
          return compareDate(
            [dayJs(date).startOf('month').format('YYYYMMDD'), dayJs(date).endOf('month').format('YYYYMMDD')],
            ignoreCurDay,
          );
      }
  }
};

export const clearNumber = (str: string) => {
  if (!str || str === '-') return '-';
  let data = str.toString();
  let newStr = data.replace(/,/g, '');
  return newStr;
};

export const formatUnit = (str: string) => {
  if (!str || str === '-') return '-';
  let newStr = clearNumber(str);
  let num = Number.parseFloat(newStr) / 10000;
  return formatNumber(num);
};

export const symbol =
  'image://data:image/png;base64,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';
export const blueSymbol =
  'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAAXNSR0IArs4c6QAAAlBJREFUSEu9llloE1EUhr87SSq2glrqRmNUMGApVUSxQk2FKgXtg6DghpRWBBVBBCvWFCEPpgv6IIgouDy54YOi1artQ4TQIiq40FJQsVGLS+paTYxkuTqMIZNJapDSmcdz/nO/O+eee+4R5Pqa5RQszCKOHZgI5CGJoxAiQRCFVxTyhu0i+q+lxIhOr5yGoBzJ9Fx7QfILwSOc9LFexLPpM0FSCryUI5ifE2AUSL4Q4w4eMWx0pYM8UmEc1SRw/DckFRD5k4lbuMWQfo10ULN0ISkZBSQZGiaPq+wToaQhBWqRc0lQlQ1SX4Zj12KWOwuZV2BjUjRB5H2IQd8A93d3ce9HlMxzsfCORtGeDrosLTxnAzBBD8q3otzeyDqXgxVA1sL59JO3de2cuPGCYMYmFTo5IAKqXQtukyXEcBmFD+upXTSDilypDMcYrrlAy91BPqdpBR9xiyspkFeuAmbqRUeqWLh3KTuStuvP4FA3PA1C0XjYVAqeSiiwaYrAN/rnHOdoxqasXGS/+C7wSSs91AGKXvRhD01T87XqO/sEtt0EaVilwg6+LWD7G7mzg9aTjxkwyHpoEr0CjyzCxlq9c5mdyf5aWlVbOArFx+BrJHsCz9TA1gWar+slHdWXuGZIXz9u4Re0STsxVuudDUtwHl5Jg2rzv4bKcyOf0uZSOL9G8/cO8aDsFKfT1AkCHBSdJoJMS91YF4OFbhpFn3aPTClvUy+saS1I/StTmmqy8E15JlSYaQ+fCjPlKdf3jjEfToxtTR23BLORFI9m3PoNgiUuKBfn4j8AAAAASUVORK5CYII=';
