import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { Options } from '@/components/screen';
import useGetFilter from '@/pages/area/areaCompany/module/privateEnterprises/filter/useGetFilter';
import { useImmer } from '@/utils/hooks';

import { registeredCapital, dateOfEstablishment, getDropScreenConfig } from './config';

const defaultLabelConfig = getDropScreenConfig({ title: '连续状态', config: [], key: '' });
const defaultRegStatusConfig = getDropScreenConfig({ title: '连续状态', config: [], key: '' });

const useFilter = (skipYear?: boolean) => {
  const [filterStatus, updateFilterStatus] = useImmer({
    loading: true,
    error: false,
  });
  // 最新年份没有连续状态筛选
  const [filterMenu, updateFilterConfig] = useImmer<Options[]>([
    defaultLabelConfig,
    registeredCapital,
    defaultRegStatusConfig,
    dateOfEstablishment,
  ]);
  const [years, setYears] = useState<Record<string, any>[]>([]);

  const onBefore = useMemoizedFn(() => {
    updateFilterStatus((d) => {
      d.loading = true;
      d.error = false;
    });
  });
  const onSuccess = useMemoizedFn((res: Record<string, any>) => {
    if (res && res.data) {
      res.data.forEach((item: Record<string, any>) => {
        switch (item.name) {
          case '连续状态':
            updateFilterConfig((d) => {
              d[0] = getDropScreenConfig({
                title: '连续状态',
                config: item.children,
                key: item.value,
              });
            });
            break;
          case '登记状态':
            updateFilterConfig((d) => {
              d[2] = getDropScreenConfig({
                title: '登记状态',
                config: item.children,
                key: item.value,
              });
            });
            break;
          case '榜单年份':
            if (!skipYear) setYears(item.children);
            break;
        }
      });
      updateFilterConfig((d) => {
        d[1] = registeredCapital;
        d[3] = dateOfEstablishment;
      });
    }
    updateFilterStatus((d) => {
      d.loading = false;
    });
  });
  const onError = useMemoizedFn(() => {
    updateFilterStatus((d) => {
      d.loading = false;
      d.error = true;
    });
  });
  /** 筛选请求 */
  const { run: getFilter } = useGetFilter({
    onBefore,
    onSuccess,
    onError,
  });

  return {
    filterStatus,
    filterMenu,
    years,
    getFilter,
    setYears,
  };
};

export default useFilter;
