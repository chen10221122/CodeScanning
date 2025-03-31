import { isNil } from 'lodash';
import styled, { css } from 'styled-components';

import { areaLinkType, areaModalType } from '@dataView/const';
import { AreaSheetViewContext, useSheetView } from '@dataView/provider';

import TableCell, { TableCellProps } from './TableCell';

// 用于区域数据浏览器的单元格
export default function AreaDataCell({ children, ...props }: TableCellProps) {
  const { extraProperties } = props || {};
  const { type, color } = extraProperties || {};

  const { isShowTrace, isShowUpdate } = useSheetView<AreaSheetViewContext>();
  const isShowTraceLink = isShowTrace && !isNil(props.value) && (type === areaLinkType || areaModalType.includes(type));

  return (
    <AreaTableCellWrapper {...props} isShowTrace={isShowTraceLink} isShowUpdate={isShowUpdate} backgroundColor={color}>
      <span data-click-area={true}>{children}</span>
    </AreaTableCellWrapper>
  );
}

enum Color {
  Yellow = 1,
  Red = 2,
}

const AreaTableCellWrapper = styled(TableCell)<{
  isSowTrace?: boolean;
  isShowUpdate?: boolean;
  backgroundColor?: Color;
}>`
  ${({ isShowUpdate, backgroundColor }) =>
    isShowUpdate
      ? backgroundColor === Color.Yellow
        ? css`
            cursor: pointer;
            background-color: #ffe9d7;
          `
        : backgroundColor === Color.Red
        ? css`
            cursor: pointer;
            background-color: #ffd6d6;
          `
        : ''
      : ''};
  ${({ isShowTrace }) =>
    isShowTrace &&
    css`
      & > span {
        color: #025cdc;
        cursor: pointer;
        text-decoration: underline;
      }
    `}
`;
