import { FC, memo, useEffect, useMemo } from 'react';

import { useImmer } from '@dzh/utils';
import { useRequest } from 'ahooks';

import { useSelector } from '@/pages/area/areaF9/context';
import {
  getPlanList,
  ProductListProp,
  SourceListProp,
} from '@/pages/area/areaF9/modules/regionalOverview/industryPlaning/api';
import { useLoading } from '@/utils/hooks';

import Content from './components/content';
import Layout from './components/layout';
import Source from './components/source';

const IndustryPlaning: FC = () => {
  const [tableAndSourceData, updateTASData] = useImmer<{
    tableData: ProductListProp[];
    sourceData: SourceListProp[];
    error: boolean;
  }>({
    tableData: [],
    sourceData: [],
    error: false,
  });

  const { areaInfo } = useSelector((s) => ({ areaInfo: s.areaInfo }));

  const { run: getList, loading } = useRequest(getPlanList, {
    manual: true,
    onSuccess(res) {
      if (res && res.data) {
        const response = res.data;
        updateTASData((d) => {
          d.tableData = response.industryProductList.map((item, idx) => ({
            idx: idx + 1,
            ...item,
          }));
          d.sourceData = response.industrySourceList;
        });
      } else {
        updateTASData((d) => {
          d.error = true;
        });
      }
    },
    onError() {
      updateTASData((d) => {
        d.error = true;
      });
    },
  });
  const params = useMemo(() => ({ regionCode: areaInfo?.regionCode || '' }), [areaInfo?.regionCode]);

  const leftTableNode = useMemo(
    () => <Content data={tableAndSourceData.tableData} params={params} regionName={areaInfo?.regionName || ''} />,
    [tableAndSourceData.tableData, params, areaInfo?.regionName],
  );
  const rightSourceNode = useMemo(
    () => <Source data={tableAndSourceData.sourceData} />,
    [tableAndSourceData.sourceData],
  );

  const isLoading = useLoading(loading);

  useEffect(() => {
    if (params?.regionCode) {
      getList(params);
    }
  }, [params, getList]);

  return (
    <Layout
      loading={isLoading}
      error={tableAndSourceData.error}
      startWidth={280}
      maxWidth={550}
      leftNode={leftTableNode}
      rightNode={rightSourceNode}
    />
  );
};

export default memo(IndustryPlaning);
