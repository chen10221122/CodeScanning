import { color } from '@/pages/area/areaEconomy/modules/blackList/constant';
import { formatNumber } from '@/utils/format';
import { EchartsOption } from '@/utils/hooks';

export interface OptioinsProp {
  type: string;
  chartDataInfo?: {
    xAxisData: string[];
    data: string[];
  };
}

export const useOptioins = ({ type, chartDataInfo }: OptioinsProp) => {
  let option: EchartsOption = {};

  switch (type) {
    case 'yearGraph':
      option = {
        color: ['#619CFF'],
        title: [
          {
            text: '单位：家',
            padding: 0,
            top: 16,
            left: 17,
            textStyle: {
              color: '#434343',
              fontSize: 12,
              fontWeight: 400,
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          textStyle: {
            color: '#3c3c3c',
            fontSize: 14,
            lineHeight: 20,
          },
          extraCssText:
            'border-radius: 2px;padding: 10px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);',
          formatter: (paramsList: any) => {
            const params = paramsList[0];
            const curData = params?.data;
            const name = `<span>${params?.name ?? '-'}</span>`;
            const content = `
            <span><span style='display: inline-block;width: 8px; height: 8px; background: ${
              params.color
            }; margin-right: 6px;'></span>企业数量：</span>
            <span>${curData && !isNaN(+curData) ? formatNumber(curData, 0)?.replace('-', '') + '家' : '-'}</span>
            `;
            return `<div style='width: 172px'><div style='margin-bottom: 6px;'>${name}</div><div style='display: flex; align-items: center; justify-content: space-between;'>${content}</div></div>`;
          },
        },
        legend: {
          data: ['企业数量(家)'],
          icon: 'rect',
          itemWidth: 8,
          itemHeight: 8,
          padding: 6,
          bottom: 19,
          textStyle: {
            color: '#5c5c5c',
            fontWeight: 300,
            fontSize: 12,
          },
        },
        grid: {
          top: 45,
          right: 15,
          bottom: 48,
          left: 17,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: chartDataInfo?.xAxisData || [],
          axisLabel: {
            // rotate: 45,
            color: '#8c8c8c',
            fontWeight: 300,
          },
          axisLine: {
            lineStyle: {
              color: '#dfdfdf',
            },
            onZero: false,
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#dfdfdf',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#8c8c8c',
            fontWeight: 300,
            align: 'right',
            formatter(value: number) {
              return formatNumber(value, 0);
            },
          },
        },
        series: [
          {
            name: '企业数量(家)',
            data: chartDataInfo?.data || [],
            type: 'bar',
            barMaxWidth: 16,
          },
        ],
      };
      break;
    case 'durationAndStatusGraph':
      option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          textStyle: {
            color: '#3c3c3c',
            fontSize: 14,
            lineHeight: 20,
          },
          extraCssText:
            'border-radius: 2px;padding: 10px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);z-index: 5;',
          confine: true,
          formatter: (params: any) => {
            const curData = params?.data;
            const name = `<span>${params?.name ?? '-'}</span>`;
            const content = `
            <span><span style='display: inline-block;width: 8px; height: 8px; background: ${
              params.color
            }; margin-right: 6px;'></span>数量占比：</span>
            <span>${
              curData.value && !isNaN(+curData.value) ? formatNumber(curData.value, 2)?.replace('-', '') + '%' : '-'
            }</span>
            `;
            return `<div style='width: 172px'><div style='margin-bottom: 6px;'>${name}</div><div style='display: flex; align-items: center; justify-content: space-between;'>${content}</div></div>`;
          },
        },
        series: [
          {
            name: '企业数量',
            type: 'pie',
            top: 6,
            left: 16,
            bottom: 6,
            right: 16,
            radius: [55, 70],
            data: chartDataInfo?.data
              ? chartDataInfo.data.map((item: string, i: number) => {
                  return { value: String(item)?.replace('%', ''), name: chartDataInfo.xAxisData[i] || '' };
                })
              : [],
            itemStyle: {
              borderWidth: chartDataInfo?.data && chartDataInfo.data?.length > 1 ? 1 : 0,
              borderColor: '#fff',
              // color的设置
              color(params: { dataIndex: number }) {
                return color[params?.dataIndex];
              },
            },
          },
        ],
      };
      break;
    case 'enterpriseGraph':
      option = {
        // color: color,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          textStyle: {
            color: '#3c3c3c',
            fontSize: 14,
            lineHeight: 20,
          },
          extraCssText:
            'border-radius: 2px;padding: 10px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20);',
          formatter: (params: any) => {
            const curData = params?.data;
            if (curData.children) return '';
            const name = `<span>${params?.name ?? '-'}</span>`;
            const content = `
            <span><span style='display: inline-block;width: 8px; height: 8px; background: ${
              params.color
            }; margin-right: 6px;'></span>数量占比：</span>
            <span>${
              curData.value && !isNaN(+curData.value) ? formatNumber(curData.value, 2)?.replace('-', '') + '%' : '-'
            }</span>
            `;
            return `<div style='width: 172px'><div style='margin-bottom: 6px;'>${name}</div><div style='display: flex; align-items: center; justify-content: space-between;'>${content}</div></div>`;
          },
        },
        series: [
          {
            type: 'treemap',
            top: 18,
            left: 18,
            bottom: 16,
            right: 18,
            // 是否缩放，默认为可缩放
            roam: false,
            // 点击的行为
            nodeClick: false,
            // 底部的面包屑
            breadcrumb: {
              show: false,
            },
            // 内部文字标签
            label: {
              // {a}系列名 {b}数据名 {c}数据值
              formatter: '{b}：{c}%',
              lineHeight: 18,
            },
            itemStyle: {
              // 每个色块之间的间距
              gapWidth: chartDataInfo?.data && chartDataInfo.data?.length > 1 ? 1 : 0,
            },
            data: chartDataInfo?.data
              ? chartDataInfo.data.map((item: string, i: number) => {
                  return {
                    value: String(item)?.replace('%', ''),
                    name: chartDataInfo.xAxisData[i] || '',
                    itemStyle: {
                      color: color[i],
                    },
                  };
                })
              : [],
          },
        ],
      };
      break;
    default:
      return option;
  }

  return option;
};
