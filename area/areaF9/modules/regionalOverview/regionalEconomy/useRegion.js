import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { isUndefined, isEmpty } from 'lodash';

import { formatNumber } from '@/utils/format';
import { shortId } from '@/utils/share';

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

export default function useRegion(hiddenChecked, regionData, tabIndex) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState({});
  const [traceType, setTraceType] = useState(false);
  // 表格显示是否有数据
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    let timer;
    if (regionData && Array.isArray(regionData)) {
      setLoading(true);
      let tempData = regionData,
        result = [],
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

      setHasData(hasDataFlag);
      if (!result?.every((i) => i?.specialTitle)) {
        setTableData({ colKey: theadData, data: result });
      }
      // 手动实现分布加载
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    if (regionData === undefined) {
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [hiddenChecked, regionData, tabIndex]);

  const handleChangeData = useCallback(() => {
    setTraceType((base) => !base);
  }, []);

  return { loading, tableData, handleChangeData, traceType, hasData };
}

// const parseData = (regionData, theadData) => {
//   const _tmp = []
//   regionData.forEach(i => {
//     _tmp.push(({ specialTitle: i.name, key: shortId() }))
//     _tmp.push(i?.child)
//   })
//   return flatten(_tmp)
// }
