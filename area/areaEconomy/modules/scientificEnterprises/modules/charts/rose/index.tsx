import { memo, useEffect, useMemo, useRef } from 'react';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import { formatThreeNumber } from '@/pages/bond/bondIssuance/utils';
import { useECharts, useWindowSize } from '@/utils/hooks';

import { Box } from '../../../components';
import { useGetChartsData } from '../../../hooks/useGetChartsData';
import { useCtx } from '../../../provider/ctx';
import { Charts } from '../../../types';

/** 排名颜色策略 */
const colorMap = new Map<number, Record<'color' | 'bg', string>>([
  [0, { color: '#fff', bg: '#F26279' }],
  [1, { color: '#fff', bg: '#F9D237' }],
  [2, { color: '#fff', bg: '#35CACA' }],
  [3, { color: '#fff', bg: '#73E6BF' }],
  [4, { color: '#fff', bg: '#3A86FE' }],
  [5, { color: '#fff', bg: '#9D8AEE' }],
  [6, { color: '#fff', bg: '#FDB078' }],
  [7, { color: '#fff', bg: '#32B0F7' }],
]);

const defaultColor = {
  color: '#8C8C8C',
  bg: '#FAFAFA',
};

export default memo(() => {
  const {
    state: { selectedAreaList, fullLoading, enterpriseStatus, areaOrTagChangeMaskLoading },
    update,
  } = useCtx();

  const { loading, data } = useGetChartsData({ requestModule: 'INDUSTRY' });

  const { width } = useWindowSize();

  const prevLoadingStatus = useRef<boolean>();

  useEffect(() => {
    update((o) => {
      if (!loading && areaOrTagChangeMaskLoading) {
        o.areaOrTagChangeMaskLoading = false;
      }
    });
    prevLoadingStatus.current = loading as boolean;
  }, [loading, update, areaOrTagChangeMaskLoading]);

  useEffect(() => {
    update((o) => {
      o.chartLoading = loading;
      if (fullLoading === true && !loading && data) {
        o.fullLoading = false;
      }
    });
  }, [loading, update, fullLoading, data]);

  /** find max */
  const max = useMemo(() => {
    if (!loading && data && !isEmpty(data)) {
      return Math.max(...data.map((i: Charts.RoseChartItem) => i.doc_count));
    }
  }, [data, loading]);

  const options = useMemo(() => {
    let list = [];

    if (data && !isEmpty(data)) {
      const sum = data.reduce((prev: number, current: Charts.RoseChartItem) => {
        return prev + current.doc_count;
      }, 0);
      list = data.map((i: Charts.RoseChartItem) => {
        return {
          ...i,
          value: i?.doc_count,
          name: i?.title,
          proportion: ((i?.doc_count / sum) * 100).toFixed(2) + '%',
        };
      });
    }
    return {
      title: {
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: {
          color: '#3c3c3c',
          fontSize: 13,
          lineHeight: '18px',
        },
        extraCssText:
          'border-radius: 2px;padding: 10px 12px;box-sizing: border-box; box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.20); z-index: 4 !important;',
        formatter: (params: any) => {
          const curData = params?.data;
          if (!curData?.name) {
            return;
          }
          const marker = `<span style="display:inline-block;border-radius: 3px;margin-right:6px;width: 6px;height:6px;background-color:${params?.color}; vertical-align: middle"></span>`;
          const name = `<span>${curData?.title}</span>`;

          const content = `
              <span>占比：${curData?.proportion ? curData.proportion : '-'}</span>
              <span style='display: block;'>企业量：${
                curData?.value && !isNaN(+curData?.value)
                  ? formatThreeNumber(curData?.value)?.replace('-', '') + '家'
                  : '-'
              }
              </span>`;
          return `<div style="align-items: center; font-size: 12px;"><div>${
            marker + name
          }</div><div style="flex: 1"></div><div>${content}</div></div>`;
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: [0, 50],
          center: ['50%', '50%'],
          // roseType: 'radius',
          // labelLine: false,
          itemStyle: {
            borderRadius: 4,
          },
          data: list,
        },
      ],
      color: ['#F26279', '#F9D237', '#35CACA', '#73E6BF', '#3A86FE', '#9D8AEE', '#FDB078', '#32B0F7'],
    };
  }, [data]);

  const [ref, instance] = useECharts(options as any, 'canvas');

  useEffect(() => {
    instance?.setOption(options as any);
  }, [options, instance]);

  const content = useMemo(() => {
    return (
      <IndustryChartsWapper enterpriseStatus={enterpriseStatus}>
        <div className="charts" ref={ref}></div>
        <div className="list">
          {data && !isEmpty(data) && max
            ? data.map((item: Charts.RoseChartItem, index: number) => {
                const colorInfo = colorMap.get(index);
                const name = item?.title;
                return (
                  <div className="listItem" key={index}>
                    <span
                      className="record"
                      style={{
                        color: colorInfo?.color ?? defaultColor.color,
                        backgroundColor: colorInfo?.bg ?? defaultColor.bg,
                      }}
                    ></span>
                    {(item?.title?.length > 8 && width <= 1659 && enterpriseStatus === 1) ||
                    (enterpriseStatus === 2 && item?.title?.length > 8) ? (
                      <Popover
                        // trigger={'click'}
                        placement="bottom"
                        content={name}
                        title={undefined}
                        color={'#fff'}
                        overlayStyle={{
                          padding: '10px 12px !important',
                          lineHeight: '18px',
                          fontSize: '12px',
                        }}
                        getPopupContainer={() =>
                          document.getElementById(`industry_popover_mounted_ref_${index}`) as HTMLElement
                        }
                        align={{ offset: [0, -6] }}
                      >
                        <span
                          className="areaName"
                          style={{ cursor: 'pointer' }}
                          id={`industry_popover_mounted_ref_${index}`}
                        >
                          {item.title}
                        </span>
                      </Popover>
                    ) : (
                      <span className="areaName">{item.title}</span>
                    )}
                    <div className="label">
                      <div className="pointer" style={{ width: `${(item.doc_count / max) * 100}%` }}></div>
                    </div>
                    <span className="count">{item?.doc_count?.toLocaleString()}</span>
                  </div>
                );
              })
            : null}
        </div>
      </IndustryChartsWapper>
    );
  }, [data, max, ref, width, enterpriseStatus]);

  return (
    <Box
      cardTitle="行业分布"
      label={enterpriseStatus === 1 ? selectedAreaList?.[selectedAreaList.length - 1]?.shortName : ''}
      content={content}
    ></Box>
  );
});

