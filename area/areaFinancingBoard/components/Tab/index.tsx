import { memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

interface ItemType {
  name: string;
  key: string;
}

interface PropsType {
  tabConfig: ItemType[];
  tab: string;
  onTabChange: (item: ItemType) => void;
}

const Tab = ({ tabConfig, tab, onTabChange }: PropsType) => {
  return (
    <Wrapper>
      {tabConfig.map((item) => (
        <div className={cn('tab', { 'tab-active': tab === item.key })} onClick={() => onTabChange(item)} key={item.key}>
          {item.name}
        </div>
      ))}
    </Wrapper>
  );
};

export default memo(Tab);

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  width: fit-content;
  height: 22px;
  line-height: 22px;
  border: 1px solid #efefef;
  border-radius: 3px;
  overflow: hidden;
  background: #ffffff;
  cursor: pointer;
  align-items: center;
  .tab {
    color: #8c8c8c;
    padding: 0 8px;
  }
  .tab-active {
    background: #f2f6ff;
    color: #0171f6;
    font-weight: 500;
  }
`;
