import { useEffect, useRef, useState } from 'react';
import { LinkProps, matchPath, RedirectProps, useHistory, useLocation } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { Tabs, TabsProps } from 'antd';
import { isFunction, isString } from 'lodash';
import styled from 'styled-components';

import NoPowerDialog from '@/app/components/dialog/power/noPayNotice';
import Vip from '@/assets/images/common/vip.svg';
import useGetCombinationAuth from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/hooks/useGetCombinationAuth';

export interface TopicNavProps extends TabsProps {
  navs: {
    /** 显示名称 */
    title: string;
    /** 点击跳转位置 */
    to: LinkProps['to'];
    /** 重定向位置 */
    redirect?: RedirectProps['to'];
    /** 是否需求vip权限访问 */
    needVip?: boolean;
  }[];
}

// 专题导航
export default function TopicNav({ navs, onChange, ...tabsProps }: TopicNavProps) {
  const history = useHistory();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState<string>();
  const [showPowerDialog, setShowPowerDialog] = useState(false);

  const { havePay } = useGetCombinationAuth();

  const setNavActive = useMemoizedFn(() => {
    if (location.pathname) {
      const activeIndex = navs.findIndex((nav) => {
        const to = nav.to;
        let url = '';
        if (isString(to)) {
          url = to;
        } else if (isFunction(to)) {
          const _url = to(location);
          if (isString(_url)) {
            url = _url;
          } else {
            if (_url.pathname) {
              url = _url.pathname;
            }
          }
        } else {
          if (to.pathname) {
            url = to.pathname;
          }
        }
        if (url) {
          return (
            matchPath(url, {
              path: location.pathname,
            }) || matchPath(location.pathname, { path: url })
          );
        }
        return false;
      });
      if (activeIndex > -1) {
        setActiveKey(`${activeIndex}`);
      }
    }
  });

  const isTriggeredByClick = useRef<boolean>();

  const handleChange = useMemoizedFn((tabKey: string) => {
    const index = Number(tabKey);
    const { to, redirect, needVip } = navs[index];
    if (!havePay && needVip) {
      setShowPowerDialog(true);
      return;
    }

    isTriggeredByClick.current = true;
    setActiveKey(tabKey);
    onChange?.(tabKey);
    if (redirect) {
      history.push(redirect);
    } else {
      if (!isFunction(to)) {
        history.push(to);
      } else {
        history.push(to(location));
      }
    }
    isTriggeredByClick.current = false;
  });

  useEffect(() => {
    if (!isTriggeredByClick.current) {
      setNavActive();
    }
  }, [setNavActive]);

  return (
    <NavWrapper {...tabsProps} onChange={handleChange} activeKey={activeKey} vip={havePay}>
      {navs.map((nav, index) => (
        <Tabs.TabPane
          key={index}
          tab={
            nav?.needVip ? (
              <div>
                {nav.title}
                <img src={Vip} className="vip" alt="" />
              </div>
            ) : (
              nav.title
            )
          }
          tabKey={`${index}`}
        ></Tabs.TabPane>
      ))}

      <NoPowerDialog visible={showPowerDialog} setVisible={setShowPowerDialog} type="memberImport">
        <DialogContentStyle />
      </NoPowerDialog>
    </NavWrapper>
  );
}

const NavWrapper = styled(Tabs)<{ vip: boolean }>`
  height: 100%;

  .ant-tabs-nav {
    margin-bottom: 0;
    height: 100%;

    &:before {
      display: none;
    }
  }

  .ant-tabs-tab {
    padding: 0;
    font-size: 14px;
    color: #141414;
    position: relative;

    &.ant-tabs-tab-active {
      font-weight: 500;
    }
  }

  .ant-tabs-tab-btn:focus {
    color: ${(prop) => (prop.vip ? ' #0171f6' : '#141414')};
  }

  .vip {
    position: absolute;
    width: 12px;
    height: 12px;
    margin: 6px 0 0 4px;
  }

  .ant-tabs-ink-bar {
    visibility: hidden;

    &:after {
      content: '';
      visibility: visible;
      position: absolute;
      left: 50%;
      bottom: 0;
      display: block;
      width: 50%;
      height: 2px;
      transform: translateX(-50%);
      background-color: #0171f6;
      border-radius: 1px;
    }
  }
`;

const DialogContentStyle = styled.div`
  background: #fff;
  border-radius: 4px;
  height: 174px;
  position: relative;
  background: url(${require('@/pages/finance/financingLeaseNew/images/nopower.png')}) center center;
  background-size: cover;
`;
