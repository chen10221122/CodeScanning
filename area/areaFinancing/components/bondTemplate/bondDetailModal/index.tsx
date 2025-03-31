import { FC, useEffect, useMemo, useRef } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { useCtx } from '@pages/area/areaFinancing/context';

import { Empty, Spin, Table } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import useDetailModal from '@/pages/area/areaFinancing/hooks/useDetailModal';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { useConditionCtx } from '../../commonLayout/context';
import { BondDetailModalInfoMap, BondModalType } from '../type';
import FullModal from './fullModal';
import S from './style.module.less';
import useModalColumns from './useModalColumns';
import useModalData from './useModalData';

const PAGESIZE = 50;

const DetailModal: FC = () => {
  const {
    state: { detailModalConfig },
  } = useConditionCtx();
  const {
    state: { wrapperRef },
  } = useCtx();
  const { visible, closeModal } = useDetailModal();
  // 根据不同弹窗类型获取不同数据
  const { condition, page, onPageChange, handleTableSortChange, handleReset, dataSource, count, loading } =
    useModalData();
  // 根据不同弹窗类型获取不同的表格列
  const modalColumns = useModalColumns({ columnType: detailModalConfig.modalType as BondModalType, condition, page });

  const tableWrapperRef = useRef<any>(null);
  const tableRef = useRef<HTMLElement>();
  const isLoaded = useRef(false);
  const [showScroll, setShowScroll] = useImmer(false);
  //是否展示备注
  const showRemark = useMemo(() => {
    return [BondModalType.FinancialReturn, BondModalType.NormalReturn].includes(detailModalConfig.modalType);
  }, [detailModalConfig.modalType]);

  // 判断页面是否出现滚动条
  useEffect(() => {
    if (count > 0 && !loading) {
      const wrapperH = tableWrapperRef?.current?.offsetHeight || 0;
      const contentH =
        (document.getElementsByClassName('cityInvestBond_detail_table')?.[0] as HTMLElement)?.offsetHeight || 0;
      const isShowScroll = wrapperH < contentH;
      setShowScroll(() => isShowScroll);
    }
  }, [count, loading, setShowScroll]);

  // 每次打开重新拿元素
  useEffect(() => {
    if (visible) {
      tableRef.current = document.getElementById('areaFinancingDetailTableId') as HTMLElement;
    } else isLoaded.current = false;
  }, [visible]);

  // 首次加载
  const isLoading = useMemo(() => {
    if (!isLoaded.current) {
      isLoaded.current = true;
      if (loading) return true;
    } else return false;
  }, [loading]);

  // 回到顶部
  useEffect(() => {
    if (tableRef.current) {
      if (!loading) tableRef.current.scrollTop = 0;
    } else {
      tableRef.current = document.getElementById('areaFinancingDetailTableId') as HTMLElement;
    }
  }, [loading]);

  const modalContent = useMemo(() => {
    return (
      <StyleContent>
        <Spin spinning={loading} type={'fullThunder'}>
          {count ? (
            <>
              <TableContainer
                ref={tableWrapperRef}
                id="areaFinancingDetailTableId"
                hasBottom={count > PAGESIZE || showRemark}
                style={{ paddingRight: showScroll ? '14px' : '32px' }}
              >
                <Table
                  onChange={handleTableSortChange}
                  rowKey={() => shortId()}
                  dataSource={dataSource}
                  columns={modalColumns}
                  showSorterTooltip={false}
                  type="stickyTable"
                  className="cityInvestBond_detail_table"
                  scroll={{ x: 'max-content' }}
                  sticky={{
                    getContainer: () => tableWrapperRef.current || document.body,
                  }}
                />
              </TableContainer>
              {count > PAGESIZE || showRemark ? (
                <Pager showRemark={showRemark}>
                  {showRemark ? (
                    <div className={'remark'}>注：同一只债券出现多次偿还时，债券明细中会多次展示该只债券。</div>
                  ) : null}
                  {count > PAGESIZE ? (
                    <Pagination total={count} current={page} pageSize={PAGESIZE} onChange={onPageChange} />
                  ) : null}
                </Pager>
              ) : null}
            </>
          ) : (
            <>
              {!loading && <div className={S.emptyWrapper} />}
              <Empty type={Empty.NO_DATA_NEW} onClick={handleReset} />
            </>
          )}
        </Spin>
      </StyleContent>
    );
  }, [
    loading,
    count,
    showScroll,
    handleTableSortChange,
    dataSource,
    modalColumns,
    showRemark,
    page,
    onPageChange,
    handleReset,
  ]);

  const exportParams = useMemo(() => {
    const sheetObj = BondDetailModalInfoMap.get(detailModalConfig!.modalType as BondModalType);
    return {
      condition: condition,
      module_type: sheetObj?.exportInfo.module_type,
      filename: detailModalConfig.title + dayjs().format('YYYYMMDD'),
      type: EXPORT,
    };
  }, [condition, detailModalConfig]);
  const modalTitle = useMemo(() => {
    return (
      <div className={S.modalTitle}>
        <div className={S.title}>
          <div>{detailModalConfig.title}</div>
          <div className={S['right-title']}>
            <div className={S['right-title-content']}>
              共计
              <span className={S['right-title-content-count']}>{isLoading ? 0 : formatNumber(count, 0) || '0'}</span>条
            </div>
            <ExportDoc {...exportParams} />
          </div>
        </div>
      </div>
    );
  }, [detailModalConfig.title, isLoading, count, exportParams]);

  return (
    <FullModal
      visible={visible}
      title={modalTitle}
      closeModal={closeModal}
      pending={false}
      content={modalContent}
      container={wrapperRef || window}
      wrapClassName={S.modalWrapper}
      maskClosable={true}
    />
  );
};

export default DetailModal;

const StyleContent = styled.div`
  padding-left: 32px;
  height: 100%;
  > div {
    padding: 0;
    margin: 0;
    > div {
      display: block;
      > div {
        height: 100%;
      }
    }
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

const TableContainer = styled.div<{ hasBottom: boolean }>`
  height: ${({ hasBottom }) => (hasBottom ? 'calc(100vh - 204px)' : 'calc(100vh - 172px)')};
  padding: 0 32px;
  overflow-y: auto;
  min-height: ${({ hasBottom }) => (hasBottom ? '176px' : '208px')};
  .ant-table-sticky-scroll {
    border-bottom: 1px solid #f0f0f0;
  }
  @media screen and (max-width: 1279px) {
    height: calc(100vh - 219px);
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
`;

const Pager = styled.div<{ showRemark?: boolean }>`
  height: 32px;
  padding: 12px 32px 0;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 1;
  display: ${({ showRemark }) => (showRemark ? 'flex' : 'block')};
  justify-content: space-between;
  .remark {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 20px;
  }
  ul {
    float: right;
    margin-bottom: 0 !important;
  }
`;
