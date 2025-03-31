import { FC, useEffect, useMemo, useRef } from 'react';

import { Table, Spin as DzhSpin, PaginationType, Modal } from '@dzh/components';
import Screen, { Options } from '@dzh/screen';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_F9_AREA_CREDITLINE_DEBTISSUER_DETAIL } from '@/configs/localstorage';
import { isCity, isCounty, isProvince } from '@/pages/area/areaEconomy/common';
import { useSelector } from '@/pages/area/areaF9/context';
import { TableWrapper } from '@/pages/area/areaF9/modules/regionalFinancialResources/common/style';
import { EmptyContent } from '@/pages/area/financialResources/module/common/style';
import { detailType } from '@/pages/area/financialResources/module/common/type';

import useColumns from './useColumns';
import useLogic from './useLogic';

import styles from '@/pages/area/financialResources/module/creditDetail/detail/style.module.less';

interface IProps {
  modalVisable: boolean;
  setModalVisable: (visable: boolean) => void;
  getContainer: () => HTMLElement;
  detail: detailType;
  enterpriseType: string;
}

const Index: FC<IProps> = ({ modalVisable, setModalVisable, detail, getContainer, enterpriseType }) => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const { regionCode, regionName } = areaInfo || {};
  // const contentRef = useRef(null);
  const keywordRef = useRef('');

  // 地区参数处理
  const region = useMemo(() => {
    const rebuildRegionCode = regionCode && String(regionCode);
    if (rebuildRegionCode) {
      if (isProvince(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCity(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
      if (isCounty(rebuildRegionCode)) return { regionCode: rebuildRegionCode };
    }
  }, [regionCode]);

  const {
    renderScreen,
    filterNoData,
    handleSearch,
    pager,
    condition,
    listData,
    firstLoaded,
    loading,
    handleChange,
    onPageChange,
    menuOption,
    handleMenuChange,
    handleReset,
    ref: contentRef,
  } = useLogic(region, detail.code, detail.year || '', enterpriseType);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [listData]);

  const modalFilter = useMemo(() => {
    return (
      <div className={styles['filter']}>
        {renderScreen ? (
          <div className={styles['filter-left']}>
            <Screen options={menuOption as Options[]} onChange={handleMenuChange} size="small" />
            <TopicSearch
              placeholder="请输入企业名称"
              onClear={() => {
                keywordRef.current = '';
                handleSearch('');
              }}
              onChange={(value: string) => {
                keywordRef.current = value;
              }}
              onSearch={handleSearch}
              dataKey={AREA_F9_AREA_CREDITLINE_DEBTISSUER_DETAIL}
              style={{ marginLeft: '16px' }}
              cref={keywordRef}
              focusedWidth={250}
              size="small"
            />
          </div>
        ) : null}
        <div className={styles['filter-right']}>
          <div className={styles['num']}>
            共 <span className={styles['count']}>{pager?.total || '0'}</span> 条
          </div>
          <div>
            <ExportDoc
              condition={{
                ...condition,
                module_type: 'debtIssuerDetail',
                sheetNames: { '0': `${detail.name}-${detail.columnName}` },
                skip: 0,
                exportFlag: true,
                pageSize: '',
                isPost: '',
              }}
              filename={`${regionName || ''}-${detail.name}-${detail.columnName}-${dayjs().format('YYYY.MM.DD')}`}
            />
          </div>
        </div>
      </div>
    );
  }, [detail, handleSearch, pager.total, condition, handleMenuChange, menuOption, regionName, renderScreen]);

  const column = useColumns({ pager, keyWord: condition.text });

  const content = useMemo(() => {
    return (
      <>
        {!firstLoaded ? (
          <SpinWrapper>
            <Spin spinning={firstLoaded} type={'thunder'} tip="加载中" />
          </SpinWrapper>
        ) : (
          <>
            {modalFilter}
            {listData.length ? (
              <TableWrapper>
                <Table
                  columnLayout="fixed"
                  columns={column as any}
                  dataSource={listData}
                  scroll={{ x: '100%' }}
                  sticky={{
                    offsetHeader: 22,
                    getContainer: () => contentRef.current!,
                  }}
                  onChange={handleChange}
                  pagination={{
                    current: pager.current,
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
    column,
    pager,
    firstLoaded,
    onPageChange,
    listData,
    loading,
    handleChange,
    modalFilter,
    filterNoData,
    handleReset,
    contentRef,
  ]);

  return (
    <>
      <ModalWrapper />
      <Modal.FullScreen
        title={`${detail.year}-${detail.name}-${detail.columnName}`}
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

export const ModalWrapper = createGlobalStyle`
  .area-small-screen-modal {
    .ant-modal-body {
      padding-top: 4px !important;
    }
  }
`;
