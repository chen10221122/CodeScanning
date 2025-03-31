import { FC, memo } from 'react';

import { Space } from 'antd';
import styled from 'styled-components';

interface Props {
  data: string[];
  handleClick?: Function;
}

const styleMap: Record<string, undefined | object> = {
  已移除: {
    color: '#FB7171',
    background: '#FEF0F0',
    // cursor: 'pointer',
  },
  国企: {
    color: '#20aef5',
    background: '#e8f6fe',
  },
  央企: {
    color: '#20aef5',
    background: '#e8f6fe',
  },
  沪深京: {
    color: '#23BFB1',
    background: '#e9f8f7',
  },
  香港: {
    color: '#23BFB1',
    background: '#e9f8f7',
  },
  新三板: {
    color: '#23BFB1',
    background: '#e9f8f7',
  },
  债: {
    color: '#7686DE',
    background: '#F1F2FB',
  },
  城投: {
    color: '#0171F6',
    background: '#DEEBFE',
  },
};

const Index: FC<Props> = ({ data, handleClick }) => {
  return (
    <Container size={6}>
      {data?.map((d) => {
        return d ? (
          <span onClick={() => handleClick?.(d)} className="tag" key={d} style={styleMap?.[d] || {}}>
            {d}
          </span>
        ) : null;
      })}
    </Container>
  );
};

export default memo(Index);

const Container = styled(Space)`
  white-space: nowrap;
  margin-left: 6px;
  .tag {
    display: inline-block;
    padding: 0 3px;
    border-radius: 2px;
    background: #e8f6fe;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    font-weight: 400;
    color: #20aef5;
    min-width: 30px;
    text-align: center;
    box-sizing: border-box;
  }
`;
