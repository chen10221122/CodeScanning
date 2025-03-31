import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';

import { getAreaSideBarOption } from '../api';

export const useGetAreaOptions = () => {
  const { update } = useCtx();

  const { data, loading } = useRequest(getAreaSideBarOption, {
    cacheKey: 'techEnterpriseSideBarOption',
    formatResult(res: { data: any }) {
      return res?.data;
    },
    onSuccess(data) {
      update((draft) => {
        draft.areaTree = data.map((i: any) => {
          return { ...i, key: 1 };
        });
      });
    },
  });
  return { loading, data };
};
