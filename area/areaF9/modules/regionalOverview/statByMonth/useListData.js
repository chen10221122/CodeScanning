import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, isUndefined } from 'lodash';

// import { getNewAreaEconomy } from '@/apis/area/areaEconomy';
import useRequest from '@/utils/ahooks/useRequest';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

import { getProgressData } from '../regionalEconomy/api';

const currentYear = new Date().getFullYear();

const statByMonth = () => {
  const _draft = [],
    _start = dayjs('202301'),
    _num = Math.abs(_start.diff(dayjs().subtract(1, 'M').format('YYYYMM'), 'M'));

  for (let i = 0; i <= _num; i++) {
    _draft.push(_start.add(i, 'M').format('YYYY-MM'));
  }
  return _draft.reverse();
};

const statByYear = Array.from({ length: 6 }).map((o, i) => currentYear - i);

export default function useListData({ tabIndex, quarterFlag, hiddenChecked, hiddenEmptyCols }) {
  const [regionData, setRegionData] = useState();
  const [tableData, setTableData] = useState({});
  const [traceType, setTraceType] = useState(false);
  const [hasData, setHasData] = useState(true);
  const { code } = useParams();
  const [loading, setLoading] = useState(true);

  // 上方卡片的接口请求
  const {
    data: progressData,
    run: getProgress,
    loading: progressPending,
  } = useRequest(getProgressData, { manual: true });

  useEffect(() => {
    let tabData = progressData?.data;
    if (tabIndex === 2 && !progressPending) {
      setRegionData(tabData);
    }
  }, [progressData, setRegionData, tabIndex, progressPending]);

  useEffect(() => {
    if (code && tabIndex) {
      if (tabIndex === 2) {
        setLoading(true);
        getProgress({
          areaCode: code,
          statNature: quarterFlag ? '1,3' : '',
          quarterFlag: quarterFlag,
        });
      }
    }
  }, [code, getProgress, tabIndex, quarterFlag]);

  useEffect(() => {
    let timer;
    if (regionData && Array.isArray(regionData)) {
      // setLoading(true);
      let tempData = regionData,
        result = [],
        noDataRowKey = [],
        theadData = [];
      //表头近5年数据
      theadData = tabIndex === 1 ? statByYear : statByMonth();

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
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [hiddenChecked, regionData, tabIndex, progressPending, hiddenEmptyCols, quarterFlag]);

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
  };
}
