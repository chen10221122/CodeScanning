import { AreaTraceModal, UpdateModal, useTraceModalFn, useUpdateModalFn } from '@dataView/components/areaTraceModal';
import { useEventSubscribe, useIndicatorHandler, useRefCtx } from '@dataView/provider';

export default function AreaExtraModal() {
  const { getIndicator } = useIndicatorHandler();

  const {
    state: { wholeModuleWrapperRef },
  } = useRefCtx();

  /** 计算指标溯源弹窗 */
  const { handleAreaLinkClick, handleModalClose, traceModalInfo } = useTraceModalFn();

  /** 数据更新详情弹窗 */
  const {
    handleCellWrapperClick,
    handleUpdateModalOpen,
    handleUpdateModalClose,
    updateInfoLoading,
    updateDataInfo,
    updateModalInfo,
  } = useUpdateModalFn();

  useEventSubscribe('cellClick', (event) => {
    const indicator = getIndicator(event.column.getColId());
    const { type } = { ...event.data?.extraProperties, ...indicator.extraProperties };

    if (type) {
      handleAreaLinkClick(event, type);
      handleCellWrapperClick(event, type);
    }
  });

  return (
    <>
      <AreaTraceModal
        traceModalInfo={traceModalInfo}
        close={handleModalClose}
        handleUpdateModalOpen={handleUpdateModalOpen}
        getContainer={() => wholeModuleWrapperRef || document.body}
      />
      {/* 数据更新弹窗 */}
      <UpdateModal
        data={updateDataInfo}
        updateModalInfo={updateModalInfo}
        loading={updateInfoLoading}
        close={handleUpdateModalClose}
        getContainer={() => wholeModuleWrapperRef || document.body}
      />
    </>
  );
}
