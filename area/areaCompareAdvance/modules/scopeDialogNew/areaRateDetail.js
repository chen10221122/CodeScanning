import { memo, useEffect, useMemo } from 'react';

// import { isNumber } from 'lodash';
import { Empty } from '@dzh/components';
import styled from 'styled-components';

import { Rate, Table } from '@/components/antd';
import { useTab } from '@/libs/route';
import { formatNumber } from '@/utils/format';
import { useECharts } from '@/utils/hooks';

import { getOption } from './config';
import useColumns from './useColumns';
import useFlat from './useFlat';

const AreaRateDetail = ({ data, radarData, detailError, radarError }) => {
  const option = getOption(radarData);

  let arr = [];
  data.forEach((item) => {
    let itemChildLength = item.subIndicList.length;
    arr.push(item.subIndicList.length, ...Array(itemChildLength - 1).fill(0));
  });

  const { flatData } = useFlat(data);

  // console.log('flatData', flatData);

  const [chartRef, chartInstance] = useECharts(option, 'canvas');
  // const arr = [];
  const prevDataSource = useMemo(() => {
    let tempArr = [];
    Array.isArray(flatData) &&
      flatData.forEach((item, i) => {
        let obj = {
          // key: i + '',
          partName: item.partName,
          name: item.name,
          proportion: item.weight,
          source: item.source,
          value: item.value,
          className: i === 0 ? 'bg-blue' : '',
          rating: item.score,
        };
        // arr.push(item.level === 1 ? item.children.length : 0);
        if (item.level !== 1) {
          tempArr.push(obj);
        }
      });
    return tempArr;
  }, [flatData]);

  const { columns } = useColumns(arr);

  const dataSource = useMemo(() => {
    let resSource = [];
    prevDataSource.forEach((d, i) => {
      resSource.push({
        ...d,
        key: i + '',
      });
    });
    resSource.push({
      key: prevDataSource.length + 1 + '',
      partName: '总得分',
      total: formatNumber(radarData?.comprehensiveScore),
      value: '',
      rating: '',
    });
    return resSource;
  }, [prevDataSource, radarData?.comprehensiveScore]);

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

  if (detailError || radarError) {
    return <Empty type={Empty.NO_DATA} />;
  }
  return (
    <Wrap>
      <div className="left">
        <div className="rate-wrap">
          <span className="rate-num">{formatNumber(radarData?.comprehensiveScore) || ''}</span>
          {radarData?.comprehensiveScore ? (
            <Rate
              className="rate-star"
              allowHalf
              defaultValue={
                radarData.comprehensiveScore > Math.floor(radarData.comprehensiveScore)
                  ? Math.floor(radarData?.comprehensiveScore) + 0.5
                  : Math.floor(radarData.comprehensiveScore)
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
    &:hover {
      ::-webkit-scrollbar-thumb {
        border-width: 2px;
      }
    }
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-thumb {
      border-width: 5px;
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
    .ant-table-container {
      border-top: none;
      .ant-table-thead {
        position: sticky;
        top: 0px;
        z-index: 1;
      }
    }
    .ant-table-thead > tr > th.ant-table-cell {
      padding: 6px 12px;
      border-top: 1px solid #ebf1fc;
      background-color: #f8faff !important;
    }
    .ant-table-tbody > tr.ant-table-row td {
      background: #fff !important;
      padding: 6px 12px;
    }
    .ant-table-tbody > tr.ant-table-row[data-row-key='0'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='6'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='12'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='17'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='23'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='28'] > td.ant-table-cell:first-of-type,
    .ant-table-tbody > tr.ant-table-row[data-row-key='32'] > td.ant-table-cell:first-of-type {
      background: #f8faff !important;
      color: #262626 !important;
    }
    .ant-table-tbody > tr.ant-table-row[data-row-key='37'] > td.ant-table-cell {
      font-weight: 400;
      color: #ff7500 !important;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td.ant-table-cell {
      background: rgba(1, 113, 246, 0.04) !important;
    }
  }
`;
