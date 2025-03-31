import { FC, memo, useEffect, useRef, useState } from 'react';

import { TooltipPlacement } from 'antd/lib/tooltip';
import classNames from 'classnames';
import styled from 'styled-components';

import { Popover } from '@/components/antd';

type OverviewType = {
  text: string;
  clamp?: number;
  containerId?: string;
  placement?: TooltipPlacement;
};

/**
 * @param {string} text 显示文字
 * @param {number} clamp 默认超过折 ? 行 (default 1)
 * @returns {React.ReactNode}
 */

const Overview: FC<OverviewType> = ({ text, clamp = 1, containerId, placement = 'top' }: OverviewType) => {
  const [hasPopover, setHasPopover] = useState<boolean>(true);
  const needTextRef = useRef<HTMLParagraphElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (text && needTextRef?.current && wrapRef?.current) {
      // setHasPopover(needTextRef?.current?.scrollHeight > needTextRef?.current?.clientHeight);
      setHasPopover(needTextRef?.current?.clientWidth > wrapRef?.current?.clientWidth);
      window.addEventListener('resize', () => {
        if (needTextRef?.current && wrapRef?.current)
          // setHasPopover(needTextRef?.current?.scrollHeight > needTextRef?.current?.clientHeight);
          setHasPopover(needTextRef?.current?.clientWidth > wrapRef?.current?.clientWidth);
      });
    }
  }, [text]);

  return (
    <LinkStyle clamp={clamp}>
      <div ref={wrapRef}>
        {hasPopover ? (
          <Popover
            style={{ display: hasPopover ? 'block' : 'none' }}
            content={text}
            arrowPointAtCenter={placement === 'top'}
            overlayClassName="similar-economy-popover"
            color="rgba(0, 0, 0, 0.75)"
            placement={placement}
            trigger="hover"
            // getPopupContainer={() => document.getElementById('bondIssuanceStatisticsStickyTableMounted') as HTMLElement}
            getPopupContainer={() => (document.getElementById(`${containerId}`) as HTMLElement) || document.body}
          >
            <p className={classNames('has-popover')}>{text}</p>
          </Popover>
        ) : null}
        <div ref={needTextRef} className={classNames('no-popover', { 'no-position': hasPopover })}>
          <span className="nowrap-span">{text}</span>
        </div>
      </div>
    </LinkStyle>
  );
};

export default memo(Overview);

const LinkStyle = styled.div<{ clamp: number }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  p {
    font-size: 13px;
    overflow: hidden;
    margin: 0;
  }
  .has-popover {
    /* line-height: 13px; */
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    /* display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${(props) => props.clamp}; */
    cursor: pointer;
  }
  .no-popover {
    height: 20px;
    line-height: 20px;
    display: inline-block;
    &.no-position {
      visibility: hidden;
      position: absolute;
    }
    .nowrap-span {
      white-space: nowrap;
      font-size: 13px;
    }
  }
`;
