import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';

import { CaretRightFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Popover } from '@dzh/components';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import * as echarts from 'echarts';
import { isNil } from 'lodash';
import styled from 'styled-components';

import RankingIcon from '@/assets/images/area/ranking_icon@2x.png';
import { Icon } from '@/components';
import { useTab } from '@/libs/route';
// import { formatNumber } from '@/utils/format';
import { EchartsOption, useECharts } from '@/utils/hooks';

import { CustomValueType, formatValue, getLinearGradientDirection } from '../../utils';
import styles from './styles.module.less';
import { Data } from './types';

export const CARDHEIGHT = 84;

export const option = (
  data: Array<any> = [],
  chartType: string | undefined = undefined,
  colorType: number = 0,
  unit: any = undefined,
  colorObj: any = null,
  isCustom: boolean = false,
  customValueType: CustomValueType | undefined = undefined,
) => {
  // const colorArr = [
  //   { start: 'rgba(24,144,255,0.1)', end: '#1890FF' },
  //   { start: 'rgba(44,196,232,0)', end: '#2cc4e8' },
  //   { start: 'rgba(247,183,34,0.1)', end: '#F6B724' },
  // ];
  const color: Record<string, { start: string; end: string }> = {
    line: { start: 'rgba(191,220,255,0.5)', end: 'rgba(134,190,255,1)' },
    bar: { start: 'rgba(220,235,255,1)', end: 'rgba(160,205,255,1)' },
  };
  const _data: Record<string, string[]> = {
    line:
      isCustom && customValueType === CustomValueType.PERCENTAGESTRING
        ? data.map((value) => value.slice(0, value.length - 1))
        : data,
    bar: data?.length > 9 ? data.filter((val, index) => !(index % 2)) : data?.length >= 5 ? data.slice(0, 5) : data,
  };
  const series: Record<string, Object> = {
    line: {
      data: _data[chartType!],
      // symbolSize: 2,
      // symbol: 'circle',
      showSymbol: _data[chartType!]?.length > 1 ? false : true,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 1, //设置线条粗细
          },
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorObj ? colorObj.end : color[chartType!]?.end,
              },
              {
                offset: 1,
                color: colorObj ? colorObj.start : color[chartType!]?.start,
              },
            ]),
          },
        },
      },
    },
    bar: {
      // data: data?.length > 5 ? data.map((val, index) => !(index % 2) ? val : undefined) : data,
      data: _data[chartType!]?.map((value) => ({
        value,
        itemStyle: {
          normal: {
            barBorderRadius: +value > 0 ? [10, 10, 0, 0] : [0, 0, 10, 10],
            color: new echarts.graphic.LinearGradient(...getLinearGradientDirection(+value), [
              { offset: 0, color: color[chartType!]?.end }, // 0% 处的颜色
              { offset: 1, color: color[chartType!]?.start }, // 100% 处的颜色
            ]),
          },
        },
      })),
      barMaxWidth: 6,
    },
  };
  return {
    grid: {
      top: '4',
      bottom: '0%',
      left: '4',
      right: '4',
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      confine: true,
      textStyle: {
        color: '#3c3c3c',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'transparent',
      position: function (point: any[], params: any, dom: { offsetWidth: number }) {
        let posDis = window.innerWidth - dom.offsetWidth;
        return posDis < point[0] ? [posDis, '10%'] : [point[0], '10%'];
      },
      formatter(params: [{ value: any }]) {
        return `${formatValue(unit, params[0].value)}${
          isCustom && customValueType === CustomValueType.PERCENTAGESTRING ? '%' : ''
        }`;
        // return params.value;
      },
      extraCssText:
        'box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 2px; color: #3C3C3C; font-size: 10px;z-index: 2',
    },
    // color: colorObj ? colorObj.end : colorArr[colorType].end,
    color: color[chartType!]?.end,
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: _data[chartType!]?.map((o, i) => i),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: chartType,
        ...(chartType ? series[chartType as string] : {}),
      },
    ],
  };
};

interface Props {
  data?: Data;
  withChart?: boolean;
  backgroundImg?: any;
  click?: () => void;
}

const { href } = window.location;

