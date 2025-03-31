import { memo, ReactNode } from 'react';

import styled, { css } from 'styled-components';

import { IndicatorCellType } from '@dataView/provider';

export interface TableCellProps {
  value: any;
  onContextMenu?: (e: any, params: any) => void;
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  noPadding?: boolean;
  className?: string;
  /** 是否没有权限 */
  permissionDenied?: boolean;
  // 单元格的元素
  cellType?: string;
  indexCellType?: IndicatorCellType;
  extraProperties?: Record<string, any>;
  [k: string]: any;
}

function TableCell({
  onContextMenu,
  onClick,
  children,
  title,
  align,
  canViewDetails,
  className,
  noPadding,
  permissionDenied,
  cellType,
  ...params
}: TableCellProps) {
  return (
    <CellWrapper
      onContextMenu={(e) => {
        if (onContextMenu) {
          onContextMenu(e, params);
        }
      }}
      className={className}
      onClick={onClick}
      title={title}
      align={align}
      noPadding={noPadding}
      permissionDenied={permissionDenied}
      data-view-table-cell={cellType}
    >
      {permissionDenied ? null : canViewDetails && children && children !== '-' ? (
        <span className="view-detail" data-view-detail={true}>
          {children}
        </span>
      ) : (
        children
      )}
    </CellWrapper>
  );
}

export default memo(TableCell);

const CellWrapper = styled.div<{
  active?: boolean;
  align?: 'left' | 'right' | 'center';
  noPadding?: boolean;
  permissionDenied?: boolean;
}>`
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 0 12px;
    `}
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ active }) =>
    active &&
    css`
      border: 1px solid #025cdc;
    `}
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  ${({ permissionDenied }) =>
    permissionDenied &&
    css`
      &:before {
        content: '';
        background: url(${require('@dataView/images/vip/icon_permission_denied.png')}) no-repeat center;
        background-size: contain;
        width: 14px;
        height: 14px;
        display: inline-block;
        pointer-events: none;
      }
    `}
  .view-detail {
    color: #025cdc;
    cursor: pointer;
  }
`;
