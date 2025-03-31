import { FC } from 'react';

import styled from 'styled-components';

import Content from './modules/content';
import LeftTab from './modules/leftTab';

const AiSide: FC = () => {
  return (
    <Outer>
      <LeftTab />
      <Content />
    </Outer>
  );
};

export default AiSide;

const Outer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  .right-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;
