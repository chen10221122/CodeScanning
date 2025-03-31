import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { SpinProps, Empty, PaginationProps, Spin } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';
import useColumns from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail/useColumns';

import { StatisticsScopeType } from '@/pages/area/areaF9/modules/regionalLand/const';
import useData from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/modules/cardTable/useData';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/provider';
import { useCtx as useCommonCtx } from '@/pages/area/areaF9/modules/regionalLand/provider';
import { IRootState } from '@/store';
import { shortId } from '@/utils/share';

interface Props {
  areaCodeObj: { [x: string]: string | undefined };
  pageType: string;
  skeletonLoading: boolean;
}

const CardTable: FC<Props> = ({ areaCodeObj, pageType, skeletonLoading }) => {
  const {
    state: { total, currentPage, sortKey, sortRule, keyword, holdRatio, loading, headerHeight },
    update,
  } = useCtx();
  const {
    state: {
      agreementTransfer: { detailIndicators },
    },
  } = useCommonCtx();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  const setHoldRatio = useMemoizedFn((v) => {
    update((draft) => {
      draft.holdRatio = v;
    });
  });

  const { dataSource, isFilterChange, indicator, onIndicatorChange } = useData({
    scrollTop,
    areaCodeObj,
    pageType,
  });

  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });

  const [loadingDelay, setLoadingDelay] = useState(skeletonLoading);
  const timeOutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timeOutRef.current = setTimeout(() => {
      setLoadingDelay(skeletonLoading);
    }, 300);
    return () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, [skeletonLoading]);

  const columns = useColumns({
    currentPage,
    sortKey,
    sortRule,
    keyword,
    dataSource,
    indicator,
    holdRatio,
    setHoldRatio,
  });
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;

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
      update((draft) => {
        draft.currentPage = pagination.current;
      });
    }
    if (action === 'sort') {
      const { field, order } = sorter;
      update((draft) => {
        draft.currentPage = 1;
        if (order) {
          draft.sortKey = field;
          draft.sortRule = order === 'ascend' ? 'asc' : 'desc';
        } else {
          draft.sortKey = '';
          draft.sortRule = '';
        }
      });
    }
  });

  const transferSelectProps: IndexTransferSelectProps = useMemo(
    () => ({
      onChange: onIndicatorResize,
      data: detailIndicators,
      moduleCode: 'land_agreement_transfer',
      pageCode: 'land_agreement_transfer',
    }),
    [detailIndicators, onIndicatorResize],
  );
  const tableLoading: SpinProps = useMemo(() => ({ spinning: loading, translucent: true, type: 'square' }), [loading]);

  const tableProps = useMemo(() => {
    const sticky = {
      offsetHeader: headerHeight,
      getContainer: () => document.getElementById('main-container') || document.body,
    };
    return {
      columns,
      dataSource: dataSource.length ? dataSource : [{}],
      sticky,
      onlyBodyLoading: true,
      pagination,
      onChange: onTableChange,
      loading: dataSource.length ? tableLoading : false,
    };
  }, [columns, dataSource, headerHeight, onTableChange, pagination, tableLoading]);

  const content = useMemo(
    () => (
      <>
        {detailIndicators.length ? (
          <IndexTable
            /* @ts-ignore */
            tableProps={tableProps}
            transferSelectProps={transferSelectProps}
          />
        ) : null}
      </>
    ),
    [detailIndicators.length, tableProps, transferSelectProps],
  );

  return (
    <MainContainer>
      {dataSource.length ? (
        <Spin spinning={loadingDelay} type={'thunder'} className="new-spin">
          <Container ref={scrollRef}>{content}</Container>
        </Spin>
      ) : !skeletonLoading ? (
        <Spin type="thunder" spinning={loading} className="empty-spin">
          <Empty
            type={isFilterChange ? Empty.NO_SCREEN_DATA : Empty.NO_DATA}
            onCleanClick={() => {
              if (isFilterChange) {
                update((draft) => {
                  draft.screenKey = shortId();
                  draft.otherFilter = {};
                  draft.keyword = '';
                  draft.holdRatio = '3';
                  draft.currentPage = 1;
                  draft.sortKey = '';
                  draft.sortRule = '';
                  draft.statisticsScope = StatisticsScopeType.HAS_CHILDREN;
                });
              }
            }}
          />
        </Spin>
      ) : null}
    </MainContainer>
  );
};

export default memo(CardTable);
const MainContainer = styled.div`
  .new-spin .ant-spin-nested-loading > div > .ant-spin {
    display: none;
  }
  .ant-empty {
    padding-top: 3vh;
  }
`;

const Container = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background: #fff;
  padding: 0px 2px 12px 0px;
  .ant-spin-nested-loading > div > .ant-spin {
    display: block !important;
  }
  .dzh-table-spinning-wrapper .ant-spin-container {
    overflow: inherit !important;
  }
  th .screen-wrapper {
    display: inline-block;
    margin-left: 16px;
    margin-right: 4px;
  }

  .empty-spin {
    position: absolute;
    top: 31px;
    background: #fff;
    z-index: 10;
    padding-top: 5vh;
    height: fit-content;
  }
  .dzh-lock-layer-wrapper,
  .dzh-lock-layer-content {
    height: 100%;
  }
  .dzh-table-pagination {
    padding-top: 6px;
    margin-top: 0px;
  }
`;
