import { FC, memo, useEffect, useRef } from 'react';

import { message } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';

import { useDispatch } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/context';
import { windowOpen } from '@/utils/download';
import { EchartsOption, useECharts } from '@/utils/hooks';
import { getTextWidth } from '@/utils/share';

const font = '12px "Microsoft YaHei"';
const onelineWidth = 130;
/** chart图可视区域 这里是固定的 直接写死 */
// const chartWidth = 752
/** 单个label的width */
// const lableItemWidth = 155
/** 单个label的width */
// const lableHalfItemWidth = lableItemWidth / 2

/**
 * echarts不支持两行... 这里的处理是通过canvas计算宽度手动添加\n实现的
 */
const handleLabelBreak = (item: Record<string, any>) => {
  const titleInfo = item.newsInfo.title;
  let onelineStr = '';
  let width = 0;
  let onelineEnd = 0;
  let line = 1;
  let firstline = 0;
  while (width < onelineWidth && onelineEnd < titleInfo.length) {
    const item = titleInfo[onelineEnd];
    width += getTextWidth(item, font);
    if (line === 1 && width >= onelineWidth) {
      // 第二行
      line++;
      width -= onelineWidth;
      onelineStr += `${titleInfo.slice(0, onelineEnd)}\n`;
      firstline = onelineEnd;
    }
    onelineEnd++;
  }
  // 如果onelineEnd>titleInfo.length 说明字符串全部结束了，但是不确定后面的能不能放下，所以需要判断width onelineWidth的关系
  // 循环出来的onelineEnd - 1是刚好大于单行宽度的(如果onelineEnd<titleInfo.length的话)，所以取到onelineEnd - 2
  // 另外还要判断剩余空间是否能够放下... width - onelineWidth 如果大于12 说明-1后 可以放下... 否则放不下 需要再-1
  const end = onelineEnd - 2 - (width - onelineWidth > 12 ? 0 : 1);

  onelineStr +=
    onelineEnd >= titleInfo.length && width <= onelineWidth
      ? titleInfo.slice(firstline)
      : `${titleInfo.slice(firstline, end)}...`;

  return onelineStr;
};

export const option = (data: Array<any> = []) => {
  const onlyOne = data.length === 1;
  return {
    grid: {
      top: /* 50 */ 84,
      bottom: 23,
      left: 0,
      right: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      extraCssText:
        'box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20); padding: 8px;border-color: #fff;border-radius: 2px;font-size: 12px;',
      textStyle: {
        color: '#3c3c3c',
      },
      formatter: (params: any) => {
        const { name, value } = params[0];
        const titleHtmlStr = `<div style="color: #8c8c8c;line-height: 16px;margin-bottom: 8px;">${name}</div>`;
        const contentTitleHtmlStr = `<span style="color: #3c3c3c;">舆情风险指数：</span>`;
        const cotnentTextHtmlStr = `<span style="color: #FF7500;">${value}</span>`;
        return /*html*/ `${titleHtmlStr}${contentTitleHtmlStr}${cotnentTextHtmlStr}`;
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#A5C3FF',
        },
      },
    },
    dataZoom: [
      {
        type: 'slider',
        height: 10,
        moveHandleSize: 0,
        handleStyle: {
          opacity: 0,
        },
        showDetail: false,
        left: 16,
        right: 16,
        bottom: 2,
      },
    ],
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#595959',
      },
      axisLine: {
        lineStyle: {
          color: '#EFEFEF',
        },
      },
      axisTick: {
        show: false,
      },
      data: data.map((o) => o.time),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#595959',
      },
      splitLine: {
        lineStyle: {
          color: '#efefef',
          type: 'dashed',
        },
      },
    },
    series: {
      type: 'line',
      smooth: true,
      color: '#3986FE',
      symbolSize: 6,
      showAllSymbol: true,
      labelLayout: (props: Record<string, any>) => {
        // const offsetX = props.labelRect.x + lableItemWidth - chartWidth
        return {
          y: 5,
          x: props.labelRect.x,
          align: 'center',
          moveOverlap: 'shiftX',
        };
      },
      label: {
        show: false,
        width: 139,
        height: 50,
        padding: [6, 8],
        backgroundColor: '#ffffff',
        borderColor: '#e9e9e9',
        borderWidth: 1,
        borderRadius: 2,
        overflow: 'break',
        rich: {
          title: {
            align: 'left',
            color: '#595959',
            lineHeight: 12,
            fontSize: 12,
          },
          content: {
            align: 'left',
            color: '#141414',
            padding: [2, 0, 0, 0],
            lineHeight: 17,
            fontSize: 12,
          },
        },
      },
      labelLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#CFCFCF',
        },
      },
      emphasis: {
        // focus: 'self',
        label: {
          borderColor: '#CADEFF',
          color: '#0171F6',
          rich: {
            title: {
              color: '#0171F6',
            },
            content: {
              color: '#0171F6',
            },
          },
        },
        labelLine: {
          lineStyle: {
            color: '#8AB6FF',
          },
        },
      },
      // blur: {
      //   label: {
      //     show: false,
      //   },
      //   labelLine: {
      //     show: false,
      //   },
      //   itemStyle: {
      //     opacity: 0,
      //   },
      // },
      data: data.map((item) => {
        const result: Record<string, any> = {
          time: item.time,
          value: item.value,
          symbol: onlyOne ? 'circle' : 'none',
        };
        if (item.newsInfo) {
          result.symbol = 'emptyCircle';
          result.newsInfo = item.newsInfo;

          // 处理换行
          const onelineStr = handleLabelBreak(item);

          result.label = {
            show: true,
            formatter: `{title|${item.time || ''}\n\n}{content|${onelineStr || ''}}`,
          };
        }
        return result;
      }),
    },
  } as EchartsOption;
};

