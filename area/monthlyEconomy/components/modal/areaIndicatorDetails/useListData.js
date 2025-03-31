import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty, isUndefined } from 'lodash';

import { getProgressData } from '@/pages/area/monthlyEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

export const statByMonth = () => {
  const _draft = [],
    _start = dayjs(new Date());
  for (let i = 0; i < 12; i++) {
    _draft.push(_start.subtract(i + 1, 'M').format('YYYY-MM'));
  }
  return _draft;
};
export default function useListData({ code, indicName, quarterFlag, hiddenChecked, hiddenEmptyCols }) {
  const [regionData, setRegionData] = useState([]);
  const [tableData, setTableData] = useState({});
  const [traceType, setTraceType] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [loading, setLoading] = useState(true);
  const endDate = cloneDeep(statByMonth())
    .reverse()
    .map((item) => item.replace('-', ''))
    .join();

  const {
    data: progressData,
    run: getProgress,
    loading: progressPending,
  } = useRequest(getProgressData, {
    manual: true,
    onError() {
      setHasData(false);
      setLoading(false);
    },
  });

  useEffect(() => {
    let tabData = progressData?.data;
    if (!progressPending) {
      setRegionData(tabData || []);
    }
  }, [progressData, setRegionData, progressPending]);

  useEffect(() => {
    if (code) {
      setLoading(true);
      getProgress({
        areaCode: code,
        statNature: quarterFlag ? '1,3' : '',
        quarterFlag: quarterFlag,
        endDate,
        indicName,
      });
    }
  }, [code, getProgress, indicName, endDate, quarterFlag]);

  useEffect(() => {
    let timer;
    if (regionData && Array.isArray(regionData)) {
      let tempData = regionData,
        result = [],
        noDataRowKey = [],
        theadData = [];
      theadData = statByMonth();
      let hasDataFlag = true; //false;
      if (isEmpty(tempData)) hasDataFlag = false;
      tempData.forEach((o) => {
        if (o.name) result.push({ specialTitle: o.name, key: shortId() });
        if (o?.child) {
          o.child.forEach((item) => {
            /** 当前指标是否有近5年和预期目标数据 */
            let currentHasData = false;
            let tableItem = { paramName: item.name, key: shortId(), paramDetailArr: item?.value };
            theadData.forEach((thItem, index) => {
              if (item?.value[thItem]) {
                hasDataFlag = true;
                currentHasData = true;
                tableItem[thItem] = !isUndefined(item.value[thItem]?.mValue)
                  ? /** 预期目标列数据无需格式化  */
                    index === 0
                    ? item.value[thItem].mValue
                    : formatNumber(item.value[thItem].mValue)
                  : '-';
                tableItem[thItem + 'indicCode'] = item?.value[thItem].indicCode;
                tableItem[thItem + 'guId'] = item?.value[thItem].guId;
                tableItem[thItem + 'posId'] = item?.value[thItem].posId;
              }
            });
            /** 隐藏空行 */
            if (hiddenChecked) {
              /** 如果当前指标预期目标值+近5年实际值都无数据，就不展示 */
              if (currentHasData) {
                result.push(tableItem);
              }
            } else {
              result.push(tableItem);
            }
          });
        }
      });
      if (hiddenEmptyCols) {
        theadData.forEach((i) => {
          const hasData = result?.find((j) => j[i]);
          !hasData && noDataRowKey.push(i);
        });
        if (!isEmpty(noDataRowKey)) {
          theadData = theadData.filter((i) => !noDataRowKey?.includes(i));
        }
      }

      if (quarterFlag) {
        theadData = theadData.filter((i) => {
          return !(i?.split('-')[1] % 3);
        });
      }

      setHasData(hasDataFlag);
      if (!result?.every((i) => i?.specialTitle)) {
        setTableData({ colKey: theadData, data: result });
      }
      // 手动实现分布加载
      timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [hiddenChecked, regionData, progressPending, hiddenEmptyCols, quarterFlag]);

  const handleChangeData = useMemoizedFn(() => {
    setTraceType((base) => !base);
  });
  return {
    code,
    pending: loading, //pending || progressPending,
    regionData: regionData ?? [],
    emptyStatus: isEmpty(regionData),
    handleChangeData,
    tableData,
    traceType,
    hasData,
    endDate,
  };
}
