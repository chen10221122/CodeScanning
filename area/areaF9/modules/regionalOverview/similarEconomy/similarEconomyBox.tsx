import { memo, useMemo, useRef } from 'react';

import { Table } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Empty } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';
import WrapperContainer from '@/pages/area/areaF9/modules/accountReceivable/common/wrapperContainer';

import Filter, { ForwardObject } from './components/filter';
import MoreAreaModal from './components/moreSimilarAreaModal';
import { useCtx } from './context';
import useColumns from './hooks/useColumns';
import useSimilar from './hooks/useSimilar';

const SimilarEconomyBox = () => {
  /**请求接口 */
  const { pending: loading, data: tableData, firstLoading, error } = useSimilar();
  const payCheck = useSelector((store) => store.payCheck);
  const filterRef = useRef<ForwardObject>(null);
  // const containerRef = useRef(null);
  const openIndictorModal = useMemoizedFn(() => {
    filterRef.current?.openIndictorModal();
  });
  const { columns } = useColumns({ beforeLeave: payCheck, openIndictorModal });

  const {
    state: { rangeDisplayText },
  } = useCtx();

  // 空状态重新加载
  const emptyReload = useMemoizedFn(() => {
    filterRef.current?.resetFilters();
  });

  const Content = useMemo(() => {
    return (
      <SimilarBox>
        <Container>
          <div id="similarContainer">
            {/* <div className="title">相似经济</div> */}
            <Filter ref={filterRef} />
            <div className="similar-table">
              {tableData.length && !firstLoading ? (
                <>
                  <Table
                    pagination={false}
                    columns={columns}
                    onlyBodyLoading
                    scroll={{ x: '100%' }}
                    dataSource={tableData}
                    loading={{ spinning: loading, translucent: true, type: 'square' }}
                    sticky={{
                      offsetHeader: 36,
                      getContainer: () => document.getElementById('main-container-id') || document.body,
                    }}
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
        <MoreAreaModal containerId={'similarContainer'} />
      </SimilarBox>
    );
  }, [tableData, firstLoading, columns, loading, rangeDisplayText, error, emptyReload]);

  return (
    <WrapperContainer
      loading={firstLoading}
      content={Content}
      // title={'相似经济'}
      isShowHeader={false}
      contentStyle={{
        minWidth: '1066px',
        paddingBottom: '0px',
      }}
      containerStyle={{ overflowX: 'hidden' }}
    ></WrapperContainer>
  );
};

export default memo(SimilarEconomyBox);

const SimilarBox = styled.div``;

const Container = styled.div`
  .similar-table {
    .ant-empty {
      margin-top: 12%;
    }

    .ant-table-thead tr:not(.dzh-table-fixed-row):not(:last-of-type) th {
      font-weight: 600;
    }
  }

  // .dzh-table.dzh-table-has-group
  //   .ant-table-bordered
  //   > .ant-table-container
  //   > .ant-table-header
  //   > table
  //   > .ant-table-thead
  //   > tr
  //   > th {
  //   right: -1px !important;
  // }

  .table-remark {
    margin-top: 12px;
    font-size: 13px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 14px;
    padding-bottom: 16px;
  }
`;
