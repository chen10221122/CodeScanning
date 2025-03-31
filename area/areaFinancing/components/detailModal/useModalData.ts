import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import {
  getAreaFinancingAShareDetail,
  getAreaHkStatisticDetail,
  getAreaIpoStatisticDetail,
  getAreaThirdBoardDetail,
  getAreaVcDetail,
} from '@/pages/area/areaFinancing/api';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
import usePage from '@/pages/area/areaFinancing/hooks/usePage';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancing/types';
import { formatDetailModalData } from '@/pages/area/areaFinancing/utils';

const apiMap = new Map([
  [DetailModalTypeEnum.StockA, getAreaFinancingAShareDetail],
  [DetailModalTypeEnum.AreaPlatform, getAreaFinancingAShareDetail],
  [DetailModalTypeEnum.Ipo, getAreaIpoStatisticDetail],
  [DetailModalTypeEnum.HK, getAreaHkStatisticDetail],
  [DetailModalTypeEnum.StockThirdPriority, getAreaThirdBoardDetail],
  [DetailModalTypeEnum.StockThirdPlus, getAreaThirdBoardDetail],
  [DetailModalTypeEnum.Vc, getAreaVcDetail],
]);

export default function useModalData() {
  const {
    state: {
      visible,
      detailModalConfig: { modalType, defaultCondition },
    },
  } = useConditionCtx();
  const { page, setPage } = usePage();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const { run, loading } = useRequest(
    apiMap.get(modalType || DetailModalTypeEnum.StockA) || getAreaFinancingAShareDetail,
    {
      manual: true,
      onSuccess: (res: any, params: Record<string, any>[]) => {
        if (res.data?.length) {
          setDataSource(formatDetailModalData(res.data, params[0].from || 0));
          setCount(res.length);
        } else {
          setDataSource([]);
          setCount(0);
        }
      },
      onError() {
        setDataSource([]);
        setCount(0);
      },
    },
  );
  useEffect(
    function () {
      if (visible) {
        setPage(1);
        run({ ...defaultCondition, from: 0 });
      }
    },
    [defaultCondition, run, setPage, visible],
  );

  return { dataSource, count, loading, page, run };
}
