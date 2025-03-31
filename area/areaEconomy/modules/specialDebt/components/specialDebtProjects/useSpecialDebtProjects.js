import { useEffect, useState, useRef, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getSpecialDebt } from '@/apis/area/areaEconomy';
import { ScreenType } from '@/components/screen';
import { isCounty, isCity, isProvince } from '@/pages/area/areaEconomy/common/index';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { useAsync } from '@/utils/hooks';

const defaultYearName = '最新';
const yearsData = Array.from({ length: new Date().getFullYear() - 2017 + 1 })
  .map((_, index) => ({
    name: parseInt(2017 + index) + '',
    value: 2017 + index,
  }))
  .reverse();

yearsData.unshift({ name: defaultYearName, value: '-', active: true });

const menuConfig = [
  {
    title: defaultYearName,
    option: {
      type: ScreenType.SINGLE,
      children: yearsData,
    },
  },
];

export const CONTAINS = '1'; // 含下属辖区
export const SELFS = '0'; // 本级

export default function useSpecialDebtProjects({ setSearchType }) {
  const {
    state: { code },
    update,
  } = useCtx();
  const requestRef = useRef();
  const [condition, setCondition] = useState({
    regionCode: code,
    year: '',
    executiveLevel: isCounty(code) ? '3' : '',
  });

  const [tableData, setTableData] = useState([]);
  const { data, execute, pending, error } = useAsync(getSpecialDebt);

  const menuChange = useMemoizedFn((list) => {
    let year = list?.length ? list[0].value : '-';
    update((d) => Object.assign(d, { selectedYear: year }));
    setCondition((originState) => {
      return { ...originState, year: year === '-' ? '' : year };
    });
    setSearchType('screenType');
  });

  const handleRadioChange = useMemoizedFn((e) => {
    const { value } = e.target;
    update((d) => Object.assign(d, { level: value }));
    // executiveLevel：1-省级本级、2-市级本级、3-区县级本级 （直辖市本级传 1，直辖市的区县本级传 3）、不传-含下属辖区。
    const executiveLevel = value === '1' ? '' : isProvince(code) ? '1' : isCity(code) ? '2' : isCounty(code) ? '3' : '';
    setCondition((originState) => {
      return { ...originState, executiveLevel };
    });
    setSearchType('screenType');
  });

  // 判断是否是区县
  const isCodeCounty = useMemo(() => {
    return isCounty(code);
  }, [code]);

  const resetChange = useMemoizedFn(() => {
    handleRadioChange({
      target: {
        value: isCodeCounty ? SELFS : CONTAINS,
      },
    });
    menuChange([{ name: '最新', value: '-', active: true }]);
  });

  useEffect(() => {
    if (error) {
      setTableData([]);
    }
  }, [error]);

  useEffect(() => {
    if (code) {
      if (data?.length) {
        const totalAmount = data.reduce((res, item) => {
          res = res + item.totalAmount;
          return res;
        }, 0);
        setTableData(
          data.map((o) => {
            o.key = o.key.indexOf('_') > -1 ? o.key.split('_')[1] : o.key;
            const rate = o.totalAmount ? parseFloat((o.totalAmount * 100) / totalAmount) : '-';
            o.rate = rate === '0.00' ? '0.01' : rate;
            return o;
          }),
        );
      } else {
        setTableData([]);
      }
    } else {
      // 金门县特殊处理，没有topCode
      setTableData([]);
    }
  }, [code, data]);

  useEffect(() => {
    if (condition && JSON.stringify(requestRef.current) !== JSON.stringify(condition)) {
      execute({ ...condition });
      requestRef.current = condition;
    }
  }, [condition, execute]);

  useEffect(() => {
    if (code) {
      setCondition({
        regionCode: code,
        year: '',
        executiveLevel: isCounty(code) ? '3' : '',
      });
      update((d) => Object.assign(d, { selectedYear: '' }));
    }
  }, [code, update]);

  return { pending, condition, tableData, menuConfig, menuChange, handleRadioChange, execute, error, resetChange };
}
