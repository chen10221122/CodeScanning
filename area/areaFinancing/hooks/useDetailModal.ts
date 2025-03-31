import { useMemoizedFn } from 'ahooks';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import { modalScreenMap } from '@pages/area/areaFinancing/components/detailModal/useCommonModalScreen';

export default function useDetailModal() {
  const {
    state: { visible, condition },
    update,
  } = useConditionCtx();
  const handleModalClick = useMemoizedFn(({ title, modalType, row, customModalCondition = {} }: any) => {
    // console.log('customModalCondition', customModalCondition);
    update((d) => {
      d.visible = true;
      d.detailModalConfig.title = title;
      d.detailModalConfig.modalType = modalType;
      d.detailModalConfig.defaultCondition = {
        ...(modalScreenMap.get(modalType)?.condition || {}),
        ...customModalCondition,
        regionCode: row.regionCode,
        regionLevel: condition?.regionLevel,
        year: condition?.year,
        date: condition?.date,
      };
    });
  });
  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
    });
  });
  return { visible, handleModalClick, closeModal };
}
