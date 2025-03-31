import { useEffect, useMemo, useState, useRef } from 'react';

import { useBoolean } from 'ahooks';

import { Empty } from '@/components/antd';
import { NewsListProps } from '@/pages/publicOpinons/apis';
import { Skeleton } from '@/pages/publicOpinons/components';
import { SkeletonConType } from '@/pages/publicOpinons/components/skeleton';
import { Tabskey } from '@/pages/publicOpinons/config';
import { useCtx } from '@/pages/publicOpinons/context';
import useGetNewsListData from '@/pages/publicOpinons/hooks/useGetNewsListData';
import { initParams } from '@/pages/publicOpinons/modules/region/config';
import { useRegionCtx } from '@/pages/publicOpinons/modules/region/context';
import { useImmer } from '@/utils/hooks';

import NewsList from '../newsList';

interface ConditionProps {
  data: NewsListProps;
}

interface IProps {
  /** scrollableTarget 位置 */
  scrollableTarget?: string | HTMLDivElement;
  cleatCondition: () => void;
}

const ContentNewsList = ({ scrollableTarget, cleatCondition }: IProps) => {
  const {
    state: { tabType, paramStateStr, tabChangeLoading },
    update: updateRegion,
  } = useRegionCtx();
  const { state } = useCtx();
  const { searchParams } = state;

  const firstEffectRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollStatus, { setTrue: setScrollStatusTrue, setFalse: setScrollStatusFalse }] = useBoolean(false);
  const [condition, updateCondition] = useImmer<ConditionProps>({
    data: initParams,
  });

  const { data, run, loading, error } = useGetNewsListData(condition.data, true);

  useEffect(() => {
    if (tabChangeLoading) {
      setScrollStatusFalse();
    }
  }, [tabChangeLoading, setScrollStatusFalse]);

  useEffect(() => {
    if (!loading) {
      setScrollStatusFalse();
    }
  }, [loading, setScrollStatusFalse]);

  useEffect(() => {
    if (loading && !scrollStatus) {
      firstEffectRef.current = false;
      setIsLoading(true);
    }
    if (!loading && !firstEffectRef.current) {
      firstEffectRef.current = true;
      setIsLoading(false);
    }
  }, [loading, scrollStatus]);

  useEffect(() => {
    updateRegion((d) => {
      d.retry = () => run({ ...condition.data });
    });
  }, [condition.data, run, updateRegion]);

  useEffect(() => {
    updateRegion((d) => {
      d.listLoading = isLoading;
      d.listError = error;
    });
  }, [isLoading, error, updateRegion]);

  // 从context中取出筛选参数
  const filterParams = useMemo(() => {
    return state[paramStateStr];
  }, [state, paramStateStr]);

  // 从context中取出搜索参数
  const moduleSearchParams = useMemo(() => {
    return searchParams[paramStateStr];
  }, [searchParams, paramStateStr]);

  // 切换三级tab
  useEffect(() => {
    if (tabType) {
      updateCondition((d: ConditionProps) => {
        d.data = {
          ...initParams,
          ...filterParams,
          ...moduleSearchParams,
          tabType: tabType,
        };
      });
    }
  }, [filterParams, moduleSearchParams, tabType, updateCondition]);

  // 筛选参数变化
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (filterParams) {
      updateCondition((d: ConditionProps) => {
        d.data = {
          ...d.data,
          ...filterParams,
          skipParam: '',
        };
      });

      timer = setTimeout(() => {
        const wrap = document.querySelector('.ant-tabs-top') as HTMLElement;
        wrap && (wrap.scrollTop = 0);
      }, 0);
    }
    return () => timer && clearTimeout(timer);
  }, [filterParams, updateCondition]);

  return (
    <>
      {loading && !scrollStatus ? (
        <Skeleton type={SkeletonConType.LIST} wrapperStyle={{ marginTop: '14px', padding: '0px 24px' }} />
      ) : error ? (
        <Empty type={Empty.MODULE_LOAD_FAIL} onClick={() => run({ ...condition.data })} />
      ) : (
        <NewsList
          setScrollStatusTrue={setScrollStatusTrue}
          updateRequestParams={updateCondition}
          dataInfos={data}
          loading={scrollStatus}
          pageKey={Tabskey.REGION}
          keyword={moduleSearchParams?.text}
          requestParams={condition.data}
          titleWidth={704}
          scrollableTarget={scrollableTarget}
          cleatCondition={cleatCondition}
        />
      )}
    </>
  );
};

export default ContentNewsList;
