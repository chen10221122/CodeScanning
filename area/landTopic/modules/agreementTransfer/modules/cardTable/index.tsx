import { memo, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { SpinProps, Empty, PaginationProps, Spin } from '@dzh/components';
import { LockLayer, BackTop } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useData from '@pages/area/landTopic/modules/agreementTransfer/modules/cardTable/useData';
import { useCtx } from '@pages/area/landTopic/modules/agreementTransfer/provider';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';
import useColumns from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail/useColumns';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';
import { ScrollDom } from '@pages/area/landTopic/styles';

import { IRootState } from '@/store';
import { shortId } from '@/utils/share';

const CardTable = () => {
  const {
    state: { total, currentPage, sortKey, sortRule, keyword, holdRatio },
    update,
  } = useCtx();
  const {
    state: {
      agreementTransfer: { detailIndicators },
    },
  } = useCommonCtx();
  const [tableHeight, setTableHeight] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  const setHoldRatio = useMemoizedFn((v) => {
    update((draft) => {
      draft.holdRatio = v;
    });
  });

  const { dataSource, loading, isFilterChange, indicator, onIndicatorChange } = useData(scrollTop);

  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });

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
  const showLockLayer = useMemo(() => !hasPay && total > 3, [hasPay, total]);

  const sticky = useMemo(() => ({ offsetHeader: 0, getContainer: () => scrollRef.current || document.body }), []);
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

  const tableProps = useMemo(
    () => ({
      columns,
      dataSource: dataSource.length ? dataSource : [{}],
      sticky,
      onlyBodyLoading: true,
      pagination,
      onChange: onTableChange,
      loading: dataSource.length ? tableLoading : false,
    }),
    [columns, dataSource, onTableChange, pagination, sticky, tableLoading],
  );
  const content = useMemo(
    () => (
      <>
        {detailIndicators.length ? (
          <IndexTable
            /* @ts-ignore */
            tableProps={tableProps}
            transferSelectProps={transferSelectProps}
            onHeightChange={setTableHeight}
          />
        ) : null}

        {dataSource.length ? null : (
          <Spin type="thunder" spinning={loading} className="empty-spin">
            <Empty
              type={isFilterChange ? Empty.NO_SCREEN_DATA : Empty.NO_DATA}
              onCleanClick={() => {
                if (isFilterChange) {
                  update((draft) => {
                    draft.screenKey = shortId();
                    draft.otherFilter = { statisticsScope: '1' };
                    draft.keyword = '';
                    draft.holdRatio = '3';
                    draft.currentPage = 1;
                    draft.sortKey = '';
                    draft.sortRule = '';
                  });
                }
              }}
            />
          </Spin>
        )}
      </>
    ),
    [dataSource.length, detailIndicators.length, isFilterChange, loading, tableProps, transferSelectProps, update],
  );

  return (
    <Container>
      <ScrollDom size="small" ref={scrollRef}>
        {showLockLayer ? (
          /* @ts-ignore */
          <LockLayer offsetTop={tableHeight - 40}>{content}</LockLayer>
        ) : (
          content
        )}
      </ScrollDom>
      <BackTop target={() => scrollRef.current || window} />
    </Container>
  );
};

export default memo(CardTable);

const Container = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background: #fff;
  padding: 0 2px 10px 10px;
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
`;
