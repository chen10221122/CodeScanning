import { FC, memo, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';

import { Loading } from '@/components';
import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import TableFinance from '@/components/tableFinance';

import { useCtx } from '../context';
import { PAGE_SIZE, pageType } from '../type';
import { loadingTips, EmptyContainer, SearchEmptyContainer } from './style';
import S from './styles.module.less';
import useTableData from './useTableData';

interface Props {
  columns: any[];
  offsetHeader: number;
}

const sortMap = new Map<string, string>([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

const Table: FC<Props> = ({ columns, offsetHeader }) => {
  const {
    state: { tableData, total, tableCondition, conditionChangeLoading, tableError, page },
    update,
  } = useCtx();

  useTableData();

  const handleChange = useMemoizedFn((pagination, filters, sorter, extra: { currentDataSource: []; action: any }) => {
    if (page === pageType.SCALE) {
      update((d) => {
        d.tableCondition.sortKey = sortMap.get(sorter.order) ? `${sorter.field}` : '';
        d.tableCondition.sortRule = `${sortMap.get(sorter.order) || ''}`;
        d.conditionChangeLoading = true;
      });
    } else {
      update((d) => {
        d.tableCondition.sort = sortMap.get(sorter.order) ? `${sorter.field}:${sortMap.get(sorter.order) || ''}` : '';
        d.conditionChangeLoading = true;
      });
    }
    const containerRect = document.querySelector('.main-container')?.getBoundingClientRect(),
      elementRect = document.querySelector('.main-content-header')?.getBoundingClientRect();
    if (containerRect && elementRect) {
      // 判断标题是否在滚动容器的可视范围内
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const elementTop = elementRect.top;
      const elementBottom = elementRect.bottom;

      const isElementVisible = elementTop >= containerTop && elementBottom <= containerBottom;
      if (isElementVisible) {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
      } else {
        (document.querySelector('.main-container') as HTMLElement).scrollTop = 32;
      }
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, [tableData]);

  return (
    <>
      {tableData.length > 0 ? (
        <TableFinance
          className={S.tableCss}
          columns={columns}
          dataSource={tableData}
          showSorterTooltip={false}
          stripe={true}
          scroll={{ x: 1024 }}
          sticky={{
            offsetHeader: offsetHeader,
            getContainer: () => document.querySelector('.main-container') as HTMLElement,
          }}
          sortDirections={['descend', 'ascend']}
          onChange={handleChange}
          loading={
            conditionChangeLoading
              ? {
                  wrapperClassName: cn(S.tableLoadingWrapper, {
                    [S.isSortOrPage]: conditionChangeLoading,
                  }),
                  tip: '',
                  indicator: loadingTips,
                }
              : false
          }
        />
      ) : (
        <Loading show={conditionChangeLoading}>
          {tableError === 1 ? (
            <EmptyContainer>
              <Empty style={{ paddingTop: '15%' }} type={Empty.PAGE_NO_DATA_NEW} />
            </EmptyContainer>
          ) : (
            <SearchEmptyContainer>
              <Empty
                type={Empty.NO_DATA_IN_FILTER_CONDITION}
                onClick={() => {
                  update((d) => {
                    d.searchRef?.setInputValue('');
                    d.searchRef?.toggleInput(false);
                    d.resetParams();
                  });
                }}
              />
            </SearchEmptyContainer>
          )}
        </Loading>
      )}
      <Pagination
        current={tableCondition?.skip / PAGE_SIZE + 1 || 1}
        pageSize={50}
        total={total}
        onChange={(current) => {
          update((d) => {
            d.tableCondition.skip = (current - 1) * PAGE_SIZE;
            d.conditionChangeLoading = true;
          });
          const containerRect = document.querySelector('.main-container')?.getBoundingClientRect(),
            elementRect = document.querySelector('.main-content-header')?.getBoundingClientRect();
          if (containerRect && elementRect) {
            // 判断标题是否在滚动容器的可视范围内
            const containerTop = containerRect.top;
            const containerBottom = containerRect.bottom;
            const elementTop = elementRect.top;
            const elementBottom = elementRect.bottom;

            const isElementVisible = elementTop >= containerTop && elementBottom <= containerBottom;
            if (isElementVisible) {
              (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
            } else {
              (document.querySelector('.main-container') as HTMLElement).scrollTop = 32;
            }
          }
        }}
        style={{ padding: '8px 0px 0px', position: 'relative', marginBottom: 0 }}
        align={'left'}
      />
    </>
  );
};

export default memo(Table);
