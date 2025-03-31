import { useState, useMemo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import * as ls from 'local-storage';
import { cloneDeep, isNull } from 'lodash';

import { getF9TreeAccess } from '@/apis/f9/enterprise';
import { useTreePush } from '@/components/commonQuickNavigation/utils';
import { OPEN_AREA_COLLECTIONS_IDS } from '@/configs/localstorage';
import { getRegionEconomyTree } from '@/pages/area/areaF9/apis';
import { MY_COLLECTION } from '@/pages/area/areaF9/components/sideBarLayout/menu';
import { SideMenuProps } from '@/pages/area/areaF9/components/sideBarLayout/sideMenu';
import { useDispatch } from '@/pages/area/areaF9/context';
import { useTrack } from '@/pages/area/areaF9/hooks';
import { GetKeys } from '@/pages/area/areaF9/hooks/utils';
type MenuItemConfig = Pick<SideMenuProps, 'menus'>['menus'];

/** 需要vip权限访问的 */
let noAccess: Array<{
  businessType: string;
  description: string;
  example: string;
}> = [];

/** 可访问的 */
let access: string[] = [];

// 这两个的页面路径配置，和目录树的选中逻辑冲突了。需要特殊处理
const specialUrl = ['/area/creditLine', '/area/creditDetail'];

export const useMenus = ({ key, code: regionCode, module, hash }: Record<string, string>) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [menus, setMenus] = useState<MenuItemConfig>([]);
  const [keyword, setKeyword] = useState('');
  const [isHideNoDataNode, setIsHide] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  /** 接口返回数据缓存 */
  const [originMenus, setOriginMenus] = useState<MenuItemConfig>([]);
  const keywordRef = useRef<string>('');
  const track = useTrack();
  const push = useTreePush();

  const { run } = useRequest(getRegionEconomyTree, {
    manual: true,
    onSuccess(res) {
      const responseData = res?.data?.data?.[0]?.treeList || [];
      if (responseData) {
        const editProps = <T extends typeof responseData>(
          data: T,
          props: { noAccess?: boolean; noAccessDes?: any },
          prev: string[],
        ) => {
          if (Array.isArray(data) && data.length) {
            data.forEach((d, index) => {
              const lastNode = index === data.length - 1;
              const path = prev.concat(lastNode ? 'last' : 'nolast');
              d.path = path;

              d.title = d.branchShowName || d.branchName;
              d.key = d.branchID;
              d.children = undefined;
              /** 无数据或者未上线，禁用 */
              d.disabled = d.limitOption !== 0;
              /** 无数据 */
              d.isHide = d.limitOption === 1;

              const noAccessDes = noAccess?.find((a) => a.businessType === d.businessType);
              const noAuthAccess = !!noAccessDes;

              // 权限处理
              d.showVipIcon = access.some((a) => a === d.businessType) || noAuthAccess;
              d.noAccess = noAuthAccess || props.noAccess || false;
              d.noAccessDes = noAccessDes || props.noAccessDes;

              // 金融机构这块需要特殊处理，除了第一个，其他都不在下一页的显示中
              if (
                d.url.startsWith('/area/financialInstitutions') &&
                d.url !== '/area/financialInstitutions?module=bank'
              ) {
                d.hiddenInNextPage = true;
              }

              if (Array.isArray(d.childTree) && d.childTree.length) {
                d.children = d.childTree;
                delete d.childTree;
                /** 将父级权限集成给子级，不过子级不需要vip图标 */
                editProps(d.children, { noAccess: d.noAccess, noAccessDes: d.noAccessDes }, path);
              }
            });
          }
        };

        editProps(responseData, {}, []);
      }
      setOriginMenus(responseData);
      setMenus(responseData);
    },
    onError(err) {
      setMenus([]);
    },
  });

  useRequest(getF9TreeAccess, {
    onSuccess(data) {
      noAccess = data?.data?.noAccess;
      access = data?.data?.access;
      run(regionCode);
    },
  });

  /**
   * 查找匹配的菜单项；
   * -匹配的是父级，保留子级；
   * -匹配的是子级，保留到子级，兄弟元素删除；
   */
  const findMenuItem = useMemoizedFn((keyword: string): MenuItemConfig => {
    const judgeFn = (node: MenuItemConfig[0]) => {
      return node.title?.indexOf(keyword) !== -1;
    };
    function _filter(nodes: MenuItemConfig, judge: Function) {
      if (!nodes || !nodes.length) return [];
      const child: MenuItemConfig = [];
      for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        // 自己本身符合条件(如果有匹配的则不用递归了，直接取下面所有的子节点)
        if (judge(node)) {
          child.push(node);
          continue;
        }

        const sub = _filter((node?.children as MenuItemConfig) || [], judge);

        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 sub 数组中有值
        // 2. 自己本身符合条件
        if ((sub && sub.length) || judge(node)) {
          if (node.children) node.children = sub;
          child.push(node);
        }
      }
      return child;
    }

    return _filter(cloneDeep(originMenus), judgeFn);
  });

  /** 搜索关键词change */
  const searchChange = useMemoizedFn((keyword) => {
    setKeyword(keyword);
    if (keyword && menus) {
      const targetMenus = findMenuItem(keyword);
      setMenus(targetMenus);
    } else {
      setMenus(originMenus);
    }
  });

  /** 拉平后的菜单数据 */
  const [flatMenus, parentNodes] = useMemo(() => {
    const childNodes: MenuItemConfig = [];
    const parentNodes: MenuItemConfig = [];
    function _flat(data: MenuItemConfig) {
      for (let node of data) {
        if (node.children) {
          _flat((node.children as MenuItemConfig) || []);
          parentNodes.push(node);
        } else {
          childNodes.push(node);
        }
      }
    }
    _flat(cloneDeep(originMenus));
    return [childNodes, parentNodes];
  }, [originMenus]);

  /** 选中的节点 */
  const selectedNode = useMemo(() => {
    return flatMenus.find((menu) => {
      /** 配置的页面路径, 只包含path和module参数 */
      const url = menu.url;
      /**
       * url中的路径有多种
       * 1. /:regionCode/area/:key 新路径或者老的路径，当前可能需要module参数
       * 2. /:regionCode/area/:key?module=xxxx 新的路径
       * 3. /:regionCode/area/:key?code=xxxx#hash 之前老的路径
       */
      if (url) {
        const suffix = `/area/${key}`;
        // 路径包含模块，表示有多个子模块，需要判断module才能选中
        if (url.includes('?module=')) {
          // 如果跳转过来的参数没有module，需要把hash赋值给参数
          const params = module || hash;

          // 路径没module参数，只需要匹配path路径
          if (!module) {
            return url.includes(suffix);
          }

          return url === `${suffix}?module=${params}`;
        } else {
          return specialUrl.includes(url) ? url === suffix : url.includes(suffix);
        }
      }

      return false;
    });
  }, [key, flatMenus, module, hash]);

  /** 跳转的节点不能访问，重定向到可以访问的节点 */
  useEffect(() => {
    if (selectedNode?.disabled || !selectedNode?.url || selectedNode.noAccess) {
      for (let i = 0; i < flatMenus.length; i++) {
        const menu = flatMenus[i];
        if ((!menu.disabled && menu.url) || menu.noAccess) {
          history.push(`/${regionCode}${menu.url}`);
          break;
        }
      }
    }
  }, [selectedNode, flatMenus, regionCode, history]);

  useEffect(() => {
    if (keyword) {
      const openKeys: string[] = [];
      GetKeys(parentNodes, keyword || '', openKeys);
      setOpenKeys(openKeys);
    } else {
      const nodekeys = selectedNode?.branchPath?.split('/') || [];
      nodekeys.pop();
      if (ls.get(OPEN_AREA_COLLECTIONS_IDS) || isNull(ls.get(OPEN_AREA_COLLECTIONS_IDS))) {
        nodekeys.push(MY_COLLECTION);
      }
      if (keywordRef.current) {
        setOpenKeys(nodekeys);
      } else {
        // @ts-ignore
        setOpenKeys((state) => [...new Set(state.concat(nodekeys).filter(Boolean))]);
      }
    }

    keywordRef.current = keyword;
  }, [key, keyword, parentNodes, selectedNode?.branchPath]);

  const showNoData = useMemoizedFn((visible) => {
    setIsHide(!visible);
  });

  const nextNode = useMemo(() => {
    let tmp = null;

    let curIndex;

    for (let i = 0; i < flatMenus.length; i++) {
      const menu = flatMenus[i];
      if (menu.key === selectedNode?.key) {
        curIndex = i;
        continue;
      }

      if (
        typeof curIndex === 'number' &&
        i > curIndex &&
        menu.url &&
        !menu.disabled &&
        i < flatMenus.length &&
        !menu.hiddenInNextPage
      ) {
        tmp = menu;
        break;
      }
    }

    return tmp;
  }, [flatMenus, selectedNode?.key]);

  const openChange = useMemoizedFn((_openKeys) => {
    ls.set(OPEN_AREA_COLLECTIONS_IDS, _openKeys.includes(MY_COLLECTION));
    setOpenKeys(_openKeys);
  });

  useEffect(() => {
    dispatch((d) => {
      // @ts-ignore
      d.nextNode = nextNode || null;
      d.curNodeBranchId = selectedNode?.branchID || '';
      d.curNodeBranchName = selectedNode?.branchFullName || '';
    });
  }, [dispatch, nextNode, selectedNode?.branchID, selectedNode?.branchFullName]);

  const handleJumpClick = useMemoizedFn((_, menu) => {
    track(menu, 'tree');

    dispatch((d) => {
      d.pathFrom = window.location.pathname;
    });

    if (menu.url && regionCode && !menu.noAccess) {
      push(`/${regionCode}${menu.url}`);
    }
  });

  return {
    /** 关键词 */
    keyword,
    /** 菜单数据 */
    menus,
    /** 搜索关键词change */
    searchChange,
    /** 显示无数据节点 */
    showNoData,
    /** 隐藏无数据节点 */
    isHideNoDataNode,
    /** 拉平后的菜单数据 */
    flatMenus,
    /** 展开的菜单key */
    openKeys,
    /** 下一个有数据的节点 */
    nextNode,
    /** 选中的key */
    selectedKey: selectedNode?.key,
    openChange,
    handleJumpClick,
  };
};
