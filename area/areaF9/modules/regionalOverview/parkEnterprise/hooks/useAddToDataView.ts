import { useMemoizedFn } from 'ahooks';

import { getParkList } from '@/apis/area/parkEnterprise';
import { LINK_ENTERPRISE_DATA_VIEW } from '@/configs/routerMap';
import { useOpenDataView } from '@/models/transmission';
import useRequest from '@/utils/ahooks/useRequest';

export default function useHandleDetailModal<T>(condition: T) {
  const openDataView = useOpenDataView();

  const { run: handleRequest1wData, loading } = useRequest(getParkList, {
    manual: true,
    onSuccess: ({ data }) => {
      openDataView(LINK_ENTERPRISE_DATA_VIEW, {
        indicators: [],
        rows: data?.infoBeans?.map((d: { itCode2: string; companyName: string }) => ({
          key: d.itCode2,
          type: 'company',
          name: d.companyName,
        })),
      });
    },
  });

  /** 添加至数据浏览器 */
  const handleAddToEnterpriseDataView = useMemoizedFn(() => {
    handleRequest1wData({ ...condition, from: 0, page: 1, size: 10000, browser: true });
  });

  return { handleAddToEnterpriseDataView, loading };
}
