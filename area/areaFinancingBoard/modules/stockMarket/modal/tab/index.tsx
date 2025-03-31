import { memo } from 'react';

import { useUnmount } from 'ahooks';
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
  setTab: React.Dispatch<React.SetStateAction<any>>;
  show: boolean;
}

const Tab = ({ tabConfig, tab, onTabChange, setTab, show }: PropsType) => {
  useUnmount(() => {
    setTab(tabConfig[0].key);
  });

  return (
    <Wrapper>
      {tabConfig.map((item, i) => (
        <div
          className={cn('tab', { 'tab-active': tab === item.key })}
          onClick={() => onTabChange(item)}
          key={item.key}
          style={{ display: i === 1 && !show ? 'none' : '' }}
        >
          {item.name}
        </div>
      ))}
    </Wrapper>
  );
};

export default memo(Tab);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 23px;
  font-size: 14px;
  line-height: 23px;
  margin: 8px 0;
  font-weight: 400;
  cursor: pointer;
  .tab {
    color: #595959;
    margin-right: 40px;
  }
  .tab-active {
    position: relative;
    color: #262626;
    font-weight: 500;
    ::after {
      display: block;
      position: absolute;
      content: '';
      width: 24px;
      height: 2px;
      background-color: #ff7500;
      border-radius: 1px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;
