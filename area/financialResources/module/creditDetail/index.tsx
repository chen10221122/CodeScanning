import { memo, useRef } from 'react';

import { useSize } from 'ahooks';
import styled from 'styled-components';

import { AREA_F9_AREA_CREDITDETAIL } from '@/configs/localstorage';
import Filter from '@/pages/area/financialResources/module/common/filter';

import DataBanner from '../common/dataBanner';
import WrapperContainer from '../common/wrapperNewContainer';
import DetailModal from './detail';
import ResizeTable from './table/resizeTable';
import useAddToDataView from './useAddToDataView';
import useColumns from './useColumns';
import useLogic from './useLogic';

const Content = () => {
  const filterRef = useRef(null);
  const domRef = useRef(null);
  const { height } = useSize(filterRef) || { height: 32 };
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
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
    detailData,
    modalVisable,
    setModalVisable,
    handleDetail,
  } = useLogic(scrollRef);

  const column = useColumns({
    pager,
    keyWord: listCondition.text,
    handleDetail,
  });

  const { handleAddToEnterpriseDataView } = useAddToDataView({
    tableParamsData: { ...listCondition, pageSize: 1000, skip: 0 },
  });

  return (
    <ContentWrapper ref={domRef}>
      <>
        <Header ref={filterRef}>
          <Filter
            menuOption={menuOption}
            handleMenuChange={handleMenuChange}
            condition={listCondition}
            total={pager.total}
            dataView={{
              platform: 'enterprise',
              handleAddToEnterpriseDataView,
            }}
            exportConfig={{
              module_type: 'creditEnterprise',
              exportOtherCondition: { exportFlag: true, pageSize: '' },
              regionName: regionName || '-',
              title: '获授信企业明细',
            }}
            handleSearch={handleSearch}
            dataKey={AREA_F9_AREA_CREDITDETAIL}
            placeholder="请输入企业名称"
            bordered={true}
            screenInfo="截止年度"
          />
        </Header>
        <DataBanner data={dataBanner} />
        <div id="area-creditDetail">
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-30px' }} ref={scrollRef}></div>
            <ResizeTable
              columns={column}
              tableData={listData}
              loading={loading}
              onChangePage={onPageChange}
              handleSort={handleSort}
              handleReset={handleReset}
              pager={pager}
              offsetHeader={height}
              tabHeight={63}
            />
          </div>
        </div>
        {modalVisable && (
          <DetailModal
            modalVisable={modalVisable}
            setModalVisable={setModalVisable}
            detail={detailData}
            getContainer={() => domRef.current || document.body}
          />
        )}
      </>
    </ContentWrapper>
  );
};

const Index = () => {
  return <WrapperContainer content={<Content />}></WrapperContainer>;
};

export default memo(Index);

export const ContentWrapper = styled.div`
  padding-bottom: 12px;
  /* 复写筛选组件的部分样式 */
  .seleft-left {
    .screen-wrapper {
      > div {
        margin-right: 16px;
        line-height: 14px;
      }
      > div:first-child {
        font-size: 12px;
      }
      > div:nth-child(2) {
        margin-right: 8px;
      }
      > div:last-child {
        margin-right: 5px;
      }
      > div + div {
        border: none;
      }
    }
    .search {
      margin-left: 0;
    }
  }
`;

const Header = styled.div`
  position: sticky;
  background: white;
  top: 0;
  z-index: 9;
`;
