import { FC, useEffect, useState } from 'react';

import ChartContainer from '@/pages/area/areaEconomy/modules/blackList/component/chart';
import GraphCardContainer from '@/pages/area/areaEconomy/modules/blackList/component/graphCardContainer';
import TableList from '@/pages/area/areaEconomy/modules/blackList/component/tableList';
import { useCtx } from '@/pages/area/areaEconomy/modules/blackList/context';
import { useGetGraphData } from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetGraphData';
import { useImmer } from '@/utils/hooks';

import useCommonStatus, { GraphModuleName } from '../useCommonStatus';

const defaultParams = {
  statisticType: 5,
  sort: '_key',
  order: 'asc',
};

const StatusGraph: FC<any> = () => {
  const {
    state: { searchParams, activeTab },
  } = useCtx();

  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultParams);
  const [xAxisData, setXAisData] = useState<string[]>([]);
  const [chartData, setChartData] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const { data, loading, isLoadEnd, error, run, noData } = useGetGraphData(condition, activeTab);

  // 状态存到ctx中
  useCommonStatus({ name: GraphModuleName.Status, isLoadEnd, error });

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

  useEffect(() => {
    const xAxisData: string[] = [];
    const chartData: string[] = [];
    const tableData: Record<string, any>[] = [];
    if (data && data.length) {
      data.forEach((item: any) => {
        // 有值且大于0
        if (item?.num?.value) {
          // chart图展示的数据
          xAxisData.push(item?.title);
          chartData.push(item?.proportion);
          // 表格展示数据
          tableData.push({
            ...item,
            originCount: item?.count,
          });
        }
      });
    }
    setXAisData(xAxisData);
    setChartData(chartData);
    setTableData(tableData);
  }, [data]);

  return (
    <GraphCardContainer
      header="经营状态"
      style={{ padding: '0 0 40px 24px', flex: 1, minWidth: '374px' }}
      loading={loading}
      error={error}
      retry={() => run(condition)}
      noData={noData}
    >
      <div style={{ height: '224px', marginBottom: '12px' }}>
        <ChartContainer type="durationAndStatusGraph" chartDataInfo={{ xAxisData, data: chartData }} />
      </div>
      <TableList title="经营状态" dataSource={tableData} />
    </GraphCardContainer>
  );
};

export default StatusGraph;
