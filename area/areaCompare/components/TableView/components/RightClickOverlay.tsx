import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { ColDef, RowNode } from 'ag-grid-community';
import { useClickAway, useEventListener, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { find, isBoolean, isEmpty, isUndefined } from 'lodash';
import styled, { css } from 'styled-components';

import { isNormalColId, isDevelopArea } from '@dataView/DataView/SheetView/TableView/hooks/useTableView';
import { Platform } from '@dataView/platforms';
import { PagePlatform, RowConfig, useIndicatorParamsHelper, usePermissionContextHelper } from '@dataView/provider';

interface RightClickOverlayProps {
  visible?: boolean;
  onVisibleChange?: (v: boolean) => void;
  contextParam: any;
  onViewRow?: (row: RowConfig) => void;
  onCopy?: (option?: { column?: ColDef<RowConfig>; rows?: RowNode<RowConfig>[]; cell?: boolean }) => void;
  onEditIndicator?: () => void;
  onRemoveRow?: () => void;
  onRemoveSelectedRows?: (selectedKeys: string[]) => void;
  onRemoveColumn?: () => void;
}

export default function RightClickOverlay({
  visible,
  onVisibleChange,
  contextParam,
  onViewRow,
  onCopy,
  onEditIndicator,
  onRemoveColumn,
  onRemoveSelectedRows,
  onRemoveRow,
}: RightClickOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const { indicators } = useIndicatorParamsHelper();
  const { havePay } = usePermissionContextHelper();

  const positionRef = useRef({ x: 0, y: 0 });

  useEventListener(
    'mousemove',
    (e) => {
      positionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    {
      target: document,
    },
  );

  useClickAway(() => {
    onVisibleChange && onVisibleChange(false);
  }, wrapperRef);

  const updateDomPosition = useMemoizedFn(({ x, y }: { x: number; y: number }) => {
    if (wrapperRef.current) {
      wrapperRef.current.style.top = y + 'px';
      wrapperRef.current.style.left = x + 'px';
    }
  });

  useLayoutEffect(() => {
    if (visible) {
      if (!lockRef.current) {
        lockRef.current = true;
        const position = positionRef.current;
        updateDomPosition(position);
        const { x, y } = position;
        if (wrapperRef.current!.offsetHeight + y >= window.innerHeight) {
          updateDomPosition({ x, y: y - wrapperRef.current!.offsetHeight });
        }
        if (wrapperRef.current!.offsetWidth + x >= window.innerWidth) {
          updateDomPosition({ x: x - wrapperRef.current!.offsetWidth, y });
        }
      }
    }
  }, [updateDomPosition, visible]);

  useEffect(() => {
    if (isBoolean(visible)) {
      lockRef.current = visible;
    }
  }, [visible]);

  const isRow = contextParam && !isUndefined(contextParam.rowIndex);
  const isCompanyName = contextParam && contextParam.data && contextParam.column;
  // 是否是 开发区
  const isDevelop = contextParam && contextParam.data && contextParam.column && isDevelopArea(contextParam.data.type);

  const canEditIndicator = useMemo(() => {
    if (contextParam) {
      const colDef = contextParam.column?.getColDef();
      if (colDef && colDef.colId) {
        const colKey = colDef.colId;
        return find(indicators, { key: colKey });
      }
    }
    return false;
  }, [contextParam, indicators]);

  const isDisabledRemoveColumn = contextParam && contextParam.column && isNormalColId(contextParam.column.colDef.colId);

  const [selectedRows, setSelectedRows] = useState<RowConfig[]>([]);

  useEffect(() => {
    if (visible && contextParam) {
      setSelectedRows(contextParam.api.getSelectedRows());
    }
  }, [contextParam, visible]);

  const isMultipleSelected = useMemo(() => {
    return (
      !isEmpty(selectedRows) &&
      selectedRows.length > 1 &&
      contextParam &&
      contextParam.data &&
      selectedRows.some((d) => d.key === contextParam.data.key)
    );
  }, [contextParam, selectedRows]);

  const processViewRow = () => {
    if (!isMultipleSelected && isCompanyName && onViewRow && !isDevelop) {
      onViewRow(contextParam.data);
      onVisibleChange && onVisibleChange(false);
    }
  };

  const processEditIndicator = () => {
    if (canEditIndicator) {
      onVisibleChange && onVisibleChange(false);
      onEditIndicator && onEditIndicator();
    }
  };

  const processRemoveRows = () => {
    if (isRow) {
      onVisibleChange && onVisibleChange(false);
      if (isMultipleSelected) {
        const selectedRows: RowConfig[] = contextParam.api.getSelectedRows();
        if (selectedRows) {
          onRemoveSelectedRows && onRemoveSelectedRows(selectedRows.map((d) => d.key));
        }
      } else {
        onRemoveRow && onRemoveRow();
      }
    }
  };

  const processRemoveColumn = () => {
    if (!isDisabledRemoveColumn) {
      onVisibleChange && onVisibleChange(false);
      onRemoveColumn && onRemoveColumn();
    }
  };

  const processCopy = ({ column, rows, cell }: { column?: boolean; rows?: boolean; cell?: boolean }) => {
    if (onCopy) {
      if (cell) {
        onVisibleChange && onVisibleChange(false);
        onCopy({ cell: true });
      } else if (column) {
        onVisibleChange && onVisibleChange(false);
        onCopy({ column: contextParam.column.colDef });
      } else if (rows) {
        if (isRow) {
          onVisibleChange && onVisibleChange(false);
          if (isMultipleSelected) {
            const _selectedRows: RowConfig[] = contextParam.api.getSelectedRows();
            const selectedRows: RowNode<RowConfig>[] = [];
            contextParam.api.forEachNodeAfterFilterAndSort((node: RowNode<RowConfig>) => {
              if (node.data && _selectedRows.some((d) => d.key === node.data!.key)) {
                selectedRows.push(node);
              }
            });
            onCopy({ rows: selectedRows });
          } else {
            onCopy({ rows: [contextParam.node] });
          }
        }
      }
    }
  };

  return (
    <Wrapper
      ref={wrapperRef}
      visible={visible}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Platform
        renderCondition={(pageType) => pageType === PagePlatform.Area}
        renders={[
          <Item
            className="icon-view-company"
            disabled={!isCompanyName || isDevelop || isMultipleSelected}
            onClick={processViewRow}
          >
            查看地区
          </Item>,
          <Item className="icon-view-company" disabled={!isCompanyName || isMultipleSelected} onClick={processViewRow}>
            查看企业
          </Item>,
        ]}
      />
      <Item className="icon-edit" disabled={!canEditIndicator} onClick={processEditIndicator}>
        编辑指标
      </Item>
      <Divider />
      <Item
        className={cn({
          'icon-remove-line': !isMultipleSelected,
          'icon-remove': isMultipleSelected,
        })}
        disabled={!isRow}
        onClick={processRemoveRows}
      >
        {isMultipleSelected ? '删除选中' : '删除整行'}
      </Item>
      <Item className="icon-remove-column" disabled={isDisabledRemoveColumn} onClick={processRemoveColumn}>
        删除整列
      </Item>
      {havePay ? (
        <Item className="icon-copy-rows" disabled={!isRow} onClick={() => processCopy({ rows: true })}>
          {isMultipleSelected ? '复制选中' : '复制整行'}
        </Item>
      ) : null}
      <Item className="icon-copy-columns" onClick={() => processCopy({ column: true })}>
        复制整列
      </Item>
      <Item className="icon-copy" onClick={() => processCopy({ cell: true })}>
        复制单元格
      </Item>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ visible?: boolean }>`
  padding: 12px 8px;
  background-color: #fff;
  font-size: 13px;
  display: none;
  position: fixed;
  border: 1px solid #efefef;
  width: 200px;
  box-shadow: 0 2px 9px 2px rgba(0, 0, 0, 0.09), 0 1px 2px -2px rgba(0, 0, 0, 0.16);
  user-select: none;
  color: #141414;
  z-index: 2;
  ${({ visible }) =>
    visible &&
    css`
      display: block;
    `}
`;

const Item = styled.div<{ disabled?: boolean }>`
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f8f8f8;
  }

  &:before {
    content: '';
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    margin-top: -2px;
  }

  &.icon-view-company {
    &:before {
      background-image: url(${require('@dataView/images/icon_view_company.png')});
    }
  }

  &.icon-edit {
    &:before {
      background-image: url(${require('@dataView/images/icon_edit.png')});
    }
  }

  &.icon-remove {
    &:before {
      width: 13px;
      height: 13px;
      background-image: url(${require('@dataView/images/icon_remove.png')});
    }
  }

  &.icon-remove-line {
    &:before {
      width: 13px;
      height: 13px;
      background-image: url(${require('@dataView/images/icon_remove_line.png')});
    }
  }
  &.icon-remove-column {
    &:before {
      width: 13px;
      height: 13px;
      background-image: url(${require('@dataView/images/icon_remove_column.png')});
    }
  }

  &.icon-copy-rows {
    &:before {
      background-image: url(${require('@dataView/images/icon_copy_rows.png')});
    }
  }

  &.icon-copy-columns {
    &:before {
      background-image: url(${require('@dataView/images/icon_copy_columns.png')});
    }
  }

  &.icon-copy {
    &:before {
      background-image: url(${require('@dataView/images/icon_copy.png')});
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      color: #bfbfbf;
      cursor: not-allowed;

      &.icon-view-company {
        &:before {
          background-image: url(${require('@dataView/images/icon_view_company_disabled.png')});
        }
      }

      &.icon-edit {
        &:before {
          background-image: url(${require('@dataView/images/icon_edit_disabled.png')});
        }
      }

      &.icon-remove {
        &:before {
          background-image: url(${require('@dataView/images/icon_remove_disabled.png')});
        }
      }

      &.icon-remove-line {
        &:before {
          background-image: url(${require('@dataView/images/icon_remove_line_disabled.png')});
        }
      }

      &.icon-remove-column {
        &:before {
          background-image: url(${require('@dataView/images/icon_remove_column_disabled.png')});
        }
      }

      &.icon-remove {
        &:before {
          background-image: url(${require('@dataView/images/icon_remove_disabled.png')});
        }
      }

      &.icon-copy-rows {
        &:before {
          background-image: url(${require('@dataView/images/icon_copy_rows_disabled.png')});
        }
      }

      &.icon-copy-columns {
        &:before {
          background-image: url(${require('@dataView/images/icon_copy_columns_disabled.png')});
        }
      }

      &.icon-copy {
        &:before {
          background-image: url(${require('@dataView/images/icon_copy_disabled.png')});
        }
      }
    `}
`;

const Divider = styled.div`
  padding: 5px 8px;

  &:after {
    content: '';
    background-color: #efefef;
    height: 1px;
    width: 100%;
    display: block;
  }
`;
