import { useState, useEffect, useRef } from 'react';

import { isEqual } from 'lodash';

import { useRequest } from '@/utils/hooks';

import { getTableData } from '../../api';
import { conditionType } from '../../index';

interface useTableDataType {
  /**模块类型 */
  moduleType?: string;
  /**表格接口入参集合 */
  condition: conditionType;
  /**当前页数 */
  current: number;
  /**页面首次加载状态 */
  firstTimeLoading: boolean;
  setDataCount: (count: number) => void;
  setFirstTimeLoading: (count: boolean) => void;
  setScreenLoading: (count: boolean) => void;
  setFirstTimeNoData: (count: boolean) => void;
}

const useTableData = ({
  moduleType,
  condition,
  current,
  firstTimeLoading,
  setDataCount,
  setFirstTimeLoading,
  setFirstTimeNoData,
  setScreenLoading,
}: useTableDataType) => {
  const [loadingError, setLoadingError] = useState(false);
  const [tableData, setTableData] = useState([]);
  const conditionRef = useRef<conditionType>();

  const { run, loading } = useRequest(getTableData, {
    manual: true,
    onSuccess: (data) => {
      if (data.data.length) {
        setTableData(data.data);
        setDataCount(data.data[0]?.total);
      } else {
        setTableData([]);
        setDataCount(0);
        firstTimeLoading && setFirstTimeNoData(true);
      }
      setFirstTimeLoading(false);
      setScreenLoading(false);
    },
    onError: () => {
      setLoadingError(true);
      setFirstTimeLoading(false);
      setScreenLoading(false);
      setTableData([]);
    },
  });
  useEffect(() => {
    const skip = 50 * (current - 1);
    const resultCondition = { ...condition, moduleType, skip };
    if (isEqual(conditionRef.current, resultCondition)) return;
    run(resultCondition);
    conditionRef.current = resultCondition;
  }, [moduleType, condition, current, run, setScreenLoading]);

  return {
    fetchParams: conditionRef.current,
    loadingError,
    loading,
    tableData,
  };
};
export default useTableData;
