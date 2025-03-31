import { useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import styled from 'styled-components';

import { withLazyLoad } from '@pages/detail/common/components';

import { Skeleton, Spin } from '@/components/antd';
import Screen from '@/components/screen/screen';
import { useSelector } from '@/pages/area/areaF9/context';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useBankDetailData';

import { getCreditEnterpriseList } from '../../apis';
import { Wrapper, Empty } from '../../components';
import ModuleTitle from '../../components/moduleTitle';
import { useConditionCtx } from '../../context';
import Table from '../bankResources/table';
import useColumn from './useColumn';
import useDetailColumns from './useDetailColumns';
import useLogic from './useLogic';
const HELP_CONTENT = '数据来源募集说明书、评级报告和年报。仅统计发债企业的授信额度。';
const WRAPPER_ID = 'areaFinancingBoard-enterpriseCreditDistribution';

//企业授信分布
const EnterpriseCreditDistribution = () => {
  const {
    state: {
      hideModule: { enterpriseCreditDistribution },
    },
  } = useConditionCtx();
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { loading, options, onChange, tableData, tableCondition, firstLoaded } = useLogic();

  const [enterpriseType, setEnterpriseType] = useState('发债企业');

  const headerRight = useMemo(() => {
    return enterpriseCreditDistribution ? (
      <></>
    ) : (
      <RightCompWrapper className="right-comp">
        <span className="screen-info">报告期:</span>
        <Screen
          options={options}
          onChange={onChange}
          getPopContainer={() => document.getElementById(WRAPPER_ID) || document.body}
        />
      </RightCompWrapper>
    );
  }, [options, onChange, enterpriseCreditDistribution]);

  // // 弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openEnterpriseModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ detailListApiFunction: getCreditEnterpriseList });

  const handleOpenModal = useMemoizedFn((row) => {
    const { creditCompanyType, creditCompanyTypeName } = row;
    setEnterpriseType(creditCompanyTypeName);
    const extraParams = {
      enterpriseType: creditCompanyType === '999' ? '' : creditCompanyType,
      year: tableCondition.year,
    };
    openEnterpriseModal(row, extraParams);
  });

  const { scrollX: x, columns } = useColumn(handleOpenModal);

  const { scrollX, columns: detailColumns } = useDetailColumns({ curPage });

  const detailTitle = useMemo(() => {
    return `${areaInfo?.regionName}-${tableCondition.year}年-${enterpriseType}-获授信企业家数明细`;
  }, [areaInfo?.regionName, enterpriseType, tableCondition.year]);

  const content = useMemo(() => {
    return tableData.length > 0 ? (
      <Continer>
        <Table columns={columns} tableData={tableData} scroll={{ x, y: 252 }} />
        <div
          className="des"
          title={'注：以上数据来自公开渠道，可能存在数据缺失导致总额度不等于已使用额度与剩余额度之和的情况。'}
        >
          注：以上数据来自公开渠道，可能存在数据缺失导致总额度不等于已使用额度与剩余额度之和的情况。
        </div>
      </Continer>
    ) : (
      <Empty />
    );
  }, [tableData, columns, x]);

  return (
    <Wrapper height={328} ratio={50} mini id={WRAPPER_ID}>
      <ModuleTitle
        title="企业授信分布"
        style={{ paddingBottom: '6px' }}
        helper={HELP_CONTENT}
        rightComp={headerRight}
      />
      {!firstLoaded && loading ? (
        <Skeleton paragraph={{ rows: 6 }} active loading={!firstLoaded}>
          {content}
        </Skeleton>
      ) : (
        <Spin type="square" spinning={loading}>
          {content}
        </Spin>
      )}
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={detailTitle}
        tableConfig={{
          dataSource,
          columns: detailColumns,
          scroll: scrollX ? { x: scrollX } : null,
          restConfig: {
            sortDirections: ['descend', 'ascend'],
          },
        }}
        exportConfig={{
          condition: {
            ...condition,
            module_type: 'creditEnterprise',
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        page={curPage}
        onPageChange={handleDetailPageChange}
        onTableChange={handleTableChange}
        detailModalPrefix={'area-enterpriseCreditDistribution'}
      />
    </Wrapper>
  );
};

export default withLazyLoad(EnterpriseCreditDistribution, 328);

const Continer = styled.div`
  .des {
    height: 18px;
    font-size: 12px;
    /* font-weight: 300; */
    text-align: left;
    color: #8c8c8c;
    line-height: 18px;
    margin-top: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const RightCompWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  line-height: 20px;
  font-size: 13px;
  .screen-info {
    margin: 0 4px 2px 0;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #8c8c8c;
  }
`;
