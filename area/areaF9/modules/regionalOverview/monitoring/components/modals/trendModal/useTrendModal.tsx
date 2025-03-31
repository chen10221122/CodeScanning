import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useDispatch, useSelector, trendModalDefaultStatus } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/context'

import TrendModal from '.';

export default () => {
  const dispatch = useDispatch();
  const { trendModal } = useSelector((s) => ({ trendModal: s.modalStatus.trendModal }));

  const closeTrendModal = useMemoizedFn(() => {
    dispatch((d) => {
      d.modalStatus.trendModal = trendModalDefaultStatus;
    });
  });

  const modal = useMemo(() => {
    return <TrendModal visible={trendModal.visible} modalInfo={trendModal.data} onCancel={closeTrendModal} />;
  }, [trendModal, closeTrendModal]);

  return { modal };
};
