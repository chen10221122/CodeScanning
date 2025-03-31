import { useEffect, useMemo, useRef } from 'react';

import dayjs from 'dayjs';
import { isEmpty, cloneDeep } from 'lodash';

import { ScreenType, Options } from '@/components/screen';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';

import { getIndustryInfo } from '../api';
import { IAreaTreeItem } from '../types';

export const useGetAllIndustry = ({ setIsFirstLoading }: any) => {
  /** 上次请求的参数 */
  const requsetRef = useRef<number>(0);

  const {
    state: { selectedAreaList, areaTree },
  } = useCtx();
  /** 行业信息请求 */
  const { data, loading, run } = useRequest(getIndustryInfo, {
    manual: true,
    formatResult(res: { data: any }) {
      return res?.data;
    },
  });

  const conf: any[] = useMemo(() => {
    if (!loading && data && !isEmpty(areaTree)) {
      // 当存在数据的时候将初始 loading 态设置为false
      setIsFirstLoading(false);
      const goal = cloneDeep(selectedAreaList)?.pop();
      return screenOption.map((i) => {
        if (i.title === '国标行业') {
          return {
            title: '国标行业',
            option: {
              ellipsis: 8,
              type: ScreenType.MULTIPLE_THIRD,
              hasSelectAll: false,
              children: data,
              cascade: true,
            },
          };
        } else if (i.title === '下属辖区') {
          let optionList: IAreaTreeItem[] = [];
          if (goal?.children && goal.value !== '100000') {
            optionList = goal.children;
          } else if (goal?.value === '100000') {
            const areaOption = cloneDeep(areaTree);
            areaOption.shift();
            optionList = areaOption;
          } else {
            optionList = [];
          }
          return {
            title: '下属辖区',
            option: {
              cancelable: true,
              type: ScreenType.MULTIPLE_THIRD_AREA,
              hasSelectAll: false,
              hasAreaSelectAll: false,
              children: optionList,
              cascade: true,
            },
          };
        } else {
          return i;
        }
      });
    } else {
      return [];
    }
  }, [loading, data, areaTree, setIsFirstLoading, selectedAreaList]);

  useEffect(() => {
    if (requsetRef.current === 0) {
      run(4);
    }
  }, [run]);

  return {
    options: conf,
    loading,
  };
};

const getRecentTimeFromNow = (yearCount: number | number[]) => {
  const now: Date = new Date();
  const nowATime: string = dayjs(now).format('YYYY-MM-DD');
  const nowMonth: string = dayjs(now).format('MM-DD');
  if (Array.isArray(yearCount) && !isEmpty(yearCount)) {
    const bigNum = Math.max(...yearCount);
    const smallNum = Math.min(...yearCount);
    return [now.getFullYear() - bigNum + '-' + nowMonth, now.getFullYear() - smallNum + '-' + nowMonth];
  }
  return [now.getFullYear() - (yearCount as number) + '-' + nowMonth, nowATime];
};

export const screenOption = [
  {
    title: '下属辖区',
    option: {
      filed: 'area',
      type: ScreenType.MULTIPLE_THIRD_AREA,
      hasSelectAll: false,
      children: [],
      cancelable: true,
      cascade: true,
    },
  },
  {
    title: '国标行业',
    option: {
      filed: 'industry',
      ellipsis: 10,
      type: ScreenType.MULTIPLE_THIRD_AREA,
      hasSelectAll: false,
      children: [],
      cascade: true,
    },
  },
  {
    title: '注册资本',
    option: {
      type: ScreenType.MULTIPLE,
      formatTitle: () => '注册资本',
      children: [
        { name: '10亿及以上', value: '[1000000000,)', filed: 'amount' },
        { name: '1-10亿', value: '[100000000,1000000000)', filed: 'amount' },
        { name: '5000万-1亿', value: '[50000000,100000000)', filed: 'amount' },
        { name: '1000-5000万', value: '[10000000,50000000)', filed: 'amount' },
        { name: '1000万以下', value: '(,10000000)', filed: 'amount' },
      ],
    },
  },
  {
    title: '更多筛选',
    option: {
      type: ScreenType.MULTIPLE_TILING,
      ellipsis: 8,
      children: [
        {
          title: '企业类型',
          hasSelectAll: true,
          multiple: true,
          data: [
            { name: '国企', value: 'b', filed: 'coType' },
            { name: '央企', value: 'a', filed: 'coType' },
            { name: '沪深京上市', value: 'c', filed: 'coType' },
            { name: '香港上市', value: 'd', filed: 'coType' },
            { name: '新三板', value: 'e', filed: 'coType' },
            { name: '发债人', value: 'f', filed: 'coType' },
            { name: '城投', value: 'g', filed: 'coType' },
          ],
        },
        {
          title: '成立日期',
          cancelable: true,
          calendar: {
            filed: 'changeTime',
          },
          ranges: [
            {
              name: `3年内`,
              value: `[${getRecentTimeFromNow(3)?.[0]},${getRecentTimeFromNow(3)?.[1]}]`,
              filed: 'changeTime',
            },
            {
              name: `3-10年`,
              value: `[${getRecentTimeFromNow([3, 10])?.[0]},${getRecentTimeFromNow([3, 10])?.[1]})`,
              filed: 'changeTime',
            },
            {
              name: `10年以上`,
              value: `[,${getRecentTimeFromNow([3, 10])?.[0]})`,
              filed: 'changeTime',
            },
          ],
          customPicker: {
            // defaultValue: [dayjs().subtract(1, 'year'), dayjs()],
            disabledDate: () => false,
          },
        },
        {
          title: '公布日期',
          cancelable: true,
          calendar: {
            filed: 'reportTime',
          },
          ranges: [
            {
              name: `1年内`,
              value: `[${getRecentTimeFromNow(1)?.[0]},${getRecentTimeFromNow(1)?.[1]})`,
              filed: 'reportTime',
            },
            {
              name: `1-3年`,
              value: `[${getRecentTimeFromNow([1, 3])?.[0]},${getRecentTimeFromNow([1, 3])?.[1]})`,
              filed: 'reportTime',
            },
            {
              name: `3-5年`,
              value: `[${getRecentTimeFromNow([3, 5])?.[0]},${getRecentTimeFromNow([3, 5])?.[1]})`,
              filed: 'reportTime',
            },
          ],
          customPicker: {
            // defaultValue: [dayjs().subtract(1, 'year'), dayjs()],
            disabledDate: () => false,
          },
        },
      ],
    },
  },
] as unknown as Options[];
