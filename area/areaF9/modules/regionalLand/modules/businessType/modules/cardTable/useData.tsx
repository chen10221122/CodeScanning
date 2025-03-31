import { useState, useMemo, useEffect } from 'react';

import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isEqual, isArray } from 'lodash';

import { getLandAnnualSales } from '@pages/area/landTopic/api';

import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/provider';
import { shortId, removeObjectNil } from '@/utils/share';
interface Props {
  scrollTop: () => void;
  areaCodeObj: { [x: string]: string | undefined };
}

const useData = ({ scrollTop, areaCodeObj }: Props) => {
  const {
    state: { currentPage, sortKey, sortRule, dateFilter, otherFilter },
    update,
  } = useCtx();

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const date: string = Object.keys(dateFilter)[0] || 'dealDate';
  const params = useMemo(
    () =>
      removeObjectNil({
        ...areaCodeObj,
        [date]: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
        ...otherFilter,
        statisticsScope: '1',
        sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
        size: 50,
        from: 50 * (currentPage - 1),
      }),
    [areaCodeObj, date, otherFilter, sortKey, sortRule, currentPage],
  );

  const isFilterChange = useMemo(
    () =>
      !isEqual(
        {
          dealDate: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
          timeStatisticsType: 'y',
        },
        { ...dateFilter, ...otherFilter },
      ),
    [dateFilter, otherFilter],
  );

  const { run } = useRequest(getLandAnnualSales, {
    manual: true,
    onSuccess: ({ data: res }) => {
      const { data, total } = res || {};
      if (isArray(data)) {
        setDataSource(data.map((item) => ({ ...item, key: shortId() })));
        /**解决双滚动条 */
        window.dispatchEvent(new Event('resize'));
        update((draft) => {
          draft.total = total;
        });
      } else {
        setDataSource([]);
        update((draft) => {
          draft.total = 0;
        });
      }
    },
    onError: () => {
      setDataSource([]);
      update((draft) => {
        draft.total = 0;
      });
    },
    onBefore: () => {
      scrollTop();
      update((draft) => {
        draft.loading = true;
      });
    },
    onFinally: () => {
      update((draft) => {
        draft.loading = false;
      });
    },
  });
  useEffect(() => {
    const { contractSignDate, dealDate, timeStatisticsType } = params;
    if (timeStatisticsType && (contractSignDate || dealDate)) {
      run(params);
    }
  }, [params, run]);

  return { dataSource, isFilterChange };
};

export default useData;
