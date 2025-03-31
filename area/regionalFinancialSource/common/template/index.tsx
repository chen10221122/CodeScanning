import { FC, memo, useRef } from 'react';

import styled from 'styled-components';

import { Filter, ResizeTable } from '@/pages/area/financialResources/components';
import { Container } from '@/pages/area/financialResources/module/common/container';
import { ContentContainer } from '@/pages/area/financialResources/module/common/contentContainer';
import WrapperContainer from '@/pages/area/financialResources/module/common/wrapperContainer';

import useAddToDataView from '../../hooks/useAddToDataView';
import useLogic from '../../hooks/useLogic';
import { dataViewPlatform, moduleType, pageTitle } from '../const';
import { PageFlag } from '../type';
import getDataKey from './getDataKey';
import useColumns from './useColumns';

import styles from '@/pages/area/financialResources/module/common/style.module.less';

interface IProps {
  pageFlag: PageFlag;
}

const OFFSET_HEADER = 28;
const TAB_HEIGHT = 63;

const Content: FC<IProps> = ({ pageFlag }) => {
  const dataKey = getDataKey(pageFlag);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    loading,
    menuOption,
    renderScreen,
    handleMenuChange,
    listCondition,
    listData,
    pager,
    handleSearch,
    onPageChange,
    handleSort,
    handleReset,
    regionName,
  } = useLogic(pageFlag, scrollRef);

  const column = useColumns({
    pager,
    keyWord: listCondition.text,
    pageFlag,
  });

  const { handleAddToEnterpriseDataView } = useAddToDataView({
    tableParamsData: { ...listCondition, pageSize: 1000, skip: 0 },
  });

  return (
    <ContentContainerWrapper className={styles.container}>
      <Container>
        <Filter
          renderScreen={renderScreen}
          menuOption={menuOption}
          handleMenuChange={handleMenuChange}
          condition={listCondition}
          total={pager.total}
          dataView={{
            platform: dataViewPlatform[pageFlag],
            handleAddToEnterpriseDataView,
          }}
          exportConfig={{
            module_type: moduleType[pageFlag],
            exportOtherCondition: { exportFlag: true, pageSize: '' },
            regionName: regionName || '-',
            title: pageTitle[pageFlag],
          }}
          handleSearch={handleSearch}
          dataKey={dataKey}
          placeholder="请输入企业名称"
        />
        <div id={`area-regionalFinancialSource-${pageFlag}`}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: `-30px` }} ref={scrollRef}></div>
            <ResizeTable
              columns={column}
              tableData={listData}
              loading={loading}
              onChangePage={onPageChange}
              handleSort={handleSort}
              handleReset={handleReset}
              pager={pager}
              offsetHeader={OFFSET_HEADER}
              tabHeight={TAB_HEIGHT}
              containerId={`area-regionalFinancialSource-${pageFlag}`}
            />
          </div>
        </div>
      </Container>
    </ContentContainerWrapper>
  );
};

const Index: FC<IProps> = ({ pageFlag }) => {
  return <WrapperContainer content={<Content pageFlag={pageFlag} />} isContentEmpty={true} />;
};

export default memo(Index);

const ContentContainerWrapper = styled(ContentContainer)`
  /* .area-financialResources-common-filter {
    padding-bottom: 7px;
  } */
  .seleft-left {
    height: 20px;
    .search {
      margin-left: 13px;
    }
  }
  .ant-table-thead {
    tr > th:first-child {
      border-right: 1px solid #f2f4f9 !important;
    }
  }
  .ant-table-tbody {
    tr > td > .resizableCol {
      white-space: unset;
    }
    tr > td:first-child {
      border-right: 1px solid #f2f4f9 !important;
    }
  }
`;
