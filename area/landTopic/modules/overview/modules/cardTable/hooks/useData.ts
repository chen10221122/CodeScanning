import { useState, useMemo, useEffect, useRef } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import dayJs from 'dayjs';
import { isArray, cloneDeep, isEqual } from 'lodash';

import { getLandInfo } from '@pages/area/landTopic/api';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import { IncrementArea } from '@pages/area/landTopic/modules/overview/modules/cardTable';
import {
  getRowData,
  buildTree,
  sortData,
  getRegion,
} from '@pages/area/landTopic/modules/overview/modules/cardTable/utils';
import { useCtx, WHOLE_COUNTRY_CODE, AreaType } from '@pages/area/landTopic/modules/overview/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';

import { removeObjectNil, shortId } from '@/utils/share';

const useData = ({
  scrollTop,
  incrementCallBackRef,
  incrementArea,
  sort: { sortKey, sortRule },
  setIncrementArea,
}: {
  scrollTop: () => void;
  incrementCallBackRef: React.MutableRefObject<(() => void) | undefined>;
  incrementArea: IncrementArea;
  setIncrementArea: React.Dispatch<React.SetStateAction<IncrementArea>>;
  sort: { sortKey: string; sortRule: string };
}) => {
  const {
    state: {
      dateFilter,
      otherFilter,
      areaFilter,
      areaLists: { provinceCodes, areaCounty },
      areaType,
    },
    update,
  } = useCtx();
  const [expandFlag, setExpandFlag] = useState(true); // 是否有展开树
  const [isAreaChange, setIsAreaChange] = useState(true);
  const [isFilterChange, setIsFilterChange] = useState(true);
  const isIncrementReqRef = useRef(false);
  const isAllNationRef = useRef(true); // 是否是全国
  const {
    state: {
      overview: { statisticsDefault },
    },
  } = useCommonCtx();

  useEffect(() => {
    setIndicator([...statisticsDefault]);
  }, [statisticsDefault]);

  const setIsAllNation = useMemoizedFn((v) => {
    isAllNationRef.current = v;
  });

  const [indicator, setIndicator] = useState<SelectItem[]>([]);

  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);

  const params = useMemo(
    () =>
      removeObjectNil({
        ...dateFilter,
        ...otherFilter,
        ...areaFilter,
      }),
    [areaFilter, dateFilter, otherFilter],
  );

  const onNoData = useMemoizedFn(() => {
    setDataSource([]);
    update((draft) => {
      draft.topEmpty = true;
    });
  });

  /** 将差量数据放到对应的地区下 */
  const addIncrementData = useMemoizedFn((list) => {
    const addData = list?.length ? list : [{ key: shortId(), isEmpty: true }];
    const parentCode = incrementArea.parentCode || '';
    const addChild = (list: any) => {
      list.forEach((item: any) => {
        const loopCount = +item.areaLevel;
        if (item.areaCode === parentCode) {
          item.children = addData;
        } else if (
          item.areaCode.substring(0, 2 * loopCount) === parentCode.substring(0, 2 * loopCount) &&
          item?.children?.length
        ) {
          addChild(item.children);
        }
      });
    };
    const oldData = cloneDeep(dataSource);
    addChild(oldData);
    setDataSource(oldData);
    incrementCallBackRef.current?.();
  });

  const { loading, run } = useRequest(getLandInfo, {
    manual: true,
    onSuccess: ({ data: res }) => {
      const { data } = res || {};
      if (isArray(data)) {
        const results = data.reduce((pre, cur) => {
          const { parentCode, areaCode } = cur;
          let hasChild = false;
          if (isAllNationRef.current) {
            const region = getRegion(areaCounty, areaCode, 1);
            if (region?.children) {
              hasChild = true;
            }
          }
          const curNode = getRowData(cur, isAllNationRef.current && hasChild);
          if (!isAllNationRef.current || parentCode === WHOLE_COUNTRY_CODE || isIncrementReqRef.current)
            pre.push(curNode);
          else buildTree(pre, curNode);
          return pre;
        }, [] as any);
        sortData(results, sortKey, sortRule, isAllNationRef.current);
        if (isIncrementReqRef.current) {
          addIncrementData(results);
        } else {
          update((draft) => {
            const checkExist = data.find(({ areaCode }) => areaCode === draft.checkRowArea.areaCode);
            draft.topEmpty = false;
            if (!checkExist) {
              const { areaCode, areaLevel, areaName } = data[0];
              draft.checkRowArea = { areaCode, areaLevel, areaName };
            }
          });
          setDataSource(results);
          setExpandFlag(isAllNationRef.current);
        }
      } else {
        if (isIncrementReqRef.current) {
          addIncrementData([]);
        } else {
          onNoData();
        }
      }
    },
    onError: () => {
      !isIncrementReqRef.current && onNoData();
    },
    onBefore: () => {
      !isIncrementReqRef.current && scrollTop();
    },
    onFinally: () => {
      isIncrementReqRef.current = false;
      setIncrementArea({});
      update((draft) => {
        draft.firstLoading = false;
      });
      setIsAreaChange(!(areaFilter.provinceCode === provinceCodes && areaType === AreaType.WHOLE));
      setIsFilterChange(
        !isEqual(
          {
            transferDate: `[${dayJs().year()}-01-01,${dayJs().format('YYYY-MM-DD')}]`,
            statisticsScope: '1',
          },
          { ...dateFilter, ...otherFilter },
        ),
      );
    },
  });

  const onIndicatorChange = useMemoizedFn((_: SelectItem[], selectsTree: SelectItem[]) => {
    setIndicator(selectsTree[0]?.children || []);
  });

  useEffect(() => {
    const { provinceCode, cityCode, countyCode } = params;
    if (provinceCode || cityCode || countyCode) {
      run(params);
    }
  }, [params, run]);

  /** 增量请求数据 */
  useEffect(() => {
    if (incrementArea.parentCode) {
      isIncrementReqRef.current = true;
      run({ ...params, provinceCode: '', areaCode: '', cityCode: '', ...incrementArea, parentCode: '' });
    }
  }, [incrementArea, params, run]);

  return {
    loading,
    dataSource,
    indicator,
    expandFlag,
    isFilterChange,
    isAreaChange,
    setDataSource,
    onIndicatorChange,
    setIsAllNation,
  };
};

export default useData;
