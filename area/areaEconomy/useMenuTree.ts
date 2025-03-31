import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { isUndefined } from 'lodash';

import { getF9Tree } from '@/apis/f9/enterprise';
import { ColumnConfig } from '@/components/menuDrop';
import { menuConfig as staticMenuConfig } from '@/pages/area/areaEconomy/staticMenuConfig';
import { Menu } from '@/pages/detail/components/menuTabs/types';
import { useAsync, useQuery } from '@/utils/hooks';

import { Data, getTreeTabConfig } from './menuTree';

export default function useMenuTree() {
  const { code } = useParams<{ code: string }>();
  const { type } = useQuery();
  const { execute: handleGetF9Tree, pending } =
    useAsync<({ code, type }: { code: string; type: string }) => Promise<Data[]>>(getF9Tree);
  const [menuConfig, setMenuConfig] = useState<ColumnConfig[]>([]);
  const [tabConfig, setTabConfig] = useState<Menu[]>([]);

  useEffect(() => {
    if (!isUndefined(code) && !isUndefined(type)) {
      handleGetF9Tree({ code, type });
    }
  }, [code, handleGetF9Tree, type]);

  useEffect(function handleResponseMenuData() {
    /* if (data) {
        const tree = data.find((d) => d.treeType === menuType);
        if (tree) {
          const rebuildMenus = rebuildMenuData(tree);
          setMenuConfig(rebuildMenus);
          const tabConfig = getTreeTabConfig(rebuildMenus);
          setTabConfig(tabConfig);
          updateStore(rebuildMenus, tabConfig);
        }
      }*/
    setMenuConfig(staticMenuConfig);
    const tabConfig = getTreeTabConfig(staticMenuConfig);
    setTabConfig(tabConfig);
  }, []);

  return {
    menuConfig,
    tabConfig,
    pending,
  };
}
