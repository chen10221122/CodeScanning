import { FC, memo, useEffect, useRef, useState, ReactNode, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { PopoverProps } from 'antd/lib/popover';
import cn from 'classnames';
import { isFunction } from 'lodash';
import styled from 'styled-components';

import { base } from '@/assets/styles/colors';
import { Popover } from '@/components/antd';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap/f9';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  text: string; // 显示文字
  code?: string;
  clamp?: number; // 几行显示...
  hasHoverStyle: boolean; // hover上去显示样式
  content?: ReactNode;
  className?: string;
  isOnResize?: boolean; // 是否需要监听尺寸变化
  keyword?: string; // 飘红的关键词
  onClick?: Function;
  /** popover还是自带的title， 默认是popover */
  noPopover?: boolean;
  getContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const Ellipsis: FC<Props & PopoverProps> = ({
  text,
  code,
  clamp = 1,
  content,
  hasHoverStyle,
  className,
  isOnResize,
  keyword,
  getContainer,
  onClick,
  noPopover = false,
  ...props
}) => {
  const history = useHistory();
  // 是否需要显示popover
  const [hasPopover, setHasPopover] = useState(true);
  // 离开页面隐藏popover
  const [leavePageHidePopover, setLeavePageHidePopover] = useState(true);

  const wrapRef = useRef<HTMLDivElement>(null);
  const needTextRef = useRef<HTMLParagraphElement>(null);

  const handleClick = () => {
    isFunction(onClick) && onClick();
    if (code) {
      history.push(
        `${urlJoin(
          dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
          urlQueriesSerialize({ code, type: 'company' }),
        )}`,
      );
      setLeavePageHidePopover(false);
      setTimeout(() => {
        setLeavePageHidePopover(true);
      });
    }
  };

  useEffect(() => {
    const callback = () => {
      if (needTextRef?.current && wrapRef?.current) {
        setHasPopover(needTextRef?.current?.clientWidth > wrapRef?.current?.clientWidth * clamp);
      }
    };
    callback();
    if (isOnResize) {
      window.addEventListener('resize', callback);
      return () => {
        window.removeEventListener('resize', callback);
      };
    }
  }, [isOnResize, clamp]);

  const newText = useMemo(() => {
    if (keyword) {
      const newKeyWord = keyword.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      const regExps = new RegExp(newKeyWord, 'gi');
      const newText = text?.replace(regExps, '<em>$&</em>');
      return newText;
    }
    return text || '-';
  }, [text, keyword]) as string;

  return (
    <Container ref={wrapRef} clamp={clamp} hasPopover={hasPopover} className={className}>
      {hasPopover && leavePageHidePopover ? (
        noPopover ? (
          <div
            className={cn('text', 'has-popover', { 'hover-link': hasHoverStyle })}
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: newText }}
            title={newText}
          />
        ) : (
          <Popover
            content={content || text}
            overlayClassName="blackListCoustomPopover"
            getPopupContainer={isFunction(getContainer) ? getContainer : () => wrapRef.current || document.body}
            placement="topRight"
            destroyTooltipOnHide
            {...props}
          >
            <div
              className={cn('text', 'has-popover', { 'hover-link': hasHoverStyle })}
              onClick={handleClick}
              dangerouslySetInnerHTML={{ __html: newText }}
            />
          </Popover>
        )
      ) : null}
      <div
        ref={needTextRef}
        className={cn('text', 'no-popover', { 'no-position': hasPopover, 'hover-link': hasHoverStyle })}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: newText }}
      />
    </Container>
  );
};

export default memo(Ellipsis);

const Container = styled.div<{ clamp: number; hasPopover: boolean }>`
  /* position: relative; */
  /* width: 100%; */
  em {
    color: ${base.redActive};
    font-style: normal;
  }
  .text {
    font-size: 13px;
    font-weight: 400;
    color: #141414;
    line-height: 20px;
    max-height: ${({ clamp }) => clamp * 23}px;
  }

  .has-popover {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${(props) => props.clamp};
  }

  .no-position {
    visibility: hidden;
    position: fixed;
    top: -10000px;
    white-space: nowrap;
  }

  .hover-link {
    cursor: pointer;
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
  }

  /* .blackListCoustomPopover {
    .ant-popover-inner {
      .ant-popover-inner-content {
        max-width: 430px;
        padding: 12px 10px !important;
        font-size: 14px;
        color: #434343;
        line-height: 21px;
      }
    }
  } */
`;
