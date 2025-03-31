import { FC, memo, useRef, useEffect } from 'react';

import { ProTableNews } from '@dzh/pro-components';
import { useSafeState, useSize } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Empty } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { useNewsDetail } from '@/globalComponent/newsDetail';
import { EmptyTableWrapperFull } from '@/pages/detail/common/style';

import { conditionType } from '../../index';
import useColumns from './useColumns';
import useTableData from './useTableData';

interface PublicSentimentTableProps {
  /** */
  condition: conditionType;
  /**模块类型 */
  moduleType?: string;
  /**搜索关键字 */
  keyWord: string;
  /**数据条数 */
  total: number;
  /**数据条数 */
  current: number;
  /**地区code */
  // regionCode: string;
  hasTabData: boolean;
  containerRef: any;
  /**首次加载状态 */
  firstTimeLoading: boolean;
  /**筛选变更加载 */
  screenLoading: boolean;
  firstTimeNoData: boolean;
  setFirstTimeNoData: (val: boolean) => void;
  setScreenLoading: (val: boolean) => void;
  setFirstTimeLoading: (val: boolean) => void;
  setDataCount: (val: number) => void;
  setCurrent: (val: number) => void;
  /**清空筛选回调 */
  handleReset: () => void;
  scrollTop: () => void;
  handleTabChange: (data: any[], type?: string) => void;
  handleAreaItemClick: (code: string) => void;
}

const PublicSentimentTable: FC<PublicSentimentTableProps> = ({
  condition,
  moduleType,
  keyWord,
  total,
  current,
  // regionCode,
  containerRef,
  firstTimeLoading,
  // screenLoading,
  hasTabData,
  firstTimeNoData,
  setFirstTimeLoading,
  setScreenLoading,
  setFirstTimeNoData,
  setDataCount,
  setCurrent,
  handleReset,
  scrollTop,
  handleTabChange,
  handleAreaItemClick,
}) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { width: tableWidth } = useSize(tableWrapperRef?.current) || {};

  const { fetchParams, loadingError, loading, tableData } = useTableData({
    condition,
    moduleType,
    current,
    firstTimeLoading,
    setDataCount,
    setFirstTimeLoading,
    setScreenLoading,
    setFirstTimeNoData,
  });
  const openModal = useNewsDetail('area_regionTrends', tableData, fetchParams || {});
  const {
    columnsList: tableColumns,
    // modalvisible,
    // newsModalInfo,
    // tagInfo,
    // handleClose,
  } = useColumns({
    tableWidth,
    moduleType,
    current,
    condition,
    keyWord,
    // regionCode,
    handleTabChange,
    handleAreaItemClick,
    openModal,
  });
  //UI认为切换舆情动态时表格宽度抖动,实际外部容器宽度有改变， 添加loading 延时显示
  const [firstLoading, setFirstLoading] = useSafeState(true);

  useEffect(() => {
    if (tableData?.length && !loading) setTimeout(() => setFirstLoading(false), 300);
  }, [setFirstLoading, loading, tableData]);

  return (
    <div ref={tableWrapperRef}>
      {!tableData?.length && !loading ? (
        <EmptyTableWrapperFull>
          {loadingError ? (
            <Empty type={Empty.LOAD_FAIL_BIG} style={{ margin: 'auto' }} />
          ) : firstTimeNoData ? (
            <Empty type={Empty.NO_DATA_NEW_IMG} style={{ margin: 'auto' }} />
          ) : (
            <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} style={{ margin: 'auto' }} />
          )}
        </EmptyTableWrapperFull>
      ) : (
        <TableWrapper className={cn({ loading: firstLoading })}>
          <ProTableNews
            sticky={{
              offsetHeader: hasTabData ? 75 : 35,
              getContainer: () => containerRef.current || document.body,
            }}
            columns={tableColumns}
            dataSource={tableData}
            bordered={false}
            pagination={false}
            loading={{ spinning: loading, translucent: true, type: 'square' }}
            // noSelectRow
            alignSync
            onlyBodyLoading
          />
          {total > 50 ? (
            <Pagination
              current={current}
              onChange={(page: number) => {
                setCurrent(page);
                scrollTop();
              }}
              pageSize={50}
              total={total}
              style={{ paddingTop: '8px', marginBottom: '0', position: 'relative', left: '9px' }}
              align={'left'}
            />
          ) : null}
          {/*<NewsDetailDialog*/}
          {/*  visible={!!modalvisible}*/}
          {/*  params={newsModalInfo}*/}
          {/*  tagInfo={tagInfo}*/}
          {/*  type={'publicOpinion'}*/}
          {/*  onClose={handleClose}*/}
          {/*  getContainer={() => containerRef.current || document.body}*/}
          {/*/>*/}
        </TableWrapper>
      )}
      {/* </LoadingWrap> */}
    </div>
  );
};
export default memo(PublicSentimentTable);

export const TableWrapper = styled.div<{ $loading?: boolean }>`
  position: relative;
  padding-bottom: 15px;
  z-index: 0;

  &.loading {
    opacity: 0.0001;
  }

  .order {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .redTxt {
    color: #ff4848;
  }
  .file-desc {
    min-width: 112px;
    width: 112px;
    display: flex;
    span {
      &:nth-child(1) {
        font-family: Arial, Helvetica, sans-serif;
        flex: 1;
        background-color: transparent;
        width: 78px;
        min-width: 78px;
        padding-left: 4px;
      }
      &:nth-child(2) {
        padding: 0;
        background-color: #ecf4fc;
        line-height: 18px;
        text-align: center;
        width: 34px;
        min-width: 34px;
      }
    }
    &:hover {
      span {
        &:nth-child(2) {
          background-color: transparent;
        }
      }
    }
  }

  .ant-table-container {
    border: none;
    .tabTitle,
    .classify,
    .span-label {
      cursor: pointer;
      em {
        color: #fe3a2f !important;
        font-style: normal;
      }
      &:hover {
        color: #0171f6;
      }
    }
  }

  .ant-pagination {
    .ant-pagination-options {
      display: none;
    }
  }
`;
