import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

export default ({ info, isLeft = false }: { info: string[]; isLeft?: boolean }) => {
  if (!info || !info?.length) {
    return <div style={{ padding: '6px 12px', textAlign: 'center', justifyContent: 'center' }}>-</div>;
  }
  const buildNode = useMemoizedFn((item, index, arr) => {
    const isLast = index + 1 === arr.length;
    return (
      <Item title={item} isLeft={isLeft} isLast={isLast}>
        {item}
      </Item>
    );
  });

  return <Wrap>{info.map(buildNode)}</Wrap>;
};

const Wrap = styled.div`
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
`;
const Item = styled.div<{ isLast: boolean; isLeft: boolean }>`
  height: 32px;
  box-sizing: border-box;
  line-height: 32px;
  text-align: ${({ isLeft }) => (isLeft ? 'left' : 'center')};
  line-height: 32px;
  padding: 0 12px;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  ${({ isLast }) => {
    if (isLast) {
      return ` border-bottom: none; `;
    } else {
      return ` border-bottom: 1px solid #F2F4F9; `;
    }
  }}
`;
