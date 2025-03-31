import { useCallback, useEffect, useState } from 'react';

import { isUndefined } from 'lodash';

import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

export default function useRegion(hiddenChecked) {
  const {
    state: { regionData },
  } = useCtx();

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState({});
  const [traceType, setTraceType] = useState(false);
  // 表格显示是否有数据
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    let timer;
    if (regionData && Array.isArray(regionData)) {
      setLoading(true);
      let tempData = regionData,
        result = [],
        theadData = [];
      //表头近5年数据
      const currentYear = new Date().getFullYear();
      theadData = Array.from({ length: 6 }).map((o, i) => currentYear - i);
      let hasDataFlag = false;
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
      setHasData(hasDataFlag);
      setTableData({ colKey: theadData, data: result });
      // 手动实现分布加载
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    if (regionData === undefined) {
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [hiddenChecked, regionData]);

  const handleChangeData = useCallback(() => {
    setTraceType((base) => !base);
  }, []);

  return { loading, tableData, handleChangeData, traceType, hasData };
}
