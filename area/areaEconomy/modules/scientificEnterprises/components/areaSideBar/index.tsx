import { FC } from 'react';

import styled from 'styled-components';

import { DEFAULT_PAGE_VERTICAL_MARGIN, getConfig } from '@/app';

import { useCtx } from '../../provider/ctx';
import { IAreaTreeItem } from '../../types';
import { Item } from './areaItem';

/**
 * @description 侧边栏地区筛选组件
 */
export const AreaSideBar: FC<{ className: string }> = () => {
  const {
    state: { areaTree },
  } = useCtx();

  return (
    <SideBarContainer>
      {areaTree.length
        ? areaTree.map((o: IAreaTreeItem) => {
            return <Item item={o} key={o.value} />;
          })
        : null}
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div<{ display?: boolean }>`
  width: 114px;
  height: calc(100vh - 38px - ${getConfig((d) => d.css.pageVerticalMargin, DEFAULT_PAGE_VERTICAL_MARGIN)});
  background-color: #fff;
  border-radius: 2px;
  margin-top: 2px;
  padding: 18px 6px 0 8px;
  overflow-y: scroll;
  overflow-x: visible;
  padding-bottom: 20px;
  border-right: 1px solid #efefef;
  &::-webkit-scrollbar {
    display: none;
  }
  /* &::-webkit-scrollbar-thumb {
    background-color: transparent;
  } */
  /* &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #ddd;
    }
  } */
  .ant-popover-inner-content {
    padding: 6px 0 0 0;
  }
`;
