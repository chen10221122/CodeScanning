import React, { FC, useMemo, useRef, useEffect } from 'react';

import { useSize } from 'ahooks';
import cn from 'classnames';
import { isFunction } from 'lodash';
import styled, { createGlobalStyle, css } from 'styled-components';

import { Table, Empty, Spin } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { Options, RowItem } from '@/components/screen';
import FullModal from '@/pages/area/areaCompany/components/detailModal/fullModal';
import { LoadingTips } from '@/pages/area/areaCompany/components/moduleTemplate/tableWithLoading';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useLoading } from '@/utils/hooks';

import { DescProps, descMap } from '../config';
import { Filter, Title, Desc } from './components';

interface ModalTypes {
  visible: boolean;
  setVisible: Function;
  count: number;
  title: string;
  filterConfig: {
    loading: boolean;
    filterMenu: Options[];
    years: Record<string, any>[];
    desc: DescProps;
    screenKey: string;
  };
  tableConfig: {
    /** 元数据 */
    dataSource: Array<any>;
    /** 列配置 */
    columns: Array<any>;
    restConfig?: Record<string, any>;
  };
  exportConfig: {
    condition: Record<string, any>;
    filename: string;
  };
  /** 页数 1开始 */
  page?: number;
  onPageChange?: (current: number) => void;
  onTableChange?: (_: any, __: any, sorter: any) => void;
  onFilterChange: (cur: RowItem[], all: RowItem[], idx: number) => void;
  onYearChange: (cur: RowItem[], all: RowItem[], idx: number) => void;
  onSearch: Function;
  onClearSearch: Function;
  onClearFilter: Function;
  containerID?: string | React.ReactNode;
  loading: boolean;
  /** 弹窗层级，默认18 */
  zIndex?: number;
  /** 弹窗命名前缀，一般是模块名 */
  detailModalPrefix?: string;
}

