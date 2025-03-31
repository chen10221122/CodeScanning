import { memo, useEffect, useMemo } from 'react';

import { isNumber } from 'lodash';
import styled from 'styled-components';

import { Rate, Table } from '@/components/antd';
import { useTab } from '@/libs/route';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

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
const AreaRateDetail = ({ data, leftTitleContent }) => {
  // console.log(data, 'model数据');
  const windowHeight = window.innerHeight;
  const option = useMemo(() => {
    return {
      color: ['#3986FE'],
      tooltip: {
        trigger: 'item',
        textStyle: {
          color: 'rgba(255, 255, 255, 1)',
        },
        borderColor: 'transparent',
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
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
        radius: 102,
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
  }, [data]);
  const [chartRef, chartInstance] = useECharts(option, 'canvas');
  const dataSource = [
    {
      key: '1',
      partName: '经济实力(32%)',
      name: '行政等级',
      proportion: '22%',
      value: '',
      className: 'bg-blue',
      rating: data?.rating_admin_level,
    },
    {
      key: '2',
      partName: '经济实力(25%)',
      name: 'GDP(亿元)',
      proportion: '47%',
      value: data?.ref_val_gdp,
      rating: data?.rating_gdp,
    },
    {
      key: '3',
      partName: '经济实力(25%)',
      name: '人均GDP(元)',
      proportion: '19%',
      value: data?.ref_val_gdp_per_capita,
      rating: data?.rating_gdp_per_capita,
    },
    {
      key: '4',
      partName: '经济实力(25%)',
      name: '近三年GDP增速均值(%)',
      proportion: '12%',
      value: isNumber(data?.ref_val_gdp_increasing_speed_in_3yr)
        ? data?.ref_val_gdp_increasing_speed_in_3yr - 100
        : '-',
      rating: data?.rating_gdp_increasing_speed_in_3yr,
    },
    {
      key: '5',
      partName: '财政实力(39%)',
      name: '一般公共预算收入(亿元)',
      proportion: '51%',
      value: data?.ref_val_public_budget_income,
      rating: data?.rating_public_budget_income,
    },
    {
      key: '6',
      partName: '财政实力(25%)',
      name: '近三年一般公共预算收入增速均值(%)',
      proportion: '18%',
      value: data?.ref_val_public_budget_income_increasing_speed_in_3yr,
      rating: data?.rating_public_budget_income_increasing_speed_in_3yr,
    },
    {
      key: '7',
      partName: '财政实力(25%)',
      name: '税收收入/一般公共预算收入(%)',
      proportion: '10%',
      value: data?.ref_val_tax_income_proportion,
      rating: data?.rating_tax_income_proportion,
    },
    {
      key: '8',
      partName: '财政实力(39%)',
      name: '财政自给率(%)',
      proportion: '21%',
      value: data?.ref_val_financial_self_sufficient_proportion,
      rating: data?.rating_financial_self_sufficient_proportion,
    },
    {
      key: '9',
      partName: '债务负担(13%)',
      name: '(地方政府债务余额+发债城投有息债务)/一般公共预算收入(%)',
      proportion: '100%',
      value: data?.ref_val_local_debt_proportion,
      rating: data?.rating_local_debt_proportion,
    },
    {
      key: '10',
      partName: '产业状况(8%)',
      name: '资源枯竭、衰退',
      proportion: '100%',
      value: data?.ref_val_region_neg_tag,
      rating: data?.rating_region_neg_tag,
    },
    {
      key: '11',
      partName: '舆情(8%)',
      name: '负面舆情',
      proportion: '100%',
      value: data?.ref_val_region_public_opinion_index,
      rating: data?.rating_region_public_opinion_index,
    },
    {
      key: '12',
      partName: '总得分',
      total: formatNumber(data?.rating_synthetical),
      value: data?.ref_val_gdp_per_capita,
      rating: data?.rating_gdp_per_capita,
    },
  ];
  const renderContent = (value, row, index) => {
    // console.log(value, row, index, 'renderContent');
    const obj = {
      children: isNumber(value) ? formatNumber(value) : value ? <div className="text-center">{value}</div> : '-',
      props: {},
    };
    if (index === 11) {
      obj.props.colSpan = 0;
    }
    return obj;
  };
  const columns = [
    {
      colSpan: 2,
      title: '指标',
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
      width: 232,
      align: 'left',
      render: (value, row, index) => {
        // console.log(value, row, index, 'renderContent');
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
      width: 66,
      align: 'right',
      className: 'header-right',
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
      width: 106,
      dataIndex: 'value',
      align: 'right',
      className: 'header-right',
      render: renderContent,
    },
    {
      title: '具体得分',
      dataIndex: 'rating',
      width: 86,
      align: 'right',
      className: 'header-right',
      render: renderContent,
    },
  ];

  useEffect(() => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  }, [chartInstance, option]);

  // 监听尺寸变化
  useEffect(() => {
    const resize = () => {
      chartInstance?.current?.resize();
    };

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        chartInstance?.current?.resize();
      }
    },
  });
  return (
    <Wrap windowHeight={windowHeight} className="score-wrapper">
      <div className="left">
        {leftTitleContent ? (
          leftTitleContent
        ) : (
          <>
            <h1>地区综合得分</h1>
            <div className="rate-wrap">
              <span className="rate-num">{formatNumber(data?.rating_synthetical) || ''}</span>
              <span className="rate-chart">
                {data?.rating_synthetical ? (
                  <Rate
                    style={{ color: '#ff9032', fontSize: 14 }}
                    className="rate-star"
                    allowHalf
                    defaultValue={
                      data.rating_synthetical > Math.floor(data.rating_synthetical)
                        ? Math.floor(data?.rating_synthetical) + 0.5
                        : Math.floor(data.rating_synthetical)
                    }
                    disabled
                  />
                ) : null}
              </span>
            </div>
          </>
        )}
        <div className="chart" ref={chartRef}></div>
      </div>

      <div
        className="right"
        style={{
          paddingTop: leftTitleContent ? 0 : '15px',
          marginLeft: leftTitleContent ? '16px' : '44px',
        }}
      >
        <Table
          type="blueBorderInterlace"
          tdPadding="5px 12px"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </Wrap>
  );
};
export default memo(AreaRateDetail);
const Wrap = styled.div`
  width: 1042px;
  background: #fff;
  display: flex;
  overflow-y: auto;
  max-height: ${(props) => (props.windowHeight < 656 ? 511 + 'px' : 'none')};
  .left {
    .chart-title {
      width: 100%;
      height: 33px;
      text-align: center;
      background: #f8faff;
      margin-top: -2px;
      span {
        font-size: 13px;
        font-weight: Regular;
        text-align: left;
        color: #262626;
        line-height: 33px;
      }
      .title-number {
        font-size: 15px;
        font-weight: Bold;
        text-align: right;
        color: #ff7500;
        padding-left: 4px;
      }
    }
    h1 {
      font-size: 22px;
      font-weight: 500;
      color: #111;
      line-height: 22px;
      display: flex;
      align-items: center;
      margin: 0 0 10px 0 !important;
      span {
        line-height: 18px;
        padding: 2px 10px;
        background: #ecf4fc;
        border-radius: 2px;
        font-size: 12px;
        margin-left: 6px;
        font-weight: 400;
        text-align: left;
        color: #3a6fbf;
        display: inline-block;
      }
    }
    .rate-wrap {
      display: flex;
      align-items: center;
      line-height: 16px;
    }
    .rate-num {
      font-size: 20px;
      color: #ff9032;
      line-height: 22px;
      margin-right: 8px;
      font-weight: BoldMT;
    }
    .rate-chart {
      line-height: 8px;
      .ant-rate-star:not(:last-child) {
        margin-right: 4px;
      }
      .ant-rate-star > div:hover,
      .ant-rate-star > div:focus {
        -webkit-transform: scale(1) !important;
        transform: scale(1) !important;
      }
    }
    .rate-star {
      color: #ff9032;
      font-size: 14px;
      line-height: 22px;
    }
    .chart {
      position: relative;
      /* margin-top: 22px; */
      width: 420px;
      height: 336px;
    }
  }
  .right {
    flex: 1;
    margin-left: 44px;
    min-width: 0;
    padding-top: 15px;
    th,
    td {
      font-size: 13px;
      height: 20px;
      line-height: 20px;
    }

    td {
      color: #141414 !important;
    }

    th {
      color: #262626 !important;
    }

    th::before {
      display: none;
    }
    .ant-table-thead {
      th.header-right {
        text-align: right !important;
      }
    }
    .ant-table-tbody > tr.ant-table-row td {
      background: #fff !important;
    }
    /*.ant-table-tbody > tr.ant-table-row > td.ant-table-cell {
      padding: 8px 15px;
    }*/
    .ant-table-tbody > tr.ant-table-row[data-row-key='1'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='5'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='9'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='10'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='11'] > td.ant-table-cell:first-of-type {
      background: #f7fbff !important;
      color: #262626 !important;
    }
    .ant-table-tbody > tr.ant-table-row[data-row-key='12'] > td.ant-table-cell {
      font-weight: 400;
      color: #ff7500 !important;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td.ant-table-cell {
      background: rgba(1, 113, 246, 0.04) !important;
    }
  }
`;
