import { FC, ReactElement, useMemo, useEffect } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import { debounce } from 'lodash';
import styled from 'styled-components';

import { DEFAULT_PAGE_BOTTOM_MARGIN, DEFAULT_PAGE_TOP_MARGIN } from '@/app';
import Icon from '@/components/icon';
// import { scrollTo } from '@/utils/animate';
import { useImmer } from '@/utils/hooks';

interface StyleProps {
  top: number;
  tableViewHeight: number;
  tableViewNoPageHeight: number;
  clientHeight: number;
  viewHeight: number;
  hasNoTableStickyScroll: boolean;
  specialStyleStr?: string;
}

interface TableWithLoadingProps {
  /** 包裹table的父级元素的id */
  tableContentId?: string;
  /** table下方元素的id，根据页面来取名即可 */
  tableAfterId?: string;
  /** 监听scroll事件的元素 */
  scrollDom?: HTMLElement | null;
  /** 页面内有多个table时需要，最外层的dom。高度应该是随table变化的 */
  containerDom?: HTMLElement | null;
  /** 表格数据变化的loading */
  loading?: boolean;
  /** 是否有翻页 */
  hasPagination?: boolean;
  children?: ReactElement;
  specialStyleStr?: string;
  noDelay?: boolean;
  className?: string;
}

export const LoadingTips = () => {
  return useMemo(() => {
    return (
      <span className="loading-tips">
        <Icon
          style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
          image={require('@/assets/images/common/loading.gif')}
        />
        <span className="loading-text">加载中</span>
      </span>
    );
  }, []);
};

const scrollEvent = new Event('scroll');

const TableWithLoading: FC<TableWithLoadingProps> = ({
  tableContentId,
  tableAfterId,
  scrollDom,
  containerDom,
  loading,
  hasPagination,
  children,
  specialStyleStr,
  noDelay,
  className,
}) => {
  const [tableViewSize, updateTableViewSize] = useImmer({
    tableViewNoPageHeight: 0,
    tableViewHeight: 0,
    top: 0,
    clientHeight: 0,
  });

  const size = useSize(containerDom);
  const rootSize = useSize(document.getElementById('root'));

  /** 滚动到头部事件 */
  // useEffect(() => {
  //   const wrap = document.getElementById('area-company-index-container') as HTMLElement;
  //   if (wrap) {
  //     wrap.setAttribute(
  //       'style',
  //       `overflow-y:
  //       ${loading ? 'hidden !important' : 'overlay'}`,
  //     );
  //     scrollTo(0, {
  //       getContainer: () => wrap,
  //       duration: 0,
  //     });
  //   }
  // }, [loading]);

  // 获取页面相关元素的尺寸
  const getTableViewHeight = useMemoizedFn(() => {
    const rootHeight = rootSize ? rootSize.height - DEFAULT_PAGE_BOTTOM_MARGIN : 0;
    const originTop = document.querySelector(`#${tableContentId} .ant-table-thead`)?.getBoundingClientRect().top || 0;
    const originBottom = document.getElementById(`${tableAfterId}`)?.getBoundingClientRect().top || 0;
    // 32是翻页器高度
    const originNoPageBottom = originBottom - (hasPagination ? 32 : 0);
    const bottom = rootSize ? Math.min(rootHeight, originBottom) : originBottom;
    const noPageBottom = rootSize ? Math.min(rootHeight, originNoPageBottom) : originNoPageBottom;
    const top = rootSize ? Math.min(rootHeight, originTop) : originTop;
    return {
      tableViewNoPageHeight: Math.max(0, noPageBottom) - Math.max(0, top),
      tableViewHeight: Math.max(0, bottom) - Math.max(0, top),
      top: Math.max(0, top),
    };
  });

  const hasNoTableStickyScroll = useMemo(() => {
    // 40是顶部36+4间距
    return (
      tableViewSize.top - DEFAULT_PAGE_TOP_MARGIN - 40 + tableViewSize.tableViewNoPageHeight <
      (scrollDom?.clientHeight || 0)
    );
  }, [tableViewSize, scrollDom]);

  useEffect(() => {
    if (scrollDom) scrollDom.dispatchEvent(scrollEvent);
  }, [size?.height, scrollDom]);

  // 监听页面滚动
  useEffect(() => {
    const debounceScroll = debounce(
      () => {
        updateTableViewSize((d) => {
          const { tableViewNoPageHeight, tableViewHeight, top } = getTableViewHeight();
          d.tableViewNoPageHeight = tableViewNoPageHeight;
          d.tableViewHeight = tableViewHeight;
          d.top = top;
        });
      },
      noDelay ? 0 : 500,
    );
    getTableViewHeight();
    if (scrollDom) {
      scrollDom.addEventListener('scroll', debounceScroll);
    }
    return () => {
      scrollDom?.removeEventListener('scroll', debounceScroll);
    };
  }, [getTableViewHeight, updateTableViewSize, scrollDom, noDelay]);

  // 页面高度以及表格数据变化也重新计算
  useEffect(() => {
    debounce(
      () => {
        updateTableViewSize((d) => {
          const { tableViewNoPageHeight, tableViewHeight, top } = getTableViewHeight();
          d.tableViewNoPageHeight = tableViewNoPageHeight;
          d.tableViewHeight = tableViewHeight;
          d.top = top;
          d.clientHeight = document.querySelector(`#${tableContentId} .ant-table-wrapper`)?.clientHeight || 0;
        });
      },
      noDelay ? 0 : 200,
    )();
  }, [getTableViewHeight, updateTableViewSize, size?.height, loading, tableContentId, noDelay]);

  return (
    <TableLoadingContianer
      className={className}
      top={tableViewSize.top}
      tableViewHeight={tableViewSize.tableViewHeight}
      tableViewNoPageHeight={tableViewSize.tableViewNoPageHeight}
      clientHeight={tableViewSize.clientHeight}
      viewHeight={scrollDom?.clientHeight || 0}
      specialStyleStr={specialStyleStr}
      hasNoTableStickyScroll={hasNoTableStickyScroll}
    >
      {children}
      <div id={`${tableAfterId}`}></div>
    </TableLoadingContianer>
  );
};

