import { useCallback, useEffect, useRef, useState } from 'react';

import { getAreaSpreads, getAreaSpreadsRecentDay } from '@/apis/area/areaEconomy';
import { chartColor } from '@/assets/styles';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';

const chartColorArr = Object.keys(chartColor).map((o) => chartColor[o]);

const STPYPE_NAME_OBJ = {
  11: '全部债项',
  12: 'AAA',
  13: 'AA+',
  14: 'AA',
  21: '省级',
  22: '地市级',
  23: '区县级',
};
const PARAMS_OBJ = {
  SP: '当前利差',
  BD0302_001: '较前一日',
  BD0302_002: '较月初',
  BD0302_003: '较季初',
  BD0302_004: '较年初',
  BD0302_005: '当前分位(%)',
  BD0302_006: '1/4分位',
  BD0302_007: '中位数',
  BD0302_008: '3/4分位',
};

//生成表格所需数据
function _rebuildData(data = []) {
  let arr = data;
  let newArr = [];
  Object.keys(PARAMS_OBJ).forEach((o, i) => {
    newArr.push({
      key: i,
      paramsName: PARAMS_OBJ[o],
      all: _makeFilterData(arr, 11, o),
      aaa: _makeFilterData(arr, 12, o),
      aaPlus: _makeFilterData(arr, 13, o),
      aa: _makeFilterData(arr, 14, o),
      province: _makeFilterData(arr, 21, o),
      city: _makeFilterData(arr, 22, o),
      district: _makeFilterData(arr, 23, o),
    });
  });

  function _makeFilterData(data, flag, key) {
    // console.log(data,flag,'这是data')
    let res,
      obj = data.filter((o) => o.SType === flag).length ? data.filter((o) => o.SType === flag)[0] : '-';
    if (obj) {
      res = obj[key] ? parseFloat(obj[key]).toFixed(2) : '-';
    }
    return res;
  }

  return newArr;
}

//生成折线图所需数据
function _makeChartData(data = []) {
  // 获取所有日期的数据
  let xDate = [...new Set(data.map((o) => o.TDate))];
  let seriesData = [];

  let itemArr = Object.keys(STPYPE_NAME_OBJ).map((t) => {
    let itemData = [];
    xDate.forEach((date) => {
      const i = data.find((item) => {
        return item.TDate === date && parseInt(item.SType) === parseInt(t);
      });

      if (i) {
        itemData.push(i.SP ? parseFloat(i.SP).toFixed(2) : '-');
      } else {
        itemData.push('-');
      }
    });
    return {
      name: STPYPE_NAME_OBJ[t],
      itemData: itemData,
    };
  });

  itemArr.forEach((o, i) => {
    seriesData.push({
      name: o.name,
      type: 'line',
      connectNulls: true,
      data: o.itemData.reverse(),
      Symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        shadowColor: chartColorArr[i] + '33',
        shadowBlur: 0,
        shadowOffsetY: 0,
      },
    });
  });
  return { xDate: xDate.reverse(), seriesData };
}

export default function useAreaSpreads(regionCode) {
  const {
    state: { code: areaCode, areaInfo },
  } = useCtx();
  const code = regionCode || areaCode;
  const [recentDate, setRecentDate] = useState('');
  // 折线图内容的 loading
  const [chartLoading, setChartLoading] = useState(true);
  const getDayConditionRef = useRef({
    regionCode: code,
    SType: '11,12,13,14,21,22,23',
  });
  const chartConditionRef = useRef({
    regionCode: code,
    SType: '11,12,13,14,21,22,23',
    fieldStr: 'SType,TDate,SP',
    recentYears: 1,
  });
  const tableConditionRef = useRef({
    regionCode: code,
    SType: '11,12,13,14,21,22,23',
    fieldStr: 'SType,TDate,SP,BD0302_001,BD0302_002,BD0302_003,BD0302_004,BD0302_005,BD0302_006,BD0302_007,BD0302_008',
    startTDate: recentDate,
    endTDate: recentDate,
  });
  const [needData, setNeedData] = useState({ tableData: [], chartData: {} });
  const { run: execute, error } = useRequest(getAreaSpreads, {
    manual: true,
    onSuccess(res) {
      if (res?.data?.length) {
        setNeedData((base) => {
          return { ...base, chartData: _makeChartData(res?.data) };
        });
      }
      setChartLoading(false);
    },
  });
  const {
    run: tableExecute,
    loading: tablePending,
    error: tableError,
  } = useRequest(getAreaSpreads, {
    manual: true,
    onSuccess(res) {
      if (res?.data?.length) {
        setNeedData((base) => {
          return { ...base, tableData: _rebuildData(res?.data) };
        });
      }
    },
  });
  const {
    run: getAreaSpreadsRecentDayExecute,
    error: dateError,
    loading: dateLoading,
  } = useRequest(getAreaSpreadsRecentDay, {
    manual: true,
    onSuccess(res) {
      if (res?.data?.length) {
        setRecentDate(res.data[0].TDate);
        tableConditionRef.current['startTDate'] = res.data[0].TDate;
        tableConditionRef.current['endTDate'] = res.data[0].TDate;
      }
    },
  });

  useEffect(() => {
    if (code) {
      getAreaSpreadsRecentDayExecute({ ...getDayConditionRef.current, regionCode: code });
    }
  }, [code, getAreaSpreadsRecentDayExecute]);

  useEffect(() => {
    if (error) {
      setNeedData((prev) => ({
        ...prev,
        chartData: {},
      }));
      setChartLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (tableError) {
      setNeedData((prev) => ({
        ...prev,
        tableData: [],
      }));
    }
  }, [tableError]);

  useEffect(() => {
    // 如果存在 dateError ，按照以前的逻辑就没有 recentDate 数据，就不会去请求折线图数据和表格数据
    if (dateError) {
      setChartLoading(false);
    }
  }, [dateError]);

  const onRadioChange = useCallback(
    (e) => {
      const { value } = e.target;
      chartConditionRef.current['recentYears'] = value;
      execute({ ...chartConditionRef.current, regionCode: code });
    },
    [code, execute],
  );

  useEffect(() => {
    if (code && recentDate) {
      execute({ ...chartConditionRef.current, regionCode: code });
      tableExecute({ ...tableConditionRef.current, regionCode: code });
    }
  }, [code, execute, recentDate, tableExecute]);

  return {
    pending: dateLoading || tablePending,
    condition: tableConditionRef.current,
    needData,
    areaInfo,
    getAreaSpreadsRecentDayExecute,
    error: dateError || tableError || error,
    tableConditionRef,
    code,
    onRadioChange,
    chartLoading,
  };
}
