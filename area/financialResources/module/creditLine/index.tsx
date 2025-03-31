import { memo, useRef, useState } from 'react';

import { AREA_F9_AREA_CREDITLINE } from '@/configs/localstorage';
import Filter from '@/pages/area/financialResources/module/common/filter';

import DataBanner from '../common/dataBanner';
import styles from '../common/style.module.less';
import WrapperContainer from '../common/wrapperNewContainer';
import { ContentWrapper } from '../creditDetail';
import ChartModal from './chartDetail';
import DetailModal from './detail';
import Table from './table';
import useAddToDataView from './useAddToDataView';
import useColumns from './useColumns';
import useLogic from './useLogic';
const Content = () => {
  const domRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    renderScreen,
    loading,
    menuOption,
    handleMenuChange,
    listCondition,
    listData,
    dataBanner,
    pager,
    handleSearch,
    onPageChange,
    handleSort,
    handleReset,
    regionName,
    modalVisable,
    detailData,
    setModalVisable,
    handleDetail,
  } = useLogic(scrollRef);

  // 自定义排序的值
  const [currentSort, setCurrentSort] = useState<{ key: string; rule: string; value: string }>({
    key: '',
    value: '',
    rule: '',
  });

  const column = useColumns({
    pager,
    keyWord: listCondition.text,
    currentSort,
    setCurrentSort,
    sortChange: handleSort,
    handleDetail,
  });

  const { handleAddToEnterpriseDataView } = useAddToDataView({
    tableParamsData: { ...listCondition, pageSize: 1000, skip: 0 },
  });

  return (
    <ContentWrapper ref={domRef} className={styles.container}>
      <Filter
        menuOption={menuOption}
        handleMenuChange={handleMenuChange}
        condition={listCondition}
        total={pager.total}
        dataView={{
          platform: 'finance',
          handleAddToEnterpriseDataView,
        }}
        exportConfig={{
          module_type: 'bankRegionalCreditScale',
          exportOtherCondition: { exportFlag: true, pageSize: '' },
          regionName: regionName || '-',
          title: '银行区域授信规模',
        }}
        handleSearch={handleSearch}
        dataKey={AREA_F9_AREA_CREDITLINE}
        placeholder="请输入银行名称"
        bordered={true}
        screenInfo="截止年度"
        renderScreen={renderScreen}
      />
      <DataBanner data={dataBanner} />
      <div id="area-financialResources-creditLine">
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-30px' }} ref={scrollRef}></div>
          <Table
            columns={column}
            tableData={listData}
            loading={loading}
            onChangePage={onPageChange}
            handleSort={handleSort}
            handleReset={handleReset}
            targetSelector={'#area-financialResources-creditLine'}
            pager={pager}
            headFixedPosition={32}
            tabHeight={63}
          />
        </div>
      </div>
      {modalVisable && detailData.type === 'list' && (
        <DetailModal
          modalVisable={modalVisable}
          setModalVisable={setModalVisable}
          detail={detailData}
          enterpriseType={listCondition.enterpriseType}
          getContainer={() => domRef.current || document.body}
        />
      )}
      {modalVisable && detailData.type === 'chart' && (
        <ChartModal
          modalVisable={modalVisable}
          setModalVisable={setModalVisable}
          detail={detailData}
          getContainer={() => domRef.current || document.body}
        />
      )}
    </ContentWrapper>
  );
};

const Index = () => {
  return <WrapperContainer content={<Content />}></WrapperContainer>;
};

export default memo(Index);
