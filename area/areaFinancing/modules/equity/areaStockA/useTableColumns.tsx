import { useMemo } from 'react';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';
import { calcPercentage } from '@pages/area/areaFinancing/utils';

export default function useTableColumns() {
  const {
    state: { condition },
  } = useConditionCtx();
  const { makeColumns, indexColumn } = useCommonColumn();

  const restTableWidth = useMemo(() => {
    return condition?.regionLevel === '3' ? 1160 : 1036;
  }, [condition?.regionLevel]);
  const columnConf = (tableWidth: number, isHistory?: boolean) => {
    const areaData = [
      { title: '首发', key: '1', customModalCondition: { statType: 'ipoType', financeType: 'IPO' } },
      { title: '增发', key: '2', customModalCondition: { statType: 'ipoType', financeType: '公开增发,定向增发' } },
      { title: '配股', key: '3', customModalCondition: { statType: 'ipoType', financeType: '配股' } },
    ];
    return areaData.map((item: Record<string, any>) => {
      return {
        title: item.title,
        children: [
          {
            title: '家数',
            dataIndex: `count${item.key}`,
            width: isHistory ? calcPercentage(100, tableWidth) : calcPercentage(60, tableWidth),
            renderMode: RenderMode.ModalText,
            modalType: DetailModalTypeEnum.StockA,
            customModalCondition: item.customModalCondition,
          },
          {
            title: '融资额(亿元)',
            dataIndex: `amount${item.key}`,
            width: isHistory ? calcPercentage(130, tableWidth) : calcPercentage(106, tableWidth),
            renderMode: RenderMode.NumberText,
            modalType: DetailModalTypeEnum.StockA,
          },
        ],
      };
    });
  };
  const columns = useMemo(() => {
    return [
      { ...indexColumn, fixed: 'left' },
      {
        title: '地区',
        fixed: 'left',
        dataIndex: `regionName`,
        width:
          condition?.regionLevel === '3' ? calcPercentage(218, restTableWidth) : calcPercentage(126, restTableWidth),
        renderMode: RenderMode.Area,
      },
      {
        title: <div style={{ textAlign: 'right' }}>A股融资总额 (亿元)</div>,
        dataIndex: `totalFinanceAmount`,
        renderMode: RenderMode.NumberText,
        // width: calcPercentage(110, restTableWidth),
      },
      {
        title: '地区GDP (亿元)',
        dataIndex: `gdp`,
        width: calcPercentage(128, restTableWidth),
        renderMode: RenderMode.NumberText,
      },
      {
        title: <div style={{ textAlign: 'right' }}>A股融资额/ 地区GDP(%)</div>,
        dataIndex: `ratio`,
        renderMode: RenderMode.NumberText,
        width: calcPercentage(128, restTableWidth),
      },
      ...columnConf(restTableWidth),
    ];
  }, [condition?.regionLevel, indexColumn, restTableWidth]);

  const historyColumns = useMemo(() => {
    return [
      { ...indexColumn, fixed: 'left' },
      {
        title: '地区',
        fixed: 'left',
        dataIndex: `regionName`,
        width:
          condition?.regionLevel === '3' ? calcPercentage(218, restTableWidth) : calcPercentage(128, restTableWidth),
        renderMode: RenderMode.Area,
      },
      {
        title: 'A股融资总额(亿元)',
        dataIndex: `totalFinanceAmount`,
        renderMode: RenderMode.NumberText,
      },
      ...columnConf(restTableWidth, true),
    ];
  }, [condition?.regionLevel, indexColumn, restTableWidth]);

  return { restTableWidth, columns: makeColumns(columns), historyColumns: makeColumns(historyColumns) };
}
