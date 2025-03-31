import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { useImmer } from '@/utils/hooks';

import { getPevcTrack } from '../../apis';
import { useConditionCtx } from '../../context';
import { TabType } from './useTab';

const typeConfig = {
  event: 1,
  financing: 2,
};

const useLogic = (type: TabType) => {
  const { update } = useConditionCtx();
  const { code } = useParams<any>();
  const [year, setYear] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableCondition, setTableCondition] = useImmer({
    regionCode: '',
    type: 0,
  });

  useEffect(() => {
    if (code) {
      setTableCondition((draft) => {
        draft.regionCode = code;
      });
    }
  }, [code, setTableCondition]);

  useEffect(() => {
    if (type) {
      setTableCondition((draft) => {
        draft.type = typeConfig[type];
      });
    }
  }, [type, setTableCondition]);

  // 列表数据获取
  const { loading } = useRequest(() => getPevcTrack(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!tableCondition.regionCode,
    onSuccess: (res: any) => {
      if (res?.data) {
        setYear(res.data?.year || []);
        const finalData = res.data?.data?.map((item: any, index: number) => ({ rank: `TOP${index + 1}`, ...item }));
        setTableData(finalData || []);
      }
    },
    onError: () => {
      setTableData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.pevcTop = true;
        });
      }
    },
  });

  return {
    loading,
    tableData,
    year,
  };
};

export default useLogic;
