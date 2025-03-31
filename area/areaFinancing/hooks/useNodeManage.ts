import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';

import { flatMenuData, VIP_MENU_KEYS } from '@pages/area/areaFinancing/config';
import { useCtx } from '@pages/area/areaFinancing/context';

import { LINK_AREA_FINANCING } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';

export default function useNodeManage() {
  const {
    state: { tabKey, wrapperRef },
    update,
  } = useCtx();
  // 用户账号信息
  const userInfo = useSelector((store: any) => store.user.info, shallowEqual);

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
    // vip未付费
    if (VIP_MENU_KEYS.includes(nextKey) && !userInfo?.havePay) {
      update((d) => {
        d.powerDialogVisible = true;
      });
      return;
    }
    update((d: any) => {
      d.tabKey = nextKey;
    });
    history.push(dynamicLink(LINK_AREA_FINANCING, { key: nextKey }));
    wrapperRef?.scrollTo({ top: 0 });
  });
  return { nextNode, handleNext };
}
