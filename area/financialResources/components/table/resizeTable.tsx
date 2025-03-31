import { FC, memo, useMemo } from 'react';

import { useSize } from 'ahooks';
import cn from 'classnames';
import { isBoolean } from 'lodash';
import { createGlobalStyle } from 'styled-components';

import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import TableFinance from '@/components/tableFinance';
import { loadingTips } from '@/pages/area/financialResources/module/common/style';

import { EmptyContent, Pager } from '.';

import S from '@/pages/area/financialResources/module/common/style.module.less';

interface Props {
  columns: any[];
  tableData: any[];
  pager: Pager;
  loading: boolean;
  handleSort: Function;
  onChangePage: (curu: number) => void;
  handleReset?: () => void;
  offsetHeader: number;
  tabHeight: number;
  containerId?: string;
}

const Table: FC<Props> = ({
  columns,
  tableData,
  pager,
  loading,
  handleSort,
  onChangePage,
  handleReset,
  offsetHeader,
  tabHeight,
  containerId = '',
}) => {
  const scroll = useMemo(() => {
    return (columns as Record<string, any>[]).reduce((prev, current) => {
      return prev + current?.width;
    }, 0);
  }, [columns]);

  const { height: tableHeight } = useSize(document.getElementById(containerId)) || {};
  const { height: containerHeight } = useSize(document.querySelector('.main-container')) || {};

  const hasTableStickyScroll = useMemo(() => {
    return tableHeight && containerHeight && tableHeight > containerHeight;
  }, [tableHeight, containerHeight]);

  return (
    <>
      {tableData?.length ? (
        <>
          <GlobalStyle hasTableStickyScroll={isBoolean(hasTableStickyScroll) && hasTableStickyScroll} />
          <TableFinance
            columns={columns}
            dataSource={tableData}
            className={S.tableCss}
            showSorterTooltip={false}
            stripe={true}
            scroll={{ x: scroll }}
            sticky={{
              offsetHeader: offsetHeader,
              getContainer: () => document.querySelector('.main-container') as HTMLElement,
            }}
            onChange={handleSort}
            loading={
              loading
                ? {
                    wrapperClassName: cn(S.tableLoadingWrapper, {
                      [S.isSortOrPage]: loading,
                    }),
                    tip: '',
                    indicator: loadingTips,
                  }
                : false
            }
          />
          {pager.total > 50 && (
            <Pagination
              onChange={onChangePage}
              current={pager.current || 1}
              pageSize={50}
              total={pager.total}
              style={{ padding: '8px 0px 0px', position: 'relative', left: '9px', marginBottom: 0 }}
              align={'left'}
            />
          )}
        </>
      ) : null}
      {!loading && !tableData?.length ? (
        <EmptyContent tabHeight={tabHeight} headFixedPosition={offsetHeader}>
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
        </EmptyContent>
      ) : null}
    </>
  );
};

export default memo(Table);

export const GlobalStyle = createGlobalStyle<{ hasTableStickyScroll?: boolean }>`
  .ant-table-sticky-scroll {
    display: ${({ hasTableStickyScroll }) => (hasTableStickyScroll ? 'block' : 'none')};
  }
`;
