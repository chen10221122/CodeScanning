import { useMemo } from 'react';

import { LAND_BUSINESS_TYPE_CHARTDATA } from '@/pages/area/areaF9/modules/regionalLand/const';
import { formatDate, extractedData } from '@/pages/area/areaF9/modules/regionalLand/utils';

const useChart = ({ dataSource }: any) => {
  const chartData = useMemo(() => {
    const sortedData = [...dataSource].sort((a, b) => Number(formatDate(a.date)) - Number(formatDate(b.date)));

    const formatedData = extractedData(LAND_BUSINESS_TYPE_CHARTDATA, sortedData);
    const {
      date,
      landDealTotalPrice,
      centralLandDealAmount,
      centralLandDealAmountRatio,
      stateLandDealAmount,
      stateLandDealAmountRatio,
      privateLandDealAmount,
      privateLandDealAmountRatio,
      urbanLandDealAmount,
      urbanLandDealAmountRatio,
      listingLandDealAmount,
      listingLandDealAmountRatio,
      realEstateLandDealAmount,
      realEstateLandDealAmountRatio,
    } = formatedData;
    const xAxisData = date;

    const data = [
      {
        data: urbanLandDealAmount,
        name: '城投拿地金额(亿元)',
        type: 'bar',
        color: '#3B87FF',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: urbanLandDealAmountRatio,
        name: '城投拿地金额占比(%)',
        type: 'line',
        color: '#3B87FF',
        yAxisIndex: 1,
        barWidth: 50,
      },

      {
        data: centralLandDealAmount,
        name: '央企拿地金额(亿元)',
        type: 'bar',
        color: '#51DEFF',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: centralLandDealAmountRatio,
        name: '央企拿地金额占比(%)',
        type: 'line',
        color: '#51DEFF',
        barWidth: 50,
        yAxisIndex: 1,
      },
      {
        data: stateLandDealAmount,
        name: '国企拿地金额(亿元)',
        type: 'bar',
        color: '#16DC93',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: stateLandDealAmountRatio,
        name: '国企拿地金额占比(%)',
        type: 'line',
        color: '#16DC93',
        barWidth: 50,
        yAxisIndex: 1,
      },
      {
        data: privateLandDealAmount,
        name: '民企拿地金额(亿元)',
        type: 'bar',
        color: '#C0E825',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: privateLandDealAmountRatio,
        name: '民企拿地金额占比(%)',
        type: 'line',
        color: '#C0E825',
        barWidth: 50,
        yAxisIndex: 1,
      },
      {
        data: realEstateLandDealAmount,
        name: '房企拿地金额(亿元)',
        type: 'bar',
        color: '#FFD923',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: realEstateLandDealAmountRatio,
        name: '房企拿地金额占比(%)',
        type: 'line',
        color: '#FFD923',
        barWidth: 50,
        yAxisIndex: 1,
      },
      {
        data: listingLandDealAmount,
        name: '上市公司拿地金额(亿元)',
        type: 'bar',
        color: '#FF9630',
        barWidth: 10,
        yAxisIndex: 0,
      },
      {
        data: listingLandDealAmountRatio,
        name: '上市公司拿地金额占比(%)',
        type: 'line',
        color: '#FF9630',
        barWidth: 50,
        yAxisIndex: 1,
      },
    ];
    const AllDataforTooltip = {
      data: landDealTotalPrice,
      name: '成交总金额(亿元)',
    };
    const legendData = [
      {
        name: '城投拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '央企拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '国企拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '民企拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '房企拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '上市公司拿地金额(亿元)',
        icon: 'rect',
      },
      {
        name: '城投拿地金额占比(%)',
      },
      {
        name: '央企拿地金额占比(%)',
      },
      {
        name: '国企拿地金额占比(%)',
      },
      {
        name: '民企拿地金额占比(%)',
      },
      {
        name: '房企拿地金额占比(%)',
      },
      {
        name: '上市公司拿地金额占比(%)',
      },
    ];
    const initialSelected = {
      '上市公司拿地金额(亿元)': false,
      '城投拿地金额(亿元)': true,
      '房企拿地金额(亿元)': false,
      '央企拿地金额(亿元)': true,
      '国企拿地金额(亿元)': true,
      '民企拿地金额(亿元)': false,
      '上市公司拿地金额占比(%)': false,
      '城投拿地金额占比(%)': true,
      '房企拿地金额占比(%)': false,
      '央企拿地金额占比(%)': true,
      '国企拿地金额占比(%)': true,
      '民企拿地金额占比(%)': false,
    };
    const yAxisData = [
      {
        text: '拿地金额(亿元)',
        padding: [1, 0, 0, 0],
        left: 0,
        textStyle: {
          color: '#494949',
          fontSize: 12,
          fontWeight: 400,
        },
      },
      {
        text: '占比(%)',
        padding: [1, 0, 0, 0],
        right: 0,
        textStyle: {
          color: '#494949',
          fontSize: 12,
          fontWeight: 400,
        },
      },
    ];
    return {
      AllDataforTooltip,
      selected: initialSelected,
      yAxisData,
      xAxisData,
      data,
      legendData,
      legendBottom: 2,
      gridBottom: 37,
      itemGap: 8,
    };
  }, [dataSource]);
  return chartData;
};

export default useChart;
