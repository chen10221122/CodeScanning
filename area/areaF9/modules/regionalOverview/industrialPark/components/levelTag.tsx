import { memo } from 'react';

import styled from 'styled-components';

const styleMap: Record<string, { color: string; background: string }> = {
  国家级: {
    color: '#1FAEF5',
    background: '#EFF8FE',
  },
  省级: {
    color: '#23BFB1',
    background: '#E9F8F7',
  },
};

const generateStyle = (status: string) => {
  return styleMap[status];
};

/* 国家级，省级标签 */
const LevelTag = ({ tag }: { tag: string }) => {
  return (
    <>
      {tag !== '其他' ? (
        <Tag style={generateStyle(tag)} className="tag">
          {tag}
        </Tag>
      ) : null}
    </>
  );
};

export default memo(LevelTag);

export const Tag = styled.span`
  margin-right: 4px;
  display: inline-block;
  padding: 0 3px;
  border-radius: 2px;
  background: #e8f6fe;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  font-weight: 400;
  color: #20aef5;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
`;
