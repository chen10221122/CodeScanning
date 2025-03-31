import { FC, useEffect, useMemo } from 'react';

import ChartContainer from '@/pages/area/areaEconomy/modules/blackList/component/chart';
import GraphCardContainer from '@/pages/area/areaEconomy/modules/blackList/component/graphCardContainer';
import { useCtx } from '@/pages/area/areaEconomy/modules/blackList/context';
import { useGetGraphData } from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetGraphData';
import { useImmer } from '@/utils/hooks';

import useCommonStatus, { GraphModuleName } from '../useCommonStatus';

const defaultParams = {
  statisticType: 2,
  sort: '_key',
  order: 'asc',
};

const YearGraph: FC<any> = () => {
  const {
    state: { searchParams, activeTab },
  } = useCtx();

  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultParams);

  const { data, isLoadEnd, error, run, noData } = useGetGraphData(condition, activeTab);

  // 状态存到ctx中
  useCommonStatus({ name: GraphModuleName.Year, isLoadEnd, error, empty: noData });

  useEffect(() => {
    if (searchParams) {
      updateCondition((d: Record<string, any>) => {
        d = {
          ...defaultParams,
          ...searchParams,
        };
        return d;
      });
    }
  }, [searchParams, updateCondition]);

  const chartDataInfo = useMemo(() => {
    const xAxisData: string[] = [];
    const chartData: string[] = [];
    if (data && data.length) {
      data.forEach((item: any) => {
        xAxisData.push(item.title || '');
        chartData.push(item?.num?.value);
      });
    }
    return {
      xAxisData,
      data: chartData,
    };
  }, [data]);

  return (
    <GraphCardContainer
      header="年份分布"
      hasIcon={true}
      style={{ padding: '0 0 16px 20px', flex: 4 }}
      error={error}
      retry={() => run(condition)}
      noData={noData}
    >
      <div style={{ height: '280px' }}>
        <ChartContainer type="yearGraph" chartDataInfo={chartDataInfo} />
      </div>
    </GraphCardContainer>
  );
};

export default YearGraph;
