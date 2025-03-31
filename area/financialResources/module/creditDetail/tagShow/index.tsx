import { FC } from 'react';

import { Checkbox } from '@dzh/components';
import styled from 'styled-components';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';
type PropsType = {
  setTagShow: React.Dispatch<React.SetStateAction<boolean>>;
  pageTagIsNeedShow: boolean;
  style?: React.CSSProperties;
};
const TagShow: FC<PropsType> = ({ setTagShow, pageTagIsNeedShow, style }) => {
  const onChange = (e: CheckboxChangeEvent) => {
    e.stopPropagation();
    setTagShow(e.target.checked);
  };
  return (
    <Wrapper style={style}>
      <Checkbox
        onChange={onChange}
        defaultChecked={pageTagIsNeedShow}
        onClick={(e) => {
          e.stopPropagation();
        }}
        size="small"
      >
        标签
      </Checkbox>
    </Wrapper>
  );
};
export default TagShow;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 6px;
  background-color: rgb(243, 248, 255);
  .ant-checkbox-wrapper.dzh-checkbox.dzh-checkbox-small {
    font-size: 12px;
    color: #262626;
    .ant-checkbox {
      margin-right: 4px;
    }
    span:nth-child(2) {
      padding: 0 !important;
    }
  }
`;
