import { isString } from 'lodash';
import styled from 'styled-components';

export const TextWrap = ({
  line = 1,
  maxWidth = 0,
  children,
  showPopContent,
}: {
  line?: number;
  maxWidth?: number;
  children?: any;
  showPopContent?: string;
}) => {
  return (
    <TextStyle
      className="textStyle"
      title={isString(children) ? children : showPopContent || ''}
      line={line}
      maxWidth={maxWidth}
    >
      {children || ''}
    </TextStyle>
  );
};

export const TextStyle = styled.div<{ line?: number; maxWidth?: number }>`
  display: ${({ line }) => ((line ?? 1) < 4 ? '-webkit-box' : 'block')};
  ${({ maxWidth }) => {
    if (maxWidth) {
      return `max-width: ${maxWidth}px;`;
    } else {
      return ``;
    }
  }};
  -webkit-line-clamp: ${({ line }) => line || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  white-space: ${({ line }) => ((line ?? 1) < 4 ? 'normal' : 'nowrap')};
`;

export default TextWrap;
