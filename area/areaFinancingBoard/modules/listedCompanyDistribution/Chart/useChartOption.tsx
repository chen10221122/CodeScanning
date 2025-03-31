import { useMemo } from 'react';

import { chartColorArr } from '@/pages/area/areaEconomy/modules/scientificEnterprises/modules/charts/china/info';

const getTootipContent = (params: any) => {
  let str = '<div>';
  let sum = params.data?.count ? params.data?.count : '-';
  let total = params.data?.amount ? params.data?.amount + '亿' : '-';
  str +=
    params.marker + params.name + '<br/><span>公司家数：' + sum + '</span><br/><span>总市值：' + total + '</span><br/>';
  return str;
};
const useChartOption = (tableData: any[]) => {
  const option = useMemo(() => {
    return {
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
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: tableData.filter((item) => item.name !== '总计'),
          emphasis: {
            label: {
              show: true,
            },
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              // shadowColor: 'rgba(0, 0, 0, 0.5)',
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
  }, [tableData]);
  return option;
};

export default useChartOption;
