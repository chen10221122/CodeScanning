import { memo, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isString } from 'lodash';
import styled, { css } from 'styled-components';

import { useCheckPagePlatform } from '@dataView/hooks';
import { useIndicatorParamsHelper, useSheetView } from '@dataView/provider';

import { Icon } from '@/components';
import { Tooltip } from '@/components/antd';

interface TableHeaderCellProps {
  onContextMenu?: (e: any, params: any) => void;
  onClick?: (e: any) => void;
  children?: ReactNode;
  indicatorKey?: string;
  align?: 'left' | 'right' | 'center';
  noPadding?: boolean;
  note?: string;
  prioritySort?: 'asc' | 'desc';
  [k: string]: any;
}

function TableHeaderCell(props: TableHeaderCellProps) {
  const { onContextMenu, onClick, children, indicatorKey, align, noPadding, note, prioritySort, ...params } = props;
  const { showParams } = useSheetView();
  const { isArea } = useCheckPagePlatform();
  const { indicatorRenderParams } = useIndicatorParamsHelper();
  const sortLoopRef = useRef(
    prioritySort === 'asc' ? (['asc', 'desc', undefined] as const) : (['desc', 'asc', undefined] as const),
  );

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const columnParams = useMemo(
    () => (indicatorRenderParams && indicatorKey ? indicatorRenderParams[indicatorKey] : undefined),
    [indicatorKey, indicatorRenderParams],
  );

  const renderParams = (sortable?: boolean) => {
    if (showParams && columnParams) {
      return (
        <ParamsWrapper sortable={sortable}>
          {columnParams.map((columnParam, index) =>
            !isString(columnParam) ? (
              <div key={index}>
                {columnParam.name}：{columnParam.value}
              </div>
            ) : (
              <div key={index}>{columnParam}</div>
            ),
          )}
        </ParamsWrapper>
      );
    }
  };

  const onSortChanged = useMemoizedFn(() => {
    const column = params.column;
    if (column.isSortAscending()) {
      setSortOrder('asc');
    } else if (column.isSortDescending()) {
      setSortOrder('desc');
    } else {
      setSortOrder(undefined);
    }
  });

  const onSortRequested = (order: 'asc' | 'desc' | undefined, event: MouseEvent<HTMLDivElement>) => {
    params.setSort(order || '', event.shiftKey);
  };

  useEffect(() => {
    params.column.addEventListener('sortChanged', onSortChanged);
    onSortChanged();

    return () => {
      params.column.removeEventListener('sortChanged', onSortChanged);
    };
  }, [onSortChanged, params.column]);

  const getNextSortOrder = () => {
    const index = sortLoopRef.current.indexOf(sortOrder);
    const len = sortLoopRef.current.length;
    if (index > -1) {
      if (index < len - 1) {
        return sortLoopRef.current[index + 1];
      } else {
        return sortLoopRef.current[0];
      }
    }
  };

  return (
    <CellWrapper
      align={align}
      noPadding={noPadding}
      onContextMenu={(e) => {
        if (onContextMenu) {
          onContextMenu(e, params);
        }
      }}
      onClick={(e) => {
        if (params.enableSorting) {
          onSortRequested(getNextSortOrder(), e);
        }
      }}
    >
      <div>
        <HeaderNameWrapper>
          {children}
          {note && isArea() ? (
            <Tooltip
              color={'#fff'}
              placement="bottom"
              title={() => (
                <TooltipContentStyle
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {note}
                </TooltipContentStyle>
              )}
              overlayStyle={{
                maxWidth: '500px',
              }}
            >
              <HoverIcon
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icon unicode="&#xe704;" size={12} />
              </HoverIcon>
            </Tooltip>
          ) : null}
        </HeaderNameWrapper>
        {params.enableSorting ? (
          <SortIconWrapper>
            <Icon
              symbol={!sortOrder ? 'iconico_weixuanzhong' : sortOrder === 'asc' ? 'iconico_shengxu' : 'iconico_jiangxu'}
            />
          </SortIconWrapper>
        ) : null}
      </div>
      {renderParams()}
    </CellWrapper>
  );
}

export default memo(TableHeaderCell);

const CellWrapper = styled.div<{ active?: boolean; align?: 'left' | 'right' | 'center'; noPadding?: boolean }>`
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 0 12px;
    `}
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
`;

const SortIconWrapper = styled.span`
  margin-left: 2px;
  .icon {
    transform: translateY(1px);
  }
`;

const HeaderNameWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ParamsWrapper = styled.div<{ sortable?: boolean }>`
  ${({ sortable }) =>
    sortable &&
    css`
      margin-right: 15px;
    `}
`;

const TooltipContentStyle = styled.div`
  font-size: 13px;
  text-align: left;
  color: #434343;
  line-height: 20px;
  max-width: 294px;
  margin: 0;
  padding: 4px 2px;
`;

const HoverIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 12px;
  position: relative;
  padding-left: 2px;
  cursor: pointer;
  text-align: center;
  i {
    vertical-align: 0;
    color: #bfbfbf;
    width: 12px;
    height: 12px;
  }
`;
