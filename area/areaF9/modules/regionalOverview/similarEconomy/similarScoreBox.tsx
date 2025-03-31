import { memo, useMemo, useRef } from 'react';

// import { Table } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Empty } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';
import WrapperContainer from '@/pages/area/areaF9/modules/accountReceivable/common/wrapperContainer';
import CustomTable from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/components/customTable/custom';
// import AgGridTable from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/components/table';

import Filter, { ForwardObject } from './components/filter/index2';
import MoreAreaModal from './components/moreSimilarAreaModal2';
import { useCtx2 } from './context2';
// import useColumns from './hooks/useColumns';
import useSimilar2 from './hooks/useSimilar2';

const SimilarScoreBox = () => {
  /**请求接口 */
  const {
    pending: loading,
    data: tableData,
    firstLoading,
    error,
    sameRegionLevel,
    onlyProvince,
    administrationLevel,
    provinceCode,
  } = useSimilar2();
  const payCheck = useSelector((store) => store.payCheck);
  const filterRef = useRef<ForwardObject>(null);
  const areaInfo = useSelector((store) => store.areaInfo);
  const containerRef = useRef(null);

  const {
    state: { rangeDisplayText },
  } = useCtx2();

  // console.log('areaInfo', areaInfo);

  // const { columns } = useColumns({ beforeLeave: payCheck });

  // console.log('loading,firstLoading', loading, firstLoading);

  // 空状态重新加载
  const emptyReload = useMemoizedFn(() => {
    filterRef.current?.resetFilters();
  });

  const Content = useMemo(() => {
    return (
      <SimilarBox>
        <Container>
          <div id="similarContainer2">
            <Filter
              ref={filterRef}
              administrationLevel={administrationLevel}
              provinceCode={provinceCode}
              sameRegionLevel={sameRegionLevel}
              onlyProvince={onlyProvince}
              areaInfo={areaInfo}
            />
            <div className="similar-table">
              {tableData.length && !firstLoading ? (
                <>
                  {/* <AgGridTable payCheck={payCheck} loading={loading} tableData={tableData} /> */}
                  <CustomTable
                    payCheck={payCheck}
                    tableData={tableData}
                    loading={loading}
                    containerRef={containerRef}
                  />
                  <div className="table-remark">
                    备注：展示偏离度绝对值在{rangeDisplayText}以内的前5个地区，点击地区对比工具查看更多指标。
                  </div>
                </>
              ) : (
                <Empty
                  type={(error as any)?.returncode === 100 ? Empty.NO_DATA_IN_FILTER_CONDITION : Empty.LOAD_FAIL_LG}
                  onClick={emptyReload}
                  className="reset-empty"
                />
              )}
            </div>
          </div>
        </Container>
        <MoreAreaModal
          containerId={'similarContainer2'}
          sameRegionLevel={sameRegionLevel}
          onlyProvince={onlyProvince}
          administrationLevel={administrationLevel}
          provinceCode={provinceCode}
        />
      </SimilarBox>
    );
  }, [
    administrationLevel,
    provinceCode,
    sameRegionLevel,
    onlyProvince,
    areaInfo,
    tableData,
    firstLoading,
    payCheck,
    loading,
    rangeDisplayText,
    error,
    emptyReload,
  ]);

  return (
    <WrapperContainer
      loading={firstLoading}
      content={Content}
      isShowHeader={false}
      containerRef={containerRef}
      contentStyle={{
        minWidth: '1066px',
        paddingBottom: '0px',
      }}
      containerStyle={{ overflowX: 'hidden' }}
    ></WrapperContainer>
  );
};

export default memo(SimilarScoreBox);

const SimilarBox = styled.div`
  height: 100%;
  // height: calc(100vh - 62px - 32px - 42px - 36px - 48px);
`;

const Container = styled.div`
  height: 100%;
  #similarContainer2 {
    height: 100%;
  }
  .custom-area-economy-screen-wrap {
    z-index: 99 !important;
    position: relative;
    top: 0 !important;
  }
  .reset-empty {
    margin-top: 15vh;
  }
  .screen-wrap {
    padding-top: 0px !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    transform: translateY(-20px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }

  .region-name {
    margin: 0px auto;
    .icon-region {
      height: 15px !important;
      margin-bottom: 5px;
    }
  }

  .similar-table {
    // min-height: 665px;
    // height: calc(100% - 36px);
    // min-height: 580px;
    // height: calc(100vh - 254px);
    .reset-empty {
      margin: 0;
      padding-top: 15vh;
    }
    .table-remark {
      margin-top: 12px;
      font-size: 13px;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 14px;
      padding-bottom: 16px;
    }
  }
`;
