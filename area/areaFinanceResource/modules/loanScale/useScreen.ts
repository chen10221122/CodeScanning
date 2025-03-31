import { useState, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';

import { ScreenType, Options } from '@/components/screen';
import { useConditionCtx } from '@/pages/area/areaFinanceResource/components/layout/context';
import { CommonResponse } from '@/utils/utility-types';

import { getFilterYear, getScaleModalList } from '../../api';

const map = new Map<string, string>([
  ['province', 'provinceCode'],
  ['city', 'cityCode'],
  ['county', 'countyCode'],
]);

export default function useScreen() {
  const {
    state: { reginLevel, condition, ready },
    update,
  } = useConditionCtx();
  const [options, setOptions] = useState<Options[]>([]);
  const [value, setValue] = useState<any>([undefined, ['province']]);
  const [areaValue, setAreaValue] = useState<any>(['province', undefined]);
  useEffect(() => {
    update((d) => {
      d.isOpenSource = false;
      d.modalRequestApi = getScaleModalList;
      d.modalExport = 'regionalDepositAndLoanScale_Detail';
      d.tableExport = 'regionalDepositAndLoanScale';
      d.exportName = `区域存贷款规模-${dayjs().format('YYYY.MM.DD')}`;
    });
  }, [update]);

  const handleScreen = useMemoizedFn((cur, total, index) => {
    setValue((d: any) => {
      const copy = [...d];
      copy[index] = [cur[0]?.value];
      return copy;
    });
    // 创建一个空对象来存储不同key对应的值数组
    const keyValues: any = {};

    // 遍历对象数组，将相同key的value值添加到对应的值数组中
    cur.forEach((obj: any) => {
      if (!keyValues[obj.key]) {
        keyValues[obj.key] = []; // 初始化值数组
      }
      keyValues[obj.key].push(obj.realValue ?? obj.value);
    });

    // 创建一个新对象来存储拼接后的值
    const result: any = {};

    // 遍历keyValues对象，将每个值数组用逗号拼接起来，并存储到新对象中
    for (const key in keyValues) {
      result[key] = keyValues[key].join(',');
    }

    if (!cur[0]) {
      update((d) => {
        d.condition.provinceCode = '';
        d.condition.cityCode = '';
        d.condition.countyCode = '';
        d.tableLoading = true;
      });
    } else if (cur[0]?.key !== 'year') {
      // 选择的是区域口径而不是详细地区的话 则只更新reginLevel，表格的请求参数更新通过年份api操作
      if (cur[0].key === 'regionLevel') {
        update((d) => {
          d.reginLevel = cur[0].value;
          d.tableLoading = true;
          d.condition.provinceCode = '';
          d.condition.cityCode = '';
          d.condition.countyCode = '';
        });
        setAreaValue([cur[0].value]);
      } else {
        update((d) => {
          const key = map.get(reginLevel) || '';
          d.condition[key] = result[key];
          d.tableLoading = true;
        });
      }
    } else {
      update((d) => {
        d.condition = {
          ...condition,
          year: cur[0].value,
          skip: 0,
        };
        d.tableLoading = true;
      });
    }
    if (document.getElementById('areaFinancingWrapper')) {
      (document.getElementById('areaFinancingWrapper') as HTMLElement).scrollTop = 0;
    }
  });

  useRequest(getFilterYear, {
    refreshDeps: [reginLevel],
    defaultParams: [reginLevel],
    onSuccess: (data: CommonResponse<any[]>) => {
      if (data?.data[0]) {
        update((d) => {
          d.condition = {
            ...condition,
            year: value[0] ? `${value[0][0]}` : data.data[0].endDate,
            regionLevel: reginLevel,
            skip: 0,
          };
          d.endYear = data.data[0].endDate;
          if (!ready) {
            d.ready = true;
          }
        });
        setValue((d: any) => {
          const copy = [...d];
          copy[0] = value[0] ?? [`${data.data[0].endDate}`];
          return copy;
        });
        setOptions([
          {
            title: '年度',
            option: {
              type: ScreenType.SINGLE,
              cancelable: false,
              children: data.data.map((item: any, index) => ({
                name: `${item.endDate}`,
                value: `${item.endDate}`,
                key: 'year',
              })),
            },
          },
        ]);
      }
    },
    onError: () => {
      setOptions([]);
      setValue([undefined, undefined]);
    },
  });

  return {
    areaValue,
    options,
    value,
    handleScreen,
  };
}
