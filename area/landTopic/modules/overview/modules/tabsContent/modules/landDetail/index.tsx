import { memo, useMemo, useState, useRef, useEffect } from 'react';

import { PaginationProps, Empty, EmptySize } from '@dzh/components';
import { useImmer } from '@dzh/hooks';
import { LockLayer } from '@dzh/pro-components';
import { useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';
import Filter from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail/filter';
import useColumns from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail/useColumns';
import useData from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail/useData';
import { useCtx } from '@pages/area/landTopic/modules/overview/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';
import { ScrollDom } from '@pages/area/landTopic/styles';

import { Spin } from '@/components/antd';
import { removeObjectNil, shortId } from '@/utils/share';

export type FilterType = Record<'stage' | 'planDevelopCycle' | 'enterpriseType' | 'keyword', string | undefined>;

const LandDetail = ({ areaCodeObj }: { areaCodeObj: { [x: string]: string | undefined } }) => {
  const {
    state: { dateFilter, hasPay, otherFilter },
  } = useCtx();
  const [currentPage, setCurrentPage] = useState(1);
  const [holdRatio, setHoldRatio] = useState('3');
  const [sort, setSort] = useState({ sortKey: 'dealPublicityStartDate', sortRule: 'desc' });
  const [filter, setFilter] = useImmer({} as FilterType);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(scrollRef) || { height: 0 };
  const [tableHeight, setTableHeight] = useState(0);
  const [filterKey, setFilterKey] = useState(shortId());
  const {
    state: {
      overview: { detailIndicators },
    },
  } = useCommonCtx();

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, otherFilter, filter, holdRatio, areaCodeObj]);

  const params = useMemo(
    () =>
      removeObjectNil({
        ...dateFilter,
        ...otherFilter,
        ...filter,
        sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
        size: 50,
        from: 50 * (currentPage - 1),
        ...areaCodeObj,
        holdRatio,
      }),
    [dateFilter, holdRatio, otherFilter, filter, sort, currentPage, areaCodeObj],
  );

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  const { dataSource, loading, total, indicator, onIndicatorChange, companyNum } = useData(params, scrollTop);
  const columns = useColumns({
    currentPage,
    ...sort,
    keyword: filter.keyword,
    dataSource,
    indicator,
    holdRatio,
    setHoldRatio,
  });
  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });

  const sticky = useMemo(() => ({ offsetHeader: 0, getContainer: () => scrollRef.current || document.body }), []);
  const showLockLayer = useMemo(() => !hasPay && total > 3, [hasPay, total]);

  const pagination: PaginationProps | false = useMemo(
    () =>
      !showLockLayer && total > 50
        ? {
            current: currentPage,
            total,
            pageSize: 50,
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
      setCurrentPage(1);
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
      data: detailIndicators,
      moduleCode: 'land_overview_detail',
      pageCode: 'land_overview_detail',
    }),
    [detailIndicators, onIndicatorResize],
  );

  const empty_top = useMemo(() => 0.3 * (height - 137), [height]);

  const headInfo = useMemo(() => {
    const titles: string[] = ['宗地编号'];
    const getIndicator = (list: any[]) => {
      list.forEach(({ tableTitle, children, dataIndex }) => {
        if (children?.length) getIndicator(children);
        else {
          if (dataIndex === 'enterpriseInfo') {
            ['关联企业', '关联上市主体', '关联城投', '关联房企', '关联央企', '关联国企', '关联民企'].forEach((item) => {
              titles.push(item);
            });
          } else {
            titles.push(tableTitle);
          }
        }
      });
    };
    getIndicator(indicator);
    return titles;
  }, [indicator]);

  const exportCondition = useMemo(
    () => ({
      module_type: 'landTheme_detail_new',
      sheetNames: { '0': '招拍挂_土地出让明细' },
      headInfo,
      ...params,
      exportFlag: true,
    }),
    [headInfo, params],
  );

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

  const filterChange = useMemo(() => {
    return holdRatio !== '3' || !!Object.keys(filter).length;
  }, [filter, holdRatio]);

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
            type={filterChange ? Empty.NO_SCREEN_DATA_SM : Empty.NO_DATA_SM}
            size={EmptySize.Small}
            onCleanClick={() => {
              if (filterChange) {
                setFilterKey(shortId());
                setFilter(() => ({} as FilterType));
                setHoldRatio('3');
                setCurrentPage(1);
              }
            }}
          />
        )}
      </>
    ),
    [dataSource.length, filterChange, setFilter, tableProps, transferSelectProps],
  );

  return (
    <Container>
      <Filter
        onChange={setFilter}
        total={total}
        exportCondition={exportCondition}
        filterKey={filterKey}
        companyNum={companyNum}
      />
      <Spin
        type={'thunder'}
        keepCenter
        spinning={loading}
        translucent={!!dataSource.length}
        useTag={!!dataSource.length}
        className={`${dataSource.length ? 'tab-table-loading ' : ''}land-detail-loading`}
      >
        <ScrollDiv size="small" ref={scrollRef} empty_top={empty_top}>
          {showLockLayer ? (
            /* @ts-ignore */
            <LockLayer offsetTop={tableHeight - 40}>{content}</LockLayer>
          ) : (
            content
          )}
        </ScrollDiv>
      </Spin>
    </Container>
  );
};

export default memo(LandDetail);

const Container = styled.div`
  height: 100%;
  .tab-content-filter {
    padding-right: 16px;
  }
`;

const ScrollDiv = styled(ScrollDom)<{ empty_top: number }>`
  position: relative;
  .ant-empty {
    padding-top: ${({ empty_top }) => `${empty_top}px`};
  }
`;
