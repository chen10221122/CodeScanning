import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, isNil, isUndefined } from 'lodash';

// import { getNewAreaEconomy } from '@/apis/area/areaEconomy';
// import { formatNumber, divisionNumber } from '@/utils/format';
import { TipType } from '@/components/advanceSearch/components/extraModal/errorMessage';
import { getCreateIndexBach } from '@/pages/dataView/api';
import { PagePlatform } from '@/pages/dataView/provider';
import { shortId } from '@/utils/share';

import { getProgressData, getEconomyChoiceParam, getAreaEconomyAndDebtNew } from './api';
import { useIndicatorsModuleConfig } from './hooks';
import { ChartType, ModalType, ignoreParamName } from './types';
import { formatValue, getValueDes, getNewTableData } from './utils';

// const widthChartTitleArr = [
//   'GDP(亿元)',
//   'GDP增速(%)',
//   '人口(万人)',
//   '一般公共预算收入(亿元)',
//   '地方政府债务余额(亿元)',
//   '城投平台有息债务(亿元)',
// ];

// const currentYear = new Date().getFullYear();

const currentYear = new Date().getFullYear();

const statByMonth = () => {
  const _draft = [],
    _start = dayjs('202301'),
    _num = Math.abs(_start.diff(dayjs().format('YYYYMM'), 'M'));

  for (let i = 0; i <= _num; i++) {
    _draft.push(_start.add(i, 'M').format('YYYY-MM'));
  }
  return _draft.reverse();
};

const statByYear = Array.from({ length: 6 }).map((o, i) => currentYear - i);

