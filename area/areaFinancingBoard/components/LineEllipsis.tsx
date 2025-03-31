import { memo } from 'react';

import styled from 'styled-components';

interface Props {
  text: string;
  line?: number;
}

const LineEllipsis = ({ text, line = 1 }: Props) => {
  return (
    <Wrapper line={line}>
      <span title={text}>{text || '-'} </span>
    </Wrapper>
  );
};

export default memo(LineEllipsis);

const Wrapper = styled.div`
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: ${({ line }: { line: number }) => line};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
