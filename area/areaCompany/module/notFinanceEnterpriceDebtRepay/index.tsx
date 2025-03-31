import { useState } from 'react';

import { useMemoizedFn, useBoolean } from 'ahooks';
import dayJs from 'dayjs';

import PublicSentimentModal from '@/components/publicSentimentModal';
import { getEnterpriceDebtRepayList, getStockBondDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import DetailModal from '@/pages/area/areaCompany/components/detailModal';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam, getBottomRemark } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import useDetailColumns from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useDetailColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { useSelector } from '@/pages/area/areaF9/context';

import useColumns from './hooks/useColumns';
import useDetailData from './hooks/useDetailData';
// import PublicOpinionModal from './publicOpinionModal';
import RepayTrendModal from './repayTrendModal';

const NotFinanceEnterpriceDebtRepay = () => {
  const { branchId } = useSelector((store) => ({ branchId: store.curNodeBranchId }));
  const [companyInfo, setCompanyInfo] = useState({ code: '', name: '', count: 0 });
  const [trendData, setTrendData] = useState({});
  const [redVisible, { setTrue, setFalse }] = useBoolean(false);
  const [repayVisible, { setTrue: setRepayTrue, setFalse: setRepayFalse }] = useBoolean(false);

  const {
    pageType,
    title: detailTitle,
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    isUrbanBond,
    modalType,
    setVisible,
    handleOpenModal,
    handleTableChange,
    handlePageChange,
  } = useDetailData();

  const detailColumns = useDetailColumns({ curPage, pageType, isUrbanBond });

  const onOpenModal = useMemoizedFn((modalType, row, pageParams) => {
    if (typeof modalType === 'string') {
      // 舆情弹窗
      if (modalType === 'opinion') {
        const { code, name, count } = row;
        setCompanyInfo({ code, name, count });
        setTrue();
      } else {
        // 偿还趋势图
        setTrendData(row);
        setRepayTrue();
      }
    } else {
      handleOpenModal(row, pageParams, modalType);
    }
  });

  return (
    <ModuleWrapper title="企业偿债压力">
      <FinanceModuleTemplate
        title="企业偿债压力"
        listApiFunction={getEnterpriceDebtRepayList}
        searchDataKey={`${branchId}_企业偿债压力`}
        detailListApiFunction={getStockBondDetailList}
        pageType={REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY}
        defaultCondition={getDefaultParam(REGIONAL_PAGE.FINANCING_NOTFINANCIAL_DEBT_REPAY)}
        useColumnsHook={useColumns}
        onOpenModal={onOpenModal}
      />
      {/* 明细弹窗 */}
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={detailTitle}
        tableConfig={{
          dataSource,
          columns: detailColumns,
          restConfig: {
            sortDirections: ['descend', 'ascend'],
          },
        }}
        exportConfig={{
          condition: {
            ...condition,
            from: 0,
            size: 1000,
            module_type: modalType,
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        bottomRemark={getBottomRemark(pageType)}
        page={curPage}
        onPageChange={handlePageChange}
        onTableChange={handleTableChange}
      />

      {/* 舆情弹窗 */}
      <PublicSentimentModal
        visible={redVisible}
        setVisible={setFalse}
        code={companyInfo.code}
        title={`${companyInfo.name}_重要负面舆情(近6个月)`}
        count={companyInfo.count || 2}
        type={'company'}
        getContainer={() => document.querySelector('.area-company-children-container') || document.body}
      />

      {/* 偿还趋势弹窗 */}
      <RepayTrendModal datas={trendData} visible={repayVisible} setFalse={setRepayFalse} />
    </ModuleWrapper>
  );
};

export default NotFinanceEnterpriceDebtRepay;
