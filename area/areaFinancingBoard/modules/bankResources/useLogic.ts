import { useMemo, useState } from 'react';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { useSelector } from '@/pages/area/areaF9/context';

import { getDistributionByTypeList } from '../../apis';
import { useConditionCtx } from '../../context';

const useLogic = () => {
  const { update } = useConditionCtx();
  const { regionCode } = useSelector((store) => store.areaInfo) || {};
  const [tableData, setTableData] = useState([]);

  const tableCondition = useMemo(() => {
    if (regionCode) {
      return {
        regionCode,
      };
    }
  }, [regionCode]);

  const { loading } = useRequest(() => getDistributionByTypeList(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!regionCode,
    onSuccess: (res: any) => {
      if (res?.data) {
        setTableData(res.data);
      }
    },
    onError: () => {
      setTableData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.bankResources = true;
        });
      }
    },
  });

  return {
    loading,
    tableData,
  };
};

export default useLogic;
