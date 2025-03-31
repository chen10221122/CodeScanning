import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import { flatMenuData } from '@pages/area/areaFinanceResource/config';
import { useCtx } from '@pages/area/areaFinanceResource/context';

import { LINK_AREA_FINANCE_RESOURCE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';

export default function useNodeManage() {
  const {
    state: { wrapperRef, tabKey },
    update,
  } = useCtx();
  const history = useHistory();
  const nextNode = useMemo(() => {
    const index = flatMenuData.findIndex((o) => o.key === tabKey);
    if (index > -1 && index < flatMenuData.length) {
      return flatMenuData[index + 1];
    }
    return null;
  }, [tabKey]);

  const handleNext = useMemoizedFn(() => {
    const nextKey = nextNode!.key;
    update((d: any) => {
      d.tabKey = nextKey;
    });
    history.push(dynamicLink(LINK_AREA_FINANCE_RESOURCE, { key: nextKey }));
    wrapperRef?.scrollTo({ top: 0 });
  });
  return { nextNode, handleNext };
}
