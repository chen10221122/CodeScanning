import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

export const pageSize = 50;

function useBaseList<T, R, U>({
  setCondition,
  originCondition,
  extraParams,
  skip = 'skip',
  keywords = 'keywords',
}: {
  setCondition: React.Dispatch<React.SetStateAction<T>>;
  originCondition: R;
  extraParams?: U;
  skip?: string;
  keywords?: string;
}) {
  const [renderScreen, setRenderScreen] = useState(true);
  const [onlyBodyLoading, setOnlyBodyLoading] = useState(false);

  const handleSearch = useMemoizedFn((value: string) => {
    setCondition((originState) => {
      return { ...originState, [skip]: 0, [keywords]: value };
    });
  });

  const handleTableChange = useMemoizedFn((pagination, filters, sorter) => {
    setOnlyBodyLoading(true);
    setCondition((originState) => {
      return {
        ...originState,
        [skip]: 0,
        page: 1,
        sortKey: sorter.order ? sorter.field : '',
        sortRule: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '',
      };
    });
  });

  const handlePageChange = useMemoizedFn((current) => {
    setCondition((originState) => {
      return { ...originState, [skip]: pageSize * (current - 1), page: current };
    });
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    setCondition((originState) => {
      return { ...originState, ...originCondition, ...extraParams };
    });
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  });

  return {
    handleSearch,
    handleTableChange,
    handlePageChange,
    handleReset,
    setOnlyBodyLoading,
    renderScreen,
    onlyBodyLoading,
  };
}

export default useBaseList;
