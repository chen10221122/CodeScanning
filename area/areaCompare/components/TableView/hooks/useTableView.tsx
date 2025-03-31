import { RefObject, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { ColDef, ColumnMovedEvent, ColumnResizedEvent, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemoizedFn } from 'ahooks';
import { debounce, find, isEmpty, isNil, isNumber, isPlainObject, isUndefined, merge, round } from 'lodash';
import raf from 'raf';
import shortid from 'shortid';
import styled from 'styled-components';

import { useCheckPagePlatform } from '@dataView/hooks';
import {
  IndicatorConfig,
  IndicatorResultType,
  RowConfig,
  useIndicatorHandler,
  useIndicatorParamsHelper,
  useSheetView,
  useTableContextHelper,
  useTableSheetData,
} from '@dataView/provider';
import { dateSort, enumSort, numberSort, secondFieldSort, stringSort } from '@dataView/utils/sort';

import { LINK_AREA_ECONOMY, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { toFixed } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import TableCell from '../components/tableCell';
import TableHeaderCell from '../components/TableHeaderCell';

interface Options {
  onBodyContextMenu: (e: any, params: any) => void;
  onHeaderContextMenu: (e: any, params: any) => void;
  gridRef: RefObject<AgGridReact>;
}

// 索引
const COL_INDEX = 'renderIndex';
// 公司名称
const COL_COMPANY_NAME = 'companyName';
// 地区名称
const COL_AREA_NAME = 'areaName';

export function isNormalColId(
  colId: string,
): colId is typeof COL_INDEX | typeof COL_COMPANY_NAME | typeof COL_AREA_NAME {
  return [COL_INDEX, COL_COMPANY_NAME, COL_AREA_NAME].includes(colId);
}

// 类型是否为开发区
export const isDevelopArea = (type: string) => type === 'develop';

export default function useTableView(sheetId: string, { onBodyContextMenu, onHeaderContextMenu, gridRef }: Options) {
  const history = useHistory();
  // 锁定重新构建columns。比如操作列改变指标排列顺序时，禁止表格的重新构建
  const lockRebuildRef = useRef(false);
  const { data, columns, withoutParentIndicators } = useTableSheetData(sheetId);
  const { updateTable } = useTableContextHelper(lockRebuildRef);
  const { moveIndicator, updateIndicator } = useIndicatorHandler();
  const { showParams } = useSheetView();
  const { indicatorRenderParams } = useIndicatorParamsHelper();

  const normalWidthConfigRef = useRef<{ [COL_INDEX]: number; [COL_COMPANY_NAME]: number; [COL_AREA_NAME]: number }>({
    [COL_INDEX]: 46,
    [COL_COMPANY_NAME]: 243,
    [COL_AREA_NAME]: 200,
  });

  const { isArea } = useCheckPagePlatform();

  useEffect(
    function updateTableHeight() {
      if (gridRef.current && gridRef.current.api) {
        if (showParams && !isEmpty(indicatorRenderParams)) {
          const paramMaxRowCount = Math.max(
            ...Object.keys(indicatorRenderParams!).map((d) => indicatorRenderParams![d].length),
          );
          gridRef.current.api.setHeaderHeight(20 * paramMaxRowCount + 30);
          updateTable({ headerHeight: 20 * paramMaxRowCount + 30 });
        } else {
          gridRef.current.api.setHeaderHeight(30);
          updateTable({ headerHeight: 30 });
        }
      } else {
        updateTable({ headerHeight: 30 });
      }
    },
    [gridRef, indicatorRenderParams, showParams, updateTable],
  );

  // 千分位格式化
  const formatThousandthsNumber = (value: number, fractionDigits = 2) =>
    toFixed(value, fractionDigits).replace(/(\d)(?=(\d{3})+(\.\d*)?$)/g, '$1,');

  const formatValue = (value: any, indicator: IndicatorConfig) => {
    if (isNil(value) || value === '') return '-';
    switch (indicator.resultType) {
      case IndicatorResultType.Money:
        return formatThousandthsNumber(value);
      case IndicatorResultType.IntNumberThousandthFormat:
        return formatThousandthsNumber(value, 0);
      case IndicatorResultType.NeedConvertNumber: {
        if (isNumber(value)) {
          const unit = indicator.unit || '';
          if ((value > 0 && value < 1e4) || value < 0) {
            return `${formatThousandthsNumber(value)}${unit}`;
          } else if (value >= 1e4 && value < 1e8) {
            return `${formatThousandthsNumber(parseFloat(toFixed(value / 1e4, 2)))}万${unit}`;
          } else {
            return `${formatThousandthsNumber(parseFloat(toFixed(value / 1e8, 2)))}亿${unit}`;
          }
        }
        return value;
      }
      case IndicatorResultType.Percent:
        return `${round(value, 2)}%`;
      default:
        return value;
    }
  };

  const setSortCompareFn = (indicator: IndicatorConfig, columnDef: ColDef<RowConfig>) => {
    const comparator: ColDef<RowConfig>['comparator'] | undefined = (():
      | ColDef<RowConfig>['comparator']
      | undefined => {
      switch (indicator.resultType) {
        case IndicatorResultType.Money:
        case IndicatorResultType.Percent:
        case IndicatorResultType.NeedConvertNumber:
        case IndicatorResultType.Number:
        case IndicatorResultType.IntNumberThousandthFormat:
          return (a, b, _, __, isDescending) => numberSort(a, b, isDescending);
        case IndicatorResultType.String:
          return (a, b, _, __, isDescending) => stringSort(a, b, isDescending);
        case IndicatorResultType.Date:
          return (a, b, _, __, isDescending) => dateSort(a, b, isDescending);
        case IndicatorResultType.Enum: {
          if (indicator.sortList) {
            const sortMap = new Map(indicator.sortList.map((v, index) => [v, index]));
            return (a, b, _, __, isDescending) => enumSort(a, b, isDescending, sortMap);
          }
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[dataView]: "${indicator.name}"缺少sortList配置`);
          }
          return (a, b, _, __, isDescending) => stringSort(a, b, isDescending);
        }
        case IndicatorResultType.SecondFieldSort:
          return (valueA, valueB, rowNodeA, rowNodeB, isDescending) =>
            secondFieldSort(valueA, valueB, rowNodeA.data!, rowNodeB.data!, isDescending, indicator.key);
        default:
          return (a, b, _, __, isDescending) => stringSort(a, b, isDescending);
      }
    })();
    if (comparator) {
      columnDef.comparator = comparator;
    }
  };

  const buildIndicatorColumn = useMemoizedFn<(indicator: IndicatorConfig, index: number) => ColDef<RowConfig>>(
    (indicator) => {
      const align =
        !isUndefined(indicator.resultType) &&
        [
          IndicatorResultType.Money,
          IndicatorResultType.Percent,
          IndicatorResultType.NeedConvertNumber,
          IndicatorResultType.Number,
          IndicatorResultType.IntNumberThousandthFormat,
        ].includes(indicator.resultType)
          ? 'right'
          : undefined;
      const columnDef: ColDef<RowConfig> = {
        field: indicator.key,
        refData: { indexId: indicator.indexId || '' },
        headerName: indicator.columnName || indicator.name,
        headerComponent: TableHeaderCell,
        headerComponentParams: {
          onContextMenu: onHeaderContextMenu,
          indicatorKey: indicator.key,
          children: indicator.columnName || indicator.name,
          align,
          note: indicator.note,
          prioritySort: indicator.prioritySort,
        },
        valueGetter: (params: ValueGetterParams<RowConfig>): string => {
          const indicatorValue = params.data?.[indicator.key];
          if (indicatorValue) {
            if (isPlainObject(indicatorValue)) {
              return indicatorValue.value;
            }
          }
          return indicatorValue;
        },
        colId: indicator.key,
        cellRenderer: (props: any) => {
          return (
            <TableCell
              {...props}
              extraProperties={{ ...props.extraProperties, ...indicator.extraProperties }}
              canViewDetails={indicator.canViewDetails}
            />
          );
        },
        sortable: indicator.sortable,
        cellRendererParams: (props: any) => {
          const renderValue =
            indicator._dirty || props.data._dirty
              ? ''
              : !isUndefined(props.value)
              ? formatValue(props.value, indicator)
              : '-';
          const indicatorValue = props.data[indicator.key];
          return {
            title: renderValue,
            onContextMenu: onBodyContextMenu,
            children: renderValue,
            align,
            indexCellType: indicator.indexCellType,
            extraProperties: isPlainObject(indicatorValue) ? indicatorValue.extraProperties : undefined,
          };
        },
      };
      if (!isUndefined(indicator.width)) {
        columnDef.width = indicator.width;
      }
      setSortCompareFn(indicator, columnDef);
      return columnDef;
    },
  );

  const buildNormalColumn = useMemoizedFn<(columnConfig: ColDef<RowConfig>, index: number) => ColDef<RowConfig>>(
    ({ colId: colKey, headerName, ...config }) => {
      const colId = colKey || shortid();
      const { headerComponentParams, ...restConfig } = config;
      const mergedHeaderComponentParams = merge(
        {
          onContextMenu: onHeaderContextMenu,
          indicatorKey: colId,
          children: headerName,
        },
        headerComponentParams,
      );
      return {
        colId,
        headerName,
        headerComponent: TableHeaderCell,
        headerComponentParams: mergedHeaderComponentParams,
        cellRenderer: TableCell,
        cellRendererParams: (props: any) => ({
          title: props.value,
          onContextMenu: onBodyContextMenu,
          children: props.value,
        }),
        ...restConfig,
      };
    },
  );

  useEffect(() => {
    if (!lockRebuildRef.current) {
      if (!isUndefined(withoutParentIndicators)) {
        const normalWidthConfig = normalWidthConfigRef.current;
        const normalColumn2Config = isArea()
          ? {
              headerName: '地区名称',
              colId: COL_AREA_NAME,
              width: normalWidthConfig[COL_AREA_NAME],
            }
          : {
              headerName: '公司名称',
              colId: COL_COMPANY_NAME,
              width: normalWidthConfig[COL_COMPANY_NAME],
            };
        const normalColumns: ColDef<RowConfig>[] = [
          {
            colId: COL_INDEX,
            headerName: '序号',
            width: normalWidthConfig[COL_INDEX],
            lockPosition: 'left',
            pinned: 'left',
            sortable: false,
            suppressMovable: false,
            cellRenderer: TableCell,
            cellRendererParams: (params: any) => ({
              onContextMenu: onBodyContextMenu,
              children: params.node.rowIndex + 1,
              align: 'center',
              noPadding: true,
            }),
            headerComponentParams: {
              align: 'center',
              noPadding: true,
            },
          },
          {
            ...normalColumn2Config,
            field: 'name',
            lockPosition: 'left',
            pinned: 'left',
            suppressMovable: false,
            comparator: (a, b, _, __, isDescending) => stringSort(a, b, isDescending),
            cellRenderer: TableCell,
            cellRendererParams: (params: any) => ({
              onContextMenu: onBodyContextMenu,
              children: (
                <TableLinkCell
                  title={params.value}
                  onDoubleClick={() => {
                    if (isArea()) {
                      !isDevelopArea(params.data.type) &&
                        history.push(
                          urlJoin(dynamicLink(LINK_AREA_ECONOMY, { code: params.data.key, key: 'regionEconomy' })),
                        );
                    } else {
                      history.push(
                        urlJoin(
                          dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                          urlQueriesSerialize({
                            code: params.data.key,
                            type: params.data.type,
                          }),
                        ),
                      );
                    }
                  }}
                >
                  {params.value}
                </TableLinkCell>
              ),
            }),
          },
        ];

        const checkboxColumn: ColDef<RowConfig> = {
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 45,
          pinned: 'left',
          lockPosition: 'left',
          resizable: false,
          cellStyle: {
            display: 'flex',
            'justify-content': 'center',
          },
          headerClass: 'data-view-checkbox-header',
        };
        const normalTableColumns = [checkboxColumn, ...normalColumns.map(buildNormalColumn)];
        updateTable({
          columns: [...normalTableColumns, ...withoutParentIndicators.map(buildIndicatorColumn)],
        });
      }
    }
    lockRebuildRef.current = false;
  }, [
    buildIndicatorColumn,
    buildNormalColumn,
    history,
    isArea,
    onBodyContextMenu,
    updateTable,
    withoutParentIndicators,
  ]);

  const onColumnMoved = useMemoizedFn((event: ColumnMovedEvent) => {
    const column = event.column;
    if (column && event.toIndex) {
      const colDef = column.getColDef() as ColDef<RowConfig>;
      const indicatorKey = colDef.colId;
      const indicator = find(withoutParentIndicators, { key: indicatorKey });
      if (indicator) {
        lockRebuildRef.current = true;
        moveIndicator(indicator, event.toIndex);
      }
    }
  });

  // 更新ag-grid实例对象
  const updateGrid = useMemoizedFn((grid: AgGridReact) => {
    updateTable({ grid });
  });

  const onColumnResized = useMemoizedFn(
    debounce((event: ColumnResizedEvent<RowConfig>) => {
      if (event.column) {
        const width = event.column.getActualWidth();
        const colId = event.column.getColId();
        lockRebuildRef.current = true;
        if (event.finished) {
          raf(() => {
            lockRebuildRef.current = false;
          });
        }
        if (!isNormalColId(colId)) {
          updateIndicator(colId, (indicator) => {
            indicator.width = width;
          });
        } else {
          normalWidthConfigRef.current[colId] = width;
        }
      }
    }, 200),
  );

  const onRowDragEnd = useMemoizedFn(() => {
    if (gridRef.current) {
      const rows: any[] = [];
      gridRef.current.api.forEachNode((node) => {
        rows.push(node.data);
      });
      updateTable({
        rows,
        data: rows,
      });
      gridRef.current.api.refreshCells({
        columns: ['renderIndex'],
      });
    }
  });

  return { data, columns, onColumnMoved, onColumnResized, onRowDragEnd, updateGrid };
}

const TableLinkCell = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #141414;
  cursor: pointer;
`;
