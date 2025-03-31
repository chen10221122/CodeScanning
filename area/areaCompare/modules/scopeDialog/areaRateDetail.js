import { memo, useEffect } from 'react';

import { isNumber } from 'lodash';
import styled from 'styled-components';

import { Rate, Table } from '@/components/antd';
import { useTab } from '@/libs/route';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

import { columns, getOption } from './config';

const AreaRateDetail = ({ data }) => {
  const option = getOption(data);

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
    <Wrap>
      <div className="left">
        <div className="rate-wrap">
          <span className="rate-num">{formatNumber(data?.rating_synthetical) || ''}</span>
          {data?.rating_synthetical ? (
            <Rate
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
        </div>
        <div className="chart" ref={chartRef}></div>
      </div>

      <div className="right">
        <Table type="blueBorderInterlace" dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    </Wrap>
  );
};
export default memo(AreaRateDetail);

const Wrap = styled.div`
  width: 832px;
  height: 100%;
  background: #fff;
  display: flex;
  .left {
    .rate-wrap {
      display: flex;
      align-items: center;
    }
    .rate-num {
      font-size: 15px;
      font-weight: 700;
      margin-right: 6px;
      color: #ff7500;
      line-height: 20px;
    }
    .rate-star {
      color: #ff9032;
      font-size: 10px;
      line-height: 10px;
      .ant-rate-star:not(:last-child) {
        margin-right: 1px;
      }
      .ant-rate-star > div:hover,
      .ant-rate-star > div:focus {
        -webkit-transform: scale(1) !important;
        transform: scale(1) !important;
      }
    }
    .chart {
      position: relative;
      width: 312px;
      height: 294px;
    }
  }
  .right {
    flex: 1;
    margin-left: 20px;
    min-width: 0;
    overflow-y: overlay;
    padding-right: 12px;
    ::-webkit-scrollbar {
      width: 10px;
    }
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
    .ant-table-thead > tr > th.ant-table-cell {
      padding: 6px 12px;
    }
    .ant-table-tbody > tr.ant-table-row td {
      background: #fff !important;
    }
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
