import { useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { withLazyLoad } from '@pages/detail/common/components';

import { Skeleton, Spin } from '@/components/antd';
import { LINK_AREA_PEVC } from '@/configs/routerMap/areaF9';
import MoreBtn from '@/pages/area/areaEconomy/components/traceBtn/moreBtn';
import ModuleTitle from '@/pages/area/areaFinancingBoard/components/moduleTitle';
import DetailModal from '@/pages/area/areaFinancingBoard/modules/stockMarket/modal';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { Empty, Wrapper } from '../../components';
import { MODAL_TYPE } from '../../config';
import { useConditionCtx } from '../../context';
import Table from '../bankResources/table';
import LineBar from './graph';
import useColumn from './useColumn';
import useLogic from './useLogic';

//PEVC融资
const PEVCFinancing = () => {
  const containerRef = useRef(null);

  const {
    state: { visible, detailModalConfig, type },
    update,
  } = useConditionCtx();

  const { loading, tableData, yearData, eventData, amountData, code } = useLogic();

  const { scrollX, columns } = useColumn();

  const closeModal = useMemoizedFn(() => {
    update((d) => {
      d.visible = false;
      d.type = '';
    });
  });

  return (
    <Wrapper height={242} ratio={63.45}>
      <ModuleTitle
        title="PEVC融资"
        rightComp={<MoreBtn linkTo={urlJoin(dynamicLink(LINK_AREA_PEVC, { code }))} style={{ background: 'none' }} />}
        style={{ paddingBottom: '6px' }}
      />
      <Spin type="square" spinning={false}>
        <Skeleton paragraph={{ rows: 4 }} active loading={loading}>
          {tableData.length > 0 ? (
            <Container ref={containerRef}>
              <div className="chart">
                <LineBar yearData={yearData} eventData={eventData} amountData={amountData} />
              </div>
              <div className="table">
                <Table columns={columns} tableData={tableData} scroll={{ x: scrollX, y: 169 }} />
              </div>
            </Container>
          ) : (
            <Empty />
          )}
        </Skeleton>
      </Spin>
      <DetailModal
        visible={(visible && type === MODAL_TYPE.PEVCFINANCING) || false}
        closeModal={closeModal}
        detailModalConfig={detailModalConfig}
        containerRef={containerRef}
      />
    </Wrapper>
  );
};

export default withLazyLoad(PEVCFinancing, 242);

const Container = styled.div`
  display: flex;
  .chart {
    width: 52%;
  }
  .table {
    width: 48%;
  }
  .chart {
    margin-right: 12px;
  }
`;
