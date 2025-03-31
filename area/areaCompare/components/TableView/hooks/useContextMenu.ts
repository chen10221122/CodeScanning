import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ColDef, RowNode } from 'ag-grid-community';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { isNil, isString, isUndefined, isNull, isPlainObject } from 'lodash';

import { FADE_DELAY, FLASH_DELAY } from '@dataView/const';
import { useCheckPagePlatform } from '@dataView/hooks';
import {
  RowConfig,
  useActiveSheet,
  useIndicatorParamsHelper,
  useSheetView,
  useTableContextHelper,
  useTableSheetData,
} from '@dataView/provider';

import { LINK_AREA_ECONOMY, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { copyToClipBoard } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface FocusInfo {
  target: 'header' | 'body';
  element: HTMLElement;
}

export default function useContextMenu() {
  const [contextParam, setContextParam] = useState<any>();
  const [visible, updateContextVisible] = useState(false);
  const { removeColumn, removeData } = useTableContextHelper();
  const { updateIndicatorModalVisible } = useIndicatorParamsHelper();
  const activeSheet = useActiveSheet();
  const { showParams } = useSheetView();
  const { columns: tableColumns, data, indicatorRenderParams } = useTableSheetData(activeSheet?.id);
  const focusInfoRef = useRef<FocusInfo>({} as FocusInfo);

  const history = useHistory();

  const { isArea } = useCheckPagePlatform();

  useEffect(() => {
    const focusInfo = focusInfoRef.current;
    if (focusInfo.target === 'body') {
      const element = focusInfo.element;
      if (visible) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    }
  }, [visible]);

  const onBodyContextMenu = useMemoizedFn((e: any, params: any) => {
    setContextParam(params);
    focusInfoRef.current = {
      target: 'body',
      element: params.eGridCell,
    };
    e.stopPropagation();
    e.preventDefault();
    updateContextVisible(false);
    Promise.resolve().then(() => {
      updateContextVisible(true);
    });
  });

  const onHeaderContextMenu = useMemoizedFn((e: any, params: any) => {
    setContextParam(params);
    focusInfoRef.current = {
      target: 'header',
      element: params.eGridHeader,
    };
    e.stopPropagation();
    e.preventDefault();
    updateContextVisible(false);
    Promise.resolve().then(() => {
      updateContextVisible(true);
    });
  });

  const onCopy = useMemoizedFn(
    (option: { column?: ColDef<RowConfig>; rows?: RowNode<RowConfig>[]; cell?: boolean } = { cell: true }) => {
      const { column, rows, cell } = option;
      if (cell) {
        copyToClipBoard(
          contextParam.colDef.colId === 'renderIndex'
            ? contextParam.rowIndex
            : isUndefined(contextParam.data)
            ? contextParam.displayName
            : contextParam.value,
          () => {
            if (contextParam.data) {
              contextParam.api.flashCells({
                rowNodes: [contextParam.node],
                columns: [contextParam.column.colId],
                flashDelay: FLASH_DELAY,
                fadeDelay: FADE_DELAY,
              });
            }
            message.success('文字已复制到剪切板');
          },
        );
      } else if (column) {
        const params =
          showParams && indicatorRenderParams?.[column.field!]
            ? indicatorRenderParams[column.field!].map((d) => (isString(d) ? d : `${d.name}：${d.value}`))
            : [];
        const values = [
          column.headerName,
          ...params,
          ...(column.colId === 'renderIndex'
            ? data.map((d, index) => index + 1)
            : data.map((d) =>
                isNil(d[column.field!])
                  ? '-'
                  : !isPlainObject(d[column.field!])
                  ? d[column.field!]
                  : d[column.field!].value,
              )),
        ];
        copyToClipBoard(values.join('\r\n'), () => {
          if (contextParam && contextParam.api) {
            contextParam.api.flashCells({ columns: [column.colId] });
          }
          message.success('内容已复制到剪切板');
        });
      } else if (rows) {
        const withoutIndexTableColumns = tableColumns.slice(1);
        const data = rows
          .map((row) => {
            const data = row.data;
            if (data) {
              return [
                !isNull(row.rowIndex) ? row.rowIndex + 1 : '-',
                ...withoutIndexTableColumns.map((col) =>
                  isNil(data[col.field!])
                    ? '-'
                    : !isPlainObject(data[col.field!])
                    ? data[col.field!]
                    : data[col.field!].value,
                ),
              ].join('\t');
            }
            return '-';
          })
          .join('\r\n');
        copyToClipBoard(data, () => {
          if (contextParam && contextParam.api) {
            contextParam.api.flashCells({ rowNodes: rows });
          }
          message.success('内容已复制到剪切板');
        });
      }
    },
  );

  const onViewRow = useMemoizedFn((rowInfo: RowConfig) => {
    if (rowInfo) {
      if (isArea()) {
        history.push(urlJoin(dynamicLink(LINK_AREA_ECONOMY, { code: rowInfo.key, key: 'regionEconomy' })));
      } else {
        history.push(
          urlJoin(
            dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
            urlQueriesSerialize({
              code: rowInfo.key,
              type: rowInfo.type,
            }),
          ),
        );
      }
    }
  });

  const onRemoveColumn = useMemoizedFn(() => {
    const colDef = contextParam.column.getColDef() as ColDef | undefined;
    if (colDef && colDef.colId) {
      removeColumn(colDef.colId);
    }
  });

  const onRemoveSelectedRows = useMemoizedFn((keys: string[]) => {
    removeData(keys);
    setTimeout(() => {
      contextParam.api.refreshCells({
        columns: ['renderIndex'],
      });
    });
  });

  const onRemoveRow = useMemoizedFn(() => {
    removeData(contextParam.data.key);
    setTimeout(() => {
      contextParam.api.refreshCells({
        columns: ['renderIndex'],
      });
    });
  });

  const onEditIndicator = useMemoizedFn(() => {
    const colDef = contextParam.column?.getColDef() as ColDef | undefined;
    if (colDef && colDef.field) {
      updateIndicatorModalVisible(colDef.field, true);
    }
  });

  return {
    updateContextVisible,
    onBodyContextMenu,
    onHeaderContextMenu,
    visible,
    contextParam,
    onViewRow,
    onCopy,
    onRemoveColumn,
    onRemoveSelectedRows,
    onRemoveRow,
    onEditIndicator,
  };
}
