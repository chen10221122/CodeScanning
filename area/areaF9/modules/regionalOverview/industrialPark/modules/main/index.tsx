import { useContext, useEffect } from 'react';

import { Empty, Spin } from '@dzh/components';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import Next from '@/pages/area/areaF9/components/next';

import IndustrialParkContext from '../../context';
import MainContext from './context';
import FunctionRegion from './functionRegion';
import Table from './table';
import useFilter from './useFilter';
import useList from './useList';

const Main = () => {
  const { setAreaCode } = useContext(IndustrialParkContext);

  const {
    empty,
    onlyBodyLoading,
    error,
    firstLoading,
    loading,
    condition,
    count,
    tableData,
    selectStatus,
    renderScreen,
    handleReset,
    handleMenuChange,
    handleSearch,
    handleTableChange,
    handlePageChange,
  } = useList();

  const { filterFirstLoading, option } = useFilter();

  useEffect(() => {
    if (condition.areaCode) {
      setAreaCode(condition.areaCode);
    }
  }, [condition.areaCode, setAreaCode]);

  //@ts-ignore
  if (!isEmpty(error) && error?.returncode === 500) return <Empty type={Empty.LOAD_FAIL} />;

  return (
    <MainContext.Provider
      value={{
        onlyBodyLoading,
        loading,
        condition,
        count,
        tableData,
        filterFirstLoading,
        option,
        renderScreen,
        handleReset,
        handleMenuChange,
        handleSearch,
        handleTableChange,
        handlePageChange,
      }}
    >
      <Spin spinning={firstLoading} type="thunder" direction="vertical" tip="加载中">
        <Container>
          <div className="title">产业园区</div>
          {empty ? (
            <EmptyWapper>
              <Empty type={Empty.NO_DATA} />
            </EmptyWapper>
          ) : (
            <>
              {renderScreen ? <FunctionRegion selectStatus={selectStatus} /> : null}
              <Spin spinning={isEmpty(tableData) && loading} type="thunder" direction="vertical" tip="加载中">
                {!isEmpty(tableData) ? (
                  <Table />
                ) : (
                  <EmptyWapper>
                    <Empty type={Empty.NO_SCREEN_DATA} onCleanClick={handleReset} />
                  </EmptyWapper>
                )}
              </Spin>
            </>
          )}
        </Container>
        <Next />
      </Spin>
    </MainContext.Provider>
  );
};

export default Main;

export const Container = styled.div`
  padding: 10px 20px 16px 20px;
  min-height: calc(100vh - 176px);
  .title {
    font-size: 15px;
    font-weight: 500;
    color: #141414;
    line-height: 23px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
      position: absolute;
      left: -8px;
      top: 4px;
    }
  }
`;

export const EmptyWapper = styled.div`
  height: calc(100vh - 258px);
  min-height: 290px;
`;
