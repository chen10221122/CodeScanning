import { useState, useMemo, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayJs from 'dayjs';
import { isEqual, isArray } from 'lodash';

import { getProtocol } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import { useCtx } from '@pages/area/landTopic/modules/agreementTransfer/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';

import { removeObjectNil, shortId } from '@/utils/share';

const useData = (scrollTop: () => void) => {
  const {
    state: { currentPage, sortKey, sortRule, keyword, dateFilter, otherFilter, holdRatio, firstLoading },
    update,
  } = useCtx();
  const {
    state: {
      agreementTransfer: { detailDefault },
    },
  } = useCommonCtx();

  const [indicator, setIndicator] = useState<SelectItem[]>([]);

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    setIndicator([...detailDefault]);
  }, [detailDefault]);

  useEffect(() => {
    const titles: string[] = ['宗地编号'];
    const getIndicator = (list: any[]) => {
      list.forEach(({ tableTitle, children, dataIndex }) => {
        if (children?.length) getIndicator(children);
        else {
          if (dataIndex === 'enterpriseInfo') {
            ['关联企业', '关联上市主体', '关联城投', '关联房企', '关联央企', '关联国企', '关联民企'].forEach((item) => {
              titles.push(item);
            });
          } else {
            titles.push(tableTitle);
          }
        }
      });
    };
    getIndicator(indicator);
    update((draft) => {
      draft.headInfo = titles;
    });
  }, [indicator, update]);

  const params = useMemo(
    () =>
      removeObjectNil({
        ...dateFilter,
        ...otherFilter,
        holdRatio,
        sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
        keyword,
        size: 50,
        from: 50 * (currentPage - 1),
      }),
    [dateFilter, otherFilter, holdRatio, sortKey, sortRule, keyword, currentPage],
  );

  const isFilterChange = useMemo(
    () =>
      !isEqual(
        {
          dealDate: `[${dayJs().year()}-01-01,${dayJs().format('YYYY-MM-DD')}]`,
          statisticsScope: '1',
          holdRatio: '3',
          keyword: '',
        },
        { ...dateFilter, ...otherFilter, keyword, holdRatio },
      ),
    [dateFilter, otherFilter, keyword, holdRatio],
  );

  const { loading, run } = useRequest(getProtocol, {
    manual: true,
    debounceWait: 30,
    onSuccess: ({ data: res }) => {
      const { data, total } = res || {};
      if (isArray(data)) {
        setDataSource(data.map((item) => ({ ...item, key: shortId() })));
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
    },
    onFinally: () => {
      if (firstLoading) {
        update((draft) => {
          draft.firstLoading = false;
        });
      }
    },
  });

  const onIndicatorChange = useMemoizedFn((selects: SelectItem[]) => {
    setIndicator(selects);
  });

  useEffect(() => {
    if (params.contractSignDate || params.dealDate) {
      run(params);
    }
  }, [params, run]);

  return { loading, dataSource, isFilterChange, indicator, onIndicatorChange };
};

export default useData;
