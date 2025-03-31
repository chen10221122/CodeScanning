import { FC, memo } from 'react';

import { useMemoizedFn, useToggle } from 'ahooks';
import { MenuItemProps } from 'antd/lib/menu';
import styled from 'styled-components';

import { Menu } from '@/components/antd';

const { SubMenu, Item } = Menu;

interface SideMenuProps {
  /** 目录树的展开宽度 */
  width?: number;
  /** 菜单数据 */
  menus: MenuItemProps[];
  /** 点击项目触发 */
  onClick?: ({ item, key, keyPath, selectedKeys, domEvent }: any) => void;
  /** 选中的项 */
  selectedKeys?: string[];
  /** 展开的菜单 */
  openKeys?: string[];
}

const SideMenu: FC<SideMenuProps> = ({ width = 200, menus, onClick, openKeys, selectedKeys }) => {
  /** 是否展开 */
  const [expand, { toggle }] = useToggle(true);

  /** 打开的菜单项， label[] */
  // const [_openKeys, setOpenKeys] = useState<string[]>([]);

  /** 更新一级菜单的展开列表 */
  // useEffect(() => {
  //   setOpenKeys(openKeys || []);
  // }, [openKeys]);

  const handleExpand = useMemoizedFn(() => {
    toggle();
  });

  // 被选中时调用
  const handleSelect = useMemoizedFn(({ selectedKeys, ...props }) => {
    onClick?.({ selectedKeys, ...props });
  });

  // SubMenu 展开/关闭的回调
  // const handleOpenChange = useMemoizedFn((openKeys) => {
  //   //控制一级菜单的展开关闭
  //   setOpenKeys(openKeys);
  // });

  const RenderSubMenu = useMemoizedFn((menu, level) => {
    if (menu.children) {
      return (
        <SubMenu key={menu.label} title={menu.label}>
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
    <SideMenuStyles expand={expand} width={width}>
      <div className="expand" onClick={handleExpand} />
      <div className="menu-wrap">
        <Menu
          onSelect={handleSelect}
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={['按规模']}
          // openKeys={_openKeys}
          // onOpenChange={handleOpenChange}
        >
          {menus.map((menu) => RenderSubMenu(menu, 0))}
        </Menu>
      </div>
    </SideMenuStyles>
  );
};

export default memo(SideMenu);

const SideMenuStyles = styled.div<{ expand: boolean; width: number }>`
  position: relative;
  width: ${({ width, expand }) => (expand ? width : 0)}px;
  height: 100%;
  border-right: 1px solid #efefef;
  box-sizing: border-box;
  background: #fff;
  transition: width 0.3s;
  padding-top: 18px;

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
              color: #1482f0;
              font-weight: 400;

              .ant-menu-submenu-arrow {
                transform: rotate(180deg) !important;

                &:before,
                &:after {
                  transition: none;
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
