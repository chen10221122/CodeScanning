import { memo, useMemo, useState, useRef, useEffect } from 'react';

import { PaginationProps, Empty, EmptySize } from '@dzh/components';
import { LockLayer } from '@dzh/pro-components';
import { useMemoizedFn, useSize } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';
import useColumns from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/yearsTransfer/useColumns';
import useData from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/yearsTransfer/useData';
import { useCtx } from '@pages/area/landTopic/modules/overview/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';
import { ScrollDom } from '@pages/area/landTopic/styles';

import { Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Options, ScreenType, Screen } from '@/components/screen';
import { removeObjectNil } from '@/utils/share';

const OPTIONS: Options[] = [
  {
    title: '类型',
    option: {
      type: ScreenType.SINGLE,
      cancelable: false,
      children: [
        { name: '月', value: 'm', field: 'timeStatisticsType' },
        { name: '季', value: 'q', field: 'timeStatisticsType' },
        { name: '年', value: 'y', active: true, field: 'timeStatisticsType' },
      ],
    },
  },
];

const DEFAULT_SORT = { sortKey: 'date', sortRule: 'desc' };

const YearsTransfer = ({ areaCodeObj }: { areaCodeObj: { [x: string]: string | undefined } }) => {
  const {
    state: { hasPay, dateFilter, otherFilter },
  } = useCtx();
  const [currentPage, setCurrentPage] = useState(1);
  const [timeStatisticsType, setTimeStatisticsType] = useState('y');
  const [sort, setSort] = useState({ ...DEFAULT_SORT });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(scrollRef) || { height: 0 };
  const [tableHeight, setTableHeight] = useState(0);
  const {
    state: {
      overview: { statisticsIndicators },
    },
  } = useCommonCtx();

  const date: string = useMemo(() => {
    return Object.keys(dateFilter)[0] || 'transferDate';
  }, [dateFilter]);

  const params = useMemo(
    () =>
      removeObjectNil({
        [date]: `(*,${dayjs().endOf('year').format('YYYY-MM-DD')}]`,
        ...otherFilter,
        sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
        ...areaCodeObj,
        timeStatisticsType,
      }),
    [date, otherFilter, sort, areaCodeObj, timeStatisticsType],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [/* dateFilter,  */ otherFilter, areaCodeObj, timeStatisticsType]);

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  const { dataSource, loading, total, indicator, onIndicatorChange } = useData(params, scrollTop);
  const columns = useColumns({
    ...sort,
    indicator,
    dateWidth: timeStatisticsType === 'm' ? 80 : timeStatisticsType === 'q' ? 110 : 60,
    dataSource,
  });
  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });
  const onScreenChange = useMemoizedFn((v) => {
    v[0]?.value && setTimeStatisticsType(v[0].value);
  });

  const sticky = useMemo(() => ({ offsetHeader: 30, getContainer: () => scrollRef.current || document.body }), []);
  const showLockLayer = useMemo(() => !hasPay && total > 3, [hasPay, total]);

  const pagination: PaginationProps | false = useMemo(
    () =>
      !showLockLayer && total > 12
        ? {
            current: currentPage,
            total,
            pageSize: 12,
            size: 'small',
            showSizeChanger: false,
            onchange,
          }
        : false,
    [currentPage, showLockLayer, total],
  );

  const onTableChange = useMemoizedFn((pagination, _, sorter, { action }) => {
    if (action === 'paginate') {
      setCurrentPage(pagination.current);
    }
    if (action === 'sort') {
      const { field, order } = sorter;
      if (order) {
        setSort({ sortKey: field, sortRule: order === 'ascend' ? 'asc' : 'desc' });
      } else {
        setSort({ sortKey: '', sortRule: '' });
      }
    }
  });

  const transferSelectProps: IndexTransferSelectProps = useMemo(
    () => ({
      onChange: onIndicatorResize,
      data: statisticsIndicators,
      moduleCode: 'land_overview_years_transfer',
      pageCode: 'land_overview_years_transfer',
    }),
    [statisticsIndicators, onIndicatorResize],
  );

  const { indicName, headInfo } = useMemo(() => {
    const titles: string[] = ['日期'];
    const keys: string[] = ['date'];
    const getIndicator = (list: any[]) => {
      list.forEach(({ tableTitle, dataIndex, children }) => {
        if (children?.length) getIndicator(children);
        else {
          titles.push(tableTitle);
          keys.push(dataIndex);
        }
      });
    };
    getIndicator(indicator);
    return { headInfo: titles, indicName: keys };
  }, [indicator]);

  const condition = useMemo(
    () => ({
      module_type: 'land-annual-sales-new',
      sheetNames: { '0': '招拍挂_土地出让统计_历年趋势' },
      ...params,
      headInfo,
      indicName,
      exportFlag: true,
    }),
    [headInfo, indicName, params],
  );

  const empty_top = useMemo(() => 0.2 * (height - 137), [height]);

  const tableProps = useMemo(
    () => ({
      columns,
      dataSource,
      sticky,
      pagination,
      onChange: onTableChange,
      loading: false,
    }),
    [columns, dataSource, onTableChange, pagination, sticky],
  );

  const content = useMemo(
    () => (
      <>
        <IndexTable
          /* @ts-ignore */
          tableProps={tableProps}
          transferSelectProps={transferSelectProps}
          hiddenTable={!dataSource.length}
          onHeightChange={setTableHeight}
        />
        {dataSource.length ? null : (
          <Empty
            type={timeStatisticsType !== 'y' ? Empty.NO_SCREEN_DATA_SM : Empty.NO_DATA_SM}
            size={EmptySize.Small}
            onCleanClick={() => {
              if (timeStatisticsType !== 'y') {
                setTimeStatisticsType('y');
                setCurrentPage(1);
              }
            }}
          />
        )}
      </>
    ),
    [dataSource.length, tableProps, timeStatisticsType, transferSelectProps],
  );

  return (
    <Container size="small" ref={scrollRef} empty_top={empty_top}>
      <div className="tab-content-filter">
        <Screen initValues={[['y']]} values={[[timeStatisticsType]]} options={OPTIONS} onChange={onScreenChange} />
        <ExportDoc condition={condition} filename={`招拍挂_土地出让统计_历年趋势_${dayjs().format('YYYYMMDD')}`} />
      </div>
      <Spin
        type={'thunder'}
        spinning={loading}
        translucent={!!dataSource.length}
        useTag={!!dataSource.length}
        className={`${dataSource.length ? 'tab-table-loading ' : ''}years-transfer-loading`}
      >
        {/* @ts-ignore */}
        {showLockLayer ? <LockLayer offsetTop={tableHeight - 40}>{content}</LockLayer> : content}
      </Spin>
    </Container>
  );
};

export default memo(YearsTransfer);
const Container = styled(ScrollDom)<{ empty_top: number }>`
  .dzh-spin-spinWrapper {
    height: calc(100% - 30px);
  }
  .ant-spin-container {
    overflow: visible !important;
  }
  .ant-empty {
    padding-top: ${({ empty_top }) => `${empty_top}px`};
  }
  .tab-content-filter {
    padding-right: 10px !important;
  }
`;
