import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { message } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';

import { scrollTo } from '@/utils/animate';
import { CommonResponse } from '@/utils/utility-types';

import { PaginationType } from './type';

export default function useModal123Request<T extends object>({
  api,
  params,
  visible,
}: {
  api: (params: Record<string, any>) => Promise<CommonResponse<{ data: T[]; total: number }>>;
  params?: Record<string, any>;
  visible?: boolean;
}) {
  const requestParamsRef = useRef<Record<string, any> | undefined>(params);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ total: 0, pageSize: 50, current: 1 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevPaginateRef = useRef(1);

  const { run, runAsync, loading } = useRequest(api, {
    manual: true,
    onBefore: () => {
      if (wrapperRef.current) {
        scrollTo(0, { getContainer: () => wrapperRef.current! });
      }
    },
    onSuccess: ({ data: resData }) => {
      if (resData) {
        const { total, data } = resData;
        setData(data);
        setPagination((prev) => ({ ...prev, total }));
      }
    },
    onError: (e: any) => {
      setPagination((prev) => ({ ...prev, current: prevPaginateRef.current }));
      message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
    },
  });

  const onPageChange = useMemoizedFn((current: number) => {
    prevPaginateRef.current = pagination.current;
    setPagination((prev) => ({ ...prev, current }));
    requestParamsRef.current = { ...params, from: (current - 1) * pagination.pageSize, size: pagination.pageSize };
    run(requestParamsRef.current);
  });

  const onTableChange = useMemoizedFn((_, __, { field, order }: SorterResult<T>) => {
    const sortType = {
      ascend: 'asc',
      descend: 'desc',
    };
    const requestParams = {
      ...params,
      from: 0,
      size: pagination.pageSize,
    };
    requestParamsRef.current = order ? { ...requestParams, sortKey: field, sortRule: sortType[order] } : requestParams;
    runAsync(requestParamsRef.current).then(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
    });
  });

  useEffect(() => {
    if (visible && params) {
      setPagination((prev) => ({ ...prev, current: 1 }));
      requestParamsRef.current = { ...params!, from: 0, size: pagination.pageSize };
      run(requestParamsRef.current);
    }
  }, [pagination.pageSize, params, run, visible]);

  return { loading, data, pagination, onTableChange, onPageChange, wrapperRef, requestParamsRef };
}
