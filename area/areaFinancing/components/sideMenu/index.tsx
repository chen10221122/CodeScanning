import { FC, memo, useState, useEffect } from 'react';

import { useMemoizedFn, useToggle } from 'ahooks';
import { MenuItemProps } from 'antd/lib/menu';
import cn from 'classnames';
import styled from 'styled-components';

import { Menu } from '@/components/antd';
import DragLine from '@/components/dragLine';
import Icon from '@/components/icon';
import { Flex } from '@/components/layout';

const { SubMenu, Item } = Menu;

interface SideMenuProps {
  /** 目录树的展开宽度 */
  width?: number;
  /** 目录树的类名 */
  wrapperClassName?: string;
  /** 菜单数据 */
  menus: MenuItemProps[];
  /** 点击项目触发 */
  onClick?: ({ item, key, keyPath, selectedKeys, domEvent }: any) => void;
  /** 选中的项 */
  selectedKeys?: string[];
  /** 展开的菜单 */
  openKeys?: string[];
  /** 是否能展开所有的一级菜单 */
  isOpenAll?: boolean;
}
const DEFAULT_SIDE_WIDTH = 210;

const SideMenu: FC<SideMenuProps> = (props) => {
  const [sideWidth, setSideWidth] = useState(DEFAULT_SIDE_WIDTH);
  const { wrapperClassName, menus, onClick, selectedKeys, openKeys, isOpenAll = false } = props;
  /** 是否展开 */
  const [expand, { toggle }] = useToggle(true);
  /** 打开的菜单项， label[] */
  const [_openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setOpenKeys(openKeys || []);
  }, [openKeys]);

  const handleExpand = useMemoizedFn(() => {
    toggle();
  });

  // 被选中时调用
  const handleSelect = useMemoizedFn(({ selectedKeys, ...props }) => {
    onClick?.({ selectedKeys, ...props });
  });

  // SubMenu 展开/关闭的回调
  const handleOpenChange = useMemoizedFn((openKeys) => {
    //控制一级菜单的展开关闭
    setOpenKeys(openKeys);
  });

  const RenderSubMenu = useMemoizedFn((menu, level) => {
    if (menu.children) {
      return (
        <SubMenu
          key={menu.label}
          title={
            <Flex>
              <MenuLabel title={menu.label}>{menu.label}</MenuLabel>
              {menu.isVip ? <VipIcon image={require('./vip.png')} width={12} height={12} /> : null}
            </Flex>
          }
        >
          {menu.children.map((child: any) => RenderSubMenu(child, level + 1))}
        </SubMenu>
      );
    } else {
      return (
        <Item key={menu.key} disabled={menu.disabled} className={`menu-item-level-${level}`} title={menu.title}>
          {menu.label}
        </Item>
      );
    }
  });

  return (
    <SideMenuStyles expand={expand} width={sideWidth} isOpenAll={isOpenAll} className={cn(wrapperClassName)}>
      <div className="expand" onClick={handleExpand} />
      <DragLine setSideWidth={setSideWidth} />
      <div className="menu-wrap">
        <Menu
          onSelect={handleSelect}
          selectedKeys={selectedKeys}
          openKeys={_openKeys}
          onOpenChange={handleOpenChange}
          mode="inline"
        >
          {menus.map((menu) => RenderSubMenu(menu, 0))}
        </Menu>
      </div>
    </SideMenuStyles>
  );
};

