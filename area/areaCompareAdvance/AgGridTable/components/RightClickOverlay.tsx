import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { RowNode } from 'ag-grid-community';
import { useClickAway, useEventListener, useMemoizedFn } from 'ahooks';
import { isBoolean } from 'lodash';
import styled, { css } from 'styled-components';

import { RowConfig } from '@/pages/area/areaCompareAdvance/types';

interface RightClickOverlayProps {
  visible?: boolean;
  onVisibleChange?: (v: boolean) => void;
  contextParam: any;
  onViewRow?: (row: RowConfig) => void;
  onReplaceArea?: (params: any) => void;
  onRemoveColumn?: () => void;
  onRemoveColumnAll?: () => void;
  onCopy?: (option?: { row?: RowNode<RowConfig>; cell?: boolean }) => void;
}

export default function RightClickOverlay({
  visible,
  onVisibleChange,
  contextParam,
  onViewRow,
  onReplaceArea,
  onRemoveColumn,
  onRemoveColumnAll,
  onCopy,
}: RightClickOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

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

  /** 是否是表头点击事件 */
  const isHeaderTarget = useMemo(() => contextParam?.target === 'header', [contextParam?.target]);

  const processViewRow = () => {
    onViewRow?.(contextParam);
    onVisibleChange && onVisibleChange(false);
  };

  const replaceArea = useMemoizedFn((params) => {
    onVisibleChange && onVisibleChange(false);
    onReplaceArea && onReplaceArea(params);
  });

  /** 删除整列 */
  const processRemoveColumn = () => {
    onVisibleChange && onVisibleChange(false);
    onRemoveColumn && onRemoveColumn();
  };

  /** 删除全部 */
  const processRemoveColumnAll = () => {
    onVisibleChange && onVisibleChange(false);
    onRemoveColumnAll && onRemoveColumnAll();
  };

  const processCopy = ({ row, cell }: { row?: boolean; cell?: boolean }) => {
    if (onCopy) {
      if (cell) {
        onVisibleChange && onVisibleChange(false);
        onCopy({ cell: true });
      } else if (row) {
        onVisibleChange && onVisibleChange(false);
        onCopy({ row: contextParam.node });
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
      <Item className="icon-check-area" disabled={false} onClick={processViewRow}>
        查看地区
      </Item>
      <Item
        className="icon-replace-area"
        onClick={() => {
          replaceArea(contextParam);
        }}
      >
        替换地区
      </Item>
      <Divider />

      <Item className="icon-remove-column" disabled={false} onClick={processRemoveColumn}>
        删除整列
      </Item>

      <Item className="icon-clear-all" disabled={false} onClick={processRemoveColumnAll}>
        清空全部
      </Item>

      <Item
        className="icon-copy-rows"
        disabled={isHeaderTarget}
        onClick={() => {
          if (!isHeaderTarget) processCopy({ row: true });
        }}
      >
        复制整行
      </Item>

      <Item className="icon-copy" disabled={false} onClick={() => processCopy({ cell: true })}>
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

  &.icon-replace-area {
    &:before {
      background-image: url(${require('@/pages/area/areaCompareAdvance/imgs/icon_replace_area.png')});
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

  &.icon-check-area {
    &:before {
      background-image: url(${require('@/pages/area/areaCompareAdvance/imgs/icon_check_area.png')});
    }
  }

  &.icon-clear-all {
    &:before {
      background-image: url(${require('@/pages/area/areaCompareAdvance/imgs/icon_clear_all.png')});
    }
  }

  &.icon-copy {
    &:before {
      background-image: url(${require('@dataView/images/icon_copy.png')});
    }
  }

  &.icon-copy-rows {
    &:before {
      background-image: url(${require('@dataView/images/icon_copy_rows.png')});
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
