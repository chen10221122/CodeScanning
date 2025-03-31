import { useEffect, useRef, useState, useMemo } from 'react';

import { RowItem } from '@dzh/screen';
import { useRequest, useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import { omit, range, isEmpty } from 'lodash';

import { useParams } from '@/pages/area/areaF9/hooks';
import { getWebNews, WebNewsType } from '@/pages/information/govIntel/api';
import { useImmer } from '@/utils/hooks';

const PAGE_SIZE = 50;

interface SelectItem {
  name: string;
  value: string;
  key: string;
  unlimited?: boolean;
}
const TEXT_LEN_MSG = '请输入2个及以上关键字！';
const useList = ({
  isGovWork,
  scrollRef,
}: {
  isGovWork: boolean;
  scrollRef: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
}) => {
  const { regionCode } = useParams();

  const originCondition = useMemo(() => {
    const normalParams = {
      regionCode: regionCode || '',
      skip: 0,
      pagesize: PAGE_SIZE,
      text: '',
    };
    return isGovWork
      ? { topicCode: 'governmentWorkReport', yearsNum: '', ...normalParams }
      : { topicCode: 'fiveYearPlan', period: '', ...normalParams };
  }, [isGovWork, regionCode]);

  const skipRef = useRef(0);
  const [error, setError] = useState(false);
  const [condition, setCondition] = useState<WebNewsType>(originCondition);
  const [renderScreen, setRenderScreen] = useState(true);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [areaValue, setAreaValue] = useState<string[][]>([[]]);
  const [showSummary, setShowSummary] = useState(true);
  const [showSummaryBtn, setShowSummaryBtn] = useState(false);
  const [pager, setPager] = useImmer<{ pageSize: number; current: number; total: number }>({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });
  const [msg, setMsg] = useState(TEXT_LEN_MSG);
  const [count, setCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const { run, loading } = useRequest(getWebNews, {
    manual: true,
    onSuccess: ({ data }) => {
      const hasData = !isEmpty(data);
      setPager((base) => {
        base.current = hasData ? skipRef.current + 1 : 1;
        base.total = hasData ? data[0]?.total ?? 0 : 0;
      });
      setTableData(hasData ? data : []);
      setFirstLoaded(false);
    },
    onError: () => {
      setError(true);
      setFirstLoaded(false);
      setTableData([]);
      setPager((base) => {
        base.total = 0;
        base.current = 1;
      });
    },
  });

  useEffect(() => run(condition), [condition, run]);

  const scrollTop = useMemoizedFn(() => scrollRef.current?.scrollIntoView({ block: 'nearest' }));

  const handlePeriodChange = useMemoizedFn((_, selection) => {
    const keyValueObj: Record<string, string> = {};
    selection.forEach((item: SelectItem) => {
      keyValueObj[item.key] = keyValueObj[item.key] ? `${keyValueObj[item.key]},${item.value}` : item.value;
      if (item.key === 'rangePicker') {
        keyValueObj['yearsNum'] = item.value
          ? range(
              Number(dayJs(item.value[0]).format('YYYY')),
              Number(dayJs(item.value[1]).format('YYYY')) + 1,
            ).toString()
          : '';
        delete keyValueObj.rangePicker;
      }
    });
    skipRef.current = 0;
    scrollTop();
    setCondition((originState) => ({
      ...originState,
      ...omit(originCondition, 'regionCode'),
      ...keyValueObj,
      text: keyword,
    }));
  });
  /** 表格翻页 */
  const handlePageChange = useMemoizedFn((pagination, _, __, { action }) => {
    if (action === 'paginate') {
      const { current } = pagination;
      setPager((base) => {
        base.current = current;
      });
      scrollTop();
      skipRef.current = current - 1;
      setCondition((originState) => ({ ...originState, skip: PAGE_SIZE * skipRef.current }));
    }
  });
  const handleAreaChange = useMemoizedFn((_, selection: RowItem[]) => {
    const trueSelectedValue = selection.map((item) => item.value);
    setAreaValue([trueSelectedValue]);
    skipRef.current = 0;
    scrollTop();

    // 带上顶级地区
    // trueSelectedValue.unshift(originCondition.regionCode);

    setCondition((originState) => {
      return {
        ...originState,
        ...omit(originCondition, 'period', 'yearsNum'),
        regionCode: trueSelectedValue.toString() || originCondition.regionCode,
        text: keyword,
      };
    });
  });

  const handleAreaItemClick = useMemoizedFn((code) => () => {
    setRenderScreen(false);
    skipRef.current = 0;
    setAreaValue([[code]]);
    scrollTop();
    setCondition({ ...originCondition, regionCode: code });
    requestAnimationFrame(() => setRenderScreen(true));
  });

  const handleReset = useMemoizedFn(() => {
    setRenderScreen(false);
    setAreaValue([]);
    skipRef.current = 0;
    setCondition(originCondition);
    requestAnimationFrame(() => setRenderScreen(true));
    setShowSummaryBtn(false);
  });
  const handleSearch = useMemoizedFn((value: string) => {
    if (value.length === 1) {
      setMsg(TEXT_LEN_MSG);
      setCount((n) => ++n);
      return;
    } else {
      setCondition((originState) => {
        return { ...originState, text: value };
      });
      setKeyword(value);
      skipRef.current = 0;
      setShowSummaryBtn(true);
      setShowSummary(true);
      scrollTop();
    }
  });
  const onClear = useMemoizedFn((a) => {
    setCondition((originState) => {
      return { ...originState, text: '' };
    });
    setShowSummaryBtn(false);
    skipRef.current = 0;
    scrollTop();
    setKeyword('');
  });
  return {
    msg,
    count,
    tableData,
    condition,
    pager,
    error,
    loading,
    firstLoaded,
    skipRef,
    areaValue,
    renderScreen,
    showSummary,
    showSummaryBtn,
    handleAreaItemClick,
    handlePeriodChange,
    handlePageChange,
    handleAreaChange,
    handleReset,
    handleSearch,
    onClear,
    setShowSummary,
  };
};

export default useList;
