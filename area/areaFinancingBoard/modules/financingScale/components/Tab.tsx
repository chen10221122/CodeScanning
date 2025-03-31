import { memo } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { TabType } from '../hooks/useTab';

interface ItemType {
  name: string;
  key: string;
}

interface PropsType {
  tabConfig: ItemType[];
  tab: string;
  onTabChange: (item: ItemType) => void;
  county: boolean;
}

const Tab = ({ tabConfig, tab, onTabChange, county }: PropsType) => {
  return (
    <Wrapper>
      {tabConfig.map((item, i) => (
        <div
          className={cn(
            'tab',
            { 'tab-active': tab === item.key },
            { 'tab-active_1': tab === TabType.ENTERPRISE },
            { 'tab-active_2': tab === TabType.REGION },
            { 'one-tab': !county },
          )}
          onClick={() => onTabChange(item)}
          key={item.key}
          style={{ display: i === 1 && !county ? 'none' : '' }}
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
  cursor: pointer;
  .tab {
    color: #878787;
    font-size: 12px;
    margin-right: 20px;
    /* padding: 3px 10px; */
  }
  .tab-active {
    color: #262626;
    font-size: 13px;
    font-weight: 500;

    &::after {
      content: '';
      width: 40px;
      height: 2px;
      position: absolute;
      background: #0171f6;
      border-radius: 1px;
      top: 21px;
      left: 23%;
    }
  }

  .one-tab.tab-active {
    &::after {
      content: none;
    }
  }

  .tab-active_1 {
    position: relative;
    &::after {
      left: 23%;
    }
  }

  .tab-active_2 {
    position: relative;
    &::after {
      width: 28px;
    }
  }
`;
