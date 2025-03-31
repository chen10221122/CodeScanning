import { useRequest } from 'ahooks';
import { isFunction } from 'lodash';

import { getPrivateFilter } from '@/pages/area/areaCompany/api/screenApi';

interface UseGetFilterProps {
  onBefore?: Function;
  onSuccess?: Function;
  onError?: Function;
}

const useGetFilter = ({ onBefore, onSuccess, onError }: UseGetFilterProps) => {
  return useRequest(getPrivateFilter, {
    manual: true,
    onBefore() {
      isFunction(onBefore) && onBefore();
    },
    onSuccess(res: Record<string, any>) {
      isFunction(onSuccess) && onSuccess(res);
    },
    onError() {
      isFunction(onError) && onError();
    },
  });
};

export default useGetFilter;
