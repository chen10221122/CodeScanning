import { CSSProperties, FC, memo } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { Icon } from '@/components';

const MoreBtn: FC<{ style?: CSSProperties; linkTo: string }> = ({ style, linkTo }) => {
  return (
    <Wrap to={linkTo} style={style}>
      <span>更多</span>
      <Icon symbol="iconico_qiyeF9_right2x" style={{ width: 10, height: 10 }} />
    </Wrap>
  );
};

export default memo(MoreBtn);
const Wrap = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 22px;
  background: rgba(20, 130, 240, 0.06);
  border-radius: 11px;
  font-weight: 400;
  margin-left: 20px;
  cursor: pointer;
  span {
    font-size: 13px;
    line-height: 13px;
    color: #0171f6;
    margin-top: 1px;
    margin-right: 2px;
  }
`;
