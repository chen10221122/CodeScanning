import { useEffect, useRef, useState } from 'react';

import { isEmpty } from 'lodash';

import { MODAL_PAGESIZE } from '@pages/finance/financingLeaseNew/modules/censusAnalyse/config';

import { getCensusAnalyseDetailData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import useRequest from '@/utils/ahooks/useRequest';

export const useGetModalData = ({
  requestParams,
  updateModalInfo,
  visible,
}: {
  requestParams: Record<string, string>;
  updateModalInfo: (d: any) => void;
  visible: boolean;
}) => {
  const reqRef = useRef<string>('');
  const [total, setTotal] = useState<number>(0);

  const lastReqArgs = useRef('');
  const {
    run,
    data: modalData,
    loading,
  } = useRequest<any>(getCensusAnalyseDetailData, {
    manual: true,
    onSuccess(res) {
      updateModalInfo?.((d: any) => {
        d.total = res?.data?.total;
      });
    },
    onError() {
      updateModalInfo?.((d: any) => {
        d.total = 0;
      });
    },
  });

  useEffect(() => {
    if (loading && JSON.stringify({ ...requestParams, size: 0, from: 0 }) !== reqRef.current) {
      setTotal(0);
      reqRef.current = JSON.stringify({ ...requestParams, size: 0, from: 0 });
    } else {
      setTotal(modalData?.data?.total ?? 0);
    }
  }, [loading, setTotal, modalData?.data?.total, requestParams]);

  useEffect(() => {
    if (!isEmpty(requestParams) && JSON.stringify(requestParams) !== lastReqArgs?.current && visible) {
      run({ ...requestParams });
      lastReqArgs.current = JSON.stringify(requestParams);
    }
  }, [requestParams, run, visible]);

  useEffect(() => {
    if (!visible) {
      updateModalInfo((d: any) => {
        d.currentPage = 1;
        d.requestParams = {
          from: 0,
          size: MODAL_PAGESIZE,
        };
      });
    }
  }, [updateModalInfo, visible]);

  return {
    loading,
    modalData,
    modalDataTotal: total,
  };
};
