import { Key, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import cn from 'classnames';
import { WritableDraft } from 'immer';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import newImage from '@/assets/images/common/new.png';
import waitImage from '@/assets/images/common/wait.png';
import { Popover } from '@/components/antd';
import { Image } from '@/components/layout';
import { useTrackMenuClickFn } from '@/libs/eventTrack';

import { ActiveKey } from './index';
import styles from './styles.module.less';
import { ITabContent } from './types';

/** 下拉目录每一项的类型 */
interface MenuItem {
  /** 名称 */
  name: string | JSX.Element;
  /** 一级tab对应的key */
  outTabKey: Key;
  /** 二级tab对应的key */
  innerTabKey?: Key;
  /** 是否有New的图标 */
  isNew?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否待上线 */
  isWait?: boolean;
}

type Props = {
  /** Tab配置 */
  tabConf: Array<ITabContent>;
  /** 当前一级和二级展示的tab */
  activeKey: ActiveKey;
  /** 当前鼠标悬浮在哪个一级tab */
  outTabHoverIndex?: number;
  /** 目录可见性 */
  menuVisible: boolean;
  setActiveKey: (f: (draft: WritableDraft<ActiveKey>) => void | ActiveKey) => void;
  handleTabChange?: (key: string | number) => void;
  jumpToAreaRank: number;
};

export default function Menu({
  tabConf,
  activeKey,
  menuVisible,
  outTabHoverIndex,
  setActiveKey,
  handleTabChange,
  jumpToAreaRank,
}: Props) {
  const [menu, setMenu] = useState<MenuItem[][]>(); // 根据tabConf生成的tab目录
  const { outTabActiveKey, innerTabActiveKey } = activeKey;
  const stickyRef = useRef(null);

  /* 根据tabConf生成的tab目录和默认展示tab，默认展示tab取第一个非disabled的 */
  useEffect(() => {
    let tabMenu: MenuItem[][] = [];
    let defaultOutKey: Key = '';
    let defaultInnerKeyAry: (Key | undefined)[] = [];
    tabConf.forEach((outTabItem) => {
      const { key: outTabKey, name: outName, innerTabCfg, disabled: outDisabled } = outTabItem;
      let innerTabDefaultKey: Key | undefined;
      if (!defaultOutKey && !outDisabled) defaultOutKey = outTabKey;

      if (innerTabCfg) {
        /* 有二级tab，目录就忽略一级的配置，取二级tab配置 */
        const { tabConf } = innerTabCfg;
        let innerMenuItem: MenuItem[] = [];
        tabConf.forEach((innerTabItem) => {
          const { key: innerTabKey, name: innerName, disabled: innerDisabled, isNew, isWait } = innerTabItem;
          if (isUndefined(innerTabDefaultKey) && !innerDisabled) innerTabDefaultKey = innerTabKey;
          innerMenuItem.push({
            name: innerName,
            outTabKey,
            innerTabKey,
            isNew,
            isWait,
            disabled: innerDisabled,
          });
        });
        tabMenu.push(innerMenuItem);
      } else
      /* 没有二级tab，目录就取一级的配置 */
        tabMenu.push([
          {
            name: outName,
            outTabKey,
            disabled: outDisabled,
          },
        ]);
      defaultInnerKeyAry.push(innerTabDefaultKey);
    });
    setMenu(tabMenu);
    setActiveKey(() => ({ outTabActiveKey: defaultOutKey, innerTabActiveKey: defaultInnerKeyAry }));
  }, [setActiveKey, tabConf]);

  const onTabChange = useTrackMenuClickFn<(cilckItem: MenuItem, index: number, e?: MouseEvent) => void>(
    (cilckItem, index) => {
      const { outTabKey, innerTabKey, disabled } = cilckItem;
      if (!disabled) {
        setActiveKey((draft) => {
          draft.outTabActiveKey = outTabKey;
          draft.innerTabActiveKey[index] = innerTabKey;
        });
        handleTabChange && handleTabChange(innerTabKey!);
      }
    },
    (cilckItem, _, e) => {
      const { disabled } = cilckItem;
      if (e && !disabled) return [e.target];
    },
  );

  // 头部可以跳转到 地区榜单
  useEffect(() => {
    if (jumpToAreaRank > 0) {
      onTabChange(
        {
          innerTabKey: 'regionalList',
          isNew: true,
          name: '地区榜单',
          outTabKey: '6',
        },
        5,
      );
    }
  }, [jumpToAreaRank, onTabChange]);

  return (
    <StickyMenu visible={menuVisible} ref={stickyRef}>
      {/* tab配置的顺序和数量是不变的，所以直接用索引做key */}
      {menu?.map((outTabItem, index) => (
        <div key={index} className={cn('menu-col', index === outTabHoverIndex ? 'menu-col-active' : '')}>
          {outTabItem.map((innerTabItem, i) => {
            const { name, isNew, isWait, disabled, outTabKey, innerTabKey } = innerTabItem;
            if (isWait) {
              return (
                <Popover
                  placement="bottomLeft"
                  content={<div className={styles.waitPopupTitle}>该模块暂未上线，敬请期待！</div>}
                  overlayClassName={styles.waitPopup}
                  mouseLeaveDelay={0}
                  getPopupContainer={() => stickyRef.current || document.body}
                >
                  <div key={i} className="menu-row menu-row-disabled">
                    {name}
                    {isWait && <Image src={waitImage} alt="new" className="new-tag" />}
                  </div>
                </Popover>
              );
            }
            return (
              <div
                key={i}
                onClick={(e) => onTabChange(innerTabItem, index, e)}
                className={cn({
                  'menu-row': true,
                  'menu-row-disabled': disabled,
                  'menu-row-active': outTabKey === outTabActiveKey && innerTabKey === innerTabActiveKey[index],
                })}
                data-trace-title={name}
              >
                {name}
                {isNew && <Image src={newImage} alt="new" className="new-tag" />}
              </div>
            );
          })}
        </div>
      ))}
    </StickyMenu>
  );
}

const StickyMenu = styled.div<{ visible: boolean }>`
  position: absolute;
  /* 100% - 左右20的padding */
  width: calc(100% - 40px);
  top: 45px;
  display: flex;
  z-index: 101;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  background: #fff;
  box-shadow: 0px 8px 20px 0px rgba(109, 109, 109, 0.08);
  .menu-col {
    width: 106px;
    height: 200px;
    padding-top: 14px;
    border-right: 1px solid #f5f5f5;
    &:hover {
      background-color: #f3f8ff;
    }
  }
  .menu-col-active {
    background-color: #f3f8ff;
  }
  .menu-row {
    line-height: 20px;
    padding: 0 0 10px 12px;
    color: #262626;
    font-size: 13px;
    &:hover {
      color: #0171f6;
      cursor: pointer;
    }
  }
  .menu-row-disabled {
    color: #bfbfbf !important;
    cursor: not-allowed !important;
  }
  .menu-row-active {
    color: #0171f6;
  }
`;
