import { useEffect, useState } from 'react';

import { getMainTableData } from '@/pages/area/areaCompareAdvance/api';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { flatDefaultIndexParam, flatDetailData } from '@/pages/area/areaCompareAdvance/utils';
import useRequest from '@/utils/ahooks/useRequest';

const useData = ({ singleSort }: { singleSort: string }) => {
  const {
    state: { indicatorParams, areaSelectCode, date, indicatorTree },
  } = useCtx();

  const [modalData, setModalData] = useState<Record<'area' | 'date' | 'regionCode', string>[]>([]);

  const { run, loading } = useRequest(getMainTableData, {
    manual: true,
    onSuccess(res) {
      if (res?.returncode === 0) {
        setModalData(flatDetailData(res?.data));
      }
    },
  });

  useEffect(() => {
    if (indicatorParams?.data?.indexId?.length) {
      run({
        singleSort,
        exportFlag: false,
        regionCodes: areaSelectCode,
        indexParamList: flatDefaultIndexParam(indicatorTree, [indicatorParams.data.indexId], [date]),
      });
    }
  }, [areaSelectCode, date, indicatorTree, run, indicatorParams, singleSort]);

  return { modalData, loading };
};

export default useData;