const IndustryChartsWapper = styled.div<{ enterpriseStatus: 1 | 2 }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 20px;

  .charts .list {
    height: 100%;
  }

  .charts {
    min-width: 220px;
    /* flex:none */
    flex: 6;
  }

  .list {
    flex: 4;
    min-width: 295px;
    max-width: 297px;
    margin-left: 6px;
    margin-bottom: 20px;
    margin-top: 20px;
    overflow-x: hidden;
    overflow-y: scroll;
    &:hover {
      ::-webkit-scrollbar,
      ::-webkit-scrollbar-thumb {
        visibility: visible;
      }
    }
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-thumb {
      visibility: hidden;
    }
    .listItem {
      height: 17px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      overflow-x: hidden;
      .ant-popover-inner-content {
        padding: 10px 12px;
      }
    }

    .listItem:not(:first-child) {
      margin-top: 6px;
    }

    .record {
      width: 6px;
      height: 6px;
      background: #fa541c;
      border-radius: 6px;
      text-align: center;
      line-height: 14px;
    }

    .areaName {
      width: 96px;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #434343;
      line-height: 12px;
      word-break: keep-all; /* 不换行 */
      white-space: nowrap; /* 不换行 */
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 10px;
    }

    .label {
      min-width: 92px;
      height: 6px;
      border-radius: 4px;
      display: block;
      background-color: #eceef5;
      margin-left: 17px;
      margin-right: 6px;
      text-align: left;
      .pointer {
        height: 6px;
        background-color: #3986fe;
        border-radius: 4px;
      }
    }

    .count {
      width: 54px;
      height: 12px;
      color: #2874f9;
      line-height: 12px;
      font-size: 12px;
      text-align: left;
    }
  }

  ${({ enterpriseStatus }) => {
    if (enterpriseStatus === 1) {
      return `
          @media screen and (min-width: 1659px) {
            .list {
              min-width: 380px;
              max-width: 380px;
              .areaName {
                width: 190px;
              }
            }
          }
        `;
    }
  }}
`;
