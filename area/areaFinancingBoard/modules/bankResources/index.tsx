import { useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayJs from 'dayjs';
import styled from 'styled-components';

import { withLazyLoad } from '@pages/detail/common/components';

import { Skeleton } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useBankDetailData';

import { getDistributionModal } from '../../apis';
import { Empty, ModuleTitle, Wrapper } from '../../components';
import Table from './table';
import useColumn from './useColumn';
import useDetailColumns from './useDetailColumns';
import useLogic from './useLogic';

const map = ['法人机构', '一级分行', '二级分行', '其他网点'];

//银行资源
const BankResources = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { loading, tableData } = useLogic();

  const [bankTypeName, setBankTypeName] = useState('');

  const [branchType, setBranchType] = useState(1);

  // // 弹窗数据
  const {
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openBankResourcesModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({ detailListApiFunction: getDistributionModal });

  const handleOpenModal = useMemoizedFn((row, branchType) => {
    const { bankTypeName, bankType } = row;

    setBankTypeName(bankTypeName);
    setBranchType(branchType);

    const extraParams = {
      bankType, //银行类型
      branchType, //1-法人机构；2-一级分行；3-二级分行；4-其他营业网点
      moduleType: 3, //1-辖区银行(按类型)弹窗;
    };

    openBankResourcesModal(row, extraParams);
  });

  const { scrollX: scrollBankX, columns } = useColumn(handleOpenModal);

  const { scrollX, columns: detailColumns } = useDetailColumns({ curPage, type: bankTypeName, branchType });

  const module_type = useMemo(() => {
    return branchType === 1
      ? 'regionalFinancialResource_areabank_corporation_info'
      : 'regionalFinancialResource_areabank_branch_info';
  }, [branchType]);

  const detailModalPrefix = useMemo(() => `area-bankResources-${branchType}`, [branchType]);

  const detailTitle = useMemo(
    () => `${areaInfo?.regionName}-${bankTypeName}-${map[branchType - 1]}明细`,
    [areaInfo?.regionName, bankTypeName, branchType],
  );

  return (
    <Wrapper height={328} ratio={50} mini>
      <ModuleTitle title="银行资源" style={{ paddingBottom: '6px' }} />
      <Skeleton paragraph={{ rows: 6 }} active loading={loading}>
        {tableData.length > 0 ? (
          <Continer>
            <Table columns={columns} tableData={tableData} scroll={{ x: scrollBankX, y: 253 }} />
          </Continer>
        ) : (
          <Empty />
        )}
      </Skeleton>
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
            sheetNames: { '0': map[branchType - 1] },
            module_type,
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        page={curPage}
        onPageChange={handleDetailPageChange}
        onTableChange={handleTableChange}
        detailModalPrefix={detailModalPrefix}
      />
    </Wrapper>
  );
};

export default withLazyLoad(BankResources, 328);

const Continer = styled.div``;
