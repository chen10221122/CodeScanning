import { isNumber } from 'lodash';

import { formatNumber } from '@/utils/format';

const renderContent = (value, row, index) => {
  const obj = {
    children: isNumber(value) ? formatNumber(value) : value ? <div className="text-center">{value}</div> : '-',
    props: {},
  };
  if (index === 11) {
    obj.props.colSpan = 0;
  }
  return obj;
};
export const columns = [
  {
    title: '指标',
    colSpan: 2,
    width: 86,
    dataIndex: 'partName',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      const arr = [4, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1];
      obj.props.rowSpan = arr[index];
      if (index === 11) {
        obj.props.colSpan = 2;
      }
      return obj;
    },
  },
  {
    title: '指标',
    colSpan: 0,
    dataIndex: 'name',
    width: 154,
    align: 'left',
    render: (value, row, index) => {
      const obj = {
        children: value ? value : '-',
        props: {},
      };
      if (index === 11) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: '权重',
    dataIndex: 'proportion',
    width: 72,
    align: 'right',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 11) {
        obj.props.colSpan = 3;
        if (row?.total) obj.children = row.total;
      }
      return obj;
    },
  },
  {
    title: '指标值',
    width: 88,
    dataIndex: 'value',
    align: 'right',
    render: renderContent,
  },
  {
    title: '具体得分',
    dataIndex: 'rating',
    width: 80,
    align: 'right',
    render: renderContent,
  },
];

const dataKey = [
  'rating_economic',
  'rating_region_neg_tag',
  'rating_region_public_opinion_index',
  'rating_debt',
  'rating_financial_solvency',
];
const RADAR_OBJ_MAP = {
  经济实力: 'rating_economic',
  产业状况: 'rating_region_neg_tag',
  舆情: 'rating_region_public_opinion_index',
  债务负担: 'rating_debt',
  财政实力: 'rating_financial_solvency',
};
export const getOption = (data) => {
  return {
    color: ['#3986FE'],
    grid: {
      top: 10,
    },
    tooltip: {
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      borderColor: 'transparent',
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      trigger: 'item',
      formatter: function (params) {
        let dom = '';
        if (params?.data?.value?.length) {
          dom = Object.keys(RADAR_OBJ_MAP).reduce((res, o, i) => {
            res += `<div>${o}: ${params.data.value[i]}</div>`;
            return res;
          }, '');
        }
        return dom;
      },
    },
    legend: {
      left: 'center',
      data: ['地区综合得分'],
      show: false,
    },
    radar: {
      indicator: [
        { text: '经济实力', max: 5 },
        { text: '产业状况', max: 5, axisLabel: { show: false } },
        { text: '舆情', max: 5, axisLabel: { show: false } },
        { text: '债务负担', max: 5, axisLabel: { show: false } },
        { text: '财政实力', max: 5, axisLabel: { show: false } },
      ],
      name: {
        formatter(text) {
          return data ? [`{a|${text}}`, `{b|${formatNumber(data[RADAR_OBJ_MAP[text]])}}`].join('\n') : text;
        },
        textStyle: {
          rich: {
            a: {
              color: 'rgba(0,0,0,0.45)',
              lineHeight: 22,
            },
            b: {
              color: '#fff',
              borderRadius: 3,
              backgroundColor: '#3986FE',
              padding: [2, 7, 4, 7],
              align: 'center',
            },
          },
        },
      },
      splitArea: {
        areaStyle: {
          color: ['#fff'],
        },
      },
      axisLabel: {
        show: true,
        color: '#aaa',
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: ['#eee'],
        },
      },
      center: ['50%', '50%'],
      radius: 82,
    },
    series: [
      {
        type: 'radar',
        tooltip: {
          trigger: 'item',
        },
        symbol: 'emptyCircle',
        symbolSize: 4,
        areaStyle: { opacity: 0.2 },
        data: [
          {
            value: Object.keys(RADAR_OBJ_MAP).map((o, i) => (data ? formatNumber(data[dataKey[i]]) : '')),
            name: '得分',
          },
        ],
      },
    ],
  };
};
