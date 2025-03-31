import { useRef } from 'react';

import { ColDef } from 'ag-grid-community';
import { useMemoizedFn, useDebounceEffect } from 'ahooks';
import cn from 'classnames';
import { isEmpty, isNil } from 'lodash';

import {
  hasDetailTypes,
  technologyInnovationType,
  enterpriseRankType,
  newRegisteredEnterprise,
  revocationOrCancelEnterprise,
  dollarBondNumType,
  dollarBondType,
} from '@dataView/DataView/SheetView/TableView/extras/area/const';

import Icon from '@/components/icon';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { RowConfig, TableCellType } from '@/pages/area/areaCompareAdvance/types';

import IndicHeaderCell from '../components/IndicHeaderCell';
import TableCell from '../components/tableCells';
import TableHeaderCell from '../components/TableHeaderCell';

interface Options {
  onHeaderContextMenu: (e: any, params: any) => void;
  onBodyContextMenu: (e: any, params: any) => void;
  // gridRef: RefObject<AgGridReact>;
  rowData: any[];
  wrapperRef: any;
}

export default function useTableView({ onHeaderContextMenu, onBodyContextMenu, rowData, wrapperRef }: Options) {
  const {
    state: { areaInfo, date },
    update,
  } = useCtx();

  const addAreaRef = useRef(null);

  // const { updateTable } = useTableContextHelper(lockRebuildRef);

  /** 处理地区列 */
  const buildAreaColumn = useMemoizedFn<(areaItem: Record<string, any>, index: number) => ColDef<RowConfig>>(
    (areaItem) => {
      return {
        field: String(areaItem.regionCode),
        colId: areaItem.regionName,
        width: 117,
        headerName: areaItem.regionName,
        headerComponentParams: {
          areaItem: areaItem,
          align: 'right',
          noPadding: true,
          onContextMenu: onHeaderContextMenu,
          indicatorKey: String(areaItem.regionCode),
          children: areaItem.regionName,
        },
        headerComponent: TableHeaderCell,
        cellRenderer: (params: any) => {
          const { data, value } = params;
          const { hasChildren, indexId, extraProperties } = data;

          // 默认是指标单元格
          let indexCellType = TableCellType.Indicator;
          if (indexId === 'REGION_10000014') {
            // if (indexId === 'REGION_10000014') {
            /** 综合评分 */
            indexCellType = TableCellType.AreaScope;
          } else if (indexId === 'REGION_30000038') {
            /** 区域对比工具-地区综合评分 */
            indexCellType = TableCellType.CompareArea;
          } else if (hasDetailTypes.includes(extraProperties?.type) && !isNil(value)) {
            /** 综合评分 */
            indexCellType = TableCellType.IndicatorDetail;
          } else if (
            [
              technologyInnovationType,
              enterpriseRankType,
              newRegisteredEnterprise,
              revocationOrCancelEnterprise,
            ].includes(extraProperties?.type) &&
            !isNil(value)
          ) {
            /** 科创类弹窗 */
            indexCellType = TableCellType.Technology;
          } else if ([...dollarBondType, ...dollarBondNumType].includes(extraProperties?.type) && !isNil(value)) {
            // 中资美元债弹窗
            indexCellType = TableCellType.DollorBond;
          }
          return (
            <span>
              {!hasChildren &&
                (!isEmpty(value?.mValue) ? (
                  value.mValue === '无权限' ? (
                    <div
                      className="no-power-icon"
                      onClick={() => {
                        update((d) => {
                          d.showModal = true;
                        });
                      }}
                    >
                      <Icon image={require('../../imgs/lock.png')} size={14} />
                    </div>
                  ) : (
                    <TableCell {...params} indexCellType={indexCellType} date={date} />
                  )
                ) : (
                  '-'
                ))}
            </span>
          );
        },
        cellRendererParams: () => ({
          onContextMenu: onBodyContextMenu,
        }),
      };
    },
  );

  useDebounceEffect(
    () => {
      /** 指标列 */
      const normalColumns = [
        {
          field: 'name',
          colId: 'renderIndicator',
          width: 220,
          headerName: '指标名称',
          headerComponent: IndicHeaderCell,
          // 固定列
          lockPosition: 'left',
          pinned: 'left',
          // 列不可被拖动
          suppressMovable: false,
          cellRenderer: (params: any) => {
            const { data, value } = params;
            const { level, hasChildren, isExpand, needPrivilege, chartSupport, maxTitle, headName, isEmpty } = data;
            const unit = headName?.match(/\(([^)]+)\)[^)]*$/)?.[1];
            return (
              <div
                className={cn(`ag-title-item ${maxTitle}`)}
                id={params.data.indexId}
                style={{
                  paddingLeft: (level - 1) * 14,
                  cursor: hasChildren ? 'pointer' : 'default',
                }}
              >
                <span
                  title={`${value}${unit && !value?.includes(unit) ? `(${unit})` : ''}`}
                  className={`ag-title-lable ag-title-level${level}`}
                >
                  {`${value}${unit && !value?.includes(unit) ? `(${unit})` : ''}`}
                </span>
                {hasChildren && (
                  <Icon
                    size={10}
                    image={require(level === 1 ? '../../imgs/expand.png' : '../../imgs/expand2.png')}
                    style={{ transform: isExpand ? 'unset' : 'rotate(-90deg)' }}
                  />
                )}
                {chartSupport === 1 && (
                  <div
                    onClick={() => {
                      areaInfo?.length > 0 &&
                        !isEmpty &&
                        update((draft) => {
                          draft.indicatorModalVisible = true;
                          draft.indicatorParams = params;
                        });
                    }}
                  >
                    <Icon
                      size={12}
                      image={require(areaInfo?.length > 0 && !isEmpty
                        ? '../../imgs/chart.png'
                        : '../../imgs/chart_disable.png')}
                      style={{ verticalAlign: '-1px', cursor: areaInfo?.length > 0 && !isEmpty ? 'pointer' : 'unset' }}
                    />
                  </div>
                )}
                {needPrivilege === 1 && <Icon size={12} image={require('../../imgs/vip.png')} />}
              </div>
            );
          },
        },
      ] as RowConfig[];

      const AddAreaColumn = [
        {
          field: 'addArea',
          width: 117,
          headerName: '添加地区',
          headerComponent: () => (
            <div
              ref={addAreaRef}
              className="add-area"
              onClick={() => {
                update((draft) => {
                  draft.areaChangeIndex = -1;
                  draft.selectAreaModalVisible = true;
                });
              }}
            >
              <Icon image={require('../../imgs/addArea.svg')} size={12} />
              <span>添加地区</span>
            </div>
          ),
        },
      ] as RowConfig[];

      /** 地区列 */
      const areaTableColumns = areaInfo?.length ? areaInfo?.map(buildAreaColumn) : [];

      update((d) => {
        d.columnDefs = [...normalColumns, ...areaTableColumns, ...AddAreaColumn];
      });
    },
    [buildAreaColumn, update, rowData, areaInfo],
    {
      wait: 100,
    },
  );
}
