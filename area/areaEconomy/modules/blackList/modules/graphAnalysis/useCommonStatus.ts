import { useEffect } from 'react';

import { useCtx, GraphCtxProps, GraphModuleName } from './context';

export { GraphModuleName } from './context';

interface CommonStatus {
  isLoadEnd: boolean;
  name: GraphModuleName;
  error?: boolean | Error;
  empty?: boolean;
}

const useCommonStatus = ({ isLoadEnd, error, name, empty }: CommonStatus) => {
  const { update } = useCtx();

  useEffect(() => {
    if (name) {
      update((d: GraphCtxProps) => {
        d[name].isLoadEnd = isLoadEnd;
        d[name].error = error;
        d[name].empty = empty;
      });
    }
  }, [isLoadEnd, error, name, update, empty]);
};

export default useCommonStatus;
