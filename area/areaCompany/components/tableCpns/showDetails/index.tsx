import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

export const ShowDetails = ({
  onTrigger,
  text,
  disableWrap,
  hasUnderline,
}: {
  onTrigger: Function;
  text: React.ReactNode | string;
  disableWrap?: boolean;
  hasUnderline?: boolean;
}) => {
  const clicked = useMemoizedFn(() => {
    onTrigger?.();
  });
  return (
    <Detail onClick={clicked} disableWrap={disableWrap ?? true} hasUnderline={hasUnderline}>
      {text ?? '查看'}
    </Detail>
  );
};

const Detail = styled.span<{ disableWrap?: boolean; hasUnderline?: boolean }>`
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  color: #025cdc;
  line-height: 20px;
  ${({ disableWrap }) => {
    return disableWrap
      ? `
        white-space: nowrap;
      `
      : ``;
  }}

  &:hover {
    ${({ hasUnderline }) => {
      return hasUnderline
        ? `
        text-decoration: underline;
      `
        : ``;
    }}
  }
  cursor: pointer;
`;