export default memo(SideMenu);
export const VipIcon = styled(Icon)`
  transform: translateY(5px);
  margin-left: 2px;
  flex: none;
`;
const MenuLabel = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  white-space: nowrap;
`;
const SideMenuStyles = styled.div<{ expand: boolean; width: number; isOpenAll: boolean }>`
  position: relative;
  width: ${({ width, expand }) => (expand ? width : 0)}px;
  height: 100%;
  border-right: 1px solid #efefef;
  box-sizing: border-box;
  background: #fff;
  transition: width 0.3s;
  padding-top: 12px;

  .expand {
    position: absolute;
    top: 50%;
    right: -10px;
    width: 10px;
    height: 59px;
    border: 1px solid #e1e1e1;
    border-radius: 0 4px 4px 0;
    transform: translateY(-50%);
    z-index: 15;
    background: #f2f2f2;
    cursor: pointer;
    &:after {
      content: '';
      height: 0;
      width: 0;
      position: absolute;
      top: 50%;
      left: 1px;
      right: ${({ expand }) => (expand ? 2 : -2)}px;
      transform: translateY(-50%);
      border-width: ${({ expand }) => (expand ? '5px 6px 5px 0' : '5px 6px')};
      border-style: solid;
      border-color: ${({ expand }) =>
        expand ? 'transparent #8694ae transparent transparent' : 'transparent transparent transparent #8694ae'};
    }
  }

  .menu-wrap {
    display: ${({ expand }) => (expand ? 'block' : 'none')};
    padding: 0 8px;
    overflow-y: overlay;
    height: 100%;
    overflow-x: hidden;
    //scrollbar-color: #ebecee transparent;

    .browser_firefox & {
      scrollbar-color: #ebecee transparent;
    }

    ::-webkit-scrollbar {
      width: 7px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }

    &:hover {
      ::-webkit-scrollbar-thumb {
        background-color: #ebecee;
      }
    }

    .ant-menu {
      font-size: 13px;
      font-weight: 400;
      color: #141414;
      &.ant-menu-root {
        border-right: none;
        margin-bottom: 14px;

        .ant-menu-submenu {
          &.ant-menu-submenu-open {
            > .ant-menu-submenu-title {
              color: ${({ isOpenAll }) => (isOpenAll ? '#141414' : '#1482f0')};
              font-weight: 400;

              .ant-menu-submenu-arrow {
                transform: rotate(180deg) !important;

                &:before,
                &:after {
                  transition: none;
                  background-color: ${({ isOpenAll }) => (isOpenAll ? '#c0c0c0' : '#1482f0')};
                }
              }
            }
          }
          &.ant-menu-submenu-selected {
            > .ant-menu-submenu-title {
              color: #1482f0;
              .ant-menu-submenu-arrow {
                &:before,
                &:after {
                  background-color: #1482f0;
                }
              }
            }
          }

          .ant-menu-submenu-title {
            padding-left: 16px !important;
            height: 28px;
            line-height: 28px;
            margin-top: 0;
            margin-bottom: 0;

            &:hover {
              color: #0171f6;
            }
          }

          .ant-menu-submenu-arrow {
            transform: rotate(270deg) !important;
            width: 6px;
            transform-origin: center center;
            transition: transform 0.3s;

            &:before,
            &:after {
              transition: none;
              background-color: #c0c0c0;
            }
          }

          .ant-menu-sub {
            background: #fff;
            .ant-menu-item {
              display: flex;
              height: 28px;
              line-height: 28px;
              padding-left: 30px !important;
              margin-top: 0;
              margin-bottom: 0;
              color: #141414;

              &:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background: #dfdfdf;
                border-radius: 50%;
              }

              &:hover {
                color: #0171f6;
                span {
                  color: #0171f6;
                }
              }

              &.ant-menu-item-disabled {
                color: #c4c4c4 !important;
              }

              &.ant-menu-item-selected {
                color: #0171f6;
                background: rgba(1, 113, 246, 0.08);

                &:before {
                  background: #0171f6;
                }

                &:after {
                  display: none;
                }

                i {
                  color: #0171f6;
                }
              }

              span {
                max-width: 132px;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              i {
                font-style: normal;
                color: #7c7c7c;
                transform: scale(${11 / 13});
                margin-left: 4px;
              }
            }
          }
        }

        .ant-menu {
          .menu-item-level-2 {
            &:before {
              display: none;
            }
          }
        }
      }
    }

    .menu-item-level-0 {
      &.ant-menu-item-only-child {
        height: 29px;
        line-height: 29px;
        margin: 0;
        padding-left: 16px !important;

        &.ant-menu-item-selected {
          background-color: rgba(1, 113, 246, 0.08);

          &:after {
            display: none;
          }
        }
      }
    }
  }
`;
