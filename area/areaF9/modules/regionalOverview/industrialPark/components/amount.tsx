import { memo } from 'react';

import styled from 'styled-components';

import { formatNumber } from '@/utils/format';

interface Props {
  text: number | string;
  handleClick: () => void;
}

/* 数量 */
const Amount = ({ text, handleClick }: Props) => {
  return (
    <span>
      {text === 0 || text === '0' ? (
        0
      ) : text && text !== '-' ? (
        <Link onClick={handleClick}>{formatNumber(text, 0)}</Link>
      ) : (
        '-'
      )}
    </span>
  );
};

export default memo(Amount);

const Link = styled.span`
  color: #025cdc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