const { href } = window.location;
const defaultOption = option([]);

const echartClickDom = ['rect', 'tspan'];

interface ChartProps {
  data: Record<string, any>[];
  itCode2: string;
}

const Chart: FC<ChartProps> = ({ data, itCode2 }) => {
  const dispatch = useDispatch();
  const [chartRef, chartInstance] = useECharts(defaultOption, 'canvas', href, false);
  const prevOptionRef = useRef<Record<string, any>>();

  /* echarts */
  const handleClick = useMemoizedFn((props) => {
    if (echartClickDom.includes(props?.event?.target?.type)) {
      // 打开新闻正文弹窗
      const propData = props?.data?.newsInfo;
      const modalInfo: Record<string, any> = {};
      if (propData) {
        // 需要的数据参考这里 src\pages\combination\const.ts
        for (let key in propData) {
          modalInfo[key] = propData[key];
        }
        modalInfo.id = propData.newsCode;
        modalInfo.type = propData.originalType;
        modalInfo.forceType = propData.type;
        modalInfo.code = itCode2;
        modalInfo.related = {
          code: itCode2,
          type: 'company',
          lastLevel: propData.lastLevel,
        };
      }
      if (
        (propData.isTort === 1 || propData.isTort === '1') &&
        propData.originalUrl &&
        !process.env.REACT_APP_TRANSFORM_URL_FLAG
      ) {
        message.warning('即将跳转至外部链接', 1);
        setTimeout(() => {
          windowOpen(propData.originalUrl);
        }, 1000);
      } else {
        dispatch((d) => {
          d.modalStatus.newsDetailModal.visible = true;
          d.modalStatus.newsDetailModal.data = modalInfo;
        });
      }
    }
  });
  const hanldeMouseover = useMemoizedFn((props) => {
    if (prevOptionRef.current) {
      (chartInstance as any).setOption({
        ...prevOptionRef.current,
        series: {
          ...prevOptionRef.current.series,
          data: (prevOptionRef.current.series.data as Record<string, any>[]).map((item) => ({
            ...item,
            // 隐藏其他label
            ...(props.name !== item.time
              ? {
                  label: {
                    color: 'transparent',
                    ...item.label,
                  },
                  labelLine: {
                    show: false,
                    ...item.labelLine,
                  },
                  itemStyle: {
                    opacity: 0,
                    ...item.itemStyle,
                  },
                }
              : {}),
          })),
        },
      });
    }
  });
  const hanldeMouseout = useMemoizedFn((props) => {
    if (prevOptionRef.current) {
      (chartInstance as any).setOption(prevOptionRef.current);
    }
  });

  useEffect(() => {
    if (chartInstance) {
      prevOptionRef.current = option(data);
      (chartInstance as any).setOption(prevOptionRef.current);
      const chart = (chartInstance as any)._dom as HTMLDivElement;
      if (chart?.offsetWidth < chart.children[0]?.clientWidth) {
        (chartInstance as any).resize();
      }
      // 每次打开重置datazoom
      chartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100,
      });
    }
  }, [data, chartInstance]);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.on('click', handleClick);
      chartInstance.on('mouseover', hanldeMouseover);
      chartInstance.on('mouseout', hanldeMouseout);
    }
    return () => {
      if (chartInstance) {
        chartInstance.off('click', handleClick);
        chartInstance.off('mouseover', hanldeMouseover);
        chartInstance.off('mouseout', hanldeMouseout);
      }
    };
  }, [chartInstance, handleClick, hanldeMouseover, hanldeMouseout]);

  return <div style={{ width: '100%', height: '305px' }} className="monitoring-trend-modal-chart" ref={chartRef}></div>;
};

export default memo(Chart);
