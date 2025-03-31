import { memo, useMemo, useState, useRef, useEffect } from 'react';

import { Empty, EmptySize } from '@dzh/components';
import { LockLayer } from '@dzh/pro-components';
import { useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';
import useColumns from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/underArea/useColumns';
import useData from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/underArea/useData';
import { useCtx } from '@pages/area/landTopic/modules/overview/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';
import { ScrollDom } from '@pages/area/landTopic/styles';

import { Spin } from '@/components/antd';
import { removeObjectNil } from '@/utils/share';

const DEFAULT_SORT = { sortKey: '', sortRule: '' };

const UnderArea = ({
  areaCodeObj,
  setCondition,
}: {
  areaCodeObj: { [x: string]: string | undefined };
  setCondition: (v: any) => void;
}) => {
  const {
    state: { hasPay, dateFilter, otherFilter },
  } = useCtx();
  const [sort, setSort] = useState({ ...DEFAULT_SORT });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(scrollRef) || { height: 0 };
  const [tableHeight, setTableHeight] = useState(0);
  const {
    state: {
      overview: { statisticsIndicators },
    },
  } = useCommonCtx();

  const params = useMemo(
    () =>
      removeObjectNil({
        ...dateFilter,
        ...otherFilter,
        sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
        ...areaCodeObj,
        size: 50,
        from: 0,
      }),
    [dateFilter, otherFilter, sort, areaCodeObj],
  );

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  const { dataSource, loading, total, indicator, onIndicatorChange } = useData(params, scrollTop);
  const columns = useColumns({
    ...sort,
    indicator,
  });

  const { indicName, headInfo } = useMemo(() => {
    const titles: string[] = ['省份', '地级市', '区县'];
    const keys: string[] = [];
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

  useEffect(() => {
    setCondition({
      module_type: 'land-area-new',
      exportFlag: true,
      sheetNames: { '0': '招拍挂_土地出让统计_下属辖区' },
      ...params,
      headInfo,
      indicName,
    });
  }, [headInfo, indicName, params, setCondition]);

  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });
  const showLockLayer = useMemo(() => !hasPay && total > 3, [hasPay, total]);

  const sticky = useMemo(() => ({ offsetHeader: 6, getContainer: () => scrollRef.current || document.body }), []);

  const onTableChange = useMemoizedFn((pagination, _, sorter, { action }) => {
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
      moduleCode: 'land_overview_under_area',
      pageCode: 'land_overview_under_area',
    }),
    [statisticsIndicators, onIndicatorResize],
  );

  const empty_top = useMemo(() => 0.2 * (height - 137), [height]);

  const tableProps = useMemo(
    () => ({
      columns,
      dataSource,
      sticky,
      pagination: false,
      onChange: onTableChange,
      loading: false,
    }),
    [columns, dataSource, onTableChange, sticky],
  );

  const content = useMemo(
    () => (
      <>
        <div className="sticky-hold" />
        <IndexTable
          /* @ts-ignore */
          tableProps={tableProps}
          transferSelectProps={transferSelectProps}
          hiddenTable={!dataSource.length}
          onHeightChange={setTableHeight}
        />
        {dataSource.length ? null : <Empty type={Empty.NO_DATA_SM} size={EmptySize.Small} />}
      </>
    ),
    [dataSource.length, tableProps, transferSelectProps],
  );

  return (
    <Spin
      type={'thunder'}
      spinning={loading}
      translucent={!!dataSource.length}
      useTag={!!dataSource.length}
      className={`${dataSource.length ? 'tab-table-loading ' : ''}under-area-loading`}
    >
      <Container size="small" ref={scrollRef} empty_top={empty_top}>
        {/* @ts-ignore */}
        {showLockLayer ? <LockLayer offsetTop={tableHeight - 40}>{content}</LockLayer> : content}
      </Container>
    </Spin>
  );
};

export default memo(UnderArea);
const Container = styled(ScrollDom)<{ empty_top: number }>`
  .sticky-hold {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 12;
    height: 6px;
  }
  .ant-spin-container {
    overflow: visible !important;
  }
  .ant-empty {
    padding-top: ${({ empty_top }) => `${empty_top}px`};
  }
`;
