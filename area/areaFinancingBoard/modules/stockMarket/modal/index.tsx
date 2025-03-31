import { useEffect, useMemo, useRef } from 'react';

import { useDeepCompareEffect, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import ExportDoc, { EXPORT } from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import Table from '@/components/tableFinance';
import TopicSearch from '@/components/topicSearch';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { shortId } from '@/utils/share';

import { transformParams } from './api';
import FullModal from './fullModal';
import ScreenForm from './screenForm';
import S from './style.module.less';
import Tab from './tab';
import useTab from './tab/useTab';
import { DetailModalInfoMap, DetailModalTypeEnum } from './type';
import useCommonModalScreen from './useCommonModalScreen';
import useModalColumns from './useModalColumns';
import useModalData from './useModalData';

const PAGESIZE = 50;
interface DetailModalProps {
  visible: boolean;
  showTabs?: boolean;
  detailModalConfig: {
    modalType: DetailModalTypeEnum;
    title: string;
    defaultCondition?: any;
    modalTitle?: string;
  };
  closeModal: () => void;
  /** 挂载dom */
  containerRef: any;
}
const DetailModal = ({ visible, showTabs, detailModalConfig, closeModal, containerRef }: DetailModalProps) => {
  const searchRef = useRef<any>(null);
  const tableWrapperRef = useRef<any>(null);
  const tableRef = useRef<HTMLElement>();
  const isLoaded = useRef(false);
  const [showScroll, setShowScroll] = useImmer(false);

  // 根据不同弹窗类型获取不同数据
  const { isFirstLoadRef, page, setPage, handleChangePage, dataSource, companyNum, count, loading, run } = useModalData(
    {
      visible,
      detailModalConfig,
    },
  );
  // 不同弹窗类型不同筛选项
  const {
    screenConfig,
    searchConfig,
    condition,
    handleMenuChange,
    screenValues,
    handleTableSortChange,
    handleReset,
    onClear,
    handleSearch,
    setScreenValues,
    loading: screenLoading,
  } = useCommonModalScreen({
    visible,
    detailModalConfig,
    setPage,
    searchRef,
  });
  // 根据不同弹窗类型获取不同的表格列
  const modalColumns = useModalColumns({ columnType: detailModalConfig.modalType, condition, page });
  //是否展示备注
  const showRemark = useMemo(() => {
    return (
      [DetailModalTypeEnum.NewThirdAdd, DetailModalTypeEnum.StockARefinance].includes(detailModalConfig.modalType) &&
      !!showTabs
    );
  }, [detailModalConfig.modalType, showTabs]);

  // 是否展示导出左侧的详细信息
  const showInfo = useMemo(() => {
    return (
      [DetailModalTypeEnum.NewThirdAdd, DetailModalTypeEnum.StockARefinance].includes(detailModalConfig.modalType) &&
      !showTabs
    );
  }, [detailModalConfig.modalType, showTabs]);

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

  // 翻页
  const onPageChange = useMemoizedFn((p) => {
    if (p === page) return;
    handleChangePage(p);
    run({ ...transformParams(condition), skip: (p - 1) * 50 });
  });

  // 筛选条件发生变化
  useDeepCompareEffect(() => {
    if (condition && Object.keys(condition).length && !isFirstLoadRef.current) {
      run({ ...transformParams(condition), skip: 0 });
      setPage(1);
    }
  }, [condition, isFirstLoadRef, run, setPage]);

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
                noScreen={!screenConfig.length}
                hasBottom={count > PAGESIZE || showRemark}
                style={{ paddingRight: showScroll ? '14px' : '32px' }}
                tabsHeight={showTabs ? 30 : 0}
              >
                {/*@ts-ignore*/}
                <Table
                  customStripe={true}
                  titleCenter={true}
                  onChange={handleTableSortChange}
                  rowKey={() => shortId()}
                  dataSource={dataSource}
                  columns={modalColumns}
                  showSorterTooltip={false}
                  type="stickyTable"
                  className="cityInvestBond_detail_table"
                  scroll={{ x: '100%' }}
                  sticky={{
                    getContainer: () => tableWrapperRef.current || document.body,
                  }}
                  stripe
                />
              </TableContainer>
              {count > PAGESIZE || showRemark ? (
                <Pager hasFooter={showRemark}>
                  {showRemark ? (
                    <div className={S.remark}>注：由于存在企业进行多次融资的情况，弹窗统计数可能大于首页统计家数。</div>
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
    screenConfig.length,
    showRemark,
    showScroll,
    handleTableSortChange,
    dataSource,
    modalColumns,
    page,
    onPageChange,
    handleReset,
    showTabs,
  ]);

  const exportParams = useMemo(() => {
    const sheetObj = DetailModalInfoMap.get(detailModalConfig!.modalType as DetailModalTypeEnum);
    return {
      condition: { ...transformParams(condition), skip: 0 },
      module_type: sheetObj?.exportInfo.module_type,
      filename: detailModalConfig.title || sheetObj?.exportInfo.filename + dayjs().format('YYYYMMDD'),
      type: EXPORT,
    };
  }, [condition, detailModalConfig]);

  const { tabConfig, tab, onTabChange, setTab } = useTab(setScreenValues, isFirstLoadRef);
  const modalTitle = useMemo(() => {
    return (
      <div className={S.modalTitle}>
        <div className={S.title}>
          <div>
            {(showTabs ? detailModalConfig.modalTitle : detailModalConfig.title) ||
              DetailModalInfoMap.get(detailModalConfig.modalType)?.title}
          </div>
        </div>
        {showTabs && <Tab {...{ tabConfig, tab, onTabChange, setTab, show: true }} />}
        {!isLoading && !screenLoading ? (
          <div className={cn(S.filterWrapper, { [S.noScreen]: !screenConfig.length })}>
            <div className={S.left}>
              {screenConfig.length ? (
                <ScreenForm
                  screenConfig={screenConfig}
                  handleMenuChange={handleMenuChange}
                  screenValues={screenValues}
                  key={detailModalConfig.modalType}
                />
              ) : null}
              {searchConfig ? (
                <div style={{ marginLeft: -8 }}>
                  <TopicSearch
                    cref={searchRef}
                    key={`modalSearch`}
                    onClear={onClear}
                    maxSaveLen="20"
                    placeholder="请输入公司名称"
                    onSearch={handleSearch}
                    hasHistory={true}
                    focusedWidth={220}
                    dataKey={searchConfig.dataKey}
                  />
                </div>
              ) : null}
            </div>
            <div className={S['right-title']}>
              {!showInfo ? (
                <div className={S['right-title-content']}>
                  共
                  <span className={S['right-title-content-count']}>
                    {isLoading ? 0 : formatNumber(count, 0) || '0'}
                  </span>
                  条
                </div>
              ) : (
                <div className={S['right-title-content']}>
                  共<span className={S['right-title-content-count']}>{formatNumber(companyNum, 0) || '0'}</span>
                  家企业
                  <span className={S['right-title-content-count']}>
                    {isLoading ? 0 : formatNumber(count || 0, 0) || '0'}
                  </span>
                  条数据
                </div>
              )}
              <ExportDoc {...exportParams} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }, [
    detailModalConfig.title,
    detailModalConfig.modalTitle,
    detailModalConfig.modalType,
    showInfo,
    companyNum,
    isLoading,
    screenConfig,
    handleMenuChange,
    screenValues,
    searchConfig,
    onClear,
    handleSearch,
    count,
    exportParams,
    tab,
    setTab,
    tabConfig,
    onTabChange,
    showTabs,
    screenLoading,
  ]);

  return (
    <FullModal
      visible={visible}
      title={modalTitle}
      closeModal={closeModal}
      pending={false}
      content={modalContent}
      container={containerRef.current || document.body}
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

const TableContainer = styled.div<{ hasBottom: boolean; noScreen: boolean; tabsHeight: number }>`
  height: ${({ hasBottom, noScreen, tabsHeight }) =>
    hasBottom
      ? `calc(100vh - ${noScreen ? 202 + tabsHeight : 232 + tabsHeight}px)`
      : `calc(100vh - ${noScreen ? 200 - 30 + tabsHeight : 200 + tabsHeight}px)`};
  padding: 0 32px;
  overflow-y: auto;
  min-height: ${({ hasBottom, noScreen, tabsHeight }) =>
    hasBottom
      ? `${noScreen ? 178 + tabsHeight : 178 - 30 + tabsHeight}px`
      : `${noScreen ? 208 + tabsHeight : 208 - 30 + tabsHeight}px`};
  .ant-table-sticky-scroll {
    border-bottom: 1px solid #f0f0f0;
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
