import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { Options, RowItem } from '@/components/screen';
import { getLevel } from '@/pages/area/areaEconomy/common';
import { Level } from '@/pages/area/areaEconomy/config';
import { useImmer } from '@/utils/hooks';

import { getScaleList, getYearConfig } from '../../apis';
import { useConditionCtx } from '../../context';
import useMenu from './useMenu';

const provinceConfig = [
  '总资产',
  '总负债',
  '贷款余额-本外币',
  '存款余额-本外币',
  '贷款余额-人民币',
  '存款余额-人民币',
  '不良贷款余额',
];

const regionConfig = ['贷款余额-本外币', '存款余额-本外币', '贷款余额-人民币', '存款余额-人民币'];

const useLogic = () => {
  const [firstLoaded, setFirstLoaded] = useState(false);
  const { update } = useConditionCtx();
  const { code } = useParams<any>();
  const [lastYear, setLastYear] = useState('');
  const [menuConfig, setMenuConfig] = useState({
    reportPeriod: [],
  });
  const [isProvince, setIsProvince] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableCondition, setTableCondition] = useImmer({
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    year: '',
  });
  const [yearCondition, setYearCondition] = useImmer({
    regionCode: '',
  });

  // 筛选选中的值
  const [selected, setSelected] = useImmer<Record<string, string[]>>({
    reportPeriod: [`${lastYear}`],
  });

  const selectParams = useMemo(() => {
    let obj = { year: '' };
    Object.entries(selected).forEach((item) => {
      const [key, value] = item;
      const rebuildKey = key === 'reportPeriod' ? 'year' : key;
      obj = { ...obj, [rebuildKey]: value.join(',') };
    });
    return obj;
  }, [selected]);

  useEffect(() => {
    setIsProvince(getLevel(`${code ? code : ''}`) === 1);
  }, [code]);

  useEffect(() => {
    if (!isEmpty(selectParams) && selectParams.year) {
      setTableCondition((draft) => {
        draft.year = `[${selectParams.year},${selectParams.year}]`;
      });
    }
  }, [selectParams, setTableCondition]);

  useEffect(() => {
    if (code) {
      const level = getLevel(code);
      setYearCondition((draft) => {
        draft.regionCode = code;
      });
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
  }, [code, setTableCondition, setYearCondition]);

  // 列表数据获取
  const { loading } = useRequest(() => getScaleList(tableCondition), {
    refreshDeps: [tableCondition],
    ready:
      !!(tableCondition.provinceCode || tableCondition.cityCode || tableCondition.countyCode) && !!tableCondition.year,
    onSuccess: (res: any) => {
      if (res?.data?.data?.length > 0) {
        const row = res?.data?.data[0];
        const indicatorList = row?.indicatorList;
        const nonPerformingLoanRate = { indicName: '不良贷款率', mValue: row?.nonPerformingLoanRate, unit: '%' };
        const rebuild = (isProvince ? provinceConfig : regionConfig).map((item) => ({
          ...indicatorList.find((i: any) => i?.indicName === item),
          indicName: item,
        }));
        let final = rebuild.map((item) => ({ ...item, unit: '亿' }));
        isProvince && final.push(nonPerformingLoanRate);
        setTableData(final);
      }
    },
    onError: () => {
      setTableData([]);
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data) && !firstLoaded) {
        update((draft) => {
          draft.hideModule.loansScale = true;
        });
      }
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  const { loading: getYearloading } = useRequest(() => getYearConfig(yearCondition), {
    refreshDeps: [yearCondition],
    ready: !!yearCondition.regionCode,
    onSuccess: (res: any) => {
      const lastYear = res.data?.year?.[0];
      const reportPeriod = res.data?.year?.map((item: any) => ({
        name: `${item}`,
        value: `${item}`,
      }));
      setLastYear(`${lastYear}`);
      setMenuConfig({ reportPeriod });
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data) && !firstLoaded) {
        update((draft) => {
          draft.hideModule.loansScale = true;
        });
      }
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  const { menuOption } = useMenu(menuConfig, `${lastYear}`);

  // 筛选
  const handleMenuChange = useMemoizedFn((_, allSelectedRows: RowItem[]) => {
    const params: Record<string, string[]> = {
      reportPeriod: [],
    };

    allSelectedRows.forEach((selectd) => {
      switch (selectd.key) {
        case 'reportPeriod':
          params.reportPeriod.push(selectd.value);
          break;
        default:
          return {};
      }
    });

    setSelected((d) => {
      d.reportPeriod = isEmpty(params.reportPeriod) ? [`${lastYear}`] : params.reportPeriod;
    });
  });

  return {
    loading: loading || getYearloading,
    isProvince,
    onChange: handleMenuChange,
    options: menuOption as Options[],
    tableData,
  };
};

export default useLogic;
