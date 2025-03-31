import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useDispatch, useSelector, newsDetailModalDefaultStatus } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/context'
import NewsDetailModal from '@/pages/publicOpinionPages/monitoring/components/modals/newsDetailModal'

export default () => {
  const dispatch = useDispatch();
  const { newsDetailModal } = useSelector((s) => ({ newsDetailModal: s.modalStatus.newsDetailModal }));

  const closeModal = useMemoizedFn(() => {
    dispatch((d) => {
      d.modalStatus.newsDetailModal = newsDetailModalDefaultStatus;
    });
  });

  const modal = useMemo(() => {
    return <NewsDetailModal visible={newsDetailModal.visible} modalInfo={newsDetailModal.data} onClose={closeModal} />;
  }, [newsDetailModal, closeModal]);

  return { modal };
};
