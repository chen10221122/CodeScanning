import { memo, useMemo, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { PaginationProps, Empty, EmptySize } from '@dzh/components';
import { LockLayer } from '@dzh/pro-components';
import { useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import useColumns from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/landDetail/useColumns';
import useData from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/landDetail/useData';
import useIndicator from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/landDetail/useIndicator';
import { useCtx as useCommonCtx } from '@pages/area/areaF9/modules/regionalLand/components/detailsModal/provider';
import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorResize from '@pages/area/landTopic/modules/overview/hooks/useIndicatorResize';

import { Spin } from '@/components/antd';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/landTransfer/provider';
import useLoading from '@/pages/detail/hooks/useLoading';
import { IRootState } from '@/store';
import { removeObjectNil } from '@/utils/share';

export type FilterType = Record<'stage' | 'planDevelopCycle' | 'enterpriseType' | 'keyword', string | undefined>;

const LandDetail = ({ modalPramas }: { modalPramas: any }) => {
  const {
    state: { dateFilter, otherFilter },
    update,
  } = useCtx();
  const { run } = useIndicator(); // 获取指标树
  useEffect(() => {
    run('1');
  }, [run]);
  const [currentPage, setCurrentPage] = useState(1);
  const [holdRatio, setHoldRatio] = useState('3');
  const [sort, setSort] = useState({ sortKey: 'dealPublicityStartDate', sortRule: 'desc' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    state: {
      overview: { detailIndicators },
    },
  } = useCommonCtx();

  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, otherFilter, holdRatio, modalPramas]);

  // 弹窗参数
  const params = useMemo(
    () =>
      removeObjectNil({
        ...otherFilter,
        sort: sort.sortKey ? `${sort.sortKey}:${sort.sortRule}` : '',
        size: 50,
        from: 50 * (currentPage - 1),
        ...modalPramas,
        holdRatio,
      }),
    [holdRatio, otherFilter, sort, currentPage, modalPramas],
  );

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({ top: 0 });
  });

  // const { dataSource, loading, total, indicator, onIndicatorChange, companyNum } = useData(params, scrollTop);
  const { dataSource, loading, total, indicator, onIndicatorChange } = useData(params, scrollTop);
  const skeletonLoading = useLoading(loading);

  // 使用sort之后单行表表头拉伸很明显，首屏加载延迟500ms，避免页面抖动
  const [loadingDelay, setLoadingDelay] = useState(skeletonLoading);
  const timeOutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timeOutRef.current = setTimeout(() => {
      setLoadingDelay(skeletonLoading);
    }, 500);
    return () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, [skeletonLoading]);

  // companyNum为成交宗数，为土地公示+合同签订 stage: "2,3"
  const columns = useColumns({
    currentPage,
    ...sort,
    dataSource,
    indicator,
    holdRatio,
    setHoldRatio,
  });
  const { onIndicatorResize } = useIndicatorResize({ container: scrollRef.current, loading, onIndicatorChange });

  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: tableHeight = 0 } = useSize(containerRef) || {};

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

  useEffect(() => {
    update((draft) => {
      draft.conditionDetails = {
        module_type: 'landTheme_detail_new',
        sheetNames: { '0': '招拍挂_土地出让明细' },
        headInfo,
        ...params,
        exportFlag: true,
      };
    });
  }, [headInfo, params, update]);

  const tableProps = useMemo(() => {
    const sticky = {
      offsetHeader: 0,
      getContainer: () =>
        (document.querySelector('.dzh-modal-body-inner') as HTMLDivElement) || scrollRef.current || document.body,
    };

    return {
      columns,
      dataSource,
      sticky,
      pagination,
      onChange: onTableChange,
      loading: false,
    };
  }, [columns, dataSource, onTableChange, pagination, scrollRef]);

  const content = useMemo(
    () => (
      <>
        <IndexTable
          /* @ts-ignore */
          ref={containerRef}
          tableProps={tableProps}
          transferSelectProps={transferSelectProps}
          hiddenTable={!dataSource.length}
          // onHeightChange={setTableHeight}
        />
        {dataSource.length ? null : (
          <Empty
            type={Empty.NO_RESULT}
            size={EmptySize.Large}
            onCleanClick={() => {
              setHoldRatio('3');
              setCurrentPage(1);
            }}
          />
        )}
      </>
    ),
    [dataSource.length, tableProps, transferSelectProps],
  );

  return (
    <Container id="detail-modalWrapper" ref={scrollRef}>
      {/* 包两个还是为了解决sort造成的首次进入页面表头拉伸问题 */}
      <Spin spinning={loadingDelay} type={'thunder'}>
        <Spin
          type={'thunder'}
          keepCenter
          spinning={loading}
          translucent={!!dataSource.length}
          useTag={!!dataSource.length}
          className={`${dataSource.length ? 'tab-table-loading ' : ''}land-detail-loading`}
        >
          {showLockLayer && !loading ? (
            /* @ts-ignore */
            <LockLayer offsetTop={tableHeight + 150}>{content}</LockLayer>
          ) : (
            content
          )}
        </Spin>
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
  .ant-spin-blur {
    height: 100%;
  }
  .ant-spin-container {
    height: 100%;
  }
  .dzh-lock-layer-mask-body {
    width: 100%;
  }
  .tab-table-loading {
    .ant-spin-container {
      overflow: visible !important;
      height: 100%;
    }
    .ant-spin-show-text {
      top: 30% !important;
      z-index: 100 !important;
    }
    .ant-spin-container {
      opacity: 1;
      &,
      &::after {
        transition: none;
      }
    }
    .ant-spin-blur::after {
      opacity: 0.7;
      transition: none;
    }
  }
  .land-detail-loading {
    height: calc(100% - 30px);
    .ant-spin-blur::after {
      height: 100%;
      top: 30px;
    }
  }
  .dzh-table .ant-table .ant-table-thead > tr > th .dzh-table-resize-content-inner > div > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dzh-table .ant-table .ant-table-thead > tr > th .dzh-table-resize-content-inner > div > span > div {
    margin-left: 10px;
  }
`;
