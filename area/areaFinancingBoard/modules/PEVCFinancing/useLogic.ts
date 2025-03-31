import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { thousandSeparatorStringToNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';

import { getPevcEventStatistic } from '../../apis';
import { useConditionCtx } from '../../context';

const useLogic = () => {
  const { update } = useConditionCtx();
  const { code } = useParams<any>();
  const [tableData, setTableData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  const [eventData, setEventData] = useState<any[]>([]);
  const [amountData, setAmountData] = useState<any[]>([]);
  const [tableCondition, setTableCondition] = useImmer({
    regionCode: '',
  });

  useEffect(() => {
    if (code) {
      setTableCondition((draft) => {
        draft.regionCode = code;
      });
    }
  }, [code, setTableCondition]);

  // 列表数据获取
  const { loading } = useRequest(() => getPevcEventStatistic(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!tableCondition.regionCode,
    onSuccess: (res: any) => {
      if (res?.data) {
        const final = res.data;
        setTableData(final);
        const reverseFinale = final?.reverse();
        const year = reverseFinale?.map((item: any) => item?.year);
        const event = reverseFinale?.map((item: any) => thousandSeparatorStringToNumber(item?.pevcEvent));
        const amount = reverseFinale?.map((item: any) => thousandSeparatorStringToNumber(item?.pevcAmount));
        setYearData(year);
        setEventData(event);
        setAmountData(amount);
      }
    },
    onError: () => {
      setTableData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.pevcFinancing = true;
        });
      }
    },
  });

  const handleOpenModal = useMemoizedFn((args) => {});

  const handleMenuChange = useMemoizedFn(() => {});

  return {
    loading,
    onChange: handleMenuChange,
    handleOpenModal,
    tableData,
    yearData,
    eventData,
    amountData,
    code,
  };
};

export default useLogic;
