import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty, toNumber } from 'lodash';

import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { thousandSeparatorStringToNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';

import { getStockScale } from '../../apis';
import { useConditionCtx } from '../../context';

const stringToNumber = (num: any) => {
  let result = parseFloat(num);
  if (isNaN(result)) {
    return 0;
  }
  return toNumber(num);
};

const useLogic = () => {
  const { update } = useConditionCtx();
  const { code } = useParams<any>();
  const lastYear = dayjs().year();
  const tenYearsAgo = dayjs().subtract(9, 'year').year();
  const [data, updateData] = useImmer({
    tableData: [],
    yearData: [],
    aShareIPOData: [],
    aShareRefinanceData: [],
    newThreeIncrease: [],
    financeCount: [],
  });
  const [tableCondition, setTableCondition] = useImmer({
    startYear: tenYearsAgo,
    endYear: lastYear,
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    businessType: 'regionBoard',
  });

  useEffect(() => {
    if (code) {
      const level = getLevel(code);
      switch (level) {
        case Level.PROVINCE:
          setTableCondition((draft) => {
            draft.provinceCode = code;
          });
          break;
        case Level.CITY:
          setTableCondition((draft) => {
            draft.cityCode = code;
          });
          break;
        case Level.COUNTY:
          setTableCondition((draft) => {
            draft.countyCode = code;
          });
          break;
      }
    }
  }, [code, setTableCondition]);

  // 列表数据获取
  const { data: originalData, loading } = useRequest<any, any>(() => getStockScale(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!(tableCondition.provinceCode || tableCondition.cityCode || tableCondition.countyCode),
    onError: () => {
      updateData((draft) => {
        draft.tableData = [];
        draft.financeCount = [];
        draft.yearData = [];
        draft.aShareIPOData = [];
        draft.aShareRefinanceData = [];
        draft.newThreeIncrease = [];
      });
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.stockMarket = true;
        });
      }
    },
  });

  useEffect(() => {
    if (originalData?.data?.data) {
      const data = originalData.data.data;
      const final = data?.filter((item: any) => item.year !== '合计')?.reverse();
      const year = final.map((item: any) => item.year);
      const financeCount = final.map(
        (item: any) =>
          stringToNumber(item?.aShareIPO?.amount) +
          stringToNumber(item?.aShareRefinance?.amount) +
          stringToNumber(item?.newThreeIncrease?.amount),
      );
      const aShareIPO = final.map((item: any) =>
        thousandSeparatorStringToNumber(item?.aShareIPO?.financingAmount || ''),
      );
      const aShareRefinance = final.map((item: any) =>
        thousandSeparatorStringToNumber(item?.aShareRefinance?.financingAmount || ''),
      );
      const newThreeIncrease = final.map((item: any) =>
        thousandSeparatorStringToNumber(item?.newThreeIncrease?.financingAmount || ''),
      );
      updateData((draft) => {
        draft.tableData = final?.reverse();
        draft.financeCount = financeCount;
        draft.yearData = year;
        draft.aShareIPOData = aShareIPO;
        draft.aShareRefinanceData = aShareRefinance;
        draft.newThreeIncrease = newThreeIncrease;
      });
    }
  }, [originalData, updateData]);

  return {
    loading,
    tableData: data.tableData,
    yearData: data.yearData,
    aShareIPOData: data.aShareIPOData,
    aShareRefinanceData: data.aShareRefinanceData,
    newThreeIncrease: data.newThreeIncrease,
    financeCount: data.financeCount,
    code,
  };
};

export default useLogic;
