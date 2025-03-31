import { useMemo } from 'react';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';
import { calcPercentage } from '@pages/area/areaFinancing/utils';

export enum StatTypeEnum {
  Plate = '上市板块',
  EntType = '企业性质',
  Industry = '产业类型',
}

const FirstColumnMap = new Map([
  [
    StatTypeEnum.Plate,
    [
      { title: '合计', customModalCondition: { statType: 'ipoPlate', plate: '' } },
      { title: '主板', key: '1', customModalCondition: { statType: 'ipoPlate', plate: '沪市主板,深市主板' } },
      { title: '创业板', key: '2', customModalCondition: { statType: 'ipoPlate', plate: '创业板' } },
      { title: '科创板', key: '3', customModalCondition: { statType: 'ipoPlate', plate: '科创板' } },
      { title: '北交所', key: '4', customModalCondition: { statType: 'ipoPlate', plate: '北交所' } },
    ],
  ],
  [
    StatTypeEnum.EntType,
    [
      { title: '合计', customModalCondition: { statType: 'entType', entType: '' } },
      { title: '国有企业', key: '1', customModalCondition: { statType: 'entType', entType: '国有企业' } },
      { title: '民营企业', key: '2', customModalCondition: { statType: 'entType', entType: '民营企业' } },
      { title: '其他', key: '3', customModalCondition: { statType: 'entType', entType: '其他' } },
    ],
  ],
  [
    StatTypeEnum.Industry,
    [
      { title: '合计', customModalCondition: { statType: 'industryType', industryType: '' } },
      { title: '第一产业', key: '1', customModalCondition: { statType: 'industryType', industryType: '1' } },
      { title: '第二产业', key: '2', customModalCondition: { statType: 'industryType', industryType: '2' } },
      { title: '第三产业', key: '3', customModalCondition: { statType: 'industryType', industryType: '3' } },
    ],
  ],
]);

export default function useTableColumns() {
  const {
    state: { condition },
  } = useConditionCtx();
  // 设计稿表格宽度，用于计算列宽和scrollX
  const restTableWidth = useMemo(() => {
    return condition?.regionLevel === '3' ? 1330 : 1240;
  }, [condition?.regionLevel]);

  // 后2个Tab表格宽度与第一个不一样
  const secondRestTableWidth = useMemo(() => {
    return condition?.regionLevel === '3' ? 1488 : 1396;
  }, [condition?.regionLevel]);

  const areaColumn = useMemo(() => {
    return {
      title: '地区',
      dataIndex: 'regionName',
      align: 'center',
      fixed: 'left',
      // width: condition?.regionLevel === '3' ? calcPercentage(218, restTableWidth) : calcPercentage(128, restTableWidth),
      renderMode: RenderMode.Area,
    };
  }, []);
  const { makeColumns, indexColumn } = useCommonColumn();
  const SecondColumnMap = useMemo(() => {
    return new Map([
      [
        StatTypeEnum.Plate,
        [
          {
            title: '公司数量',
            dataIndex: `count`,
            width: calcPercentage(90, restTableWidth),
          },
          {
            title: '公司市值(亿元)',
            dataIndex: `amount`,
            align: 'right',
            width: calcPercentage(124, restTableWidth),
          },
        ],
      ],
      [
        StatTypeEnum.EntType,
        [
          {
            title: '公司数量',
            dataIndex: `count`,
            width: calcPercentage(90, secondRestTableWidth),
          },
          {
            title: '公司市值(亿元)',
            dataIndex: `amount`,
            align: 'right',
            width: calcPercentage(124, secondRestTableWidth),
          },
          {
            title: '市值占比(%)',
            dataIndex: `ratio`,
            align: 'right',
            width: calcPercentage(124, secondRestTableWidth),
          },
        ],
      ],
      [
        StatTypeEnum.Industry,
        [
          {
            title: '公司数量',
            dataIndex: `count`,
            width: calcPercentage(90, secondRestTableWidth),
          },
          {
            title: '公司市值(亿元)',
            dataIndex: `amount`,
            align: 'right',
            width: calcPercentage(124, secondRestTableWidth),
          },
          {
            title: '市值占比(%)',
            dataIndex: `ratio`,
            align: 'right',
            width: calcPercentage(124, secondRestTableWidth),
          },
        ],
      ],
    ]);
  }, [restTableWidth, secondRestTableWidth]);

  const columnConf = (tabType: StatTypeEnum) => {
    const arr =
      FirstColumnMap.get(tabType)?.map((item: Record<string, any>) => {
        let childrenColumns: Record<string, any>[] = SecondColumnMap.get(tabType)!.map((o) => {
          return {
            ...o,
            dataIndex: `${o.dataIndex}${item.key}`,
            renderMode: o.dataIndex === 'count' ? RenderMode.ModalText : RenderMode.NormalText,
            modalType: DetailModalTypeEnum.AreaPlatform,
            customModalCondition: item.customModalCondition,
          };
        });
        if (item.title === '合计') {
          childrenColumns = [
            {
              title: '公司数量',
              dataIndex: 'totalCount',
              width: calcPercentage(90, tabType === StatTypeEnum.Plate ? restTableWidth : secondRestTableWidth),
              renderMode: RenderMode.ModalText,
              modalType: DetailModalTypeEnum.AreaPlatform,
              customModalCondition: item.customModalCondition,
            },
            {
              title: '公司市值(亿元)',
              dataIndex: 'totalAmount',
              width: calcPercentage(123, tabType === StatTypeEnum.Plate ? restTableWidth : secondRestTableWidth),
              renderMode: RenderMode.NumberText,
            },
          ];
        }
        return {
          title: item.title,
          children: childrenColumns,
        };
      }) || [];
    return [{ ...indexColumn, fixed: 'left' }, areaColumn, ...arr];
  };
  return [
    makeColumns(columnConf(StatTypeEnum.Plate)),
    makeColumns(columnConf(StatTypeEnum.EntType)),
    makeColumns(columnConf(StatTypeEnum.Industry)),
    restTableWidth,
    secondRestTableWidth,
  ];
}
