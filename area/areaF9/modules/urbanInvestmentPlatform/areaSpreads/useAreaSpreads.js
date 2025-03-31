import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useImmer } from '@dzh/hooks';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';

import { getAreaSpreadInstrument } from '@/apis/area/areaEconomy';
import { colorsEnum } from '@/pages/bond/cityInvestSpreadInstrument/constants';
import toolTipDom from '@/pages/detail/modules/bond/areaCastleThrow/modules/spreadAnalysis/components/tooltip';
import useRequest from '@/utils/ahooks/useRequest';
import { getTextWidth } from '@/utils/share';

export default function useAreaSpreads(regionCode) {
  const { code: areaCode } = useParams();
  const code = regionCode || areaCode;
  const defaultParams = useMemo(
    () => ({
      /** 截止日期 */
      interestDate: dayjs().format('YYYY-MM-DD'),
      /** 利差起始日期 */
      interestBeginDate: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
      /** 利差算法-中位数 */
      interestAlgorithm: '0',
      /** 利差类型 */
      interestType: '0',
      parkStatus: '0',
      issueMode: '0',
      cnBondEvaluateLevel: '0',
      remainingYear: '0',
      guaranteeStatus: '0',
      areaCode: code,
      chooseDimension: '0',
    }),
    [code],
  );
  const [fetchParams, updateFetchParams] = useImmer(defaultParams);
  const [currentPage, setCurrentPage] = useState(1);
  const isChangeParam = useMemo(() => {
    return !isEqual(fetchParams, defaultParams);
  }, [fetchParams, defaultParams]);
  const [needData, updateNeedData] = useImmer({ originData: [], tableData: [], chartData: {}, tableCols: [] });
  const [currentKey, setCurrentKey] = useState(0); // 重置日期筛选组件
  const {
    run: getAreaSpreadInstrumentData,
    loading,
    error,
  } = useRequest(getAreaSpreadInstrument, {
    manual: true,
    onSuccess({ data }) {
      if (data?.length) {
        updateNeedData((draft) => {
          let xAxisData = data[0].curve.map(({ interestDate }) => interestDate);
          const series = data.map(({ curveName, curve }) => ({
            name: curveName,
            type: 'line',
            connectNulls: false,
            data: curve.map(({ value }) => value),
            Symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              width: 2,
            },
          }));
          draft.originData = data;
          draft.chartData = {
            title: {
              text: '单位：BP',
              textStyle: {
                color: '#595959',
                fontSize: 12,
                fontWeight: 'Regular',
              },
              padding: [0, 0, 10, 4],
            },
            tooltip: {
              confine: true,
              enterable: true,
              trigger: 'axis',
              axisPointer: {
                type: 'none',
                label: {
                  backgroundColor: '#6a7985',
                },
              },
              textStyle: {
                color: '#3c3c3c',
              },
              position: function (point, params, dom) {
                let posDis = window.innerWidth - dom.offsetWidth;
                return posDis < point[0] ? [posDis, '15%'] : [point[0], '15%'];
              },
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              extraCssText: 'padding: 0px;border-radius: 4px;z-index:4;',
              formatter: (params) => {
                return toolTipDom(params);
              },
            },
            color: colorsEnum,
            legend: {
              type: 'scroll',
              bottom: 0,
              textStyle: {
                color: '#5c5c5c',
                padding: [2, 0, 0, 0],
                fontSize: 12,
                lineHeight: 14,
              },
              pageIconSize: [10, 16],
              pageTextStyle: { color: '#5c5c5c', fontSize: 12, lineHeight: 12 },
              pageIcons: {
                horizontal: [
                  'image://' + require('@pages/bond/cityInvestSpread/images/legend_page_left.svg'),
                  'image://' + require('@pages/bond/cityInvestSpread/images/legend_page_right.svg'),
                ],
              },
              padding: [0, 15],
              itemGap: 30,
              icon: 'rect',
              itemWidth: 8,
              itemHeight: 8,
            },
            grid: {
              top: 30,
              left: 0,
              right: 8,
              bottom: 30,
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: xAxisData,
              axisLine: { lineStyle: { color: '#efefef' } },
              axisTick: { show: false },
              axisLabel: { color: '#595959', showMinLabel: false },
            },
            yAxis: {
              min: 0,
              max: (value) => {
                return value.max ? undefined : 60;
              },
              axisLine: { show: false },
              axisTick: { show: false },
              axisLabel: {
                color: '#595959',
                padding: [0, -4, 0, 0],
              },
              splitLine: { lineStyle: { type: 'dashed', color: '#efefef' } },
            },
            series,
          };
          draft.tableCols = [
            { title: '日期', dataIndex: 'date', width: 86, fixed: 'left', align: 'center' },
            /* @ts-ignore */
            ...data.map(({ curveName }, i) => {
              const title = `${series[i].name}`;
              const calcTitleWidth = getTextWidth(title, `400 12px Arial`);
              return {
                title: <div title={title}>{title}</div>,
                resizable: true,
                dataIndex: curveName,
                width: calcTitleWidth > 185 ? 185 : calcTitleWidth < 40 ? 65 : calcTitleWidth + 26,
                align: 'right',
                render: (text) => text || '-',
              };
            }),
          ];
          draft.tableData = xAxisData
            .map((date, i) =>
              data.reduce(
                (pre, { curveName, curve }) => {
                  pre[curveName] = curve[i].value;
                  return pre;
                },
                { date },
              ),
            )
            .reverse();
        });
      }
    },
    onError() {
      updateNeedData((draft) => {
        draft.originData = [];
        draft.chartData = [];
        draft.tableData = [];
        draft.tableCols = [];
      });
    },
  });

  const onDateChange = useMemoizedFn((item) => {
    if (item?.length) {
      updateFetchParams((draft) => {
        draft.interestBeginDate = item[0];
        draft.interestDate = item[1];
      });
    }
    setCurrentPage(1);
  });

  const onScreenChange = useMemoizedFn((select, key) => {
    if (select?.length) {
      updateFetchParams((draft) => {
        /** 因为我这里是单选，所以省事了，如果是多选，需要数据归类 */
        draft[select[0].key] = select[0].value;
      });
    } else {
      updateFetchParams((draft) => {
        draft[key] = '0';
      });
    }
    setCurrentPage(1);
  });

  const handleClear = useMemoizedFn(() => {
    updateFetchParams(() => {
      return { ...defaultParams };
    });
    setCurrentKey(Math.random());
    setCurrentPage(1);
  });

  useEffect(() => {
    if (fetchParams) getAreaSpreadInstrumentData(fetchParams);
  }, [fetchParams, getAreaSpreadInstrumentData]);

  return {
    pending: loading,
    error,
    currentKey,
    needData,
    fetchParams,
    isChangeParam,
    currentPage,
    setCurrentPage,
    handleClear,
    onDateChange,
    onScreenChange,
  };
}
