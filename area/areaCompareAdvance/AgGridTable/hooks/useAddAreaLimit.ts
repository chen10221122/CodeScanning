import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';

import { useCtx, LIMIT_SELECT } from '@/pages/area/areaCompareAdvance/context';

const useAddAreaLimit = () => {
  const {
    state: { areaInfo },
    update,
  } = useCtx();
  const havePay = useSelector((store: any) => store.user.info).havePay || false;

  const addAreaLimit = useMemoizedFn(() => {
    if (!havePay && areaInfo?.length === LIMIT_SELECT.NORMAL) {
      update((draft) => {
        draft.showModal = true;
      });
    } else if (havePay && areaInfo?.length === LIMIT_SELECT.VIP) {
      update((draft) => {
        draft.showPayLimit = true;
      });
    } else {
      update((draft) => {
        draft.areaChangeIndex = -1;
        draft.selectAreaModalVisible = true;
      });
    }
  });

  return { addAreaLimit };
};

export default useAddAreaLimit;
