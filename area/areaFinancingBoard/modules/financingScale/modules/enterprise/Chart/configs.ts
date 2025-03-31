import { chartColorArr } from '@/pages/area/areaEconomy/modules/scientificEnterprises/modules/charts/china/info';
import { formatNumber } from '@/utils/format';

const getTootipContent = (params: any) => {
  let str = '<div>';
  let val = params.data?.percent ? params.data?.percent : '-';
  let sum = params.data?.count ? formatNumber(params.data?.count, 0) + '次' : '-';
  let total = isNaN(params.value) ? '-' : formatNumber(params.value) + '亿';
  str +=
    params.marker +
    params.name +
    '<br/><span>融资次数：' +
    sum +
    '</span><br/><span>融资总额：' +
    total +
    '</span><br/><span>占比：' +
    val +
    '</span></div>';
  return str;
};

export const PieOption = {
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    extraCssText: 'box-shadow: 2px 2px 10px 0 rgba(0,0,0,0.20); padding: 6px 12px;border-radius: 3px;z-index:2',
    textStyle: {
      color: '#3c3c3c',
    },
    formatter: getTootipContent,
  },
  series: [
    {
      type: 'pie',
      radius: [0, '50%'],
      center: ['50%', '45%'],
      data: [],
      emphasis: {
        label: {
          show: true,
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        show: true,
        position: 'outside',
      },
      labelLine: {
        length: 5,
        length2: 5,
      },
    },
  ],
  color: chartColorArr,
};
