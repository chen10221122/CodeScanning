import { useEffect, useRef } from 'react';

import { cloneDeep } from 'lodash';

import { ScreenType } from '@/components/screen';
import { getScreenData } from '@/pages/area/areaEconomy/modules/blackList/apis';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { dateScreenData, mainBodyScreenData, originCombination } from './../constant';

export const useData = () => {
  const [resultScreenData, updateResultScreenData] = useImmer([]);
  // 类型
  const typeRef = useRef<Record<string, any>>();
  // 国标行业
  const industryRef = useRef<Record<string, any>>();
  // 地区
  const areaRef = useRef<Record<string, any>>();
  // 自选组合
  const combinationRef = useRef<Record<string, any>>();

  const {
    data: screenData,
    loading: screenLoading,
    run: runScreen,
    error: screenError,
  } = useRequest(getScreenData, {
    manual: false,
    // defaultParams: [0],
    formatResult(res: any) {
      return res?.data || [];
    },
  });

  useEffect(() => {
    if (screenData && screenData.length) {
      screenData?.forEach((item: any) => {
        const name = item?.name;
        // 处理 类型 筛选
        if (name === '类型') {
          typeRef.current = item;
        } else if (name === '国标行业') {
          // 处理 主体-国标行业 主体-地区 筛选
          industryRef.current = {
            ...item,
            option: {
              type: ScreenType.MULTIPLE_THIRD,
              hasSelectAll: false,
              cascade: true,
              ellipsis: 8,
              hideSearch: !item.children || item.children.length <= 20,
            },
          };
        } else if (name === '地区') {
          areaRef.current = {
            ...item,
            option: {
              type: ScreenType.MULTIPLE_THIRD,
              hasSelectAll: false,
              cascade: true,
              // ellipsis: 8,
              hideSearch: !item.children || item.children.length <= 20,
            },
          };
        } else if (name === '自选组合') {
          // 处理 自选组合 筛选
          item.children.push(originCombination);
          if (!combinationRef.current) {
            combinationRef.current = {
              ...item,
              showVip: true,
              singleSelect: true,
            };
          } else {
            // 添加自选
            combinationRef.current.children = item.children;
          }
        }
      });

      const mainBodyCloneData = cloneDeep(mainBodyScreenData);

      updateResultScreenData((d: any) => {
        // if (d[d.length - 1].name === '自选组合') {
        //   d[d.length - 1].children = combinationRef.current;
        // } else {
        //   d.push(combinationRef.current);
        // }
        mainBodyCloneData.children.push(industryRef.current, areaRef.current);
        d.push(dateScreenData, typeRef.current, mainBodyCloneData, combinationRef.current);
      });
    }
  }, [screenData, updateResultScreenData]);

  return {
    screenData: resultScreenData,
    screenLoading,
    runScreen,
    screenError,
  };
};
