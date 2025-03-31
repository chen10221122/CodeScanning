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

const indiMap = [
  // { text: '综合得分', max: 5, axisLabel: { show: false }, indi: 'comprehensiveScore', avg: 'avgComprehensiveScore' },
  { text: '经济实力', max: 5, axisLabel: { show: false }, indi: 'economicStrength' },
  { text: '财政实力', max: 5, axisLabel: { show: false }, indi: 'financialQuality' },
  { text: '债务压力', max: 5, axisLabel: { show: false }, indi: 'debtPressure' },
  { text: '金融资源', max: 5, axisLabel: { show: false }, indi: 'financialResource' },
  { text: '信用风险', max: 5, axisLabel: { show: false }, indi: 'creditRisk' },
  { text: '营商环境', max: 5, axisLabel: { show: false }, indi: 'business' },
  {
    text: '科创能力',
    max: 5,
    axisLabel: { show: false },
    indi: 'technologicalCapability',
  },
];

// export const getOption = (indicatorScore) => {
//   const indiData = () => {
//     let tempData = [];
//     if (!indicatorScore) {
//       tempData = Array(7).fill(0);
//     } else {
//       indiMap.forEach((_, i) => {
//         tempData.push(+indicatorScore[indiMap[i].indi]);
//       });
//     }
//     return tempData;
//   };
//   // console.log('indicatorScore', indicatorScore, 'indiData', indiData());
//   return {
//     color: ['#0788FF'],
//     tooltip: {
//       trigger: 'item',
//       // position: ['10%', '50%'],
//       confine: true,
//       textStyle: {
//         color: 'rgba(255, 255, 255, 1)',
//       },
//       borderColor: 'transparent',
//       backgroundColor: 'rgba(50, 50, 50, 0.7)',
//       formatter: function (params) {
//         let dom = `<div>${params.name}</div>`;
//         // console.log('params', params);
//         if (params.data?.value?.length) {
//           dom += indiMap.reduce((res, o, i) => {
//             res += `<div>${o.text}: ${params.data.value[i]}</div>`;
//             return res;
//           }, '');
//         }
//         return dom;
//       },
//     },
//     grid: {
//       top: 10,
//       containLabel: true,
//     },
//     radar: [
//       {
//         splitArea: {
//           areaStyle: {
//             color: ['#fff'],
//           },
//         },
//         axisLabel: {
//           show: true,
//           color: 'red',
//         },
//         axisLine: {
//           lineStyle: {
//             color: '#ddd',
//           },
//         },
//         splitNumber: 4,
//         splitLine: {
//           lineStyle: {
//             color: ['#eee'],
//           },
//         },
//         nameGap: 10,
//         indicator: indiMap,
//         name: {
//           textStyle: {
//             color: '#595959',
//             lineHeight: 22,
//           },
//         },
//         // axisName: {
//         //   color: 'red',
//         // },
//         radius: 82,
//         center: ['50%', '50%'],
//       },
//     ],
//     series: [
//       {
//         type: 'radar',
//         // radarIndex: 1,
//         areaStyle: {},
//         symbol: 'none',
//         lineStyle: {
//           width: 1,
//         },
//         data: [
//           {
//             value: indiData(),
//             name: '得分',
//             areaStyle: { opacity: 0.2 },
//           },
//         ],
//       },
//     ],
//   };
// };

export const getOption = (indicatorScore) => {
  const indiData = () => {
    let tempData = [];
    if (!indicatorScore) {
      tempData = Array(7).fill(0);
    } else {
      indiMap.forEach((_, i) => {
        tempData.push(+indicatorScore[indiMap[i].indi]);
      });
    }
    return tempData;
  };

  return {
    color: ['#3986FE'],
    grid: {
      top: 10,
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      borderColor: 'transparent',
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      formatter: function (params) {
        let dom = `<div>${params.name}</div>`;
        // console.log('params', params);
        if (params.data?.value?.length) {
          dom += indiMap.reduce((res, o, i) => {
            res += `<div>${o.text}: ${params.data.value[i]}</div>`;
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
      indicator: indiMap,
      name: {
        // formatter(text) {
        //   return indicatorScore ? [`{a|${text}}`, `{b|${formatNumber(data[RADAR_OBJ_MAP[text]])}}`].join('\n') : text;
        // },
        formatter(text) {
          let indiValue = indiData();
          let b = indiMap.findIndex((d) => d.text === text);
          return indicatorScore && b !== -1 ? [`{a|${text}}`, `{b|${indiValue[b]}}`].join('\n') : text;
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
        areaStyle: { opacity: 0.2 },
        symbol: 'emptyCircle',
        symbolSize: 4,
        data: [
          {
            value: indiData(),
            name: '得分',
          },
        ],
      },
    ],
  };
};
