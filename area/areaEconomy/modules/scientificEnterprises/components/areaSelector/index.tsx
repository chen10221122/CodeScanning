import { FC } from 'react';

import styled from 'styled-components';

import AreaScreen from '../areaScreen';

export const AreaSelector: FC<any> = () => {
  return (
    <AreaSelectorWapper>
      <span>
        <AreaScreen />
      </span>
    </AreaSelectorWapper>
  );
};

const AreaSelectorWapper = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
