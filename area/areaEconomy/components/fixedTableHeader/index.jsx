import { useState, useEffect, useRef } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

/**
 * @description 固定表格头部
 * @param {ReactNode} children 子组件
 * @param {Number} headerTop 表格头部固定的位置
 * @param {String} className 类名
 * @param {Number} scrollTop 滚动到改位置固定头部
 */
const FixedTableHeader = ({ children, headerTop = 143, className }) => {
  const [tableFixed, setTableFixed] = useState(false);
  const ref = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [width, setWidth] = useState();

  useEffect(() => {
    const contentViewDom = document.getElementById('table-content-view');
    const resizeOb = new ResizeObserver((entries) => {
      setWidth(entries[0]?.target?.offsetWidth - 2);
    });
    resizeOb.observe(contentViewDom);

    return () => {
      resizeOb.disconnect();
    };
  }, []);

  useEffect(() => {
    const tabsWrapper = document.getElementById('tabsWrapper');
    function scroll() {
      const top = ref.current?.getBoundingClientRect?.()?.top;
      const scrollLeft = tabsWrapper.scrollLeft;
      setScrollLeft(-scrollLeft);
      setTableFixed(top && top <= headerTop ? true : false);
    }
    tabsWrapper.addEventListener('scroll', scroll);
    return () => {
      tabsWrapper.removeEventListener('scroll', scroll);
    };
  }, [headerTop, tableFixed]);

  return (
    <TableWrapper
      headerWidth={width}
      headerTop={headerTop}
      className={cn(className, { 'fixed-header': tableFixed })}
      ref={ref}
      scrollLeft={scrollLeft}
    >
      {children}
    </TableWrapper>
  );
};

export default FixedTableHeader;

export const TableWrapper = styled.div`
  &.fixed-header {
    .ant-table-sticky-holder {
      z-index: 2;
      width: ${(props) => props.headerWidth}px !important;
      position: fixed !important;
      top: ${(props) => props.headerTop}px !important;
      transform: translateX(${(props) => props.scrollLeft}px) !important;
      overflow: hidden;
      & + .ant-table-body {
        padding-top: 30px;
      }
    }
    .underarea-table,
    .specific-table {
      .ant-table-sticky-holder + .ant-table-body {
        padding-top: 50px;
      }
    }
  }
`;
