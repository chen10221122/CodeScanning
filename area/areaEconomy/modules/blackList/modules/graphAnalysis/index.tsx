import { FC, useState, useEffect, useRef } from 'react';

import styled from 'styled-components';

import { Spin, Empty } from '@/components/antd';
import { TableChangeLoading, EmptyError } from '@/pages/area/areaEconomy/modules/blackList/style';

import AreaGraph from './areaGraph';
import { useCtx, Provider, GraphModuleName } from './context';
import DurationGraph from './durationGraph';
import EnterpriseGraph from './enterpriseGraph';
import StatusGraph from './statusGraph';
import YearGraph from './yearGraph';

interface GraphAnalysisProps {
  tabChangeLoading: boolean;
}

const Content: FC<GraphAnalysisProps> = ({ tabChangeLoading }) => {
  const {
    state: { [GraphModuleName.Area]: areaModule, [GraphModuleName.Year]: yearModule },
  } = useCtx();

  // 模块内对tabChangeLoading再一次管理
  const [moduleTabChangeLoading, setModuleTabChangeLoading] = useState(false);
  // 分布加载
  const [firstModuleLoading, setFirstModuleLoading] = useState(false);
  // 加载失败
  const [firstModuleError, setFirstModuleError] = useState(false);
  const [firstModuleEmpty, setFirstModuleEmpty] = useState(false);
  // 是否第一次加载该模块
  const isFirstRef = useRef(true);
  // 是否是筛选变动
  const isScreenChangeRef = useRef(false);

  // 第一次加载该模块会有一次闪动
  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
    } else {
      setModuleTabChangeLoading(tabChangeLoading);
    }
  }, [tabChangeLoading]);

  // 第一屏加载状态变化
  useEffect(() => {
    isScreenChangeRef.current = true;
    let timer: NodeJS.Timeout;
    setFirstModuleLoading(!(areaModule.isLoadEnd && yearModule.isLoadEnd));
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [areaModule.isLoadEnd, yearModule.isLoadEnd]);

  useEffect(() => {
    setFirstModuleError(!!areaModule.error && !!yearModule.error);
  }, [areaModule.error, yearModule.error]);

  useEffect(() => {
    setFirstModuleEmpty(!!areaModule.empty && !!yearModule.empty);
  }, [areaModule.empty, yearModule.empty]);

  useEffect(() => {
    let wrap = document.getElementById('blackListContainer');
    if (wrap) {
      // 无数据以及错误时滚动条隐藏
      let status = 'scroll';
      if (firstModuleError || firstModuleEmpty || moduleTabChangeLoading) {
        status = 'hidden';
      }
      wrap.style.overflowY = status;
    }
    return () => {
      if (wrap) {
        wrap.style.overflowY = 'scroll';
        wrap = null;
      }
    };
  }, [firstModuleError, firstModuleEmpty, moduleTabChangeLoading]);

  return (
    <TableChangeLoading>
      <Spin type="square" spinning={moduleTabChangeLoading || firstModuleLoading}>
        {firstModuleError ? (
          <EmptyError marginTop={110}>
            <Empty type={Empty.MODULE_LOAD_FAIL} />
          </EmptyError>
        ) : firstModuleEmpty ? (
          <EmptyError marginTop={110}>
            <Empty type={Empty.NO_SCREEN_DATA} />
          </EmptyError>
        ) : null}
        <GrgphAnalysisContainer style={{ opacity: firstModuleError || firstModuleEmpty ? '0' : '1' }}>
          <div className="firstGraph">
            <AreaGraph />
            <YearGraph />
          </div>
          <div className="divider-line"></div>
          <div className="secondGraph">
            <DurationGraph />
            <EnterpriseGraph />
            <StatusGraph />
          </div>
        </GrgphAnalysisContainer>
      </Spin>
    </TableChangeLoading>
  );
};

const GrgphAnalysis = ({ tabChangeLoading }: GraphAnalysisProps) => {
  return (
    <Provider>
      <Content tabChangeLoading={tabChangeLoading} />
    </Provider>
  );
};

export default GrgphAnalysis;

const GrgphAnalysisContainer = styled.div`
  /* min-width: 1130px; */
  background: #f6f6f6;
  .firstGraph,
  .secondGraph {
    display: flex;
  }
  .divider-line {
    position: relative;
    left: -24px;
    width: calc(100% + 48px);
    height: 6px;
    background: #f6f6f6;
  }
  /* .ant-spin-nested-loading > div > .ant-spin {
    position: absolute;
  } */
`;
