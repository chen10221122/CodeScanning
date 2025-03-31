import { chunk, cloneDeep, isEmpty, isUndefined } from 'lodash';

import { JumpType } from '@/layouts/common/header/menuDrop/types';
import { MenuItemConfig } from '@/pages/detail/components/menuTabs/types';

export interface Data {
  treeType: string;
  treeList: TreeList[];
}

export interface TreeList {
  jumpType: JumpType;
  branchID: string;
  rotate: number;
  branchPath: string;
  showParent: number;
  branchShowName: string;
  icon: string;
  branchFullName: string;
  branchName: string;
  childTree: TreeList[];
  rootBranchID: string;
  limitOption: number;
  sort: number;
  nodeType: number;
  exportData: number;
  url: string;
  css: string;
  helpLink: string;
  isData: number;
  showMore: number;
  closed: number;
  child_type: string;
  tag: {
    color: string;
    label: string;
    countLabel: string;
    url: string;
  };
}

type CollectByChildren = { children: string[]; extraProps?: { [extraKey: string]: any } };
type IdWithExtraProps = { id: string; extraProps?: { [extraKey: string]: any } };

export type BranchId =
  | string
  | (string | { id: string; extraProps?: { [extraKey: string]: any } })[]
  | CollectByChildren
  | IdWithExtraProps;

export const rebuildMenuData = (tree: Data): MenuItemConfig[] => {
  const _flat = (tree: TreeList[], deep: number, path: string, parent: TreeList | null) => {
    return tree.map((item) => {
      const treeItem: MenuItemConfig = {
        id: item.branchID,
        url: item.url
          ? item.url
          : (!isEmpty(item.childTree) || item.jumpType === JumpType.JUMP) && parent?.url
          ? parent.url
          : '',
        baseUrl: parent?.url,
        deep,
        title: item.branchShowName,
        anchor: `#${item.branchName.trim()}`,
        count: Number(item.tag.countLabel),
        path: `${path.substr(1)}/${item.branchID}`,
        jumpType: item.jumpType,
      };
      if (item.limitOption === 1) {
        treeItem.disabled = true;
      }
      if (item.child_type) {
        treeItem.child_type = item.child_type;
      }
      if (item.icon) {
        treeItem.icon = item.icon;
      }
      if (!isUndefined(item.css)) {
        treeItem.css = item.css;
      }
      if (!isEmpty(item.childTree)) {
        treeItem.children = _flat(item.childTree, deep + 1, `${path}/${item.branchID}`, item);
      }
      return treeItem;
    });
  };

  return _flat(cloneDeep(tree.treeList), 0, '', null);
};

export const getTreeTabConfig = (data: MenuItemConfig[]) => {
  const _flat = (tree: MenuItemConfig[]) => {
    return tree.map((treeItem) => {
      if (treeItem.id === '2000' /* 财务数据 */ && treeItem.children) {
        treeItem.withCategory = true;
        treeItem.activeKey = '主要指标';
      } else if (
        treeItem.id &&
        ['2009' /* 财务分析 */, '6605' /* 新闻公告 */].includes(treeItem.id) &&
        treeItem.children
      ) {
        treeItem.activeKey = treeItem.children[0].title;
      }
      if (treeItem.title === '财务附注' && treeItem.children) {
        return {
          title: treeItem.title,
          icon: treeItem.icon,
          id: treeItem.id,
          layout: {
            children: chunk(treeItem.children, 8).map((chunkedChildren) => ({
              children: chunkedChildren,
            })),
          },
        };
      }
      if (treeItem.children) {
        treeItem.children = _flat(treeItem.children);
      }
      return treeItem;
    });
  };

  return _flat(cloneDeep(data).filter((d) => d.id !== '900040'));
};
