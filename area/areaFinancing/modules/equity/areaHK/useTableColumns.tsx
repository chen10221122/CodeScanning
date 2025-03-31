import { useMemo } from 'react';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';

import { calcPercentage } from '../../../utils';

export default function useTableColumns() {
  const {
    state: { condition },
  } = useConditionCtx();
  // 设计稿表格宽度，用于计算列宽和scrollX
  const restTableWidth = useMemo(() => {
    return condition?.regionLevel === '3' ? 1138 : 1036;
  }, [condition?.regionLevel]);

  const areaColumn = useMemo(() => {
    return {
      title: '地区',
      dataIndex: 'regionName',
      fixed: 'left',
      width: condition?.regionLevel === '3' ? calcPercentage(218, restTableWidth) : calcPercentage(128, restTableWidth),
      renderMode: RenderMode.Area,
    };
  }, [condition?.regionLevel, restTableWidth]);

  const { makeColumns, indexColumn } = useCommonColumn();

  const columnConf = [
    {
      title: '首发',
      children: [
        {
          title: '主板家数',
          dataIndex: `mainCount`,
          width: calcPercentage(95, restTableWidth),
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.HK,
          customModalCondition: { plate: '主板', financeType: '1' },
        },
        {
          title: '创业板家数 ',
          dataIndex: `secondCount`,
          width: calcPercentage(98, restTableWidth),
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.HK,
          customModalCondition: { plate: '创业板', financeType: '1' },
        },
        {
          title: '融资金额(亿元)',
          dataIndex: `amount1`,
          align: 'right',
          width: calcPercentage(122, restTableWidth),
        },
      ],
    },
    {
      title: '增发',
      key: '2',
      children: [
        {
          title: '发行家数 ',
          dataIndex: `addIssueCount`,
          width: calcPercentage(95, restTableWidth),
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.HK,
          customModalCondition: { plate: '', financeType: '4' },
        },
        {
          title: '融资金额(亿元)',
          dataIndex: `amount2`,
          align: 'right',
          width: calcPercentage(121, restTableWidth),
        },
      ],
    },
    {
      title: '配股',
      key: '3',
      children: [
        {
          title: '发行家数 ',
          dataIndex: `ipoCount`,
          width: calcPercentage(95, restTableWidth),
          renderMode: RenderMode.ModalText,
          modalType: DetailModalTypeEnum.HK,
          customModalCondition: { plate: '', financeType: '3' },
        },
        {
          title: '融资金额(亿元)',
          dataIndex: `amount3`,
          align: 'right',
          width: calcPercentage(121, restTableWidth),
        },
      ],
    },
  ];
  return {
    columns: makeColumns([
      { ...indexColumn, fixed: 'left' },
      areaColumn,
      {
        title: <div style={{ textAlign: 'right' }}>H股融资合计 (亿元)</div>,
        dataIndex: 'totalAmount',
        align: 'right',
      },
      ...columnConf,
    ]),
    restTableWidth,
  };
}
