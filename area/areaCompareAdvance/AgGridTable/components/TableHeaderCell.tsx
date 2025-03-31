import { memo, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

import styled, { css } from 'styled-components';

import { LINK_AREA_ECONOMY } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

interface TableHeaderCellProps {
  areaItem: Record<string, any>;
  indicatorKey?: string;
  onContextMenu?: (e: any, params: any) => void;
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  noPadding?: boolean;
  displayName: string;
}

function TableHeaderCell(props: TableHeaderCellProps) {
  const history = useHistory();
  const { areaItem, onContextMenu, displayName, children, indicatorKey, align, noPadding, ...params } = props;

  return (
    <CellWrapper
      align={align}
      title={displayName}
      noPadding={noPadding}
      onContextMenu={(e) => {
        if (onContextMenu) {
          onContextMenu(e, params);
        }
      }}
      onDoubleClick={(e) => {
        history.push(urlJoin(dynamicLink(LINK_AREA_ECONOMY, { code: areaItem.regionCode, key: 'regionEconomy' })));
      }}
    >
      {children}
    </CellWrapper>
  );
}

export default memo(TableHeaderCell);

const CellWrapper = styled.div<{ active?: boolean; align?: 'left' | 'right' | 'center'; noPadding?: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 0 12px;
    `}
  line-height: 30px;
  cursor: pointer;
`;