const DetailModal: FC<ModalTypes> = ({
  visible,
  setVisible,
  count,
  title,
  filterConfig,
  tableConfig,
  exportConfig,
  page,
  onPageChange,
  onTableChange,
  onFilterChange,
  onYearChange,
  onSearch,
  onClearSearch,
  onClearFilter,
  containerID = 'area-company-index-container',
  loading,
  zIndex = 18,
  detailModalPrefix = 'area-company-private',
}) => {
  const isLoaded = useRef(false);

  const { tableContainerId, tableContentId } = useMemo(
    () => ({
      tableContainerId: `${detailModalPrefix}-detail-modal-tableID`,
      tableContentId: `${detailModalPrefix}-detail-table`,
    }),
    [detailModalPrefix],
  );

  const wrapSize = useSize(document.getElementById(tableContainerId));
  const contentSize = useSize(document.getElementById(tableContentId));

  const showScroll = useMemo(() => {
    if (visible && !loading) {
      return (wrapSize?.height || 0) <= (contentSize?.height || 0);
    } else {
      return false;
    }
  }, [visible, loading, wrapSize, contentSize]);

  /** 是否底部有分页 */
  const hasBottom = useMemo(() => count > PAGESIZE, [count]);

  // 每次打开重新拿元素
  useEffect(() => {
    if (visible) {
      // 重置
      isFunction(onPageChange) && onPageChange(1);
    } else isLoaded.current = false;
  }, [visible, onPageChange]);

  // 重写序号列
  const curColumns = useMemo(() => {
    if (tableConfig.columns && page) {
      tableConfig.columns[0].render = (_: any, __: any, idx: number) => (page - 1) * PAGESIZE + idx + 1;
      tableConfig.columns[0].width = 42 + Math.max((String(page * PAGESIZE).length - 2) * 13, 0);
    }
    return tableConfig.columns;
  }, [tableConfig.columns, page]);

  // 首次加载
  const isLoading = useMemo(() => {
    if (!isLoaded.current) {
      isLoaded.current = true;
      if (loading || filterConfig.loading) return true;
    } else return false;
  }, [loading, filterConfig.loading]);
  const firstFirstLoading = useLoading(filterConfig.loading);
  const firstTableLoading = useLoading(loading);
  /** 筛选接口loading以及第一次列表请求loading 错误重试loading */
  const bigLoading = useMemo(
    () => (count ? firstTableLoading || filterConfig.loading : loading),
    [count, loading, firstTableLoading, filterConfig.loading],
  );

  // 回到顶部
  useEffect(() => {
    const wrap = document.getElementById(tableContainerId) as HTMLElement;
    if (wrap) {
      wrap.scrollTop = 0;
      wrap.setAttribute('style', `overflow-y: ${loading ? 'hidden' : 'auto'}`);
    }
  }, [loading, tableContainerId]);

  const modalTitle = useMemo(() => {
    return visible ? (
      <Title title={title} years={firstFirstLoading ? [] : filterConfig.years} onYearChange={onYearChange} />
    ) : null;
  }, [visible, title, filterConfig.years, firstFirstLoading, onYearChange]);
  const modalDesc = useMemo(() => {
    const hasDesc = Array.from(descMap.values()).some((key) => filterConfig.desc[key as keyof DescProps]);
    return hasDesc ? <Desc descInfo={filterConfig.desc} /> : null;
  }, [filterConfig.desc]);

  const modalFilter = useMemo(
    () => (
      <Filter
        exportConfig={exportConfig}
        count={count}
        filterMenu={filterConfig.filterMenu}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        screenKey={filterConfig.screenKey}
      />
    ),
    [
      exportConfig,
      count,
      filterConfig.filterMenu,
      // filterConfig.loading,
      filterConfig.screenKey,
      onFilterChange,
      onSearch,
      onClearSearch,
    ],
  );

  const modalContent = useMemo(() => {
    return (
      <StyleContent hasDesc={!!modalDesc}>
        <Spin spinning={bigLoading} type={'thunder'}>
          {modalDesc}
          {modalFilter}
          {count ? (
            <>
              <TableContainer
                // ref={wrapperRef}
                id={tableContainerId}
                hasBottom={hasBottom}
                showScroll={showScroll}
                hasDesc={!!modalDesc}
              >
                <Table
                  rowKey={(v: any) => JSON.stringify(v)}
                  {...tableConfig.restConfig}
                  columns={curColumns}
                  dataSource={tableConfig.dataSource}
                  type="stickyTable"
                  id={tableContentId}
                  scroll={{ x: 'max-content' }}
                  sticky={{
                    getContainer: () => document.getElementById(tableContainerId) || document.body,
                  }}
                  onChange={onTableChange}
                  showSorterTooltip={false}
                  loading={
                    loading
                      ? {
                          wrapperClassName: 'mount-table-loading',
                          tip: '加载中',
                          indicator: <LoadingTips />,
                        }
                      : false
                  }
                />
              </TableContainer>
              {hasBottom ? (
                <Pager>
                  {count > PAGESIZE ? (
                    <Pagination total={count} current={page} pageSize={PAGESIZE} onChange={onPageChange} />
                  ) : null}
                </Pager>
              ) : null}
            </>
          ) : (
            <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={onClearFilter as any} />
          )}
        </Spin>
      </StyleContent>
    );
  }, [
    modalDesc,
    modalFilter,
    bigLoading,
    loading,
    tableConfig.dataSource,
    tableConfig.restConfig,
    curColumns,
    count,
    page,
    showScroll,
    hasBottom,
    tableContainerId,
    tableContentId,
    onPageChange,
    onTableChange,
    onClearFilter,
  ]);

  return (
    <>
      <CityDetailBondGlobalStyle />
      <FullModal
        visible={visible}
        // 关闭弹窗卸载title组件
        title={modalTitle}
        setVisible={setVisible}
        pending={isLoading}
        content={modalContent}
        container={
          ((typeof containerID === 'string' ? document.getElementById(containerID) : containerID) ||
            document.body) as HTMLElement
        }
        wrapClassName={cn('private-enterprises-detail-modal', `${detailModalPrefix}-detail-modal`)}
        maskClosable={true}
        zIndex={zIndex}
      />
    </>
  );
};

