import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';

export default function useTableColumns() {
  const { makeColumns, indexColumn } = useCommonColumn();
  return [
    indexColumn,
    {
      title: '地区',
      dataIndex: 'regionName',
      align: 'center',
      renderMode: RenderMode.Area,
      // width: 128,
    },
    {
      title: '辅导期企业家数',
      dataIndex: 'count1',
      align: 'right',
      width: '19%',
      resizable: true,
      renderMode: RenderMode.ModalText,
      modalType: DetailModalTypeEnum.Ipo,
      customModalCondition: { state: '1', sortKey: 'IT0074_002' },
    },
    {
      title: '在审企业家数',
      dataIndex: 'count2',
      align: 'right',
      width: '19%',
      renderMode: RenderMode.ModalText,
      modalType: DetailModalTypeEnum.Ipo,
      customModalCondition: { state: '2' },
    },
    {
      title: '已过会待注册企业家数',
      dataIndex: 'count3',
      align: 'right',
      width: '19%',
      renderMode: RenderMode.ModalText,
      modalType: DetailModalTypeEnum.Ipo,
      customModalCondition: { state: '3' },
    },
    {
      title: '已注册待发行企业家数',
      dataIndex: 'count4',
      align: 'right',
      width: '19%',
      renderMode: RenderMode.ModalText,
      modalType: DetailModalTypeEnum.Ipo,
      customModalCondition: { state: '4' },
    },
  ].map((o) => {
    return makeColumns({ ...o });
  });
}
