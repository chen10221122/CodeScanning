import { memo, useState, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { MAP_TOP_HEIGHT } from '../content';
import { useCtx } from './context';
import Tab from './tabBar';
import useTab from './useTab';

interface IProps {
  jumpToAreaRank: number;
  handleTabChange: (key: string | number) => void;
}

const TabArea = ({ handleTabChange, jumpToAreaRank }: IProps) => {
  const {
    state: { regionCode },
    update,
  } = useCtx();

  /* tab栏右侧的内容，导出、数量等，当content有自己的筛选时，导出与自己的筛选放一行，否则导出放在tab栏右侧 */
  const [rightContent, setRightContent] = useState<JSX.Element | undefined>();
  const [activeKey, setActiveKey] = useState<string>('1'); //当前显示tab的key，默认1
  // tab 栏
  const { tabConf } = useTab();

  //tab切换事件
  const tabChange = useMemoizedFn((activeKey) => {
    setActiveKey(activeKey);
  });

  useEffect(() => {
    update((old) => {
      old.activeTab = activeKey;
    });
  }, [activeKey, update]);

  useEffect(() => {
    setActiveKey('1'); //切换地区，默认到区域经济
  }, [regionCode]);

  /* 只有区县的地区利差，导出图标才在tab栏上 */
  useEffect(() => {
    if (activeKey !== '9') {
      setRightContent(undefined);
    }
  }, [activeKey]);

  const onMenuVisibleChange = useMemoizedFn((visible) => {
    update((draft) => {
      draft.tabMenuVisible = visible;
    });
  });

  const onInnerTabChange = useMemoizedFn((activeKey) => {
    update((draft) => {
      draft.activeinnerTab = activeKey;
    });
  });

  return (
    <Tab
      tabConf={tabConf}
      rightContent={rightContent}
      onChange={tabChange}
      activeKey={activeKey}
      stickyTop={MAP_TOP_HEIGHT}
      key={`${regionCode}`}
      onMenuVisibleChange={onMenuVisibleChange}
      onInnerTabChange={onInnerTabChange}
      handleTabChange={handleTabChange}
      jumpToAreaRank={jumpToAreaRank}
      hasMemu
    />
  );
};

export default memo(TabArea);

export const Divider = styled.div`
  background: #f6f6f6;
  height: 6px;
`;
