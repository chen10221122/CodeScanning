import { useContext, useRef } from 'react';

import { Modal, Empty, Spin } from '@dzh/components';
import { useSize } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import IndustrialParkContext from '../../context';
import ModalContext from './context';
import FunctionRegion from './functionRegion';
import Table from './table';
import useDetail from './useDetail';
import useFilter from './useFilter';

const MyModal = () => {
  const { isOpenEnterprise, enterpriseParams, setEnterpriseFalse } = useContext(IndustrialParkContext);
  const {
    onlyBodyLoading,
    error,
    firstLoading,
    renderScreen,
    condition,
    loading,
    count,
    tableData,
    handleReset,
    handleMenuChange,
    handleSearch,
    handleTableChange,
    handlePageChange,
    handleClose,
  } = useDetail({
    isOpenEnterprise,
    enterpriseParams,
    setEnterpriseFalse,
  });

  const filterRef = useRef<HTMLDivElement>(null);

  const option = useFilter({ isOpenEnterprise, enterpriseParams });

  const { height: debounceScreenHeadHeight } = useSize(filterRef) || {};

  const { devZoneName } = enterpriseParams;

  return (
    <ModalContext.Provider
      value={{
        option,
        debounceScreenHeadHeight,
        loading,
        onlyBodyLoading,
        condition,
        count,
        tableData,
        renderScreen,
        handleReset,
        handleMenuChange,
        handleSearch,
        handleTableChange,
        handlePageChange,
      }}
    >
      <Modal.FullScreen
        title={`${devZoneName}-园区企业明细`}
        visible={isOpenEnterprise}
        onCancel={handleClose}
        destroyOnClose={true}
        bodyStyle={{ paddingTop: 0 }}
        getContainer={false}
      >
        {!isEmpty(error) && (error as any).returncode === 500 ? (
          <Empty type={Empty.LOAD_FAIL} />
        ) : firstLoading ? (
          <Spin type="thunder" direction="vertical" tip="加载中">
            <div style={{ height: '70vh' }}></div>
          </Spin>
        ) : (
          <Wrapper>
            {renderScreen ? <FunctionRegion refs={filterRef} /> : null}
            <Spin spinning={isEmpty(tableData) && loading} type="thunder" direction="vertical" tip="加载中">
              {!isEmpty(tableData) ? (
                <Table />
              ) : (
                <div style={{ marginTop: '8vh' }}>
                  <Empty type={Empty.NO_SCREEN_DATA} onCleanClick={handleReset} />
                </div>
              )}
            </Spin>
          </Wrapper>
        )}
      </Modal.FullScreen>
    </ModalContext.Provider>
  );
};

export default MyModal;

export const Wrapper = styled.div`
  .dzh-spin-spinWrapper {
    height: calc(100% - 35px);
  }
`;
