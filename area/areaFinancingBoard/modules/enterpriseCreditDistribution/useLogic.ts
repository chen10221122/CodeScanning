import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useRequest } from 'ahooks';
import { isEmpty } from 'lodash';

import { Options, RowItem } from '@/components/screen';
import { useImmer } from '@/utils/hooks';

import { getCreditCompanyDistribute, getYearConfig } from '../../apis';
import { useConditionCtx } from '../../context';
import useMenu from './useMenu';

const useLogic = () => {
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [filterLoaded, setFilterFirstLoaded] = useState(false);
  const { update } = useConditionCtx();
  const [lastYear, setLastYear] = useState('');
  const [menuConfig, setMenuConfig] = useState({
    reportPeriod: [],
  });
  const { code } = useParams<any>();
  const [yearCondition, setYearCondition] = useImmer({
    regionCode: '',
    dataType: 'creditEnterprise',
  });
  const [tableCondition, setTableCondition] = useImmer({
    regionCode: '',
    year: '',
  });

  const [tableData, setTableData] = useState([]);

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
    if (!isEmpty(selectParams) && code) {
      setYearCondition((draft) => {
        draft.regionCode = code;
      });
      setTableCondition((draft) => {
        draft.regionCode = code;
        draft.year = selectParams.year;
      });
    }
  }, [code, selectParams, setTableCondition, setYearCondition]);

  // 列表数据获取
  const { loading } = useRequest(() => getCreditCompanyDistribute(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!tableCondition.regionCode && !!tableCondition.year,
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
          draft.hideModule.enterpriseCreditDistribution = true;
        });
      }
      if (!firstLoaded) setFirstLoaded(true);
    },
  });

  const { loading: getYearloading } = useRequest(() => getYearConfig(yearCondition), {
    refreshDeps: [yearCondition],
    ready: !!yearCondition.regionCode,
    onSuccess: (res: any) => {
      if (isEmpty(res?.data)) {
        return;
      }
      const lastYear = res.data?.year?.[0];
      const reportPeriod = res.data?.year?.map((item: any) => ({
        name: `${item}`,
        value: `${item}`,
      }));
      setLastYear(`${lastYear}`);
      setMenuConfig({ reportPeriod });
    },
    onFinally: (params, res, error) => {
      if (isEmpty(res?.data)) {
        update((draft) => {
          draft.hideModule.enterpriseCreditDistribution = true;
        });
      }
      if (!filterLoaded) setFilterFirstLoaded(true);
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
    firstLoaded: firstLoaded && filterLoaded,
    options: menuOption as Options[],
    onChange: handleMenuChange,
    tableData,
    menuOption,
    tableCondition,
  };
};

export default useLogic;
