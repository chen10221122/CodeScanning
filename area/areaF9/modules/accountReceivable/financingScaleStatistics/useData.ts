import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useRequest, useSize, useCreation } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';

import { ScreenType } from '@/components/screen';
import { isMac } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { uuid } from '@/utils/analysis/utils';
import { useImmer } from '@/utils/hooks';

import { Level, getLevel } from '../../../utils';
import { getScreenOptions, getScaleStatisticsList } from '../api';
import { PageType, useStaticOptions, sortMap } from '../config';

const typeMap = new Map<string, 'month' | 'week' | 'quarter' | 'year'>([
  ['m', 'month'],
  ['q', 'quarter'],
  ['y', 'year'],
]);

const ORIGIN_CONDITION = {
  size: 50,
  frequency: 'm',
  from: 0,
  keywords: '',
  pledgorBusinessType: '',
  pledgorGBIndustryPrimaryCode: '',
  pledgorGBIndustrySecondCode: '',
  pledgorGBIndustryThirdCode: '',
  pledgorGBIndustryFourthCode: '',
  registerLimit: '',
  registerStartDateFrom: dayjs().subtract(1, 'y').format('YYYY-MM-DD'),
  registerStartDateTo: dayjs().format('YYYY-MM-DD'),
  isLatest: 1,
};

const sortKeyMap = new Map<string, string>([
  ['eventCount', 'count_events'],
  ['financingAmount', 'sum_amount'],
  ['financingEnterpriseCount', 'count_pledgor'],
  ['pledgeeCount', 'count_pledgee'],
]);