const iconStyle = { width: 10, height: 10, marginLeft: '4px', verticalAlign: 0 };
const ChartCard: React.FC<Props> = ({ data, withChart, backgroundImg, click }) => {
  const { hasChart, chartType } = data ?? {};
  const rankingRef = useRef(null);
  // const rankingSize = useSize(rankingRef.current);
  const [isPop, setIsPop] = useState(false);
  const cardRef = useRef(null);
  const cardSize = useSize(cardRef.current);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const tTextSize = useSize(titleTextRef);
  const valueTextRef = useRef<HTMLSpanElement>(null);
  const vTextSize = useSize(valueTextRef);

  const [chartRef, chartInstance] = useECharts(
    option(
      data?.valueArr,
      chartType,
      data?.colorType,
      data?.unit,
      null,
      data?.isCustom,
      data?.customValueType,
    ) as EchartsOption,
    'svg',
    href,
    true,
  );
  useEffect(() => {
    if (chartInstance) {
      (chartInstance as any).setOption(
        option(
          data?.valueArr,
          data?.chartType,
          data?.colorType,
          data?.unit,
          null,
          data?.isCustom,
          data?.customValueType,
        ),
      );
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

  useEffect(() => {
    if (chartInstance && cardSize?.width) {
      const chart = (chartInstance as any)._dom as HTMLDivElement;
      if (chart?.children[0]?.clientWidth < chart.children[0]?.children[0]?.clientWidth) {
        (chartInstance as any).resize();
      }
    }
  }, [chartInstance, cardSize?.width]);

  const hasRank = useMemo(() => {
    const rank = data?.nationalRank || data?.provinceRank;
    return !!(rank?.molecule || rank?.denominator);
  }, [data?.nationalRank, data?.provinceRank]);

  const showValueT = useMemo(
    () => (valueTextRef.current?.scrollWidth ?? 0) > (valueTextRef.current?.offsetWidth ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vTextSize?.width],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showTitleP = useMemo(() => (titleTextRef.current?.scrollHeight ?? 0) > 25, [tTextSize?.height]); // 应该是大于 24，但是不晓得为啥多了1px

  const PopoverContent = useMemo(
    () => (
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
    ),
    [data?.tooltipText],
  );

  return (
    <CardContainer onClick={click} className={classNames('card-item', { hasChart: hasChart })} ref={cardRef}>
      {/* 背景图片 */}
      {!hasChart ? <div className={'bg ' + data?.indexId}></div> : null}
      {/* 渐变填充 */}
      {!hasChart ? <div className="bg-fill"></div> : null}

      <Detail>
        <span className="detail">
          <span
            className="detail-value"
            ref={valueTextRef}
            title={showValueT ? `${data?.text || '-'}${data?.text && data?.unit ? data?.unit : ''}` : undefined}
          >
            <span className="text">{data?.text || '-'}</span>
            <span className="small-unit">{data?.text ? data?.unit : null}</span>
          </span>
          {!isNil(data?.changedValue) ? (
            <ChangeValue
              className={classNames({
                up: data?.changedType === 'up' && data?.changedValue !== 0,
                down: data?.changedType === 'down' && data?.changedValue !== 0,
              })}
            >
              {data?.changedType === 'up' && '+'}
              {/* {data?.changedType === 'down' && '-'} */}
              {data?.changedValue}
              {data?.changedType === 'up' && data?.changedValue !== 0 && (
                <Icon style={iconStyle} image={require('@/assets/images/area/icon_up@2x.png')} />
              )}
              {data?.changedType === 'down' && data?.changedValue !== 0 && (
                <Icon style={iconStyle} image={require('@/assets/images/area/icon_down@2x.png')} />
              )}
            </ChangeValue>
          ) : null}
        </span>
        {/* 图表 */}
        {hasChart && chartType ? <div className="chart" ref={chartRef}></div> : null}
      </Detail>

      <TitleRanking>
        {/* 标题 */}
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="title-container">
            {/* <div className="blue-line" /> */}
            <div
              className="title"
              // style={{ maxWidth: `calc(100% - ${rankingSize?.width ? rankingSize.width + 5 : 0}px)` }}
              // 按照三位数地区排名计算 65px 是够的
              style={{ maxWidth: `calc(100% - ${hasRank ? 65 : 0}px)` }}
            >
              <div className="con-ref">
                <Popover
                  placement="bottomLeft"
                  content={data?.title}
                  trigger="hover"
                  limitContent={false}
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0}
                  visible={showTitleP && isPop}
                >
                  <span
                    className="title-eclipse"
                    ref={titleTextRef}
                    onMouseEnter={() => setIsPop(true)}
                    onMouseOut={() => setIsPop(false)}
                  >
                    {data?.title}
                  </span>
                </Popover>
              </div>
              <span style={{ whiteSpace: 'nowrap' }}>
                {data?.tooltipText ? (
                  <Popover content={PopoverContent} placement="bottom" overlayClassName={styles['tooltip-popover']}>
                    <InfoCircleOutlined
                      size={8}
                      style={{ cursor: 'pointer', marginLeft: '3px', transform: 'scale(0.9)' }}
                    />
                  </Popover>
                ) : null}
                {data?.valueArr?.length && (
                  <CaretRightFilled
                    size={10}
                    style={{ color: '#A4A4A4', marginLeft: '-2px', transform: 'scale(0.8)' }}
                  />
                )}
              </span>
            </div>
            {hasRank && (data?.nationalRank || data?.provinceRank) ? (
              <Ranking ref={rankingRef}>
                {data?.nationalRank && (
                  <span className="text">
                    {'全国'}
                    {data.nationalRank.molecule}/{data.nationalRank.denominator}
                  </span>
                )}
                {data?.provinceRank && (
                  <span className="text">
                    {'省内'}
                    {data.provinceRank.molecule}/{data.provinceRank.denominator}
                  </span>
                )}
              </Ranking>
            ) : null}
          </div>
        </div>
      </TitleRanking>
    </CardContainer>
  );
};
ChartCard.defaultProps = {
  data: {
    title: '',
  },
};
export default React.memo<typeof ChartCard>(ChartCard);

export const CardContainer = styled.div`
  width: 100%;
  height: ${CARDHEIGHT}px;
  padding: 10px 10px 4px 14px;
  box-sizing: border-box;
  border: 1px solid #f4f7f7;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: visible;
  &.hasChart {
    cursor: pointer;
  }

  .bg {
    width: 60px;
    height: 50px;
    position: absolute;
    bottom: 2px;
    right: 2px;
    background: url(${require('@/assets/images/area/img_card_def@2x.png')}) no-repeat;
    background-size: contain !important;
    z-index: 1;
  }
  .bg.REGION_10000010 {
    background: url(${require('@/assets/images/area/img_card_01@2x.png')}) no-repeat;
  }
  .bg.REGION_10000409 {
    height: 56px;
    background: url(${require('@/assets/images/area/img_card_02@2x.png')}) no-repeat;
  }
  .bg.REGION_10000297 {
    height: 52px;
    background: url(${require('@/assets/images/area/img_card_03@2x.png')}) no-repeat;
  }
  .bg.REGION_10000343 {
    height: 55px;
    background: url(${require('@/assets/images/area/img_card_04@2x.png')}) no-repeat;
  }
  .bg-fill {
    width: 100%;
    height: 84px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.57;
    background: linear-gradient(177deg, #f2f9ff 10%, #ffffff 62%);
    overflow: hidden;
    z-index: 0;
  }
  .bg-fill::before,
  .bg-fill::after {
    content: '';
    width: 160px;
    height: 70px;
    left: -60px;
    opacity: 0.8;
    background: linear-gradient(213deg, #feffff, rgba(248, 252, 255, 0) 43%);
    position: absolute;
    top: 1px;
    left: -60px;
    z-index: -1;
  }
  .bg-fill::after {
    left: -26px;
    opacity: 0.74;
    background: linear-gradient(238deg, #feffff 9%, rgba(248, 252, 255, 0) 33%);
  }
  .chart-bg {
    width: 135px;
    position: absolute;
    height: 100px;
    bottom: 0;
    right: 0;
    background: url(${require('@/assets/images/area/empty.png')}) no-repeat;
    background-size: cover !important;
  }
`;
const TitleRanking = styled.div`
  margin-top: 7px;
  flex: 1;
  z-index: 2;

  .title-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    width: 100%;
    font-size: 12px;
    line-height: 12px;
    color: #8c8c8c;
    flex: 1;
    display: inline-flex;
    align-items: flex-start;
  }
  .title .con-ref {
    position: relative;
    color: #414141;
    .text-ref {
      position: absolute;
      top: 0;
      left: 0;
      visibility: hidden;
    }
  }
  .title-eclipse {
    display: -webkit-box;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    vertical-align: middle;
    cursor: pointer;
  }
  .tooltip-popover {
    &.dzh-popover-no-title.dzh-popover-limit-content .ant-popover-inner-content {
      max-height: max-content;
    }
  }
`;
const Detail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  position: relative;
  margin-top: -2px;
  height: 34px;

  .detail {
    display: inline-flex;
    flex-direction: column;
  }
  .detail-value {
    width: auto;
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    line-height: 18px;
    white-space: nowrap;
  }
  .text {
    font-weight: 600;
    color: #262626;
  }
  .small-unit {
    font-size: 12px;
    color: #5c5c5c;
    line-height: 12px;
    padding-left: 3px;
  }
  .chart {
    // flex: 1;
    width: 35%;
    min-width: 40px;
    max-width: 70px;
    height: 22px;
    display: flex;
    justify-content: flex-end;
    margin-right: -5px;
  }
`;
const Ranking = styled.div`
  // display: inline-flex;
  width: max-content;
  // padding: 1px 2px;
  // background: #f8fbff;
  // border-radius: 2px;
  // align-items: center;
  // justify-content: space-evenly;

  .ranking-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    line-height: 12px;
    margin-left: 4px;
    background: url('${RankingIcon}');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .text {
    display: inline-block;
    height: 12px;
    font-size: 11px;
    font-weight: 300;
    text-align: left;
    color: #5c5c5c;
    line-height: 12px;
    margin-left: 1px;
  }
`;
const ChangeValue = styled.div`
  display: inline-block;
  text-wrap: nowrap;
  width: max-content;
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  position: relative;
  margin-top: 3px;
  &.up {
    color: #fe3a2f;
  }
  &.down {
    color: #14ba70;
  }
`;
export const LoadingCard = styled.div`
  width: 100%;
  height: ${CARDHEIGHT}px;
  padding: 10px 14px;
  box-sizing: border-box;
  border: 1px solid #f4f7f7;
  border-radius: 2px;
`;
