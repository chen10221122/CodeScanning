import { useEffect } from 'react';

import cn from 'classnames';

import { Icon, Pagination, Loading } from '@/components';
import { Empty } from '@/components/antd';
import FinanceTable from '@/components/tableFinance';

import { SearchEmptyContainer } from './style';
import S from './style.module.less';

const loadingTips = (
  <span className={S.loadingTips}>
    <Icon
      style={{ width: 24, height: 24, marginTop: 20, zIndex: 1, position: 'relative', left: 15 }}
      image={require('@/assets/images/common/loading.gif')}
    />
    <span className={S.loadingText}>加载中</span>
  </span>
);

/**
 * 区域F9应收账款融资节点公用的表格模块
 */
export default function Table({
  columns,
  tableInfo,
  skip,
  loading,
  sortChangeLoading,
  pageChange,
  sortChange,
  handleClear,
  debounceScreenHeadHeight,
}: any) {
  useEffect(() => {
    if (tableInfo.data.length) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [tableInfo]);

  return (
    <>
      {tableInfo.data.length > 0 ? (
        <>
          {
            //@ts-ignore
            <FinanceTable
              cancelSeleceRow={true}
              className={S.tableCss}
              columns={columns}
              dataSource={tableInfo.data}
              showSorterTooltip={false}
              stripe={true}
              scroll={{ x: 1024 }}
              sticky={{
                offsetHeader: debounceScreenHeadHeight ? debounceScreenHeadHeight : 47,
                getContainer: () => document.querySelector('.main-container') as HTMLElement,
              }}
              loading={
                loading
                  ? {
                      wrapperClassName: cn(S.tableLoadingWrapper, {
                        [S.isSortOrPage]: sortChangeLoading,
                      }),
                      tip: '',
                      indicator: loadingTips,
                    }
                  : false
              }
              onChange={sortChange}
            />
          }
          {tableInfo.total > 50 && (
            <Pagination
              current={skip / 50 + 1 || 1}
              pageSize={50}
              total={tableInfo.total}
              style={{ padding: '8px 0px 0px', position: 'relative', marginBottom: 0 }}
              align={'left'}
              onChange={(current) => {
                (document.querySelector('.main-container') as HTMLElement).scrollTop = 0;
                pageChange(current);
              }}
            />
          )}
        </>
      ) : (
        <>
          {loading ? (
            <Loading show={true} />
          ) : (
            <SearchEmptyContainer>
              <Empty
                type={Empty.NO_DATA_IN_FILTER_CONDITION}
                onClick={() => {
                  handleClear();
                }}
              />
            </SearchEmptyContainer>
          )}
        </>
      )}
    </>
  );
}