export default TableWithLoading;

export const TableLoadingContianer = styled.div<StyleProps>`
  .ant-table-thead > tr > th {
    text-align: center !important;
  }
  /** 表头压缩显示... */
  .areaf9-tbl-header {
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .resizeable-th-wrapper {
    > div:first-child {
      -webkit-line-clamp: 1 !important;
      min-width: 0 !important;
    }
    /** 解决上市企业表头排序图标掉落问题 */
    .ant-table-column-sorters {
      display: inline-flex;
    }
  }
  /** 解决排序列背景遮挡的问题 */
  .ant-table-column-sort {
    background: #fff;
  }

  /** 解决点击排序时表头跳动的问题 */
  .ant-table-column-sorters {
    display: inline-flex;
    align-items: center;
    .ant-table-column-title {
      height: 18px;
    }
    .ant-table-column-sorter-full {
      height: 18px;
    }
  }
  .mount-table-loading {
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
      z-index: 6;
      .loading-tips {
        width: 88px;
        height: 88px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 22px 6px rgba(44, 44, 48, 0.07);
        margin-top: 0 !important;
        margin-left: -44px;
        opacity: 1;
        z-index: 1;
        /* clientHeight大于视口的高度sticky，小于的话absolute */
        /* sticky的bottom为50%
           absolute时计算：上相交的话计算bottom 下相交的话计算top
            下相交判断：top + tableViewHeight > viewHeight
        */
        ${({ top, tableViewHeight, clientHeight, viewHeight }) => {
          const isSticky = !clientHeight || clientHeight > viewHeight;
          const isDownInsert = top + tableViewHeight > viewHeight;
          const distance = (((tableViewHeight / 2 - 44) / clientHeight) * 100).toFixed(2);
          return `
            ${
              isSticky
                ? `
              display: block;
              position: sticky;
              top: null;
              top: 40%;
              left: 50%;
            `
                : `
              position: absolute;
              top: ${isDownInsert ? `${distance}%` : 'initial'};
              bottom: ${isDownInsert ? 'initial' : `${distance}%`};
            `
            }
          `;
        }}

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

  /* 防止双滚动条 */
  .ant-table-sticky-scroll {
    display: ${({ hasNoTableStickyScroll }) => (hasNoTableStickyScroll ? 'none' : 'block')};
  }

  ${({ specialStyleStr }) => {
    return specialStyleStr ? specialStyleStr : '';
  }}

  .ant-table-container .ant-table-header.ant-table-sticky-holder {
    z-index: 5 !important;
  }

  .ant-table-column-sorters .ant-table-column-sorter {
    padding-left: unset;
    margin-left: unset;
  }

  /* .ant-table-tbody > tr > td {
    &.wrapLineCol:not(.ant-table-cell-fix-left) {
      .wrapLine > div {
        min-width: 0 !important;
      }
    }
    &.areaf9-revoke-itname-column {
    .wrapLine > div {
      min-width: 0 !important;
    }
    }
  } */
`;
