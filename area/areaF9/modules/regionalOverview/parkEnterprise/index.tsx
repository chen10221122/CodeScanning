import { useRef } from 'react';

import { Empty, Spin } from '@dzh/components';
import { useSize } from 'ahooks';
import { isEmpty } from 'lodash';

import Next from '@/pages/area/areaF9/components/next';
import { Container, EmptyWapper } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/main';

import ParkEnterpriseContext from './context';
import FunctionRegion from './functionRegion';
import useFilter from './hooks/useFilter';
import useList from './hooks/useList';
import Table from './table';

const ParkEnterprise = () => {
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    empty,
    onlyBodyLoading,
    error,
    firstLoading,
    loading,
    condition,
    count,
    tableData,
    renderScreen,
    handleReset,
    handleMenuChange,
    handleSearch,
    handleTableChange,
    handlePageChange,
  } = useList();

  const option = useFilter();

  const { height: debounceScreenHeadHeight } = useSize(filterRef) || {};

  //@ts-ignore
  if (!isEmpty(error) && error?.returncode === 500) return <Empty type={Empty.LOAD_FAIL} />;

  return (
    <ParkEnterpriseContext.Provider
      value={{
        option,
        debounceScreenHeadHeight,
        onlyBodyLoading,
        loading,
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
      <Spin spinning={firstLoading} type="thunder" direction="vertical" tip="加载中">
        <Container>
          <div className="title">园区企业</div>
          {empty ? (
            <EmptyWapper>
              <Empty type={Empty.NO_DATA} />
            </EmptyWapper>
          ) : (
            <>
              {renderScreen ? <FunctionRegion refs={filterRef} /> : null}
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
    </ParkEnterpriseContext.Provider>
  );
};

export default ParkEnterprise;
