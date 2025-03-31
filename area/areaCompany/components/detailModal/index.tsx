import React, { FC, useMemo, useRef, useEffect } from 'react';

import cn from 'classnames';
import { isFunction } from 'lodash';
import styled, { createGlobalStyle } from 'styled-components';

import { Table, Empty, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import { LoadingTips } from '@/pages/area/areaCompany/components/moduleTemplate/tableWithLoading';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import FullModal from './fullModal';

const PAGESIZE = 50;

interface ModalTypes {
  visible: boolean;
  setVisible: Function;
  count: number;
  title: string;
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
  containerID?: string | React.ReactNode;
  loading: boolean;
  /** 弹窗层级，默认18 */
  zIndex?: number;
  /** 弹窗命名前缀，一般是模块名 */
  detailModalPrefix?: string;
  /** 特殊样式覆盖 */
  specialStyleStr?: string;
  /** 表格底部备注内容 */
  bottomRemark?: string;
}

const DetailModal: FC<ModalTypes> = ({
  visible,
  setVisible,
  count,
  title,
  tableConfig,
  exportConfig,
  page,
  onPageChange,
  onTableChange,
  containerID = 'area-company-index-container',
  loading,
  zIndex = 18,
  detailModalPrefix = 'area-company',
  specialStyleStr,
  bottomRemark
}) => {
  const wrapperRef = useRef<any>(null);
  const isLoaded = useRef(false);
  const [showScroll, setShowScroll] = useImmer(false);
  // 判断页面是否出现滚动条
  useEffect(() => {
    if (count > 0 && !loading) {
      const wrapperH = wrapperRef?.current?.offsetHeight || 0;
      const contentH =
        (document.getElementsByClassName(`${detailModalPrefix}-detail-table`)?.[0] as HTMLElement)?.offsetHeight || 0;
      setShowScroll(() => wrapperH < contentH);
    }
  }, [count, loading, setShowScroll, detailModalPrefix]);

  const tableContainerId = useMemo(() => `${detailModalPrefix}-detail-modal-tableID`, [detailModalPrefix]);

  /** 是否底部有分页 */
  const hasBottom = useMemo(() => count > PAGESIZE || !!bottomRemark, [count, bottomRemark]);

  // 每次打开重新拿元素
  useEffect(() => {
    if (visible) {
      // 重置
      isFunction(onPageChange) && onPageChange(1);
    } else isLoaded.current = false;
  }, [visible, tableContainerId, onPageChange]);

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
      if (loading) return true;
    } else return false;
  }, [loading]);

  // 回到顶部
  useEffect(() => {
    const wrap = document.getElementById(tableContainerId) as HTMLElement;
    if (wrap) {
      wrap.scrollTop = 0;
      wrap.setAttribute(
        'style',
        `overflow-y:
        ${loading ? 'hidden' : 'auto'}`,
      );
    }
  }, [loading, tableContainerId]);

  const modalContent = useMemo(() => {
    return (
      <StyleContent>
        <Spin spinning={isLoading} type={'thunder'}>
          {count ? (
            <>
              <TableContainer
                ref={wrapperRef}
                id={tableContainerId}
                hasBottom={hasBottom}
                specialStyleStr={specialStyleStr}
                showScroll={showScroll}
              >
                <Table
                  rowKey={() => shortId()}
                  {...tableConfig.restConfig}
                  columns={curColumns}
                  dataSource={tableConfig.dataSource}
                  type="stickyTable"
                  className={`${detailModalPrefix}-detail-table`}
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
                  <span className='remark'>{bottomRemark}</span>
                  {count > PAGESIZE ? (
                    <Pagination total={count} current={page} pageSize={PAGESIZE} onChange={onPageChange} />
                  ) : null}
                </Pager>
              ) : null}
            </>
          ) : (
            <Empty type={Empty.NO_DATA_NEW_IMG} />
          )}
        </Spin>
      </StyleContent>
    );
  }, [
    isLoading,
    loading,
    tableConfig.dataSource,
    tableConfig.restConfig,
    curColumns,
    count,
    page,
    bottomRemark,
    showScroll,
    hasBottom,
    detailModalPrefix,
    tableContainerId,
    onPageChange,
    onTableChange,
    specialStyleStr,
  ]);

  const modalTitle = useMemo(() => {
    return (
      <ModalTitle>
        <div className="title">{title}</div>
        <div className="right-title">
          <div className="right-title-content">
            共<span className="right-title-content-count">{isLoading ? 0 : formatNumber(count, 0) || '0'}</span>条
          </div>
          <ExportDoc {...exportConfig} />
        </div>
      </ModalTitle>
    );
  }, [title, count, isLoading, exportConfig]);

  return (
    <>
      <CityDetailBondGlobalStyle />
      <FullModal
        visible={visible}
        title={[modalTitle]}
        setVisible={setVisible}
        pending={false}
        content={modalContent}
        container={
          ((typeof containerID === 'string' ? document.getElementById(containerID) : containerID) ||
            document.body) as HTMLElement
        }
        wrapClassName={cn('detail-modal', `${detailModalPrefix}-detail-modal`)}
        maskClosable={true}
        zIndex={zIndex}
      />
    </>
  );
};

export default DetailModal;

const CityDetailBondGlobalStyle = createGlobalStyle`
  /* 样式覆盖 */
  .detail-modal {
    &.modal-mask-scroll .ant-modal .ant-modal-content {
      height: calc(100vh - 86px);
      border-radius: 2px;
      .ant-modal-header {
        padding-bottom: 12px;
      }
    }
    .ant-spin-container {
      height: 100%;
      .ant-empty-image {
        padding-top: 180px;
      }
    }
  }
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    height: 27px;
    font-size: 18px;
    color: #141414;
    font-weight: 500;
    line-height: 27px;
  }
  .right-title {
    display: flex;
    align-items: center;
    .right-title-content {
      font-size: 12px;
      color: #666666;
      line-height: 18px;
      margin-right: 24px;
      font-weight: 400;
      .right-title-content-count {
        color: #ff7500;
        margin: 0 2px;
      }
    }
  }
`;

const StyleContent = styled.div`
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

const TableContainer = styled.div<{ hasBottom: boolean; specialStyleStr?: string; showScroll?: boolean }>`
  height: ${({ hasBottom }) => (hasBottom ? 'calc(100vh - 180px)' : 'calc(100vh - 152px)')};
  overflow-y: auto;
  padding-right:${({ showScroll }) => showScroll ? '14px' : '32px'} ;
  .ant-table-sticky-scroll {
    border-bottom: 1px solid #f0f0f0;
  }
  @media screen and (max-width: 1279px) {
    height: calc(100vh - 193px);
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
  ${({ specialStyleStr }) => {
    return specialStyleStr ? specialStyleStr : '';
  }}

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
  padding: 8px 32px 0  0;
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
