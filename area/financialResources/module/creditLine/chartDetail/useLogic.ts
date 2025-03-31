import { useEffect, useRef, useState } from 'react';

import { useDeepCompareEffect, useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { getCreditScaleHistoricalTrend, ICreditScaleHistoricalTrend } from '@/pages/area/financialResources/api';
import { Pager, detailType } from '@/pages/area/financialResources/module/common/type';
import { useImmer } from '@/utils/hooks';

const defaultParams = {
  regionCode: '',
  itCode2: '',
  pageSize: 50,
  skip: 0,
};

const useLogic = (region: any, itCode: string) => {
  const [detailData, setDetailData] = useState({} as detailType);
  const [modalVisable, setModalVisable] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const skipRef = useRef(0);
  const [pager, updatePager] = useImmer<Pager>({
    current: 1,
    total: 0,
    pageSize: 50,
  });
  const [listData, setListData] = useState([]);
  const [listCondition, setListCondition] = useState(defaultParams);

  const {
    run: getList,
    data,
    loading,
  } = useRequest<any, ICreditScaleHistoricalTrend[]>(getCreditScaleHistoricalTrend, {
    manual: true,
    onError() {
      setListData([]);
      updatePager((pager) => {
        pager.total = 0;
        pager.current = 1;
      });
    },
    onFinally() {
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  // 列表数据处理
  useEffect(() => {
    const finalData = data?.data;
    if (finalData) {
      // 处理echarts数据
      !isEmpty(finalData) && setListData(finalData.slice(1).reverse());
      updatePager((pager) => {
        pager.total = finalData.length - 1;
        pager.current = skipRef.current + 1;
      });
    }
  }, [data, setListData, updatePager]);

  // 更新列表请求参数
  useDeepCompareEffect(() => {
    if (region && itCode) {
      setListCondition((d) => ({
        ...d,
        ...region,
        itCode2: itCode,
      }));
    }
  }, [itCode, region, setListCondition]);

  // 列表请求发起
  useDeepCompareEffect(() => {
    const { regionCode, itCode2 } = listCondition;
    if (regionCode && itCode2) {
      getList(listCondition);
    }
  }, [listCondition, getList]);

  const onPageChange = useMemoizedFn((current) => {
    skipRef.current = current - 1;
    setListCondition((con) => ({
      ...con,
      skip: skipRef.current * pager.pageSize,
    }));
  });

  const handleDetail = useMemoizedFn((item: detailType) => {
    setDetailData({ ...item });
    setModalVisable(true);
  });

  return {
    firstLoaded,
    condition: listCondition,
    loading,
    listData,
    pager,
    onPageChange,
    handleDetail,
    detailData,
    modalVisable,
    setModalVisable,
  };
};

export default useLogic;
