import { FC, useMemo, useRef } from 'react';

import { Table, PaginationType, Spin as DzhSpin, Modal } from '@dzh/components';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_F9_AREA_CREDITDETAIL_DETAIL } from '@/configs/localstorage';
import { TableWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { EmptyContent } from '@/pages/area/financialResources/module/common/style';
import { detailType } from '@/pages/area/financialResources/module/common/type';
import { ModalWrapper } from '@/pages/area/financialResources/module/creditLine/detail';

import styles from './style.module.less';
import useColumns from './useColumns';
import useLogic from './useLogic';

interface IProps {
  modalVisable: boolean;
  setModalVisable: (visable: boolean) => void;
  getContainer: () => HTMLElement;
  detail: detailType;
}

const Index: FC<IProps> = ({ modalVisable, setModalVisable, detail, getContainer }) => {
  const keywordRef = useRef('');

  const {
    handleSearch,
    pager,
    condition,
    listData,
    firstLoaded,
    loading,
    handleChange,
    onPageChange,
    filterNoData,
    handleReset,
    renderScreen,
    ref: contentRef,
  } = useLogic(detail.code, detail.year);

  const filter = useMemo(() => {
    return (
      <div className={styles['filter']}>
        <div className={styles['filter-left']}>
          {renderScreen ? (
            <div className={styles['search']}>
              <TopicSearch
                placeholder="请输入银行名称"
                onClear={() => {
                  keywordRef.current = '';
                  handleSearch('');
                }}
                onChange={(value: string) => {
                  keywordRef.current = value;
                }}
                onSearch={handleSearch}
                dataKey={AREA_F9_AREA_CREDITDETAIL_DETAIL}
                style={{}}
                cref={keywordRef}
                focusedWidth={200}
                size="small"
              />
            </div>
          ) : null}
        </div>
        <div className={styles['filter-right']}>
          <div className={styles['num']}>
            共 <span className={styles['count']}>{pager?.total || '0'}</span> 条
          </div>
          <div>
            <ExportDoc
              condition={{
                ...condition,
                module_type: 'creditInstitutionDetail',
                year: detail.year,
                sheetNames: { '0': `${detail.name}-${detail.columnName}` },
                skip: 0,
                exportFlag: true,
                pageSize: '',
                isPost: '',
              }}
              filename={`${detail.name}-${detail.columnName}-${dayjs().format('YYYY.MM.DD')}`}
            />
          </div>
        </div>
      </div>
    );
  }, [detail, handleSearch, pager.total, condition, renderScreen]);

  const column = useColumns({ pager, keyWord: condition.text });

  const content = useMemo(() => {
    return (
      <>
        {!firstLoaded ? (
          <SpinWrapper>
            <Spin spinning={!firstLoaded} type={'thunder'} tip="加载中" />
          </SpinWrapper>
        ) : (
          <>
            {filter}
            {listData.length ? (
              <TableWrapper>
                <Table
                  columnLayout="fixed"
                  columns={column as any}
                  dataSource={listData}
                  showSorterTooltip={false}
                  scroll={{ x: '100%' }}
                  sticky={{
                    offsetHeader: 22,
                    getContainer: () => contentRef.current!,
                  }}
                  onChange={handleChange}
                  pagination={{
                    current: pager.current,
                    className: 'pagination',
                    hideOnSinglePage: true,
                    pageSize: 50,
                    total: pager.total,
                    onChange: onPageChange,
                    type: PaginationType.SHOW_LAST,
                  }}
                  loading={{ spinning: loading, translucent: true, indicator: <DzhSpin type="square" tip="加载中" /> }}
                />
              </TableWrapper>
            ) : (
              filterNoData && (
                <EmptyContent>
                  <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} onClick={handleReset} />
                </EmptyContent>
              )
            )}
          </>
        )}
        {!loading && !listData.length && !filterNoData ? (
          <EmptyContent>
            <Empty type={Empty.NO_DATA_NEW_IMG} />
          </EmptyContent>
        ) : null}
      </>
    );
  }, [
    filter,
    onPageChange,
    pager,
    column,
    firstLoaded,
    listData,
    loading,
    handleChange,
    filterNoData,
    handleReset,
    contentRef,
  ]);

  return (
    <>
      <ModalWrapper />
      <Modal.FullScreen
        title={`${detail.name}-${detail.columnName}`}
        open={modalVisable}
        onCancel={() => {
          setModalVisable(false);
        }}
        footer={null}
        destroyOnClose
        getContainer={getContainer}
        scrollRef={contentRef}
        wrapClassName="area-small-screen-modal"
      >
        {content}
      </Modal.FullScreen>
    </>
  );
};

export default Index;

const SpinWrapper = styled.div`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
`;
