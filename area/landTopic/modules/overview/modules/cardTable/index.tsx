import { memo, useMemo, useRef, useState } from 'react';

import { Empty } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { useTablePipeline, features, SortItem } from 'ali-react-table';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import IndexTable, { IndexTransferSelectProps } from '@pages/area/landTopic/components/IndexTable';
import useData from '@pages/area/landTopic/modules/overview/modules/cardTable/hooks/useData';
import { sortData } from '@pages/area/landTopic/modules/overview/modules/cardTable/utils';
import { useCtx, AreaType } from '@pages/area/landTopic/modules/overview/provider';
import { useCtx as useCommonCtx } from '@pages/area/landTopic/provider';
import { ScrollDom } from '@pages/area/landTopic/styles';

import { Spin } from '@/components/antd';
import ExportTable from '@/pages/area/landTopic/modules/overview/modules/cardTable/exportTable';
import useColumns from '@/pages/area/landTopic/modules/overview/modules/cardTable/hooks/useColumns';
import useExpand from '@/pages/area/landTopic/modules/overview/modules/cardTable/hooks/useExpand';
import { shortId } from '@/utils/share';

export interface IncrementArea {
  parentCode?: string;
  provinceCode?: string;
  cityCode?: string;
  countyCode?: string;
}

const CardTable = () => {
  const {
    state: {
      areaLists: { provinceCodes },
      firstLoading,
    },
    update,
  } = useCtx();
  const {
    state: {
      overview: { statisticsIndicators },
    },
  } = useCommonCtx();

  const [sort, setSort] = useState({ sortKey: '', sortRule: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const incrementCallBackRef = useRef<() => void>();
  const [incrementArea, setIncrementArea] = useState<IncrementArea>({}); // 增量请求地区信息

  const scrollTop = useMemoizedFn(() => {
    scrollRef.current?.scroll({
      top: 0,
    });
  });

  const {
    dataSource,
    loading,
    indicator,
    isFilterChange,
    isAreaChange,
    onIndicatorChange,
    expandFlag,
    setIsAllNation,
    setDataSource,
  } = useData({
    scrollTop,
    incrementCallBackRef,
    incrementArea,
    setIncrementArea,
    sort,
  });

  const { expandedRows, onChangeOpenKeys } = useExpand({
    incrementCallBackRef,
    setIncrementArea,
  });

  const { columns, getRowProps } = useColumns({
    dataSource,
    indicator,
    expandFlag,
    expandedRows,
    ...sort,
    onChangeOpenKeys,
    setIsAllNation,
  });

  const transferSelectProps: IndexTransferSelectProps = useMemo(
    () => ({
      onChange: onIndicatorChange,
      data: statisticsIndicators,
      moduleCode: 'land_overview_main',
      pageCode: 'land_overview_main',
    }),
    [statisticsIndicators, onIndicatorChange],
  );

  const pipeline = useTablePipeline()
    .input({
      dataSource,
      columns: provinceCodes.length ? columns : [],
    })
    .primaryKey('key')
    .use(
      features.sort({
        mode: 'single',
        keepDataSource: true,
        sorts: [{ code: sort.sortKey, order: sort.sortRule } as SortItem],
        onChangeSorts: (nextSorts) => {
          const { code, order } = nextSorts[0] || {};
          if (order !== 'none') {
            setSort({ sortKey: code, sortRule: order });
            if (code && order) {
              const lists = cloneDeep(dataSource);
              sortData(lists as any, code, order, expandFlag);
              setDataSource(lists);
            }
          } else {
            setSort({ sortKey: '', sortRule: '' });
          }
        },
      }),
    )
    .use(
      features.treeMode({
        clickArea: 'icon',
        openKeys: expandedRows,
        indentSize: 16,
        iconGap: -8,
      }),
    );

  const tableProps = useMemo(
    () => ({
      ...pipeline.getProps(),
      estimatedRowHeight: 30,
      getRowProps,
      hasStickyScroll: !!dataSource.length,
    }),
    [dataSource.length, getRowProps, pipeline],
  );

  return (
    <Wrapper>
      <Spin
        spinning={loading && !firstLoading}
        type="thunder"
        translucent={!!dataSource.length}
        useTag={!!dataSource.length}
        className={`top-table-loading ${dataSource.length ? '' : 'top-table-loading-opacity'}`}
      >
        <ExportTable dataSource={dataSource} indicator={indicator} expandedRows={expandedRows} />
        <Container size="small" ref={scrollRef}>
          <IndexTable virtualTable tableProps={tableProps} transferSelectProps={transferSelectProps} />
          {dataSource.length ? null : (
            <Empty
              className="empty-cover"
              type={isFilterChange || isAreaChange ? Empty.NO_SCREEN_DATA : Empty.NO_DATA}
              onCleanClick={() => {
                if (isFilterChange) {
                  update((draft) => {
                    draft.screenKey = shortId();
                  });
                }
                if (isAreaChange) {
                  update((draft) => {
                    draft.resetArea = shortId();
                    draft.areaType = AreaType.WHOLE;
                    draft.areaFilter = { provinceCode: provinceCodes, cityCode: '', countyCode: '' };
                  });
                }
              }}
            />
          )}
        </Container>
      </Spin>
    </Wrapper>
  );
};

export default memo(CardTable);

const Container = styled(ScrollDom)`
  position: relative;
  .area-clo {
    .dzh-table-cell-inner {
      display: flex;
      align-items: center;
    }
  }
  .dzh-table .ant-table-tbody > tr:nth-child(even of .ant-table-row) > td {
    background-color: #fff;
  }
  .pre-row-check td {
    border-bottom: 1px solid #99c7ff !important;
  }
  .row-check td {
    background: #eaf7ff !important;
    border-bottom: 1px solid #99c7ff !important;
    &:first-child,
    &:last-child {
      border-left: 1px solid #99c7ff !important;
    }
  }
  .first-row-check td {
    border-top: 1px solid #99c7ff !important;
  }
  .header-bottom-check {
    .art-table {
      .ant-table-tbody {
        .row-check {
          td {
            border-top: 1px solid #99c7ff !important;
          }
        }
      }
    }
  }
  .art-sticky-scroll {
    margin-top: -12px !important;
  }
  .empty-cover {
    position: absolute;
    top: 40px;
    background: #fff;
    z-index: 10;
    padding-top: 5vh;
    height: fit-content;
    width: 100%;
  }
`;

const Wrapper = styled.div`
  padding: 0 2px 4px 10px;
  height: 100%;
  background: #fff;
  .ant-spin-dot,
  .ant-spin-text {
    z-index: 1000;
  }
`;
