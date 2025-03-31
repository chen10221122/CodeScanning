import React, { useEffect } from 'react';

import classNames from 'classnames';
import * as echarts from 'echarts';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import { Image } from '@/components/layout';
import { useTab } from '@/libs/route';
import TipIcon from '@/pages/detail/modules/bond/f9/images/headerPic/ico_提示@2x.png';
import { formatNumber } from '@/utils/format';
import { EchartsOption, useECharts } from '@/utils/hooks';

export const option = (data: Array<any> = [], colorType: number = 0, colorObj: any = null) => {
  const colorArr = [
    { start: 'rgba(24,144,255,0.1)', end: '#1890FF' },
    { start: 'rgba(44,196,232,0)', end: '#2cc4e8' },
    { start: 'rgba(247,183,34,0.1)', end: '#F6B724' },
  ];
  return {
    grid: {
      top: '4',
      bottom: '0%',
      left: '4',
      right: '4',
    },
    tooltip: {
      show: true,
      textStyle: {
        color: '#3c3c3c',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'transparent',
      position: function (point: any[], params: any, dom: { offsetWidth: number }) {
        let posDis = window.innerWidth - dom.offsetWidth;
        return posDis < point[0] ? [posDis, '10%'] : [point[0], '10%'];
      },
      formatter(params: { value: any }) {
        return `${formatNumber(params.value)}`;
      },
      extraCssText:
        'box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 2px; color: #3C3C3C; font-size: 10px;z-index: 2',
    },
    color: colorObj ? colorObj.end : colorArr[colorType].end,
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: data.map((o, i) => i),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: data,
        type: 'line',
        symbolSize: 2,
        symbol: 'circle',
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colorObj ? colorObj.end : colorArr[colorType].end,
            },
            {
              offset: 1,
              color: colorObj ? colorObj.start : colorArr[colorType].start,
            },
          ]),
        },
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1, //设置线条粗细
            },
          },
        },
      },
    ],
  };
};

type Data = {
  title?: string;
  text?: string;
  valueArr?: Array<any>; //画图所需数据
  changedValue?: number;
  colorType?: any; //0:蓝 1:绿 2:黄
  changedType?: any; //changedValue箭头上下 'up':'down'
  tooltipText?: string;
  unit?: string;
  smallUnit?: boolean;
};

interface Props {
  data?: Data;
  withChart?: boolean;
  backgroundImg?: any;
}

const { href } = window.location;

const ChartCard: React.FC<Props> = ({ data, withChart, backgroundImg }) => {
  const [chartRef, chartInstance] = useECharts(
    option(data?.valueArr, data?.colorType) as EchartsOption,
    'svg',
    href,
    true,
  );

  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any).setOption(option(data?.valueArr, data?.colorType));
      const chart = (chartInstance as any)._dom as HTMLDivElement;
      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        (chartInstance as any).resize();
      }
    }
  }, [data, chartInstance]);

  useTab({
    onActive() {
      if (chartInstance) {
        (chartInstance as any).resize();
      }
    },
  });

  const PopoverContent = () => (
    <div
      style={{
        maxWidth: 340,
        fontSize: '13px',
        fontWeight: 400,
        textAlign: 'justify',
        color: '#434343',
        lineHeight: '20px',
      }}
    >
      {data?.tooltipText}
    </div>
  );

  return (
    <CardContainer>
      {/* 背景图片 */}
      {backgroundImg ? <div className="bg" style={{ background: `url(${backgroundImg}) no-repeat` }}></div> : null}

      {/* 图 */}
      {withChart && data?.valueArr?.length === 0 ? <div className="chart-bg"></div> : null}

      <div className="detail">
        <span className="detail-text">
          {data?.text || '-'}
          <span className="small-unit">{data?.text ? data?.unit : null}</span>
        </span>
        <span style={{ flex: 1 }}></span>
        {data?.changedValue && data.changedValue !== 0 ? (
          <span
            className={classNames('changed-value', {
              up: data.changedType === 'up',
              down: data.changedType === 'down',
            })}
          >
            {data.changedValue}
            <Image
              className="up-down-img"
              src={data.changedType === 'up' ? require('./up.png') : require('./down.png')}
              alt="up-down"
            />
          </span>
        ) : null}
      </div>

      <div className="title-chart">
        {/* 标题 */}
        <div className="title-container">
          <div className="blue-line" />
          <div className="title">
            <span className="title-eclipse" title={data?.title}>
              {data?.title}
            </span>
            {data?.tooltipText ? (
              <Popover content={PopoverContent} placement="bottom">
                <span className="hover-tips-icon"></span>
              </Popover>
            ) : null}
          </div>
        </div>
        {withChart ? <div className="chart" ref={chartRef}></div> : <div className="chart" />}
      </div>

      {/* 图表 */}
    </CardContainer>
  );
};
ChartCard.defaultProps = {
  data: {
    title: '',
  },
};
export default React.memo<typeof ChartCard>(ChartCard);

const CardContainer = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;

  .chart-bg {
    width: 135px;
    position: absolute;
    height: 100px;
    bottom: 0;
    right: 0;
    background: url(${require('@/assets/images/area/empty.png')}) no-repeat;
    background-size: cover !important;
  }

  .bg {
    width: 77px;
    position: absolute;
    height: 42px;
    bottom: 0;
    right: 0;
    background-size: cover !important;
  }
  .up-down-img {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 2px;
    margin-top: -2px;
  }
  &:after {
    content: '';
  }
  .title-container {
    width: 74%;
    display: flex;
    /* flex: 0.74; */
  }

  .title-chart {
    margin-top: 2px;
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  .blue-line {
    flex-shrink: 0;
    width: 3px;
    height: 10px;
    background: #0171f6;
    margin-right: 4px;
    margin-top: 1px;
  }
  .title {
    font-size: 12px;
    color: #8c8c8c;
    line-height: 12px;
    flex: 1;
  }
  .title-eclipse {
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
    /* max-width: calc(100% - 20px); */
    max-width: calc(100% - 40px);
    cursor: pointer;
  }
  .hover-tips-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    line-height: 12px;
    margin-left: 4px;
    background: url('${TipIcon}');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    cursor: pointer;
    top: 1px;
    left: -2px;
  }
  .detail {
    display: flex;
    align-items: center;
    z-index: 2;
    position: relative;
    .detail-text {
      width: auto;
      max-width: 145px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      color: #111111;
      line-height: 18px;
      white-space: nowrap;
    }
    .small-unit {
      font-size: 12px;
      color: #5c5c5c;
      line-height: 12px;
      padding-left: 3px;
    }
    .changed-value {
      font-size: 12px;
      text-align: right;
      color: #fe3a2f;
      position: relative;
      padding-right: 0;
      line-height: 12px;
      &.down {
        color: #14ba70;
      }
    }
  }
  .chart {
    width: 26%;
    min-width: 40px;
    /* flex: 0.26; */
    height: 22px;
    display: flex;
    justify-content: flex-end;
  }
`;
