import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isEmpty } from 'lodash';

import { getAreaUnderArea } from '@/apis/area/areaEconomy';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useAsync } from '@/utils/hooks';

import { nextTick } from '../../common';
import { getAreaChild } from '../../common/getAreaChild';
import { IndustryName } from '../../config/underArea';

interface IRequestParams {
  form: number;
  size: number;
  indicName: string;
  sort?: string;
  regionCode?: string;
  endDate?: string;
}

export type IGetAreaUnderArea = (type: IRequestParams) => Promise<{ data: { data: any[] } }>;
export default function useUnderArea() {
  const {
    state: { code, lastYear },
  } = useCtx();
  // 默认请求参数
  const defaultParams = useMemo(() => {
    const indicNames = Object.keys(IndustryName);
    return {
      form: 0,
      size: 10000,
      sort: `${indicNames[0]}:desc`,
      indicName: indicNames.join(','),
    };
  }, []);
  // 请求状态
  const [loading, setLoading] = useState(false);
  // 缓存请求参数，数据导出用
  const requestParams = useRef<IRequestParams>(defaultParams);
  const [date, setDate] = useState(lastYear);
  // 排序参数
  const [sort, setSort] = useState<{ [key: string]: string }>({});
  // 判断是否没有下属辖区
  const [hasNextRegion, setHasNextRegion] = useState(true);

  const [tableData, setTableData] = useState<any[]>([]);
  const { data, execute, pending, error } = useAsync<IGetAreaUnderArea>(getAreaUnderArea);
  useEffect(() => {
    if (error) {
      setTableData([]);
    }
  }, [error]);

  useEffect(() => {
    setLoading(!!pending);
  }, [pending, setLoading]);

  useEffect(() => {
    if (data && Array.isArray(data?.data)) {
      setTableData(data.data);
    } else {
      setTableData([]);
    }
  }, [data]);
  const reladData = useCallback(
    ({ code, date, sort }) => {
      const regionCode = getAreaChild(code)
        .map((item) => item.value)
        .join(',');
      // 没有下属辖区，不请求数据，清空数据, 设置loading状态
      if (!regionCode) {
        setLoading(true);
        setTableData([]);
        setHasNextRegion(false);
        nextTick(() => setLoading(false));
        return;
      }
      let params: IRequestParams = {
        ...defaultParams,
        regionCode,
        endDate: date,
      };
      if (!isEmpty(sort)) {
        params.sort = `${sort.field}:${sort.order === 'ascend' ? 'asc' : 'desc'}`;
      }
      setHasNextRegion(true);
      requestParams.current = params;
      execute(params);
    },
    [execute, defaultParams],
  );
  useEffect(() => {
    if (code && date) {
      reladData({ code, date, sort });
    }
  }, [code, reladData, date, sort]);

  const menuChange = useCallback(
    (cur) => {
      setDate(cur[0]?.value || '');
    },
    [setDate],
  );

  return { loading, tableData, menuChange, date, code, error, requestParams, reladData, setSort, hasNextRegion };
}
