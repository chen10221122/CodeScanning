import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getCityInvestLimits } from '@/apis/bond/cityInvestMap';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { Dispatch } from '@/store';
import useRequest from '@/utils/ahooks/useRequest';

export default function useLimits() {
  const { update } = useCtx();
  const dispatch: Dispatch = useDispatch();

  // 限制查询五个地区
  const { runAsync: handleRequestLimits } = useRequest(getCityInvestLimits, {
    manual: true,
    formatResult: (res: any) => {
      // 处理非vip用户查看次数的提示内容
      if (res.info?.includes('该模块为VIP模块')) {
        const info = res.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          dispatch.checkInfo.setRegionEconomyCheckInfo(`今日已查看${info[1]}`);
        }
      }
      return res;
    },
  });

  const handleLimit = useCallback(
    (code, onSuccess) => {
      handleRequestLimits({ code: code || '110000', pageCode: 'regionalEconomyQuickView' })
        .then((info) => {
          onSuccess && onSuccess(info);
        })
        .catch((reason: any) => {
          if (reason?.returncode === 202 && reason.info?.includes('该模块今日查询次数已达上限')) {
            dispatch.checkInfo.setRegionEconomyCheckInfo('今日已查看5/5个地区');
            update((o) => {
              o.showPowerDialog = true;
            });
          }
        });
    },
    [dispatch.checkInfo, handleRequestLimits, update],
  );
  return { handleLimit };
}
