import { memo, FC, ReactNode, useRef } from 'react';

import { useMemoizedFn, useToggle, useControllableValue } from 'ahooks';
import styled from 'styled-components';

import useSidebarResize from '@/pages/dataView/Sidebar/useSidebarResize';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

const prefix = getPrefixCls('side');
const css = getStyledPrefixCls('side');

interface SideProps {
  children?: ReactNode;
  /** 宽度 */
  width?: number;
}

const Side: FC<SideProps> = (props) => {
  const { children } = props;
  const [sideWidth, setSideWidth] = useControllableValue(props, {
    defaultValue: 214,
  });

  /** 是否展开 */
  const [collapse, { toggle }] = useToggle(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleCollapse = useMemoizedFn(() => {
    toggle();
  });

  const { processMouseDown } = useSidebarResize(wrapperRef, setSideWidth, { minWidth: 214 });

  return (
    <SideStyle
      style={{ width: collapse ? sideWidth : 0 }}
      ref={wrapperRef}
      className={prefix('container')}
      collapse={collapse}
    >
      {/* 折叠 */}
      <div className={prefix('collapse')} onClick={handleCollapse} />
      {/* 拖拽 */}
      <div className={prefix('drag')} onMouseDown={processMouseDown} />

      <div className={prefix('content')}>{children}</div>
    </SideStyle>
  );
};

export default memo(Side);

const SideStyle = styled.div<{ collapse?: boolean }>`
  position: relative;
  padding-right: ${(props) => (props.collapse ? 3 : 0)}px;
  will-change: width;
  border-right: 1px solid #efefef;
  height: 100%;
  font-size: 13px;
  color: #5c5c5c;
  background-color: #fff;
  display: flex;
  transition: width 0.15s;
  flex-direction: column;

  ${css('collapse')} {
    position: absolute;
    top: 50%;
    right: -11px;
    width: 11px;
    height: 59px;
    border: 1px solid #e1e1e1;
    border-radius: 0 4px 4px 0;
    transform: translateY(-50%);
    z-index: 15;
    background: #f2f2f2;
    &:after {
      content: '';
      height: 0;
      width: 0;
      position: absolute;
      top: 50%;
      left: 1px;
      right: ${({ collapse }) => (collapse ? 2 : -2)}px;
      transform: translateY(-50%);
      border-width: ${({ collapse }) => (collapse ? '5px 6px 5px 0' : '5px 6px')};
      border-style: solid;
      border-color: ${({ collapse }) =>
        collapse ? 'transparent #8694ae transparent transparent' : 'transparent transparent transparent #8694ae'};
    }
  }

  ${css('drag')} {
    position: absolute;
    right: 0px;
    top: 0;
    bottom: 0;
    width: 2px;
    cursor: col-resize;
    z-index: 1;
    user-select: none;
  }

  ${css('content')} {
    width: 100%;
    height: 100%;
  }
`;
