import { useMemo } from 'react';

const calcMax = (arr: number[]) => {
  let max = Math.max.apply(null, arr);
  // 不让最高值超过最上面的刻度
  return Math.ceil((max / 9.5) * 10);
};

const useChartOption = (dateArray: any[], stockArray: any[], ratioArray: any[], regionName: string) => {
  const option: any = useMemo(() => {
    return {
      legend: {
        type: 'plain',
        bottom: 0,
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 24,
        textStyle: {
          color: '#595959',
          lineHeight: 16,
          padding: [0, 0, -2, 0],
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255, 0.87)',
        extraCssText: 'box-shadow:1px 1px 5px 0 rgba(0,0,0,0.2);',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(61, 127, 243, .04)',
          },
        },
        textStyle: {
          fontSize: 12,
          color: '#3C3C3C',
        },
        padding: 8,
        formatter(params: any[]) {
          let tip = ''; //提示内容
          if (params && params.length > 0) {
            params.forEach((item) => {
              item.value || item.value === 0
                ? (tip += item.marker + item.seriesName + '：' + item.value + '<br/>')
                : (tip += item.marker + item.seriesName + '：-<br/>');
            });
          }
          return tip;
        },
      },
      grid: {
        top: 12,
        left: 0,
        right: 0,
        bottom: 30,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: dateArray,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#E2E6EC',
            },
          },
          axisLabel: {
            fontSize: 12,
            color: '#8C8C8C',
            /* interval: 0,
            rotate: 25, */
          },
        },
      ],
      yAxis: [
        {
          // name: `亿元`,
          type: 'value',
          position: 'left',
          nameTextStyle: {
            // align: 'left',
            color: '#8c8c8c',
            fontSize: 12,
            //左侧的y轴存在时，且单位长度是两位时要右移10px，防止单位显示不全
            padding: [0, 0, 0, -30],
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
            color: '#b7b7b7',
          },
          axisLabel: {
            color: '#8c8c8c',
            fontSize: 12,
            align: 'right',
          },
          splitLine: {
            lineStyle: {
              color: '#efefef',
              type: 'dashed',
            },
          },
          min: 0,
          max: calcMax(stockArray),
          splitNumber: 5,
        },
        {
          // name: '%', //%前面的空格千万别删！！！不然当echartsUnit为%时两个y轴会重合
          offset: 0,
          nameTextStyle: {
            // align: 'left',
            color: '#595959',
            fontSize: 12,
            padding: [0, 0, 0, 8],
          },
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#dfdfdf',
            },
          },
          axisTick: {
            show: false,
            color: '#b7b7b7',
          },
          axisLabel: {
            color: '#8c8c8c',
            fontSize: 12,
            align: 'left',
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#efefef',
              type: 'dashed',
            },
          },
          min: 0,
          // max: 1,
        },
      ],
      series: [
        {
          name: `银行总授信规模`,
          type: 'bar',
          barWidth: 50,
          itemStyle: {
            color: '#3986FE',
          },
          data: stockArray,
          yAxisIndex: 0,
        },
        {
          name: `${regionName}授信规模占比`,
          type: 'line',
          itemStyle: {
            color: '#EDB965',
          },
          data: ratioArray,
          yAxisIndex: 1,
        },
      ],
    };
  }, [dateArray, ratioArray, stockArray, regionName]);
  return option;
};

export default useChartOption;
