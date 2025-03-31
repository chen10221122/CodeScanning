import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import * as ls from 'local-storage';
import { isArray } from 'lodash';

import { useDispatch } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

import { getAreaEconomyInfo } from '@/apis/area/areaEconomy';
import { useTitle } from '@/app/libs/route';
import { quickAreaOptions, ScreenAreaTreeData } from '@/components/screen';
import { AREA_ECONOMY_AREA_TREE_DATA } from '@/configs/localstorage';
import { findAreaJurisdictions } from '@/pages/area/areaCompany/utils/filter';
import { useRequest } from '@/utils/hooks';
import { recursion } from '@/utils/share';

type ScreenAreaItemType = {
  wholeCode?: string;
  provinceSelf?: boolean;
  label: string;
  citySelf?: boolean;
} & ScreenAreaTreeData;

const { getAllAreaTree } = quickAreaOptions;
/**
 * 头部地区相关数据，首次必须获取
 */
export function useInitData() {
  const { code } = useParams();
  const dispatch = useDispatch();
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const [loading, setLoading] = useState(true);

  // 存入localstorage的地区数据，否则城投平台接口入参就会错误
  useRequest(getAllAreaTree, {
    onSuccess(data: any) {
      ls.set(AREA_ECONOMY_AREA_TREE_DATA, data);
      dispatch((d) => {
        d.econmyAreaTree = data;
      });
    },
    defaultParams: [false],
    formatResult: ({ data }: any) => {
      return recursion<ScreenAreaItemType>(data as ScreenAreaItemType[], (item) => {
        item.label = item.name;
        if (item.province || item.city) {
          const v = item.value;
          if (item.sameLevelValue) {
            item.value = v;
            item.wholeCode = v;
          }
          if (item.province) {
            delete item.province;
            item.provinceSelf = true;
          } else {
            delete item.city;
            item.citySelf = true;
          }
        }
      });
    },
  });

  // 地区相关数据
  const { data: areaInfo, run: getInfo } = useRequest(getAreaEconomyInfo, {
    manual: true,
    onBefore() {
      setLoading(true);
    },
    onFinally() {
      setLoading(false);
    },
  });

  useEffect(() => {
    code && getInfo({ regionCode: code, underlingFlag: true });
  }, [code, getInfo]);

  useEffect(() => {
    if (areaInfo?.data?.regionInfo?.[0]) {
      const list: any = ls.get(AREA_ECONOMY_AREA_TREE_DATA) || [];
      const codestr =
        findAreaJurisdictions({ list: isArray(list) ? list : list.data || [], code })
          ?.children?.map((m: any) => m?.value)
          ?.join(',') || '';
      dispatch((d) => {
        d.areaDataInfo = areaInfo.data;
        d.areaInfo = areaInfo.data.regionInfo[0];
        d.lastYear = dayjs(areaInfo?.data.areaEconomyAndDebtDate).format('YYYY');
        d.jurisdictionCode = codestr;
      });
    }
  }, [areaInfo, dispatch, code]);

  useTitle(areaInfo?.data?.regionInfo?.[0]?.regionName);

  // 地区次数权限
  const setPowerDialogVisible = useMemoizedFn((data) => {
    dispatch((d) => {
      d.showPowerDialog = data;
    });
  });

  // 未付费无权限
  const setPayPowerDialogVisible = useMemoizedFn((data) => {
    dispatch((d) => {
      d.showPayPowerDialog = data;
    });
  });

  // 更多指标无权限
  const setMoreIndicPowerDialogVisible = useMemoizedFn((data) => {
    dispatch((d) => {
      d.showMoreIndicDialog = data;
    });
  });

  const payCheck = useMemoizedFn(() => {
    if (!havePay) {
      setPayPowerDialogVisible(true);
      return false;
    }
    return true;
  });

  useEffect(() => {
    dispatch((d) => {
      d.payCheck = payCheck;
      d.havePay = havePay;
    });
  }, [payCheck, dispatch, havePay]);

  return {
    setPayPowerDialogVisible,
    setPowerDialogVisible,
    setMoreIndicPowerDialogVisible,
    loading,
  };
}

// 面包屑地区文字逻辑

// const [areaData, setAreaData] = useState<ScreenAreaTreeData[]>();
// const [areaCrumbs, setAreaCrumbs] = useState<ScreenAreaTreeData[] | null>(null);
// 地区树
// const { run: repGetAllAreaTree, loading: areaLoading } = useRequest(getAllAreaTree, {
//   manual: true,
//   defaultParams: [true],
//   onSuccess: (res) => {
//     if (res?.data) {
//       setAreaData(res.data);
//       setLocalStorageData({ key: AREA_F9_AREA_ALL_DATA, data: res.data });
//     }
//   },
// });

// useEffect(() => {
//   if (!getLocalStorageData(AREA_F9_AREA_ALL_DATA)?.data) {
//     repGetAllAreaTree();
//   } else {
//     setAreaData(getLocalStorageData(AREA_F9_AREA_ALL_DATA)?.data);
//   }
// }, [repGetAllAreaTree]);

// useEffect(() => {
//   if (areaData?.length) {
//     if (code) {
//       setAreaCrumbs(findElementByValue<ScreenAreaTreeData>(areaData, code));
//     }
//   }
// }, [areaData, code]);
