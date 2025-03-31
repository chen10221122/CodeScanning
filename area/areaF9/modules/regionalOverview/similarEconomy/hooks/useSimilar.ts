import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useRequest } from 'ahooks';

import { useParams } from '@pages/area/areaF9/hooks';

import { getSimilarEconomy } from '@/apis/area/areaEconomy';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import { useCtx } from '../context';
import { handleRawSimilarList, RenderableSimilarList } from '../utils';

export default function useSimilar() {
  const [tableData, setTableData] = useState<RenderableSimilarList>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const { code } = useParams();
  const {
    state: { params, defaultIndicatorLoading, yearLoading },
    update,
  } = useCtx();

  const {
    data,
    run: getDataFromServer,
    error,
  } = useRequest(getSimilarEconomy, {
    manual: true,
    onBefore() {
      setTableLoading(true);
    },
    onSuccess(res) {
      if (res.returncode !== 0) {
        setTableData([]);
      } else {
        // 处理列表数据: 服务器生数据 RawSimilarList -> 可渲染数据 RenderableSimilarList
        const renderable = handleRawSimilarList(data?.data);
        setTableData(renderable);
      }
    },
    onError(error) {
      setTableData([]);
    },
    onFinally() {
      setTableLoading(false);
    },
  });

  const selectedData = useSelector((store: any) => store?.user?.info, shallowEqual);

  /**初次请求loading
   * defaultIndicatorLoading 默认指标接口加载Loading
   * yearLoading 默认年份加载loading
   */
  const firstLoading = useLoading(tableLoading, defaultIndicatorLoading, Boolean(yearLoading));
  useAnchor(firstLoading);

  // 获取会员权限判断
  useEffect(() => {
    update((draft) => {
      draft.hasPay = selectedData.havePay;
    });
  }, [selectedData.havePay, update]);

  // 更新code
  useEffect(() => {
    update((draft) => {
      draft.params.code = code;
    });
  }, [code, update]);

  // 执行请求
  useEffect(() => {
    if (!defaultIndicatorLoading && !yearLoading && params.code) {
      getDataFromServer(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, getDataFromServer, defaultIndicatorLoading, yearLoading]);

  return { pending: Boolean(tableLoading), data: tableData, getDataFromServer, firstLoading, error };
}