export default function useData() {
  const screenRef = useRef();
  const { StaticOptions } = useStaticOptions(PageType.STATIC);
  const { code } = useParams<any>();
  const [firstLoading, setFirstLoading] = useState(true);
  // 日期选择器的类型
  const [picker, setPicker] = useState<'date' | 'time' | 'month' | 'week' | 'quarter' | 'year' | undefined>('month');
  // 日期选择器的值
  const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'y'), dayjs()]);
  const [option, setOption] = useState<any[]>([]);
  const [condition, setCondition] = useImmer<any>(ORIGIN_CONDITION);
  const [tableInfo, setTableInfo] = useState({
    data: [],
    total: 0,
  });
  // 表格排序而导致的表格loading
  const [sortChange, setSortChange] = useState(false);
  // refresh
  const [refresh, setRefresh] = useState(uuid());

  /** 筛选表头动态高度，将此传给table的headFixedPosition */
  const { height: _debounceScreenHeadHeight } = useSize(screenRef) || {};

  const debounceScreenHeadHeight = useCreation(() => {
    if (_debounceScreenHeadHeight) {
      return isMac() ? _debounceScreenHeadHeight - 1 : _debounceScreenHeadHeight;
    } else {
      return undefined;
    }
  }, [_debounceScreenHeadHeight]);

  const { loading } = useRequest(getScreenOptions, {
    defaultParams: [{ selectParam: 2, industryLevel: 4 }],
    onSuccess: (data: any) => {
      if (data.data) {
        setOption([
          {
            type: '',
            key: 'industry',
            screenOption: {
              title: '行业',
              formatTitle: (rows: any) => {
                if (!rows.length) return '行业';
                return rows.map((row: any) => row.name).join(',');
              },
              option: {
                type: ScreenType.MULTIPLE_THIRD,
                children: data.data[0].children,
                cascade: true,
                ellipsis: 9,
              },
            },
          },
          ...StaticOptions,
        ]);
      }
    },
  });

  const { run, loading: tableLoading } = useRequest(getScaleStatisticsList, {
    ready: !!(condition.pledgorProvinceCode || condition.pledgorCityCode || condition.pledgorCountyCode),
    manual: true,
    onSuccess: (data: any) => {
      if (firstLoading) setFirstLoading(false);
      if (data.data) {
        setTableInfo({
          data: data.data.data.map((item: any, index: number) => ({
            ...item,
            registerStartDate: condition?.frequency !== 'm' ? item.registerStartDateView : item.registerStartDate,
            index: condition.from + index + 1,
            // 传递给中台的数据
            registerStartDateProps: item.registerStartDate,
          })),
          total: data.data.total,
        });
      } else {
        setTableInfo({
          data: [],
          total: 0,
        });
      }
      if (sortChange) {
        setSortChange(false);
      }
    },
    onError: () => {
      if (firstLoading) setFirstLoading(false);
      setTableInfo({
        data: [],
        total: 0,
      });
    },
  });

  const handleScreenChange = useMemoizedFn((key, selected) => {
    // 行业筛选项特殊处理
    if (key === 'industry') {
      setCondition((draft) => {
        const fistLevel: string[] = [],
          secondLevel: string[] = [],
          thirdLevel: string[] = [],
          fourthLevel: string[] = [];
        selected.forEach((item: any) => {
          if (item.key === 1) {
            fistLevel.push(item.value);
          } else if (item.key === 2) {
            secondLevel.push(item.value);
          } else if (item.key === 3) {
            thirdLevel.push(item.value);
          } else {
            fourthLevel.push(item.value);
          }
        });
        draft.pledgorGBIndustryPrimaryCode = fistLevel.join(',');
        draft.pledgorGBIndustrySecondCode = secondLevel.join(',');
        draft.pledgorGBIndustryThirdCode = thirdLevel.join(',');
        draft.pledgorGBIndustryFourthCode = fourthLevel.join(',');
      });
    } else {
      setCondition((draft) => {
        draft[key] = selected[0]?.value ? selected.map((item: any) => item.value).join(',') : '';
      });
    }

    if (key === 'frequency') {
      setPicker(typeMap.get(selected[0].value) || 'month');
      switch (selected[0].value) {
        case 'm':
          setDate([dayjs().subtract(1, 'year'), dayjs()]);
          setCondition((draft) => {
            draft.registerStartDateTo = dayjs().endOf('month').format('YYYY-MM-DD');
            draft.registerStartDateFrom = `${dayjs().subtract(1, 'year').format('YYYY-MM')}-01`;
          });
          break;
        case 'q':
          setDate([dayjs().subtract(3, 'year'), dayjs()]);
          setCondition((draft) => {
            draft.registerStartDateTo = dayjs().endOf('month').format('YYYY-MM-DD');
            draft.registerStartDateFrom = `${dayjs().subtract(3, 'year').format('YYYY-MM')}-01`;
          });
          break;
        case 'y':
          setDate([dayjs().subtract(10, 'year'), dayjs()]);
          setCondition((draft) => {
            draft.registerStartDateTo = dayjs().endOf('month').format('YYYY-MM-DD');
            draft.registerStartDateFrom = `${dayjs().subtract(10, 'year').format('YYYY-MM')}-01`;
          });
          break;
      }
    }
  });

  const handlePageChange = useMemoizedFn((current) => {
    setCondition((draft) => {
      draft.from = (current - 1) * 50;
    });
  });

  const handleDateChange = useMemoizedFn((selected: Dayjs[], dateString: string) => {
    if (selected) {
      // 起使日期从当月1号 到 截止日期的月末
      setCondition((d) => {
        d.registerStartDateFrom = `${selected[0].format('YYYY-MM')}-01`;
        d.registerStartDateTo = selected[1].endOf('month').format('YYYY-MM-DD');
      });
    }
  });

  const handleTableSortChange = useMemoizedFn(
    (pagination, filters, sorter, extra: { currentDataSource: []; action: any }) => {
      setCondition((draft) => {
        draft.sortKey = sortMap.get(sorter.order) ? `${sortKeyMap.get(sorter.field) ?? ''}` : '';
        draft.sortRule = sortMap.get(sorter.order) || '';
      });
      setSortChange(true);
    },
  );

  const handleClear = useMemoizedFn(() => {
    setCondition((draft) => ORIGIN_CONDITION);
    setDate([dayjs().subtract(1, 'y'), dayjs()]);
    setRefresh(uuid());
  });

  useEffect(() => {
    if (code) {
      const level = getLevel(code);
      switch (level) {
        case Level.PROVINCE:
          setCondition((d) => {
            d.pledgorProvinceCode = code;
          });
          run(condition);
          break;
        case Level.CITY:
          setCondition((d) => {
            d.pledgorCityCode = code;
          });
          run(condition);
          break;
        default:
          setCondition((d) => {
            d.pledgorCountyCode = code;
          });
          run(condition);
          break;
      }
    }
  }, [code, condition, run, setCondition]);

  return {
    screenRef,
    debounceScreenHeadHeight,
    option,
    loading: tableLoading || loading,
    picker,
    tableInfo,
    date,
    condition,
    firstLoading: firstLoading || loading,
    sortChangeLoading: sortChange,
    refresh,
    handleScreenChange,
    handlePageChange,
    handleDateChange,
    handleTableSortChange,
    handleClear,
  };
}
