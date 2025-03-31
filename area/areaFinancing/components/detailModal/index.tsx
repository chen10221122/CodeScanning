import { FC, useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isFunction } from 'lodash';
import styled from 'styled-components';

import useModalColumns from '@pages/area/areaFinancing/components/detailModal/useModalColumns';
import { useCtx } from '@pages/area/areaFinancing/context';
import { DetailModalExportMap, DetailModalTypeEnum } from '@pages/area/areaFinancing/types';

import { Empty, Spin, Table } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import useCommonModalScreen from '@/pages/area/areaFinancing/components/detailModal/useCommonModalScreen';
import useDetailModal from '@/pages/area/areaFinancing/hooks/useDetailModal';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { useConditionCtx } from '../commonLayout/context';
import ScreenForm from '../screenForm';
import FullModal from './fullModal';
import S from './style.module.less';
import useModalData from './useModalData';

const PAGESIZE = 50;

const DetailModal: FC = () => {
  const {
    state: { detailModalConfig },
  } = useConditionCtx();
  const {
    state: { wrapperRef },
  } = useCtx();
  const hasFooter = useMemo(() => {
    return (
      detailModalConfig.modalType &&
      [
        DetailModalTypeEnum.StockA,
        DetailModalTypeEnum.HK,
        DetailModalTypeEnum.StockThirdPriority,
        DetailModalTypeEnum.StockThirdPlus,
      ].includes(detailModalConfig.modalType)
    );
  }, [detailModalConfig.modalType]);
  const { visible, closeModal } = useDetailModal();

  // 不同弹窗类型不同筛选项
  const {
    condition,
    screenConfig,
    handleMenuChange,
    screenValues,
    page,
    setPage,
    handleChangePage,
    handleTableSortChange,
    handleReset,
  } = useCommonModalScreen();
  // 根据不同弹窗类型获取不同数据
  const { dataSource, count, loading, run } = useModalData();
  // 根据不同弹窗类型获取不同的表格列
  const modalColumns = useModalColumns({ columnType: detailModalConfig.modalType, condition });

  const tableWrapperRef = useRef<any>(null);
  const tableRef = useRef<HTMLElement>();
  const isLoaded = useRef(false);
  const [showScroll, setShowScroll] = useImmer(false);
  // 翻页
  const onPageChange = useMemoizedFn((p) => {
    if (p === page) return;
    handleChangePage(p);
    run({ ...condition, from: (p - 1) * 50 });
  });

  // 筛选条件发生变化
  useEffect(() => {
    if (condition && Object.keys(condition).length) {
      run({ ...condition, from: 0 });
      setPage(1);
    }
  }, [condition, run, setPage]);

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

  /** 是否底部有分页或备注文字 */
  const hasBottom = useMemo(() => hasFooter || count > PAGESIZE, [hasFooter, count]);

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
                hasBottom={hasBottom}
                noScreen={!screenConfig.length}
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
              {hasBottom ? (
                <Pager hasFooter={hasFooter}>
                  {hasFooter ? (
                    <div className={S.remark}>注：因企业存在多次融资情况，故明细数可能会大于统计家数。</div>
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
              <Empty type={Empty.NO_SCREEN_DATA_CLEAR} onClick={handleReset} />
            </>
          )}
        </Spin>
      </StyleContent>
    );
  }, [
    loading,
    count,
    hasBottom,
    screenConfig.length,
    showScroll,
    handleTableSortChange,
    dataSource,
    modalColumns,
    hasFooter,
    page,
    onPageChange,
    handleReset,
  ]);

  const exportParams = useMemo(() => {
    const sheetObj = DetailModalExportMap.get(detailModalConfig.modalType || DetailModalTypeEnum.StockA);

    return {
      type: EXPORT,
      condition: {
        ...condition,
        sheetIndex:
          sheetObj && isFunction(sheetObj?.sheetIndex)
            ? sheetObj.sheetIndex(
                detailModalConfig.modalType === DetailModalTypeEnum.Ipo ? condition.state : condition.financeType,
              )
            : sheetObj?.sheetIndex,
      },
      module_type: 'Region_Finance_import',
      filename: sheetObj?.filename,
    };
  }, [condition, detailModalConfig.modalType]);
  const modalTitle = useMemo(() => {
    return (
      <div className={S.modalTitle}>
        <div className={S.title}>{detailModalConfig.title}</div>
        {!isLoading ? (
          <div className={cn(S.filterWrapper, { [S.noScreen]: !screenConfig.length })}>
            <div className={S.left}>
              {screenConfig.length ? (
                <ScreenForm
                  screenConfig={screenConfig}
                  handleMenuChange={handleMenuChange}
                  screenValues={screenValues}
                />
              ) : null}
            </div>
            <div className={S['right-title']}>
              <div className={S['right-title-content']}>
                共计
                <span className={S['right-title-content-count']}>{isLoading ? 0 : formatNumber(count, 0) || '0'}</span>
                条
              </div>
              <ExportDoc {...exportParams} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }, [detailModalConfig.title, screenConfig, isLoading, handleMenuChange, screenValues, count, exportParams]);

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

const TableContainer = styled.div<{ hasBottom: boolean; noScreen: boolean }>`
  height: ${({ hasBottom, noScreen }) =>
    hasBottom ? `calc(100vh - ${noScreen ? 202 : 232}px)` : `calc(100vh - ${noScreen ? 200 - 30 : 200}px)`};
  padding: 0 32px;
  overflow-y: auto;
  min-height: ${({ hasBottom, noScreen }) =>
    hasBottom ? `${noScreen ? 178 : 178 - 30}px` : `${noScreen ? 208 : 208 - 30}px`};
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

const Pager = styled.div<{ hasFooter?: boolean }>`
  height: 32px;
  padding: 12px 32px 0;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 1;
  display: ${({ hasFooter }) => (hasFooter ? 'flex' : 'block')};
  justify-content: space-between;
  ul {
    float: right;
    margin-bottom: 0 !important;
  }
`;
