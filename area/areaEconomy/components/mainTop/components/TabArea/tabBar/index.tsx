import { FC, memo, Key, useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useMemoizedFn, useHover } from 'ahooks';
import { Tabs } from 'antd';
import cn from 'classnames';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { appbarHeight, noticebarHeight } from '@/app/less.config';
import newImage from '@/assets/images/common/new.png';
import waitImage from '@/assets/images/common/wait.png';
import { Popover } from '@/components/antd';
import { Image } from '@/components/layout';
import { useTrackMenuClickFn } from '@/libs/eventTrack';
import { useImmer } from '@/utils/hooks';

import { INNER_TAB_HEIGHT } from '../../content';
import Menu from './menu';
import { _checkTabConf } from './rules';
import styles from './styles.module.less';
import { ITabContent, ITabsCpn } from './types';

import type { TabsProps } from 'antd';

export interface ActiveKey {
  outTabActiveKey?: Key;
  innerTabActiveKey: (Key | undefined)[];
}

const TabBar: FC<ITabsCpn<ITabContent>> = ({
  tabConf,
  rightContent,
  onChange,
  onTabPaneHover,
  activedColor = '#0171f6',
  lineColor = 'rgba(1,113,246,0.40)',
  stickyTop,
  hasMemu,
  activeKey,
  className,
  onMenuVisibleChange,
  onInnerTabChange,
  handleTabChange,
  jumpToAreaRank,
  ...defaultTabProps
}): JSX.Element => {
  _checkTabConf(tabConf);

  const { key } = useParams<{ key: string }>();

  const [tabActiveKey, setTabActiveKey] = useImmer<ActiveKey>({
    // 一级tab和二级tab当前展示的key
    innerTabActiveKey: [],
  });

  const { outTabActiveKey, innerTabActiveKey } = tabActiveKey;
  const [hasInnerTab, setHasInnerTab] = useState(false); // 当前展示的一级tab下是否有二级tab
  const [menuVisible, setMenuVisible] = useState(false); // 目录是否展开
  const [outTabHoverIndex, setOutTabHoverIndex] = useState<number>(); // 当前鼠标悬浮在哪个一级tab
  const tabMenuRef = useRef<HTMLDivElement>(null);

  const tabRef = useRef<HTMLDivElement | null>(null);

  // 页面 tab 停留的位置, 只在第一次页面进来的时候有效
  useEffect(() => {
    const innerKey = key === 'financialInstitutions' ? `${key}${window.location.hash}` : key;
    const curOutTab = tabConf.find((item) => {
      return item?.innerTabCfg?.tabConf?.find((list) => list.key === innerKey);
    });
    if (key && curOutTab && curOutTab.key) {
      const num = Number(curOutTab.key) - 1;
      setTabActiveKey((draft) => {
        draft.outTabActiveKey = curOutTab.key;
        draft.innerTabActiveKey[num] = innerKey;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    onMenuVisibleChange?.(menuVisible);
  }, [menuVisible, onMenuVisibleChange]);

  const isMenuHover = useHover(tabMenuRef);

  useEffect(() => {
    onInnerTabChange?.(innerTabActiveKey);
  }, [innerTabActiveKey, onInnerTabChange]);

  useEffect(() => {
    /* 鼠标离开时关闭菜单 */
    if (!isMenuHover) {
      setMenuVisible(false);
      // 取消 z-index 设置
      const dom = document.getElementById('top_container');
      if (dom) {
        (dom as any).style.zIndex = '6';
      }
    }
  }, [isMenuHover]);

  /* 当tab切换时，关闭目录 */
  useEffect(() => {
    setMenuVisible(false);
    // 取消 z-index 设置
    const dom = document.getElementById('top_container');
    if (dom) {
      (dom as any).style.zIndex = '6';
    }
  }, [tabActiveKey]);

  /* 监听当前的一级tab下是否有二级tab */
  useEffect(() => {
    const curOutTab = tabConf.find((item) => item.key === outTabActiveKey);
    setHasInnerTab(!isUndefined(curOutTab?.innerTabCfg));
  }, [outTabActiveKey, tabConf]);

  /** 自定义tab栏 */
  const renderTabBar: TabsProps['renderTabBar'] = useMemoizedFn((props, DefaultTabBar) => {
    return (
      <div ref={tabMenuRef} className={stickyTop || stickyTop === 0 ? 'sticky-tab' : ''}>
        <DefaultTabBar {...props} />
        {hasMemu ? (
          <Menu
            tabConf={tabConf}
            activeKey={tabActiveKey}
            menuVisible={menuVisible}
            outTabHoverIndex={outTabHoverIndex}
            setActiveKey={setTabActiveKey}
            handleTabChange={handleTabChange}
            jumpToAreaRank={jumpToAreaRank}
          />
        ) : null}
      </div>
    );
  });

  /** 一级tab点击事件 */
  const onOutTabClick = useTrackMenuClickFn(
    (activeKey) => {
      onChange?.(activeKey);
      setTabActiveKey((draft) => {
        draft.outTabActiveKey = activeKey;
      });
      if (innerTabActiveKey && activeKey) {
        const innerActiveKey = innerTabActiveKey[Number(activeKey) - 1];
        innerActiveKey && handleTabChange && handleTabChange(innerActiveKey);
      }
    },
    (key) => {
      const curOutTab = tabConf.find((item) => item.key === key);
      return [
        tabRef.current,
        {
          title: curOutTab!.name,
        },
      ];
    },
  );

  /** 内层tab点击事件 */
  const onInnerTabClick = useMemoizedFn((index) => (activeKey: string) => {
    setTabActiveKey((draft) => {
      draft.innerTabActiveKey[index] = activeKey;
    });
    handleTabChange && handleTabChange(activeKey);
  });

  /** 一级tab的鼠标移入事件 */
  const onTabMouseLeave = useMemoizedFn(() => setOutTabHoverIndex(undefined));

  /** 一级tab的鼠标移出事件 */
  const onTabMouseOver = useMemoizedFn((index, item) => () => {
    setOutTabHoverIndex(index);
    setMenuVisible(true);
    // 设置 z-index 优先级高一点
    const dom = document.getElementById('top_container');
    (dom as any).style.zIndex = '9';
    onTabPaneHover?.(item);
  });

  const hasUnderline = useMemo(() => !hasInnerTab, [hasInnerTab]);

  return (
    <TabWapper
      conf={{ activedColor, lineColor, stickyTop, isInnerTab: false, hasUnderline }}
      ref={tabRef}
      data-trace-from="onMenu"
    >
      <Tabs
        onChange={onOutTabClick}
        tabBarExtraContent={rightContent}
        animated={false}
        renderTabBar={hasMemu ? renderTabBar : undefined}
        activeKey={hasMemu && outTabActiveKey ? String(outTabActiveKey) : activeKey}
        className={cn(className, 'out-tab', hasUnderline ? 'has-underline' : '')}
        {...defaultTabProps}
      >
        {tabConf.map((item, index) => {
          const { show, key, name, isNew, disabled, content, innerTabCfg, innerTabContent } = item;
          let showContent = content;
          /* 有内层二级tab的话就展示二级tab内容 */
          if (innerTabCfg) {
            const { tabConf: innerCfg, activedColor, lineColor, stickyTop, isQuick } = innerTabCfg;
            showContent = (
              <>
                <TabWapper conf={{ activedColor, lineColor, stickyTop, isInnerTab: true, hasUnderline: true }}>
                  <Tabs
                    onChange={onInnerTabClick(index)}
                    activeKey={innerTabActiveKey[index] ? String(innerTabActiveKey[index]) : undefined}
                    className={cn('inner-tab has-underline', {
                      'is-quick-inner-tab': isQuick,
                    })}
                  >
                    {innerCfg.map((innerItem) => (
                      <Tabs.TabPane
                        key={innerItem.key}
                        tab={
                          innerItem.isWait ? (
                            <Popover
                              placement="bottomLeft"
                              content={<div className={styles.waitPopupTitle}>该模块暂未上线，敬请期待！</div>}
                              overlayClassName={styles.waitInnerPopup}
                              mouseLeaveDelay={0}
                            >
                              <div>
                                {innerItem.name}
                                <Image src={waitImage} alt="new" className="new-tag" />
                              </div>
                            </Popover>
                          ) : (
                            <div>
                              {innerItem.name}
                              {innerItem.isNew && <Image src={newImage} alt="new" className="new-tag" />}
                            </div>
                          )
                        }
                        disabled={innerItem.disabled || innerItem.isWait}
                      >
                        {innerItem.content ? (
                          <ContentContainer>
                            <PaddingWrapper>{innerItem.content}</PaddingWrapper>
                          </ContentContainer>
                        ) : null}
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </TabWapper>
                {innerTabContent ? (
                  <ContentContainer>
                    <PaddingWrapper>{innerTabContent}</PaddingWrapper>
                  </ContentContainer>
                ) : null}
              </>
            );
          }

          return show || isUndefined(show) ? (
            <Tabs.TabPane
              key={key}
              tab={
                <div className="out-tab-title" onMouseLeave={onTabMouseLeave} onMouseOver={onTabMouseOver(index, item)}>
                  {name}
                  {isNew && <Image src={newImage} alt="new" className="new-tag" />}
                </div>
              }
              disabled={disabled}
            >
              {showContent ?? null}
            </Tabs.TabPane>
          ) : null;
        })}
      </Tabs>
    </TabWapper>
  );
};

export default memo(TabBar);

const TabWapper = styled.div<any>`
  .ant-tabs-tabpane {
    height: fit-content;
  }
  .ant-tabs {
    overflow: visible !important;
  }
  .ant-tabs-nav {
    position: ${({ conf }) => (conf.stickyTop || conf.stickyTop === 0 ? 'sticky' : 'relative')};
    top: ${({ conf }) => (conf.stickyTop || conf.stickyTop === 0 ? conf.stickyTop : '0')}px;
    background-color: #fff;
    margin: 0 20px;
    border-bottom: none;
  }
  .ant-tabs-tab {
    margin: 0;
    margin-right: 2px;
    align-items: center;
    justify-content: center;
    border-radius: 2px 2px 0px 0px;
  }
  .ant-tabs-tab:hover {
    background: '#f5faff';
  }
  .ant-tabs-tab-active:hover {
    background-color: ${({ conf }) => (conf.activedColor ? conf.activedColor : '#0171f6')};
  }
  .ant-tabs-tab-active {
    border-radius: 2px 2px 0 0;
    background-color: ${({ conf }) => (conf.activedColor ? conf.activedColor : '#0171f6')};
  }
  .ant-tabs-tab-btn {
    width: 100%;
    text-align: center;
    font-weight: 400;
    line-height: 21px;
    height: 100%;
    padding-top: 6px;
  }
  .ant-tabs-tab-active > .ant-tabs-tab-btn {
    font-weight: 500;
  }
  .ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar,
  .ant-tabs-top > div > .ant-tabs-nav .ant-tabs-ink-bar {
    visibility: hidden;
    &:after {
      content: '';
      visibility: ${({ conf }) => (conf.isInnerTab ? 'visible' : 'hidden')};
      position: absolute;
      left: 50%;
      bottom: 0;
      display: block;
      width: 26px;
      height: 2px;
      transform: translateX(-50%);
      background-color: #0171f6;
      border-radius: 1px;
    }
  }
  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border: none;
  }
  .ant-tabs-tab-disabled {
    .ant-tabs-tab-btn {
      color: #bfbfbf !important;
      .out-tab-title {
        background: #f5f6f9 !important;
      }
    }
  }
  .new-tag {
    position: relative;
    top: -6px;
    width: 14px;
    height: 11px;
  }
  .sticky-tab {
    position: sticky;
    height: 45px;
    top: ${({ conf }) => (conf.stickyTop || conf.stickyTop === 0 ? conf.stickyTop : '0')}px;
    z-index: 100;
    margin: 0;
    padding: 0 20px;
    background: #fff;
    .ant-tabs-nav {
      position: relative;
      top: 0;
      margin: 0;
    }
  }
  .out-tab {
    .ant-tabs-nav {
      z-index: 100;
      padding-top: 12px;
      .ant-tabs-tab {
        width: 104px;
        padding: 0;
        height: 32px;
        font-size: 14px;
        background: #f5f6f9;
        border-radius: 2px 2px 0 0;
        overflow: hidden;
        .ant-tabs-tab-btn {
          color: #262626;
          padding-top: 0;
        }
      }
      .ant-tabs-tab-active {
        background: #0171f6;
        .out-tab-title {
          background: #0171f6 !important;
        }
        .ant-tabs-tab-btn {
          color: #fff;
        }
      }
    }
  }
  .inner-tab {
    .ant-tabs-nav {
      z-index: 99;
      padding-top: 0;
      margin: 0;
      padding: 0 20px;
      .ant-tabs-tab {
        width: fit-content;
        padding-left: 15px;
        padding-right: 15px;
        &:first-of-type {
          padding-left: 24px;
        }
        height: ${INNER_TAB_HEIGHT}px;
        font-size: 13px;
        background: #fff;
        .ant-tabs-tab-btn {
          color: #3c3c3c;
        }
        .ant-tabs-tab-btn {
          padding-top: 6px;
        }
      }
      .ant-tabs-tab-active > .ant-tabs-tab-btn {
        color: #0171f6;
      }
    }
  }
  .is-quick-inner-tab {
    .ant-tabs-nav {
      .ant-tabs-tab > .ant-tabs-tab-btn {
        &:hover {
          color: #ff7500;
        }
      }
      .ant-tabs-tab-active > .ant-tabs-tab-btn {
        color: #ff7500;
      }
      .ant-tabs-ink-bar {
        &:after {
          visibility: hidden;
        }
      }
    }
  }
  .has-underline {
    .ant-tabs-nav-wrap {
      border-bottom: 1px solid ${({ conf }) => (conf.lineColor ? conf.lineColor : '#cde3fd')};
    }
  }
  .out-tab-title {
    line-height: 32px;
    &:hover {
      background: #f5faff;
    }
  }
`;

const ContentContainer = styled.div`
  // 跟随头部设置最小宽度，否则缩小有空白
  //min-width: 1226px;
  .ant-table-sticky-holder {
    z-index: 7 !important;
  }
  .content-view {
    overflow: visible !important;

    .ant-tabs {
      overflow: visible !important;
    }
  }

  @media (min-width: 1366px) {
    background-color: #fafbfc !important;
    padding: 0 48px;
    box-sizing: border-box;
    /* height: 100%; */
  }
`;

const PaddingWrapper = styled.div`
  background-color: #fff;
  padding: 0 20px;
  margin-bottom: 0 !important;
  /* 100vh - 顶部的 62px - 底部 26 - 本身 顶部高度 */
  min-height: ${() => `calc(100vh - ${appbarHeight} - ${noticebarHeight} - 138px)`};
`;
