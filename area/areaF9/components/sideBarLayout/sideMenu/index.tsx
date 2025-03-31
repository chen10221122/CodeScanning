import { FC, memo } from 'react';

import styled from 'styled-components';

import { Empty } from '@/components/antd';
import Menu, { MenuProps } from '@/pages/area/areaF9/components/sideBarLayout/menu';
import Search, { SearchWithHideProps } from '@/pages/area/areaF9/components/sideBarLayout/search';
import { getPrefixCls } from '@/utils/getPrefixCls';

const prefix = getPrefixCls('side-menu');

export interface SideMenuProps extends MenuProps, SearchWithHideProps {
  /** 用来区分在页面中的位置 */
  type?: string;
  /** 搜索关键词 */
  keyword?: string;
}

const SideMenu: FC<SideMenuProps> = ({
  menus,
  onChange,
  keyword,
  hideDataIconHistoryKey,
  onShowNoData,
  isHideNoDataNode,
  openKeys,
  selectedKeys,
  onClick,
  onOpenChange,
  onCollection,
  collections,
  flatMenus,
  onEditCollection,
}) => {
  return (
    <Container className={prefix('container')}>
      <SideMenuStyle>
        {/* 搜索内容为空 */}
        {keyword && !menus.length ? (
          <SearchEmpty>
            <Empty type={Empty.NO_SEARCH_DATA_NEW} description="暂无搜索结果" />
          </SearchEmpty>
        ) : (
          <Menu
            menus={menus}
            isHideNoDataNode={isHideNoDataNode}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onClick={onClick}
            onOpenChange={onOpenChange}
            onCollection={onCollection}
            getContainer={() => document.querySelector(`.${prefix('content')}`) as HTMLElement}
            collections={collections}
            flatMenus={flatMenus}
            onEditCollection={onEditCollection}
            keyword={keyword}
          />
        )}
      </SideMenuStyle>
      <Search onChange={onChange} hideDataIconHistoryKey={hideDataIconHistoryKey} onShowNoData={onShowNoData} />
    </Container>
  );
};

export default memo(SideMenu);

const Container = styled.div`
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  .menu-item-level-0.menu-item-level-0.ant-menu-item-only-child {
    padding-right: 4px !important;
  }
  .menu-item-level-0.menu-item-level-0.ant-menu-item-only-child.ant-menu-item-selected {
    background-color: transparent;
  }
  .ant-menu.ant-menu-root .ant-menu-submenu .ant-menu-sub .ant-menu-item i {
    margin-left: unset;
  }
`;

const SearchEmpty = styled.div`
  margin-top: 36px;
  padding: 0 20px;
  .ant-empty-image {
    width: 126px !important;
    height: 76px !important;
    margin-bottom: 11px !important;
  }
  .ant-empty-description {
    font-size: 12px !important;
    line-height: 18px;
  }
`;

const SideMenuStyle = styled.div`
  overflow-y: auto;
  overflow-y: overlay;
  height: calc(100% - 27px);
  overflow-x: hidden;
  position: relative;
  background-color: #fff;
  z-index: 1;

  .browser_firefox & {
    scrollbar-color: #ebecee transparent;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      background: #cfcfcf;
    }
  }
`;
