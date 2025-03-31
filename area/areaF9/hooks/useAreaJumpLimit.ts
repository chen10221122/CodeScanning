import { useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useDispatch } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

import { getCityInvestLimits } from '@/apis/bond/cityInvestMap';
import { useTrackMenuClick } from '@/libs/eventTrack';
import useRequest from '@/utils/ahooks/useRequest';
import { useQuery } from '@/utils/hooks';

/**
 * @description 地区跳转权限判定
 * @example
 * @returns
 * @param trackRef 埋点的容器
 */

/** 默认地区: 北京市 */
const defaultAreaCode = '110000';

export function useAreaJumpLimit(trackRef?: HTMLElement, isScreenChange?: boolean) {
  const { code } = useParams();
  const dispatch = useDispatch();
  const { trackMenuClick } = useTrackMenuClick();
  const query = useQuery();

  // 限制查询五个地区
  const { runAsync: handleLimits } = useRequest(getCityInvestLimits, {
    manual: true,
    onSuccess: (res) => {
      if (res?.info?.includes('该模块为VIP模块')) {
        const info = res?.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          dispatch((d) => {
            d.regionEconomyCheckInfo = `今日已查看${info[1]}`;
          });
        }
      }
    },
    onError: (err: any) => {
      if (err?.returncode === 202 && err.info?.includes('该模块今日查询次数已达上限')) {
        dispatch((d) => {
          d.outIn = !isScreenChange;
        });
        if (!isScreenChange) return;
        dispatch((d) => {
          d.regionEconomyCheckInfo = `今日已查看5/5个地区`;
          d.showPowerDialog = true;
        });
      }
    },
    onFinally: () => {
      if (trackRef) {
        // 地区切换埋点  regionCode：code title:按钮名称
        trackMenuClick(trackRef, {
          regionCode: code,
          title: '确定',
        });
      }
    },
  });

  const handleLimit = useMemoizedFn((regionCode?: string, onSuccess?: (data: any) => void) => {
    handleLimits({ code: regionCode || code || '110000', pageCode: 'regionalEconomyQuickView' }).then((res) => {
      if (res?.info?.includes('该模块为VIP模块')) {
        const info = res?.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);

        if (info.length > 1) {
          dispatch((d) => {
            d.regionEconomyCheckInfo = `今日已查看${info[1]}`;
          });
        }

        if (info !== '5/5个地区') {
          onSuccess && onSuccess(res);
        }
      } else {
        onSuccess && onSuccess(res);
      }
    });
  });

  // 如果是因为权限不足定位到北京，那么就默认打开权限不足的弹窗，只有上面的重定向才会带有showPowerDialog参数
  useEffect(() => {
    if (query?.showPowerDialog) {
      handleLimit(defaultAreaCode, (info) => {
        if (info?.info === '该模块为VIP模块，已查询5/5个地区/天，提升等级可获更多权限') {
          dispatch((o) => {
            o.regionEconomyCheckInfo = `今日已查看5/5个地区`;
            o.showPowerDialog = true;
          });
        }
      });
    }
  }, [handleLimit, dispatch, query?.showPowerDialog]);

  return {
    handleLimits,
    handleLimit,
  };
}
