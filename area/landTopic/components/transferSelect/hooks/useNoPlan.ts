import { useEffect } from 'react';

import { useUpdateEffect } from 'ahooks';

import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

/**
 * 只需要指标
 */
export default function useNoPlan({
  selectedModalVisible,
  onSelectedModalVisibleChange,
}: {
  selectedModalVisible?: boolean;
  onSelectedModalVisibleChange?: (visible: boolean) => void;
}) {
  const {
    state: { editModalVisible },
    update,
  } = useCtx();

  useEffect(() => {
    if (selectedModalVisible) {
      update((draft) => {
        draft.editModalVisible = true;
      });
    }
  }, [selectedModalVisible, update]);

  useUpdateEffect(() => {
    onSelectedModalVisibleChange?.(editModalVisible);
  }, [editModalVisible, onSelectedModalVisibleChange]);
}
