import { useMemoizedFn } from 'ahooks';

import { useDispatch } from '@/pages/area/areaF9/context';

const useRankModal = () => {
  const dispatch = useDispatch();

  /**
   * 打卡榜单弹窗
   * @param curTableItem 表格当前列数据
   */
  const handleOpenModal = useMemoizedFn((curTableItem: Record<string, any>) => {
    dispatch((d) => {
      d.rankModalCurData = curTableItem;
      d.rankModalVisible = true;
    });
  });

  const handleCloseModal = useMemoizedFn(() => {
    dispatch((d) => {
      d.rankModalVisible = false;
    });
  });

  const hanldeChangeModalDom = useMemoizedFn((modalDom: HTMLDivElement | HTMLElement | null | undefined) => {
    dispatch((d) => {
      d.rankModalDom = modalDom as any;
    });
  });

  return {
    handleOpenModal,
    handleCloseModal,
    hanldeChangeModalDom,
  };
};

export default useRankModal;
