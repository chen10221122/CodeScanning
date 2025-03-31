import { useEffect, useState } from 'react';

import { getSimilarEconomy } from '@/apis/area/areaEconomy';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useAsync } from '@/utils/hooks';

import { handleRawSimilarList, RawSimilarList, RenderableSimilarList } from './utils';

// getSimilarEconomy 函数签名
type getSimilarEconomyFuc = (code: string) => Promise<RawSimilarList>;

export default function useSimilar() {
  const [tableData, setTableData] = useState<RenderableSimilarList>([]);
  const { data, execute: getDataFromServer, pending, error } = useAsync<getSimilarEconomyFuc>(getSimilarEconomy);
  const {
    state: { code, topCode },
  } = useCtx();

  // 处理错误
  useEffect(() => {
    if (error) {
      setTableData([]);
    }
  }, [error]);

  // 处理列表数据: 服务器生数据 RawSimilarList -> 可渲染数据 RenderableSimilarList
  useEffect(() => {
    if (code === topCode) {
      const renderable = handleRawSimilarList(data);
      setTableData(renderable);
    }
  }, [code, data, topCode]);

  // 执行请求
  useEffect(() => {
    getDataFromServer(code);
  }, [code, getDataFromServer]);

  return { pending: Boolean(pending), data: tableData, error, getDataFromServer, code };
}
