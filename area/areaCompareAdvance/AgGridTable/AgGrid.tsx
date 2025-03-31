import { memo, useRef, useEffect, useState, useMemo } from 'react';

import { ColDef, GetRowIdFunc, BodyScrollEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemoizedFn, useSize } from 'ahooks';
import { cloneDeep } from 'lodash';

import { RowConfig } from '@dataView/provider';

import BackTop from '@/components/backTop';
import Icon from '@/components/icon';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { generateResultTree } from '@/pages/area/areaCompareAdvance/utils';

import RightClickOverlay from './components/RightClickOverlay';
import useContextMenu from './hooks/useContextMenu';
import useTableView from './hooks/useTableView';
import useTreeFold from './hooks/useTreeFold';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './ag-grid-dzh-vars.less';

const defaultColDef: ColDef<RowConfig> = {
  width: 160,
  minWidth: 20,
  maxWidth: 800,
  resizable: true,
  /** true 表示列被拖出网格时不会隐藏 */
  lockVisible: true,
  /** true 表示锁定的列无法拖出固定部分 */
  lockPinned: true,
};

function TableView() {
  const {
    state: { columnDefs, indexIds, indicatorTree, areaSelectCode, isAddAreaFixed, rowDatas, screenLoading },
    update,
  } = useCtx();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);
  const size = useSize(wrapperRef);

  const {
    visible,
    contextParam,
    onCopy,
    onViewRow,
    onReplaceArea,
    onRemoveColumn,
    onRemoveColumnAll,
    onBodyContextMenu,
    onHeaderContextMenu,
    updateContextVisible,
  } = useContextMenu();

  const [calcColumnDef, setCalcColumnDef] = useState<any>([]);

  useEffect(() => {
    if (!areaSelectCode?.length) {
      update((draft) => {
        draft.areaInfo = [];
        draft.rowDatas = generateResultTree(indicatorTree, { data: {}, indexIdList: indexIds });
      });
    }
  }, [areaSelectCode?.length, indexIds, indicatorTree, update]);

  const onGridReady = useMemoizedFn(() => {
    if (gridRef.current) {
      update((d: any) => {
        d.grid = gridRef.current;
      });
    }
  });

  const getRowId = useMemoizedFn<GetRowIdFunc<RowConfig>>((params) => params.data.indexId);

  const { updateFoldKeys, rowData } = useTreeFold(rowDatas, gridRef);

  useTableView({ onHeaderContextMenu, onBodyContextMenu, rowData, wrapperRef });

  // 处理点击事件并更新数据
  const handleCellClick = useMemoizedFn((params) => {
    if (params.column.colId === 'renderIndicator') {
      if (!params.data.hasChildren) return;
      updateFoldKeys(params.data.indexId);
    }
  });

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

  useEffect(() => {
    if (!columnDefs?.length) return;
    const cloneColumnDef = cloneDeep(columnDefs);
    const filteredColumnDef = cloneColumnDef.filter((o) => o.field !== 'addArea');
    const sumWidth = filteredColumnDef.reduce((sum, o) => sum + (o.width || 0), 0);
    const isFixed = sumWidth + 60 > (wrapperRef.current?.offsetWidth ?? 0);
    update((d) => {
      d.isAddAreaFixed = isFixed;
    });
    setCalcColumnDef(isFixed ? filteredColumnDef : columnDefs);
  }, [columnDefs, update, size]);

  /** 点击右侧目录，对应的标题行高亮 */
  const getRowStyle = useMemoizedFn((params) => {
    if (params.node.data.focused) {
      return { backgroundColor: '#FFF7EA' };
    }
  });

  /** loading样式 */
  const loadingTip = useMemo(() => {
    if (screenLoading) {
      return (
        <div className="aggrid-area-compare-loading">
          <span className="loading-tips">
            <Icon
              style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
              image={require('@/assets/images/common/loading.gif')}
            />
            <span className="loading-text">加载中</span>
          </span>
        </div>
      );
    }
  }, [screenLoading]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: 'calc(100% - 59px)' }} className="ag-theme-alpine">
      {loadingTip}
      <AgGridReact
        ref={gridRef}
        animateRows
        rowHeight={28}
        rowDragManaged
        rowData={rowData}
        getRowId={getRowId}
        onGridReady={onGridReady}
        columnDefs={calcColumnDef}
        suppressNoRowsOverlay={true}
        suppressScrollOnNewData={true}
        defaultColDef={defaultColDef}
        onCellClicked={handleCellClick}
        onBodyScroll={handleBodyScroll}
        suppressMoveWhenRowDragging
        getRowStyle={getRowStyle}
      />
      {isAddAreaFixed && (
        <div
          className="add-area-fix"
          onClick={() => {
            update((draft) => {
              draft.areaChangeIndex = -1;
              draft.selectAreaModalVisible = true;
            });
          }}
        >
          <Icon image={require('../imgs/addArea.png')} size={12} style={{ marginRight: '2px' }} />
          <Icon image={require('../imgs/addAreaFix.png')} width={20} height={24} />
        </div>
      )}

      {/* 右击下拉框菜单 */}
      <RightClickOverlay
        visible={visible}
        contextParam={contextParam}
        onCopy={onCopy}
        onViewRow={onViewRow}
        onReplaceArea={onReplaceArea}
        onRemoveColumn={onRemoveColumn}
        onRemoveColumnAll={onRemoveColumnAll}
        onVisibleChange={updateContextVisible}
      />
      <BackTop target={() => wrapperRef.current?.querySelector<HTMLDivElement>('.ag-body-viewport') || document.body} />
    </div>
  );
}

export default memo(TableView);
