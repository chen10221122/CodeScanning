import { isNil } from 'lodash';
import styled, { css } from 'styled-components';

import { bondIssuerModalType } from '@dataView/const';

import TableCell, { TableCellProps } from './TableCell';

// 用于债券发行人浏览器的单元格
export default function BondIssuerDataCell({ children, ...props }: TableCellProps) {
  const { extraProperties } = props || {};
  const { type } = extraProperties || {};

  const canViewDetail = !isNil(props.value) && bondIssuerModalType.includes(type);

  return (
    <BondIssuerTableCellWrapper {...props} isShowLink={canViewDetail}>
      {canViewDetail ? <span data-click-area={canViewDetail}>{children}</span> : children}
    </BondIssuerTableCellWrapper>
  );
}

const BondIssuerTableCellWrapper = styled(TableCell)<{
  isShowLink?: boolean;
}>`
  ${({ isShowLink }) =>
    isShowLink &&
    css`
      & > span {
        color: #025cdc;
        cursor: pointer;
      }
    `}
`;
