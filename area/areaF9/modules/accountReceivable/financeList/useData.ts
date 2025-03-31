import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCreation, useMemoizedFn, useRequest, useSize } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';

import { ScreenType } from '@/components/screen';
import { isMac } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { useImmer } from '@/utils/hooks';

import { getLevel, Level } from '../../../utils/area';
import { getFinancingList, getScreenOptions } from '../api';
import { PageType, sortMap, useStaticOptions } from '../config';

const ORIGIN_CONDITION = {
  size: 50,
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
  expireFlag: '',
  isLatest: 1,
};

const sortKeyMap = new Map<string, string>([
  ['financingEventCount', 'count_events'],
  ['financingAmount', 'financingAmount'],
  ['financingEnterpriseCount', 'count_pledgor'],
  ['pledgeeCount', 'count_pledgee'],
  ['registeredCapital', 'registered_capital'],
  ['name', ''],
  ['registerStartDate', 'registerStartDate'],
  ['pledgorList', 'pledgorList'],
  ['pledgeeList', 'pledgeeList'],
  ['currency', 'currency'],
  ['timeLimit', 'timeLimit'],
  ['registerEndDate', 'registerEndDate'],
  ['lastedRegisterStatus', 'lastedRegisterStatus'],
  ['financingType', 'financingType'],
  ['pledgedProperty', 'pledgedProperty'],
  ['pledgedPropertyDesc', 'pledgedPropertyDesc'],
  ['fourthGBIndustry', 'primaryGBIndustry'],
]);

export default function useData() {
  /** 筛选ref */
  const screenRef = useRef();
  const { StaticOptions } = useStaticOptions(PageType.LIST);
  const { code } = useParams<any>();
  const keywordRef = useRef<any>();
  const [option, setOption] = useState<any[]>([]);
  const [firstLoading, setFirstLoading] = useState(true);
  const [condition, setCondition] = useImmer<any>(ORIGIN_CONDITION);
  // 日期选择器的值
  const [date, setDate] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'y'), dayjs()]);
  // 刷新screen
  const [reFresh, setRefresh] = useState(nanoid());
  const [tableInfo, setTableInfo] = useState({
    data: [],
    total: 0,
  });
  // 表格排序而导致的表格loading
  const [sortChange, setSortChange] = useState(false);
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
        StaticOptions.splice(2, 0, {
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
              //@ts-ignore
              cascade: true,
              ellipsis: 9,
            },
          },
        });
        setOption(StaticOptions);
      }
    },
  });

  const { loading: tableLoading } = useRequest(() => getFinancingList(condition), {
    ready:
      (!isEmpty(condition.pledgorProvinceCode) ||
        !isEmpty(condition.pledgorCityCode) ||
        !isEmpty(condition.pledgorCountyCode)) &&
      !!code,
    refreshDeps: [condition],
    onSuccess: (data: any) => {
      if (firstLoading) setFirstLoading(false);
      if (data.data) {
        setTableInfo({
          data: data.data.data.map((item: any, index: number) => ({
            ...item,
            index: condition.from + index + 1,
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
  });

  const handlePageChange = useMemoizedFn((current) => {
    setCondition((draft) => {
      draft.from = (current - 1) * 50;
    });
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

  const handleDateChange = useMemoizedFn((selected: Dayjs[], dateString: string) => {
    if (selected) {
      // 起使日期从当月1号 到 截止日期的月末
      setCondition((d) => {
        d.registerStartDateFrom = dateString[0];
        d.registerStartDateTo = dateString[1];
      });
    }
  });

  const handleSearch = useMemoizedFn((text: string) => {
    setCondition((d) => {
      d.keywords = text;
    });
  });

  const handleClear = useMemoizedFn(() => {
    keywordRef.current.setInputValue('');
    keywordRef.current.toggleInput(false);
    setCondition((draft) => ORIGIN_CONDITION);
    setDate([dayjs().subtract(1, 'y'), dayjs()]);
    setRefresh(nanoid());
  });

  const handleCheck = useMemoizedFn((e) => {
    setCondition((draft) => {
      draft.expireFlag = e;
    });
  });

  useEffect(() => {
    if (code) {
      const level = getLevel(code);
      switch (level) {
        case Level.PROVINCE:
          setCondition((d) => {
            d.pledgorProvinceCode = code;
          });
          break;
        case Level.CITY:
          setCondition((d) => {
            d.pledgorCityCode = code;
          });
          break;
        default:
          setCondition((d) => {
            d.pledgorCountyCode = code;
          });
          break;
      }
    }
  }, [code, condition, setCondition]);

  return {
    screenRef,
    reFresh,
    keywordRef,
    option,
    loading: tableLoading || loading,
    tableInfo,
    firstLoading: firstLoading || loading,
    sortChangeLoading: sortChange,
    condition,
    date,
    debounceScreenHeadHeight,
    handleScreenChange,
    handlePageChange,
    handleTableSortChange,
    handleDateChange,
    handleSearch,
    handleClear,
    handleCheck,
  };
}
