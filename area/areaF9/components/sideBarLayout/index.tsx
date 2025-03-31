import { memo, ReactNode, FC, useRef } from 'react';
import { useSelector } from 'react-redux';

import cn from 'classnames';
import styled from 'styled-components';

import { contentOffset, pageOffset } from '@/app/less.config';
import BackTop from '@/components/backTop';
import Side from '@/pages/area/areaF9/components/sideBarLayout/side';
import { IRootState } from '@/store';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

import ViewPermissionModal from '../viewPermissionModal';

const prefix = getPrefixCls('side-page');
const css = getStyledPrefixCls('side-page');

export enum SideLayoutChildTypeEnum {
  /** 头部 */
  HEADER = 'HEADER',
  /** 侧边 */
  SIDE = 'SIDE',
  /** 主题内容 */
  CHILDREN = 'CHILDREN',
}

export enum NodeTypeEnum {
  /** 推荐节点 */
  RECOMMEND = '1',
  /** 常用节点 */
  COMMONUSE = '2',
}

interface SideLayoutProps {
  /** 头部节点 */
  header?: ReactNode;
  /** 侧边栏节点 */
  side?: ReactNode;
  /** 主体内容节点 */
  children?: ReactNode | FC[];
  /** 隐藏滚动条 */
  hideScrollBar?: boolean;
  /** 侧边宽度 */
  sideWidth?: number;
}

const SideLayout: FC<SideLayoutProps> = ({ header, side, children, hideScrollBar, sideWidth }) => {
  const scrollContentRef = useRef<HTMLDivElement>(null);

  /** children是单个元素 */
  const isSingleChild = !Array.isArray(children);

  let sideVdom = null;
  let headerVdom = null;
  let childrenVdom: any[] = [];

  if (!isSingleChild) {
    children.forEach((vdom) => {
      // @ts-ignore
      switch (vdom?.props?.type) {
        case SideLayoutChildTypeEnum.HEADER:
          headerVdom = vdom;
          break;
        case SideLayoutChildTypeEnum.SIDE:
          sideVdom = vdom;
          break;
        case SideLayoutChildTypeEnum.CHILDREN:
          childrenVdom.push(vdom);
          break;
        default:
          childrenVdom.push(vdom);
      }
    });
  }

  const kxBoxHeight = useSelector((store: IRootState) => store.common.kxBoxHeight);

  /**是否存在快捷导航栏 */
  const hasQuickNavigation = useSelector((store: IRootState) => store.common.hasQuickNavigation);
  const quickNavigationHeight = useSelector((store: IRootState) => store.common.quickNavigationHeight);

  return (
    <Container
      kxBoxHeight={kxBoxHeight}
      hasQuickNavigation={hasQuickNavigation}
      quickNavigationHeight={quickNavigationHeight}
      className={cn(prefix('container'), { 'hide-scroll-bar': hideScrollBar })}
    >
      <div className={prefix('header')}>{header || headerVdom}</div>
      <div className={prefix('section')}>
        <Side width={sideWidth}>{side || sideVdom}</Side>
        <div ref={scrollContentRef} className={prefix('content')}>
          <ViewPermissionModal>{isSingleChild ? children : childrenVdom}</ViewPermissionModal>
        </div>
        <BackTop target={() => scrollContentRef.current!} />
      </div>
    </Container>
  );
};

export default memo(SideLayout);

const Container = styled.div<{ kxBoxHeight: number; hasQuickNavigation: boolean; quickNavigationHeight: number }>`
  height: calc(
    100vh - ${contentOffset} - ${(props) => props.kxBoxHeight}px -
      ${({ hasQuickNavigation, quickNavigationHeight }) => (hasQuickNavigation ? `${quickNavigationHeight}px` : '0px')}
  );
  @media (max-width: 1279px) {
    /* 小于1280时最外层容器会有一个滚动条高度 */
    height: calc(
      100vh - ${contentOffset} - 12px - ${(props) => props.kxBoxHeight}px -
        ${({ hasQuickNavigation, quickNavigationHeight }) =>
          hasQuickNavigation ? `${quickNavigationHeight}px` : '0px'}
    );
    overflow-x: auto;
  }
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  overflow-y: hidden;

  &.hide-scroll-bar {
    overflow: hidden;
    ${css('content')} {
      overflow: hidden;
    }
  }

  ${css('header')} {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    /* font-weight: 500; */
    color: #141414;
    margin-bottom: 4px;
    background: #fafafa;
  }

  ${css('section')} {
    height: calc(100vh - ${pageOffset});
    display: flex;
    background: #fff;
    overflow-y: hidden;

    ${css('content')} {
      flex: 1;
      overflow-y: auto;
      overflow-y: overlay;
      position: relative;
      will-change: width;
    }
  }
`;
