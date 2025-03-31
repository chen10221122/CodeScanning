import { useCallback, useEffect, useRef, useState } from 'react';

import { getSpecificItem } from '@/apis/area/areaEconomy';
import { isCounty } from '@/pages/area/areaEconomy/common/index';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useAsync } from '@/utils/hooks';

const PAGESIZE = 50;
export default function useSpecificItems({ specialDebtLoading, setSearchType }) {
  const {
    state: { code, selectedYear, level },
  } = useCtx();

  const [condition, setCondition] = useState({
    regionCode: code,
    year: '',
    skip: 0,
    pagesize: PAGESIZE,
    isQueryThisLevel: isCounty(code) ? '1' : level === '1' ? '2' : '1',
  });

  const [pager, setPager] = useState({
    current: 1,
    pagesize: PAGESIZE,
    total: 0,
  });
  const requestRef = useRef();
  // 绕过第一次的pageChange
  const firstPageChangeRef = useRef();
  // 是否是第一次请求
  const iFirstRequest = useRef(true);
  const [firstPageChange, setFirstPageChange] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { data, execute, pending, error } = useAsync(getSpecificItem);
  //翻页
  const handlePageChange = useCallback(
    (pager) => {
      if (!firstPageChangeRef.current) {
        firstPageChangeRef.current = true;
      } else {
        setFirstPageChange(true);
      }
      setPager((base) => {
        return { ...base, current: pager };
      });
      setCondition((originState) => {
        return { ...originState, skip: (pager - 1) * PAGESIZE, regionCode: code };
      });
      setSearchType('pageType');
    },
    [code, setSearchType],
  );

  useEffect(() => {
    handlePageChange({ ...pager, current: 1 });
    /* eslint-disable */
  }, [handlePageChange]);

  useEffect(() => {
    if (selectedYear) {
      setPager((originState) => ({
        ...originState,
        current: 1,
      }));
      setCondition((originState) => {
        return { ...originState, year: selectedYear === '-' ? '' : selectedYear, skip: 0 };
      });
      setFirstPageChange(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    setPager((originState) => ({
      ...originState,
      current: 1,
    }));
    setCondition((originState) => {
      return { ...originState, skip: 0, isQueryThisLevel: isCounty(code) ? '1' : level === '1' ? '2' : '1' };
    });
    setFirstPageChange(false);
  }, [level, code]);

  useEffect(() => {
    if (error) {
      setTableData([]);
    }
  }, [error]);

  useEffect(() => {
    if (code) {
      if (data?.data?.length) {
        setTableData(
          data.data.map((o) => {
            return { ...o, key: o.id };
          }),
        );
        setPager((base) => {
          return { ...base, total: data.total };
        });
      } else {
        setTableData([]);
      }
    } else {
      // 金门县特殊处理，没有topCode
      setTableData([]);
    }
  }, [code, data]);

  useEffect(() => {
    // 当第一个请求结束后再去请求表格数据， 后续 loading 与 specialDebtLoading 无关
    if (
      !(iFirstRequest.current && specialDebtLoading) &&
      condition &&
      JSON.stringify(requestRef.current) !== JSON.stringify(condition)
    ) {
      execute({ ...condition });
      requestRef.current = condition;
      iFirstRequest.current = false;
    }
  }, [execute, condition]);

  return { pending, condition, tableData, pager, handlePageChange, execute, error, firstPageChange };
}
