import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isArray, isString } from 'lodash';

import { ScreenType } from '@/components/screen';
import { FilterEnum, customDateRangeRender } from '@/layouts/filterTableTemplate/config';

const LESSEE_TYPE_KEY = 'companyTypeCodeLessee';

const currentDay = dayjs().format('YYYY-MM-DD');
const recentWeek = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
const recentThreeMonth = dayjs().subtract(3, 'month').format('YYYY-MM-DD');
const recentYear = dayjs().subtract(1, 'year').format('YYYY-MM-DD');

const nextWeek = dayjs().add(1, 'week').format('YYYY-MM-DD');
const nextThreeMonth = dayjs().add(3, 'month').format('YYYY-MM-DD');
const nextMonth = dayjs().add(1, 'month').format('YYYY-MM-DD');
const nextYear = dayjs().add(1, 'year').format('YYYY-MM-DD');

const registrationStartDate = {
  type: FilterEnum.CommonScreen,
  options: {
    title: '全部',
    label: '登记起始日',
    key: 'startDate',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        { name: '近一周', key: 'startDate', value: `${recentWeek},${currentDay}` },
        { name: '近三个月', key: 'startDate', value: `${recentThreeMonth},${currentDay}` },
        {
          active: true,
          name: '近一年',
          key: 'startDate',
          value: `${recentYear},${currentDay}`,
        },
        customDateRangeRender({ key: 'startDate' }),
      ],
    },
    formatTitle: (row: any[]) => {
      if (row.length) {
        // 日期范围
        if (isArray(row[0].value)) {
          const val = row[0].value;
          return `${dayjs(val[0]).format('YYYY-MM-DD')}至${dayjs(val[1]).format('YYYY-MM-DD')}`;
        } else {
          return typeof row[0].value === 'object' ? `${dayjs(row[0].value).format('YYYY-MM-DD')}` : row[0].name;
        }
      }
      return '日期';
    },
    filterType: FilterEnum.Year,
    ellipsis: 30,
  },
};
const registrationEndDate = {
  type: FilterEnum.CommonScreen,
  options: {
    title: '全部',
    label: '登记到期日',
    key: 'endDate',
    option: {
      formatTitle: (row: any[]) => {
        if (row.length) {
          // 日期范围
          if (isArray(row[0].value)) {
            const val = row[0].value;
            return `${dayjs(val[0]).format('YYYY-MM-DD')}至${dayjs(val[1]).format('YYYY-MM-DD')}`;
          } else {
            return typeof row[0].value === 'object' ? `${dayjs(row[0].value).format('YYYY-MM-DD')}` : row[0].name;
          }
        }
        return '全部';
      },
      type: ScreenType.SINGLE,
      cancelable: true,
      children: [
        { name: '已到期', key: 'endDate', value: `1900-01-01,${currentDay}` },
        { name: '一周内到期', key: 'endDate', value: `${currentDay},${nextWeek}` },
        { name: '一月内到期', key: 'endDate', value: `${currentDay},${nextMonth}` },
        { name: '三月内到期', key: 'endDate', value: `${currentDay},${nextThreeMonth}` },
        { name: '一年内到期', key: 'endDate', value: `${currentDay},${nextYear}` },
        { name: '未到期', key: 'endDate', value: `${currentDay},9999-12-31` },
        customDateRangeRender({ key: 'endDate' }),
      ],
    },
  },
};

/** 承租人分类 */
export const lesseeType = {
  type: FilterEnum.CommonScreen,
  options: {
    title: '承租人分类',
    label: '',
    key: LESSEE_TYPE_KEY,
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        { name: '央企', value: '1' },
        { name: '央企子公司', value: '14' },
        { name: '国企', value: '2' },
        { name: '民企', value: '8' },
        { name: '城投', value: '6' },
        { name: '城投子公司', value: '9' },
        { name: '上市', value: '3,4,7,15,16,17,18' },
        { name: '发债', value: '5' },
        { name: '高新技术企业', value: '10' },
        { name: '科技型中小企业', value: '11' },
        { name: '创新型中小企业', value: '19' },
        { name: '专精特新“小巨人”', value: '12' },
        { name: '专精特新中小企业', value: '13' },
      ].map((o) => ({ ...o, key: LESSEE_TYPE_KEY })),
    },
  },
};
export default function useScreen(setCondition: any) {
  // 筛选配置
  const screenConfig = useMemo(() => {
    return [registrationStartDate, registrationEndDate, lesseeType];
  }, []);
  /** 统计列表筛选变化逻辑 */
  const handleMenuChange = useMemoizedFn((changeType: FilterEnum, allData: Record<string, any>[], options: any) => {
    switch (changeType) {
      case FilterEnum.CommonScreen: {
        const key = options?.key;
        if (!allData.length) {
          switch (key) {
            case 'companyTypeCodeLessee':
              setCondition((d: any) => {
                d.companyTypeCodeLessee = '';
              });
              break;
            case 'endDate':
              setCondition((d: any) => {
                d.endDateFrom = '';
                d.endDateTo = '';
              });
          }
          return;
        }
        switch (key) {
          case 'companyTypeCodeLessee':
            setCondition((d: any) => {
              d.companyTypeCodeLessee = allData.map((o) => o.value).join(',');
            });
            break;
          case 'startDate':
            setCondition((d: any) => {
              const v = allData[0].value;
              if (isString(v)) {
                const arr = v?.split(',');
                if (arr.length) {
                  d.startDateFrom = arr[0];
                  d.startDateTo = arr[1];
                }
              } else if (isArray(v)) {
                d.startDateFrom = dayjs(v[0]).format('YYYY-MM-DD');
                d.startDateTo = dayjs(v[1]).format('YYYY-MM-DD');
              }
            });
            break;
          case 'endDate':
            setCondition((d: any) => {
              const v = allData[0].value;
              if (isString(v)) {
                const arr = v?.split(',');
                if (arr.length) {
                  d.endDateFrom = arr[0];
                  d.endDateTo = arr[1];
                }
              } else if (isArray(v)) {
                d.endDateFrom = dayjs(v[0]).format('YYYY-MM-DD');
                d.endDateTo = dayjs(v[1]).format('YYYY-MM-DD');
              }
            });
            break;
        }
        setCondition((d: any) => {
          d.sortKey = 'startDate';
          d.sortType = 'desc';
        });
        break;
      }
    }
  });

  return {
    screenConfig,
    handleMenuChange,
  };
}
