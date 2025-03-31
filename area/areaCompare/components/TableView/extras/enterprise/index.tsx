import CellDetailModal, { ColumnType } from '@dataView/components/cellDetailModal';
import useCellDetailModal from '@dataView/components/cellDetailModal/useCellDetailModal';
import { useEventSubscribe, useRefCtx } from '@dataView/provider';

export default function EnterpriseExtra() {
  const {
    state: { wholeModuleWrapperRef },
  } = useRefCtx();

  const { modalConfig, handleClose, handleDetailClick } = useCellDetailModal();

  useEventSubscribe('cellClick', (event) => {
    handleDetailClick(event);
  });

  return (
    <CellDetailModal
      getContainer={() => wholeModuleWrapperRef || document.body}
      type={ColumnType.Venture}
      {...modalConfig}
      onClose={handleClose}
    />
  );
}
