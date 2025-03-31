import { isEmpty } from 'lodash';

import { MenuItemProps } from '@/pages/area/areaF9/components/sideBarLayout/menu/interface';

// 判断子节点是否存在 title 存在 keyword 的节点
export function hasTitleContaining(data: MenuItemProps[], keyword: string) {
  function checkNode(node: MenuItemProps): boolean {
    const { title, children } = node || {};
    if (title && title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
      return true;
    }
    if (children && !isEmpty(children)) {
      return children.some((child) => checkNode(child));
    }
    return false;
  }

  return data.some((item) => checkNode(item));
}

// 递归获取需要展开的节点
export function GetKeys(menu: any, keyWord: string, keys: string[]) {
  if (!menu || isEmpty(menu)) return;
  (menu as any).forEach((node: MenuItemProps) => {
    const { children } = node || {};
    if (children && !isEmpty(children) && hasTitleContaining(children, keyWord || '')) {
      keys.push(node?.key || node?.id || '');
      GetKeys(children, keyWord, keys);
    }
  });
}