export default DetailModal;

const CityDetailBondGlobalStyle = createGlobalStyle`
  /* 样式覆盖 */
  .private-enterprises-detail-modal {
    &.modal-mask-scroll .ant-modal .ant-modal-content {
      height: calc(100vh - 86px);
      border-radius: 2px;
      .ant-modal-header {
        padding-bottom: 4px;
      }
    }
    .ant-spin-container {
      height: 100%;
      .ant-empty-image {
        padding-top: 120px;
      }
    }
  }
`;

const StyleContent = styled.div<{ hasDesc: boolean }>`
  /* margin-top: ${({ hasDesc }) => (hasDesc ? '-4px' : '-10px')}; */
  margin-top: -4px;
  padding-left: 32px;
  height: 100%;
  > div {
    padding: 0;
    margin: 0;
  }

  .full-modal-container-style {
    height: 100%;
  }

  .full-modal-header-style {
    padding: 24px 0 12px;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 2;
  }
`;

const TableContainer = styled.div<{
  hasBottom: boolean;
  hasDesc: boolean;
  specialStyleStr?: string;
  showScroll?: boolean;
}>`
  /* height: ${({ hasBottom }) => (hasBottom ? 'calc(100vh - 180px)' : 'calc(100vh - 152px)')}; */
  ${({ hasDesc, hasBottom }) => {
    const extraHeight = hasDesc ? 0 : 28;
    return hasBottom
      ? css`
          height: calc(100% - 78px - ${extraHeight}px);
          @media screen and (max-width: 1279px) {
            height: calc(100% - 96px);
          }
        `
      : css`
          height: calc(100% - 52px - ${extraHeight}px);
          @media screen and (max-width: 1279px) {
            height: calc(100% - 64px);
          }
        `;
  }}
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding-right: 14px;

  /* 防止双滚动条 */
  .ant-table-sticky-scroll {
    border-bottom: 1px solid #f0f0f0;
    display: ${({ showScroll }) => (showScroll ? 'block' : 'none')};
  }
  ::-webkit-scrollbar {
    width: 18px;
  }
  ::-webkit-scrollbar-thumb {
    color: #cfcfcf;
    border: 6px solid transparent;
  }
  .ant-table-container::after {
    display: none;
  }

  .ant-table-column-sorters .ant-table-column-sorter {
    line-height: 16px;
  }

  .mount-table-loading {
    & {
      position: initial;
    }
    .ant-spin-container {
      opacity: 1;
      overflow: visible !important;
      transition: none;
      &:after {
        top: 34px;
        opacity: 0.85;
        transition: none;
        z-index: 2 !important;
        height: calc(100% - 30px) !important;
      }
    }
    .ant-spin-spinning {
      transition: none;
      max-height: none;
      .loading-tips {
        display: inline-block;
        width: 88px;
        height: 88px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 22px 6px rgba(44, 44, 48, 0.07);
        margin-top: -44px;
        margin-left: -44px;
        opacity: 1;
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 50%;

        .loading-text {
          font-size: 13px;
          color: #434343;
          line-height: 20px;
          margin-top: 6px;
          display: block;
        }
      }
      .ant-spin-text {
        display: none;
      }
    }
  }
`;

const Pager = styled.div`
  height: 56px;
  padding: 8px 32px 0 0;
  position: sticky;
  bottom: -56px;
  background-color: #fff;
  z-index: 1;
  display: block;
  justify-content: space-between;
  .remark {
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #8c8c8c;
    line-height: 18px;
  }
  ul {
    float: right;
    margin-bottom: 0 !important;
  }
`;
