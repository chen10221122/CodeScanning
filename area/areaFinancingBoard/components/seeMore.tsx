import { memo } from 'react';
import { useHistory } from 'react-router';

import styled from 'styled-components';

import { Icon } from '@/components';

const SeeMore = ({ moreTxt = '更多', link = '', fontSize = 13, style = {} }) => {
  const history = useHistory();
  return (
    <SeeMoreWarrap
      onClick={() => {
        history.push(link);
      }}
      style={style}
    >
      <span className="txt" style={{ fontSize }}>
        {moreTxt}
      </span>
      <Icon className="atlas-more-icon" symbol="iconico_qiyeF9_right2x" />
    </SeeMoreWarrap>
  );
};

export default memo(SeeMore);

const SeeMoreWarrap = styled.div`
  font-size: 13px;
  color: #0171f6;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  .atlas-more-icon {
    color: #0171f6;
    font-size: 8px;
    margin-left: 4px;
  }
`;
