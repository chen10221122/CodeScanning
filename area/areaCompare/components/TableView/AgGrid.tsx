import { memo, useRef } from 'react';

import {
  BodyScrollEvent,
  CellClickedEvent,
  ColDef,
  ColumnResizedEvent,
  GetRowIdFunc,
  SortChangedEvent,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isEmpty } from 'lodash';

import { useAutoExtractData, useKeyboardHandler } from '@dataView/hooks';
import { RowConfig, useEventEmitter } from '@dataView/provider';

import BackTop from '@/components/backTop';

import RightClickOverlay from './components/RightClickOverlay';
import ExtraNode from './extras';
import useContextMenu from './hooks/useContextMenu';
import useTableEmptyOverlay from './hooks/useTableEmptyOverlay';
import useTableView from './hooks/useTableView';
import './ag-grid-dzh-vars.less';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const defaultColDef: ColDef<RowConfig> = {
  width: 160,
  minWidth: 20,
  maxWidth: 800,
  sortable: true,
  resizable: true,
  lockVisible: true,
  lockPinned: true,
};

function TableView({ sheetId }: { sheetId: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const gridRef = useRef<AgGridReact<RowConfig>>(null);

  const event$ = useEventEmitter();

  const {
    visible,
    contextParam,
    updateContextVisible,
    onBodyContextMenu,
    onHeaderContextMenu,
    onCopy,
    onEditIndicator,
    onRemoveRow,
    onRemoveSelectedRows,
    onRemoveColumn,
    onViewRow,
  } = useContextMenu();

  const handleCellClick = useMemoizedFn((event: CellClickedEvent<RowConfig>) => {
    updateContextVisible(false);
    event$.emit('cellClick', event);
  });

  const {
    data,
    columns,
    onColumnMoved,
    onColumnResized: resizeFn1,
    onRowDragEnd,
    updateGrid,
  } = useTableView(sheetId, {
    gridRef,
    onBodyContextMenu,
    onHeaderContextMenu,
  });
  // 表格空状态
  useTableEmptyOverlay({
    sheetId,
    gridRef,
    wrapperRef,
    columns,
  });

  useAutoExtractData(sheetId);

  const handleBodyScroll = useMemoizedFn((event: BodyScrollEvent<RowConfig>) => {
    updateContextVisible(false);
    if (wrapperRef.current) {
      if (event.left > 0) {
        wrapperRef.current.classList.add('ag-table-has-left-offset');
      } else {
        wrapperRef.current.classList.remove('ag-table-has-left-offset');
      }
    }
  });

  const onGridReady = useMemoizedFn(() => {
    if (gridRef.current) {
      updateGrid(gridRef.current);
    }
  });

  const handleSortChange = useMemoizedFn((params: SortChangedEvent<RowConfig>) => {
    params.api.refreshCells({
      columns: ['renderIndex'],
    });
  });

  const onColumnResized = useMemoizedFn((event: ColumnResizedEvent<RowConfig>) => {
    resizeFn1(event);
  });

  const getRowId = useMemoizedFn<GetRowIdFunc<RowConfig>>((params) => params.data.key);

  const processKeyDown = useKeyboardHandler();

  return (
    <div
      ref={wrapperRef}
      style={{ width: '100%', height: '100%' }}
      className={cn('ag-theme-alpine', {
        'ag-table-empty': isEmpty(columns),
      })}
      onContextMenu={(e) => {
        if (data.length > 0) {
          e.preventDefault();
        }
      }}
    >
      <AgGridReact<RowConfig>
        ref={gridRef}
        rowData={data}
        columnDefs={columns}
        onColumnMoved={onColumnMoved}
        rowHeight={30}
        onBodyScroll={handleBodyScroll}
        suppressScrollOnNewData={true}
        onGridReady={onGridReady}
        defaultColDef={defaultColDef}
        suppressNoRowsOverlay={true}
        onColumnResized={onColumnResized}
        onSortChanged={handleSortChange}
        onCellClicked={handleCellClick}
        rowSelection="multiple"
        rowDragManaged
        rowDragMultiRow
        rowDragEntireRow
        onRowDragEnd={onRowDragEnd}
        suppressMoveWhenRowDragging
        onCellKeyDown={processKeyDown}
        getRowId={getRowId}
      />
      <RightClickOverlay
        visible={visible}
        onVisibleChange={updateContextVisible}
        contextParam={contextParam}
        onCopy={onCopy}
        onEditIndicator={onEditIndicator}
        onRemoveColumn={onRemoveColumn}
        onRemoveRow={onRemoveRow}
        onRemoveSelectedRows={onRemoveSelectedRows}
        onViewRow={onViewRow}
      />
      <BackTop target={() => wrapperRef.current!.querySelector<HTMLDivElement>('.ag-body-viewport') || document.body} />
      <ExtraNode />
    </div>
  );
}

export default memo(TableView);