export default function useListData({ tabIndex, currentStat, hiddenChecked, indicatorTypeMap, listDefaultChoice }) {
  const hasPay = useSelector((store) => store.user.info).havePay;
  // const [regionData, setRegionData] = useState();
  const [tableData, setTableData] = useState({});
  // 表格数据
  const [tableList, setTableList] = useState([]);
  const [traceType, setTraceType] = useState(false);
  const [hasData, setHasData] = useState(true);
  /** 提示信息 */
  const [tipInfo, setTipInfo] = useState({
    visible: false,
  });
  /** 指标排序信息 */
  const [sort] = useState(false); // 是否根据拖拽排序
  const [sortMap, setSortMap] = useState({ hasSort: 0 });
  // 手动限制初始请求次数
  const requestCountRef = useRef(0);
  const { code } = useParams();
  const [firstLoading, setFirstLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  // const [, setLoading] = useState(true);
  /** 列表导出参数 */
  const [listParam, setListParam] = useState({
    indexParamList: [],
    restoreDefault: 1,
  });
  /** 列表指标参数内容 */
  const [listHeadParamMap, setListHeadParamMap] = useState({});

  const [resetFlag, setResetFlag] = useState(false);
  const {
    data: choiceParam,
    runAsync: getParamAsync,
    // run: getParam,
    loading: paramLoading,
  } = useRequest(getEconomyChoiceParam, {
    manual: true,
    params: {
      pageCode: 0,
    },
  });

  const {
    data: _tableData,
    // run: getTableData,
    runAsync: getTableDataAsync,
    loading: _tableLoading,
    // error,
  } = useRequest(getAreaEconomyAndDebtNew, {
    manual: true,
    onBefore() {
      setTableLoading(true);
      setTableError(false);
    },
    onSuccess(_tableData) {
      const regionData = _tableData?.data;
      if (regionData && Array.isArray(regionData)) {
        // setLoading(true);
        let tempData = regionData,
          result = [],
          theadData = [];
        //表头近5年数据
        theadData = tabIndex === 1 ? statByYear : statByMonth();
        let hasDataFlag = true; //false;

        if (isEmpty(tempData)) hasDataFlag = false;

        tempData.forEach((o) => {
          if (o.name) result.push({ specialTitle: o.name, key: shortId() });
          /** 大分类下的指标是否有值标志位，在隐藏空行模式下，如果子指标都没值，大分类也不展示 */
          const hasDataFlags = new Array(o?.child.length).fill(false);
          if (o?.child) {
            o.child.forEach((item, itemIndex) => {
              const { isCustom, customValueType } = getValueDes(item?.indexId, item.value);
              /** 当前指标是否有近5年和预期目标数据 */
              // let currentHasData = false;
              let tableItem = {
                paramName: item.name,
                key: shortId(),
                paramDetailArr: item?.value,
                paramMap: item?.paramMap,
                indexId: item?.indexId,
                isCustom,
                customValueType,
                unit: item?.unit,
                // 1.有趋势图 2.趋势图类型不为null 3.不是自定义指标的布尔值
                hasChart: !!(+item?.detailFlag && item?.detailType) && (!isCustom || (isCustom && customValueType)),
                chartType: ChartType[item?.detailType],
                // 判断当前指标整行是否有数据，默认值是false，用于隐藏空行功能
                currentHasData: false,
              };
              tableItem.extraProperties = {
                ...(item?.updateValue || {}),
                type: indicatorTypeMap[item?.indexId],
                value: item?.updateValue?.mValue,
              };
              tableItem.type = indicatorTypeMap[item?.indexId];
              theadData.forEach((thItem, index) => {
                if (item?.value[thItem]) {
                  hasDataFlag = true;
                  tableItem.currentHasData = true;
                  tableItem[thItem] = !isUndefined(item.value[thItem]?.mValue)
                    ? /** 预期目标列数据无需格式化  */
                      index === 0
                      ? item.value[thItem].mValue
                      : formatValue(item.unit, item.value[thItem].mValue)
                    : '-';
                  // item.value[thItem].mValue = tableItem[thItem];
                  tableItem[thItem + 'indicCode'] = item?.value[thItem].indicCode;
                  tableItem[thItem + 'guId'] = item?.value[thItem].guId;
                  tableItem[thItem + '_isMissVCA'] = item?.value[thItem].isMissVCA;
                  if (item?.value[thItem]?.updateValue) {
                    item.value[thItem]['extraProperties'] = {
                      ...(item.value[thItem]?.['extraProperties'] || {}),
                      ...item.value[thItem].updateValue,
                      type: indicatorTypeMap[item.indexId],
                    };
                  }
                }
              });
              /** 隐藏空行 */
              // if (hiddenChecked) {
              //   /** 如果当前指标预期目标值+近5年实际值都无数据，就不展示 */
              //   if (currentHasData) {
              //     hasDataFlags[itemIndex] = true;
              //     result.push(tableItem);
              //   }
              // } else {
              hasDataFlags[itemIndex] = tableItem?.currentHasData;
              result.push(tableItem);
              // }
            });
            // 判断一级标题下的二级标题是否都没有数据，有数据一级标题hasDataFlags值为true
            if (hasDataFlags.includes(true)) {
              const titleIdx = result.length - o.child.length - 1;
              result[titleIdx].hasDataFlags = true;
            }
          }
        });
        if (sortMap.hasSort) {
          result.sort((a, b) => sortMap[a?.indexId ?? a?.specialTitle] - sortMap[b?.indexId ?? b?.specialTitle]);
        }

        setHasData(hasDataFlag);
        if (!result?.every((i) => i?.specialTitle)) {
          setTableData({ colKey: theadData, data: result });
          setTableList(getNewTableData(hiddenChecked, result));
          setFirstLoading(false);
        }
      }

      if (!regionData?.length) {
        // console.log('false')
        setHasData(false);
      }
      setFirstLoading(false);
      setTableLoading(false);
    },
    onError() {
      setTableLoading(false);
      setHasData(false);
      setTableError(true);
    },
  });

  const { run: getParamTextList } = useRequest(getCreateIndexBach, {
    manual: true,
    onSuccess(data) {
      const map = {};
      data?.data?.forEach((item) => {
        const endIndex = item.indexId.indexOf('#');
        const indexId = item.indexId.slice(0, endIndex < 0 ? undefined : endIndex);
        // 过滤：1.日期类字段 2.空值字段
        map[indexId] = item.headParamList.filter((head) => !ignoreParamName.includes(head.name) && !isNil(head.value));
      });
      // console.log('map', map);
      setListHeadParamMap(map);
    },
  });

  const handleGetDefData = useMemoizedFn(() => {
    getTableDataAsync({
      regionCode: code,
      restoreDefault: 1,
      indexParamList: Object.values(listDefaultChoice).filter((item) => item !== undefined && item !== null),
    });
    setListParam({
      indexParamList: Object.values(listDefaultChoice),
      restoreDefault: 1,
    });
    setResetFlag(false);
  });

  const {
    data: progressData,
    run: getProgress,
    loading: progressPending,
  } = useRequest(getProgressData, { manual: true });

  const regionData = useMemo(() => {
    let tab1Data = _tableData?.data;
    let tab2Data = progressData?.data;
    if (tabIndex === 1 && !_tableLoading) {
      return tab1Data;
    } else if (tabIndex === 2 && !progressPending) {
      return tab2Data;
    }
    return [];
  }, [_tableData?.data, _tableLoading, progressData?.data, progressPending, tabIndex]);

  // restoreDefault 为是否默认参数，true 为是默认参数，无需恢复默认
  const getDataAsync = useMemoizedFn((indicList, restoreDefault, showTip = false) => {
    getTableDataAsync({
      regionCode: code,
      indexParamList: indicList,
      restoreDefault: restoreDefault,
    })
      .then(() => {
        if (showTip) {
          setTipInfo({
            visible: true,
            type: TipType.success,
            text: '保存成功',
          });
        }
        setListParam({
          indexParamList: indicList,
          restoreDefault: +restoreDefault,
        });
        setResetFlag(!+restoreDefault);
        requestCountRef.current++;
      })
      .catch(() => {
        if (showTip) {
          setTipInfo({
            visible: true,
            type: TipType.error,
            text: '保存失败',
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          setTipInfo({
            visible: false,
          });
        }, 3000);
        setFirstLoading(false);
      });
  });

  // 初次请求
  useEffect(() => {
    if (requestCountRef.current === 1) {
      // 有权限才用缓存
      if (choiceParam?.data && hasPay) {
        const {
          data: { indicList, restoreDefault },
        } = choiceParam;
        getDataAsync(indicList, restoreDefault);
        requestCountRef.current++;
      } else {
        const listParam = Object.values(listDefaultChoice);
        if (listParam.length) {
          getDataAsync(listParam, true);
          requestCountRef.current++;
        }
      }
    }
  }, [code, getDataAsync, hasPay, listDefaultChoice, choiceParam]);

  // 获取指标参数对应的文本
  useEffect(() => {
    if (listParam.indexParamList.length) {
      const params = [];
      listParam.indexParamList.forEach((item) => {
        if (item?.indexId && item?.paramMap) params.push(item);
      });
      params.length && getParamTextList(params);
    }
  }, [getParamTextList, listParam.indexParamList]);

  const handleChangeData = useMemoizedFn(() => {
    setTraceType((base) => !base);
  });

  // 初次请求，先请求缓存
  useEffect(() => {
    if (code && tabIndex) {
      if (tabIndex === 1) {
        // setLoading(true);
        if (requestCountRef.current === 0) {
          getParamAsync({ pageCode: ModalType.LIST }).finally(() => {
            requestCountRef.current = 1;
          });
        }
      } else if (tabIndex === 2) {
        // setLoading(true);
        getProgress({
          areaCode: code,
          exportFlag: 'false',
          statNature: isEmpty(currentStat) ? '' : currentStat.join(','),
        });
      }
    }
  }, [code, getProgress, tabIndex, currentStat, getParamAsync]);

  const { batchRequest } = useIndicatorsModuleConfig();
  /** 自定义指标弹窗保存回调 */
  const handleConfirmChange = useMemoizedFn((checkedNodes, isDefault, selectedParamMap) => {
    // 异步保存排序信息
    if (sort) {
      Promise.resolve(checkedNodes).then((nodes) => {
        const parentTitleSortMap = {};
        const kindSortList = [];
        nodes.forEach((node) => {
          const parentTitle = node.parent[0];
          if (parentTitleSortMap[parentTitle]) {
            kindSortList[parentTitleSortMap[parentTitle].index].push(node.indexId);
          } else {
            parentTitleSortMap[parentTitle] = { index: kindSortList.length };
            kindSortList.push([parentTitle, node.indexId]);
          }
        });
        const sortObj = { hasSort: 1 };
        let count = 0;
        kindSortList.forEach((list) => {
          list.forEach((item) => {
            sortObj[item] = count;
            count++;
          });
        });
        // console.log('list sort', kindSortList);
        setSortMap(sortObj);
      });
    }
    const customIndexIds = [];
    const params = {};
    checkedNodes.forEach((item) => {
      params[item.indexId] = { indexId: item.indexId };
      if (item?.defaultParamMap) {
        params[item.indexId] = { indexId: item.indexId, paramMap: item.defaultParamMap };
      }
      if (selectedParamMap[item.indexId]) {
        params[item.indexId] = { indexId: item.indexId, paramMap: selectedParamMap[item.indexId] };
      }
      if (item?.canAdd || item?.isCustom) {
        customIndexIds.push(item.indexId);
        params[item.indexId] = { indexName: item?.indexName, indexId: item.indexId };
      }
    });
    // 如果有自定义指标需要先请求自定义指标的默认入参
    if (customIndexIds.length) {
      batchRequest({
        indexIds: customIndexIds.join(','),
        isDefault: true,
        pageType: PagePlatform.Area,
      }).then((res) => {
        res?.data?.forEach((item) => {
          const { indexId, indexName, defaultValueBean } = item;
          params[indexId] = { indexId, indexName, paramMap: defaultValueBean?.paramMap };
        });
        getDataAsync(Object.values(params), isDefault, true);
      });
    } else {
      getDataAsync(Object.values(params), isDefault, true);
    }
  });

  return {
    code,
    // pending: loading, //pending || progressPending,
    pending: paramLoading || tableLoading,
    firstLoading,
    error: tableError,
    // execute,
    // regionData: regionData ?? [],
    emptyStatus: isEmpty(regionData),
    handleChangeData,
    tableData,
    traceType,
    hasData,
    // getTableData,
    listParam,
    resetFlag,
    handleGetDefData,
    paramData: {
      ...choiceParam,
      data: { indicList: listParam.indexParamList, restoreDefault: listParam.restoreDefault },
    },
    listHeadParamMap,
    paramLoading,
    defaultChoice: listDefaultChoice,
    // updateListParam,
    tipInfo,
    handleConfirmChange,
    tableList,
    setTableList,
  };
}
