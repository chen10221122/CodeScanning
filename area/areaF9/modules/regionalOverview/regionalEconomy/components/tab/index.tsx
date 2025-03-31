import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

const cfg = [
  { name: '年度', key: 1 },
  { name: '进度', key: 2 },
];

export const SubTab = ({ cb }: { cb: (x: number) => void }) => {
  const [activeTab, setActiveTab] = useState(1);

  const setActive = useMemoizedFn((x) => {
    return () => {
      setActiveTab(x);
      cb?.(x);
    };
  });

  return (
    <TabWrapper>
      {cfg.map((i) => {
        return (
          <div
            className={cn('tab-item', { 'item-actived': i.key === activeTab })}
            onClick={setActive(i.key)}
            key={i.key}
          >
            {i.name}
          </div>
        );
      })}
    </TabWrapper>
  );
};

const TabWrapper = styled.div`
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;

  .tab-item {
    height: 32px;
    background: #ffffff;
    border: 1px solid #f2f4f9;
    border-radius: 4px 4px 0px 0px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #434343;
    line-height: 20px;
    margin-right: 2px;
    border-bottom: 0;
  }

  .item-actived {
    background: #f8faff;
    border: 1px solid #f2f4f9;
    color: #025cdc;
    border-bottom: 0;
  }
`;
