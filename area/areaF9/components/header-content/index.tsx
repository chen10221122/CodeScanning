import { FC, memo, useState } from 'react';

import styled from 'styled-components';

import LeftContent from './left-content';
import RightContent from './right-content';

interface HeaderContentProps {
  /** 用来区分在页面中的位置 */
  type?: string;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const [rightWidth, setRightWidth] = useState(0);

  return (
    <HeaderContainer id="header-container-id">
      <LeftContent rightWidth={rightWidth} />
      <RightContent setRightWidth={setRightWidth} />
    </HeaderContainer>
  );
};

export default memo(HeaderContent);

const HeaderContainer = styled.div`
  padding: 0 24px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  position: relative;
`;
