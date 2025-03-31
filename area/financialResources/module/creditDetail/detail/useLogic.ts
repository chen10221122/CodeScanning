import { useRef, useState } from 'react';

import { useDeepCompareEffect, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getCreditInstitutionDetail, ICreditInstitutionDetail } from '@/pages/area/financialResources/api';
import { Pager } from '@/pages/area/financialResources/module/common/type';
import { useImmer } from '@/utils/hooks';

const listDefaultParams = {
  itCode2: '',
  pageSize: 50,
  skip: 0,
  sort: '',
  text: '',
};

const useLogic = (itCode: string, year?: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const [renderScreen, setRenderScreen] = useState(true);
  const [filterNoData, setFilterNoData] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [listCondition, setListCondition] = useImmer({ ...listDefaultParams, itCode2: itCode, year });
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const sortInfo = useRef<{ key: string; order: string }>({ key: '', order: '' });
  const [listData, setListData] = useState([]);

  const {
    run: getList,
    loading,
    data,
  } = useRequest<any, ICreditInstitutionDetail[]>(getCreditInstitutionDetail, {
    manual: true,
    debounceWait: 300,
    onSuccess() {
      if (data?.data) {
        const { total, data: finalData } = data.data;
        setListData(finalData);
        updatePager((pager) => {
          pager.total = total;
          pager.current = skipRef.current + 1;
        });
      }
    },
    onError() {
      setListData([]);
      updatePager((pager) => {
        pager.total = 0;
        pager.current = 1;
      });
      setFilterNoData(firstLoaded);
    },
    onFinally() {
      setSearchLoading(false);
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  useDeepCompareEffect(() => {
    if (itCode && year) {
      getList(listCondition as ICreditInstitutionDetail);
    }
  }, [listCondition, getList, itCode]);

  const handleSearch = useMemoizedFn((keyWord: string) => {
    skipRef.current = 0;
    setSearchLoading(true);
    setListCondition((originState) => ({
      ...originState,
      skip: 0,
      text: keyWord,
    }));
  });

  const onPageChange = useMemoizedFn((current) => {
    skipRef.current = current - 1;
    setListCondition((con) => ({
      ...con,
      skip: skipRef.current * pager.pageSize,
    }));
  });

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
    if (isEmpty(sorter)) return;
    const { order: originOrder, field } = sorter;
    if (sortInfo.current.order !== originOrder || sortInfo.current.key !== field) {
      sortInfo.current.key = field;
      sortInfo.current.order = originOrder;
      skipRef.current = 0;
    }
    const order = originOrder === 'ascend' ? 'asc' : originOrder === 'descend' ? 'desc' : '';
    const sort = order ? `${field}:${order}` : '';
    setListCondition((originState) => ({
      ...originState,
      skip: skipRef.current * pager.pageSize,
      sort,
    }));
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    skipRef.current = 0;
    setListCondition((d) => ({ ...d, skip: 0, text: '', sortKey: '', sortRule: '' }));
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  });

  return {
    loading: loading || searchLoading,
    handleSearch,
    listData,
    pager,
    onPageChange,
    condition: listCondition,
    firstLoaded,
    handleChange,
    filterNoData,
    handleReset,
    renderScreen,
    ref,
  };
};

export default useLogic;
