import { useState, useMemo, useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayJs from 'dayjs';
import { isEqual, isArray } from 'lodash';

import { getProtocol, getLandDetail } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';

import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/provider';
import { useCtx as useCommonCtx } from '@/pages/area/areaF9/modules/regionalLand/provider';
import { removeObjectNil, shortId } from '@/utils/share';
interface Props {
  scrollTop: () => void;
  areaCodeObj: { [x: string]: string | undefined };
  pageType: string;
}

const useData = ({ scrollTop, areaCodeObj, pageType }: Props) => {
  const getInterface = pageType === '2' ? getProtocol : getLandDetail;
  const {
    state: { currentPage, sortKey, sortRule, keyword, dateFilter, statisticsScope, otherFilter, holdRatio },
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
        ...areaCodeObj,
        ...dateFilter,
        ...otherFilter,
        statisticsScope,
        holdRatio,
        sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
        keyword,
        size: 50,
        from: 50 * (currentPage - 1),
      }),
    [areaCodeObj, dateFilter, otherFilter, statisticsScope, holdRatio, sortKey, sortRule, keyword, currentPage],
  );

  const isFilterChange = useMemo(() => {
    const comparisonFilter =
      pageType === '2'
        ? {
            dealDate: `[${dayJs().year()}-01-01,${dayJs().endOf('year').format('YYYY-MM-DD')}]`,
            holdRatio: '3',
            keyword: '',
          }
        : {
            transferDate: `[${dayJs().year()}-01-01,${dayJs().endOf('year').format('YYYY-MM-DD')}]`,
            holdRatio: '3',
            keyword: '',
          };
    return !isEqual(comparisonFilter, { ...dateFilter, ...otherFilter, holdRatio, keyword });
  }, [pageType, dateFilter, otherFilter, holdRatio, keyword]);

  const { run } = useRequest(getInterface, {
    manual: true,
    debounceWait: 30,
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
  const onIndicatorChange = useMemoizedFn((selects: SelectItem[]) => {
    setIndicator(selects);
  });
  useEffect(() => {
    if (params.contractSignDate || params.dealDate || params.transferDate) {
      run(params);
    }
  }, [params, run]);

  return { dataSource, isFilterChange, indicator, onIndicatorChange, params };
};

export default useData;
