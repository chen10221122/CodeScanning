import { useContext, useCallback, useRef } from 'react';

import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import { Empty as MyEmpty } from '@/pages/area/areaFinancingBoard/components';
import { years } from '@/pages/area/areaFinancingBoard/modules/financingScale/components/Fitter';

import { FinancingScaleContext } from '../../index';
import Table from './Table';
import useEnterprise from './useEnterprise';

const Enterprise = () => {
  const containerRef = useRef(null);
  const { year, setYear, setRenderScreen } = useContext(FinancingScaleContext);
  const { loading, data } = useEnterprise();

  const handleReset = useCallback(() => {
    setRenderScreen(false);
    setYear(years[0]);
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  }, [setRenderScreen, setYear]);

  return (
    <div style={{ height: 219 }}>
      <Spin type="square" spinning={loading}>
        {data.length > 0 ? (
          <Continer ref={containerRef}>
            <Table tableData={data} containerRef={containerRef} />
            <div className="des">注：以上数据来自公开渠道或第三方，可能存在数据不全的情况。</div>
          </Continer>
        ) : year !== years[0] ? (
          <NoDataEmpty>
            <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION_SMALL} onClick={handleReset} />
          </NoDataEmpty>
        ) : (
          <MyEmpty />
        )}
      </Spin>
    </div>
  );
};

export default Enterprise;

export const Continer = styled.div`
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

export const NoDataEmpty = styled.div`
  height: 215px;
  padding-top: 36px;
`;
