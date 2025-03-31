import { useEffect, useMemo, useRef, useState } from 'react';

import { getLocalDebt } from '@/apis/area/areaEconomy';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useAsync } from '@/utils/hooks';

const BACK_END_VALUE_MAP = ['再融资债券', '新增债券', '置换债券', '再融资债券', '新增债券', '置换债券'];
const TABLE_ROW_MAP = {
  0: 1,
  1: 2,
  2: 3,
  3: 5,
  4: 6,
  5: 7,
};
//堆叠图legend
const CHART_NAME_ARR = ['再融资一般债', '新增一般债', '置换一般债', '再融资专项债', '新增专项债', '置换专项债'];
const rowNameArr = [
  '一般债券发行',
  '再融资债券',
  '新增债券',
  '置换债券',
  '专项债券发行',
  '再融资债券',
  '新增债券',
  '置换债券',
];

export default function useLocalDebtIssue() {
  const {
    state: { code: regionCode },
  } = useCtx();

  const [condition] = useState({
    regionCode,
    dateScope: '',
    statCycleNum: '',
    sortMode: '',
  });

  let defaultTableData = useMemo(() => {
    return rowNameArr.map((o, i) => {
      return { tableTitle: o, key: i };
    });
  }, []);

  const columnsName = useRef([]);
  const [tableData, setTableData] = useState(defaultTableData);
  const [chartData, setChartData] = useState([]);
  const { data, execute, pending, error } = useAsync(getLocalDebt);

  useEffect(() => {
    if (error) {
      setTableData([]);
      setChartData([]);
    }
  }, [error]);

  useEffect(() => {
    if (data?.length) {
      columnsName.current = data.map((o) => o.key); // 日期列表
      //table及表格所需数据转换
      let needTableData = rowNameArr.map((o, i) => ({ tableTitle: o, key: i })),
        needChartData = CHART_NAME_ARR.map((o) => {
          return { name: o, data: columnsName.current.map((o) => '') };
        }),
        tableRowIndex = 0,
        chartDataIndex = 0;

      data.forEach((o) => {
        if (o.key && o?.stat?.length) {
          o.stat.forEach((t) => {
            //获取单个数据对应所需数组的下标
            tableRowIndex = BACK_END_VALUE_MAP.findIndex((c, i) => i === t.bondUses - 1);
            chartDataIndex = columnsName.current.findIndex((c) => c === o.key);
            needTableData[TABLE_ROW_MAP[tableRowIndex]][o.key] = t?.amount || '-';
            needChartData[tableRowIndex].data[chartDataIndex] =
              t?.amount && !isNaN(t?.amount) ? parseFloat(t.amount).toFixed(2) : '-';
          });
        }
      });

      //计算一般债，专项债合计
      columnsName.current.forEach((c) => {
        needTableData[0][c] =
          needTableData
            .filter((o, i) => i > 0 && i < 4)
            .reduce((res, item) => {
              if (item[c]) res += item[c];
              return res;
            }, 0) || '-';
        needTableData[4][c] =
          needTableData
            .filter((o, i) => i > 4)
            .reduce((res, item) => {
              if (item[c]) res += item[c];
              return res;
            }, 0) || '-';
      });
      setTableData(needTableData);
      setChartData(needChartData);
    } else {
      columnsName.current = [];
      setTableData([]);
      setChartData([]);
    }
  }, [data, defaultTableData, regionCode]);

  useEffect(() => {
    if (condition && regionCode) {
      execute({ ...condition, regionCode });
    }
  }, [regionCode, condition, execute]);

  return { pending, condition, columnsName: columnsName.current, chartData, tableData, error, execute, regionCode };
}
