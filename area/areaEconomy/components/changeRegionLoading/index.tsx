import { ReactNode, useMemo } from 'react';

import { isUndefined } from 'lodash';
import styled from 'styled-components';

import Spin from '@/components/antd/spin';

// 模块Loading，用于F9页面模块加载
const ModuleLoading = ({ children, isLoading }: { children?: ReactNode; isLoading?: boolean }) => {
  const loading = useMemo(() => isLoading || isUndefined(isLoading), [isLoading]);
  return (
    <>
      {loading ? (
        <Container>
          <div style={{ overflow: 'hidden' }}>
            <Spin type="fullThunder" className={'moduleLoading'} />
          </div>
        </Container>
      ) : null}
      <div style={{ display: loading ? 'none' : '' }}>{children}</div>
    </>
  );
};

export default ModuleLoading;

const Container = styled.div`
  .moduleLoading {
    margin: 0;
    background-color: #fff;
    z-index: 3;
    /* 手动测出来的距离，为了和外部的全局加载位置保持一致 */
    margin-top: -510px;
    margin-left: -55px;
  }
`;
