import { memo, FC, useEffect, useState, useMemo } from 'react';

import { ProMenu } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';

import { getConfig } from '@/app';
import { useModal } from '@/app/components/modal/NoPayNotice';
import { scrollTo } from '@/utils/animate';
import { findParents } from '@/utils/dom';
import { transformUrl } from '@/utils/url';

import { useSelector } from '../../../context';
import useClose from '../closeBtn/useClose';
import { MenuItemProps } from './interface';
import useDelete from './useDelete';

export const MY_COLLECTION = '我的常用';
const MY_COLLECTION_PREFIX = 'collection_';
const isXinsight = getConfig((d) => d.platform.IS_XINSIGHT_APP);
export interface MenuProps {
  /** 菜单数据 */
  menus: MenuItemProps[];
  /** 点击项目触发 */
  onClick?: ({ item, key, keyPath, selectedKeys, domEvent }: any, menu: MenuItemProps) => void;
  /** 选中的项 */
  selectedKeys?: string;
  /** 展开的菜单 */
  openKeys?: string[];
  /** 隐藏无数据节点 */
  isHideNoDataNode?: boolean;
  /** 打开关闭菜单时间 */
  onOpenChange?: (openKeys: string[]) => void;
  /** 收藏 */
  onCollection?: (menu: MenuItemProps, isCollection: boolean) => void;
  getContainer?: () => HTMLElement;
  /** 收藏的数据 */
  collections: { branchShowName: string; businessType: string; nodeType: any }[];
  flatMenus: MenuItemProps[];
  onEditCollection?: (menus: MenuItemProps[]) => void;
  keyword?: string;
}

const Menu: FC<MenuProps> = ({
  menus,
  onClick,
  selectedKeys,
  isHideNoDataNode,
  openKeys: parentOpenkeys,
  onOpenChange,
  onCollection,
  getContainer,
  collections,
  flatMenus,
  onEditCollection,
  keyword,
}) => {
  const viewTimesOver = useSelector((state) => state.viewTimesOver);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const [modal, contextHolder] = useModal();

  useEffect(() => {
    setOpenKeys(parentOpenkeys || []);
  }, [parentOpenkeys]);

  /** SubMenu 展开/关闭的回调 */
  const handleOpenChange = useMemoizedFn((_openKeys) => {
    //控制一级菜单的展开关闭
    setOpenKeys(_openKeys);
    onOpenChange?.(_openKeys);
  });

  const handleTitleClick = useMemoizedFn(({ key, domEvent }) => {
    if (domEvent.target && !openKeys.includes(key) && getContainer?.()) {
      const domEventParent = domEvent.target.parentElement;
      if (domEventParent) {
        setTimeout(() => {
          const parent = findParents(domEventParent, 'ant-menu-submenu-open');
          if (parent) scrollTo(parent.offsetTop - 50, { getContainer });
        });
      }
    }
  });

  const handleClickItem = useMemoizedFn((props, menu) => {
    // 这是 area 点击弹窗逻辑
    if (menu.noAccess && !viewTimesOver) {
      modal.open({
        permission: {
          title: '权限不足',
          description: `成为正式用户即可查看${menu.branchShowName}`,
          exampleImageUrl: transformUrl(menu?.noAccessDes.example),
          showVipIcon: true,
        },
      });
    }
    onClick?.({ ...props, selectedKeys: props.key }, menu);
  });

  const handleDel = useClose();

  const handleDelItem = useDelete();

  const collectionsMenus = useMemo(() => {
    const collectionMenu: MenuItemProps[] = [];
    collections.forEach((collection) => {
      const menu = cloneDeep(flatMenus.find((menu) => menu.businessType === collection.businessType) as MenuItemProps);
      if (menu) {
        menu.key = menu.key?.startsWith(MY_COLLECTION_PREFIX) ? menu.key : `${MY_COLLECTION_PREFIX}${menu.key}`;
        collectionMenu.push({ ...menu, collected: true, nodeType: collection.nodeType });
      }
      // 收藏的节点，可能不在目录树中，需要添加不适用标志
      else {
        collectionMenu.push({
          ...collection,
          title: collection.branchShowName,
          key: collection.businessType,
          noMatch: true,
          collected: true,
          nodeType: collection.nodeType,
        } as MenuItemProps);
      }
    });

    return collectionMenu;
  }, [flatMenus, collections]);

  const selectedKeysWithCollections = useMemo(() => {
    if (selectedKeys?.startsWith(MY_COLLECTION_PREFIX)) {
      const collectionKey = selectedKeys.split('_')[1];
      if (collectionKey) {
        return [selectedKeys, collectionKey];
      }
    } else {
      const collection = collectionsMenus.find((collection) => collection.key?.endsWith(selectedKeys as string));
      if (collection) {
        return [selectedKeys, collection.key];
      }
    }
    return [selectedKeys];
  }, [selectedKeys, collectionsMenus]);

  const menusWithCollections = keyword
    ? []
    : [{ title: MY_COLLECTION, children: collectionsMenus, key: MY_COLLECTION } as MenuItemProps];

  if (!menus?.length) {
    return null;
  }
  if (isXinsight) {
    // 预警云不显示VIP
    let menusStr = JSON.stringify(menus);
    menusStr = menusStr.replace(/showVipIcon/g, 'showVipIcon_del');
    menus = JSON.parse(menusStr);
  }

  return (
    <div style={{ marginTop: 6, marginRight: 4 }}>
      {contextHolder}
      <ProMenu
        menus={menusWithCollections.concat(menus)}
        collections={collections}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeysWithCollections as string[]}
        onClickItem={handleClickItem}
        onTitleClick={handleTitleClick}
        keyword={keyword}
        handleDel={handleDel}
        handleDelItem={handleDelItem}
        hideCollectButton={getConfig((d) => d.commons.hideCollectButton)}
        onCollection={onCollection}
      />
    </div>
  );
};

export default memo(Menu);
