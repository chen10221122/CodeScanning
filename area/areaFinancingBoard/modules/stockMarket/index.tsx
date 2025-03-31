import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { withLazyLoad } from '@pages/detail/common/components';

import { Skeleton, Spin } from '@/components/antd';
import { LINK_AREA_FINANCING_SCALE_STATISTIC } from '@/configs/routerMap/areaF9';
import SeeMore from '@/pages/area/areaFinancingBoard/components/seeMore';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import useTab, { TabType } from '@/pages/area/areaFinancingBoard/components/Tab/useTab';
import useCondition from '@/pages/area/areaFinancingBoard/hooks/useCondition';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { Empty, ModuleTitle, Center, Wrapper } from '../../components';
import { MODAL_TYPE } from '../../config';
import { useConditionCtx } from '../../context';
import DetailModal from './modal';
import Chart from './modules/chart';
import Table from './table';
import useColumn from './useColumn';
import useLogic from './useLogic';

//股票市场
const StockMarket = () => {
  const {
    state: { visible, condition, detailModalConfig, type },
    update,
  } = useConditionCtx();
  useCondition(condition);
  const containerRef = useRef(null);
  const { tabConfig, tab, onTabChange } = useTab();

  const { loading, tableData, yearData, aShareIPOData, aShareRefinanceData, newThreeIncrease, financeCount, code } =
    useLogic();

  const { scrollX, columns } = useColumn();

  const headerRight = useMemo(() => {
    return (
      <Center>
        <Tab {...{ tabConfig, tab, onTabChange }} />
        <SeeMore
          link={urlJoin(dynamicLink(LINK_AREA_FINANCING_SCALE_STATISTIC, { code }))}
          style={{ marginLeft: 16, lineHeight: '21px' }}
        />
      </Center>
    );
  }, [tabConfig, tab, onTabChange, code]);

  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
      d.type = '';
    });
  });

  return (
    <Wrapper ratio={50} height={216}>
      <ModuleTitle title="股票市场" rightComp={headerRight} />
      <Spin type="square" spinning={false}>
        <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
          {tableData.length > 0 ? (
            <>
              {tab === TabType.GRAPH ? (
                <Chart
                  yearData={yearData}
                  aShareIPOData={aShareIPOData}
                  aShareRefinanceData={aShareRefinanceData}
                  newThreeIncrease={newThreeIncrease}
                  financeCount={financeCount}
                />
              ) : null}
              {tab === TabType.TABLE ? (
                <Container ref={containerRef}>
                  <Table columns={columns} tableData={tableData} scroll={{ x: scrollX, y: 113 }} />
                </Container>
              ) : null}
            </>
          ) : (
            <Empty />
          )}
          <DetailModal
            visible={(visible && type === MODAL_TYPE.STOCKMARKET) || false}
            closeModal={closeModal}
            detailModalConfig={detailModalConfig}
            containerRef={containerRef}
          />
        </Skeleton>
      </Spin>
    </Wrapper>
  );
};

export default withLazyLoad(StockMarket, 216);

const Container = styled.div`
  .ant-table-thead > tr:not(.ant-table-measure-row) > th,
  .ant-table-tbody > tr:not(.ant-table-measure-row) > td {
    white-space: nowrap !important;
  }
`;
