import { useMemoizedFn, useRequest } from 'ahooks';

import { LINK_FINANCE_DATA_VIEW } from '@/configs/routerMap';
import { useOpenDataView } from '@/models/transmission';

import { getBondAndInsureFinancialResourceList } from '../api';

interface Props {
  /** 外部表格接口初始化请求参数 */
  tableParamsData: Record<string, any>;
}

export default function useAddToDataView({ tableParamsData }: Props) {
  const openDataView = useOpenDataView();

  const { run: handleRequest1wData } = useRequest<any, any>(getBondAndInsureFinancialResourceList, {
    manual: true,
    onSuccess: ({ data }) => {
      openDataView(LINK_FINANCE_DATA_VIEW, {
        indicators: [],
        rows: data?.data?.map((d: Record<string, any>) => ({
          key: d?.enterpriseInfo?.itCode,
          type: 'company',
          name: d?.enterpriseInfo?.itName,
        })),
      });
    },
  });

  /** 添加至数据浏览器 */
  const handleAddToEnterpriseDataView = useMemoizedFn(() => {
    handleRequest1wData({ ...tableParamsData, skip: 0 });
  });

  return { handleAddToEnterpriseDataView };
}
