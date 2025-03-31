import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';

export default function useTableColumns() {
  const { makeColumns, indexColumn } = useCommonColumn();
  return makeColumns([
    indexColumn,
    {
      title: '地区',
      dataIndex: `regionName`,
      renderMode: RenderMode.Area,
    },
    {
      title: '定向增发',
      children: [
        {
          title: '发行家数',
          dataIndex: `count1`,
          width: '18.9%',
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.StockThirdPlus,
          customModalCondition: { financeType: '1' },
        },
        {
          title: '融资金额(万元)',
          dataIndex: `amount1`,
          align: 'right',
          width: '18.9%',
        },
      ],
    },
    {
      title: '优先股',
      children: [
        {
          title: '发行家数',
          dataIndex: `count2`,
          width: '18.9%',
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.StockThirdPriority,
          customModalCondition: { financeType: '2' },
        },
        {
          title: '融资金额(万元)',
          dataIndex: `amount2`,
          width: '18.9%',
          align: 'right',
        },
      ],
    },
  ]);
}
