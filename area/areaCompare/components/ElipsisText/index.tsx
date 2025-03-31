import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDebounceEffect, useMemoizedFn, useSize } from 'ahooks';
import { TooltipProps } from 'antd';
import cn from 'classnames';
import styled from 'styled-components';

import Icon from '@/components/icon';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { useWindowSize } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import './index.less';

export interface ElipsisTextProps {
  /** 内容文本 */
  text: string;
  /** 跳转区域经济code */
  code: string;
  /** 标签类型 默认 span */
  tag?: string;
  /** 提示的文本，默认为传入的 text 值 */
  tipText?: string;
  /** ToolTip 组件的 props，参考 https://ant.design/components/tooltip-cn/#API */
  tipProps?: TooltipProps;
  /** 其他 prop ，赋给文本标签 */
  [key: string]: any;
}

type Prop = {
  /** 点击文字方法 */
  onClick?: () => void;
  /** 显示文字 */
  text: string;
  /** 跳转区域经济code */
  code: string;
  /** 设置的折行数，几行显示... */
  clamp?: number; //
  /** hover上去显示样式 */
  hasHoverStyle: boolean;
  /** 外部传入的class类名 */
  className?: string;
  /** 用于关键字高亮 */
  keyword?: string;
  /** 单行最大宽度 */
  maxWidth?: number;
  /** 字符串为空样式 */
  emptyClassName?: string;
};

const ElipsisText: React.FC<Prop> = ({ text, className, code, clamp = 1, hasHoverStyle, maxWidth }) => {
  const { width } = useWindowSize();

  /** 是否展示title*/
  const [show, setShow] = useState<boolean>(false);
  const [isMouseIn, setMouseIn] = useState<boolean>(false);
  const wrapRef = useRef<any>();
  const contentRef = useRef<any>();
  const wrapSize = useSize(wrapRef);
  const history = useHistory();

  /** 跳转区域经济速览 */
  const gotoArearegionEconomy = useMemoizedFn(() => {
    if (code) {
      history.push(urlJoin(dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code }), urlQueriesSerialize({ code })));
      setMouseIn(false);
    }
  });

  useDebounceEffect(
    () => {
      if (
        (wrapRef?.current as unknown as HTMLElement)?.scrollHeight >
        (contentRef?.current as unknown as HTMLElement)?.clientHeight
      ) {
        setShow(true);
      } else {
        setShow(false);
      }
    },
    [setShow, width, wrapSize],
    { wait: 100 },
  );

  return (
    <Wrap onClick={gotoArearegionEconomy} onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}>
      <OverflowWrap ref={wrapRef} row={clamp} className={className} maxWidth={maxWidth}>
        <div className={cn('contentEllipsis')} ref={contentRef}>
          <div className="titleNew" title={show ? text : undefined}>
            <div className={cn('text', { 'hover-link': hasHoverStyle })}>
              <span>{text}</span>
            </div>
          </div>
        </div>
      </OverflowWrap>
      {isMouseIn && <Icon image={require('./goArea.svg')} size={8} />}
    </Wrap>
  );
};

export default ElipsisText;

const OverflowWrap: any = styled.div<{ row: number; maxWidth: number }>`
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props?.row ? props?.row : 1)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  .contentEllipsis {
    width: 100%;
    line-height: normal;
    white-space: break-spaces;
    word-break: break-all;

    .titleNew {
      position: relative;
      max-width: ${(props) => (props?.maxWidth ? props?.maxWidth + 'px' : '700px')};
    }
    .text {
      font-size: 13px;
      /* height: 23px;  千万不能设置height，否则clamp会失效*/
      font-weight: 400;
      color: #0e0e0e;
      line-height: 20px;
    }
    .hover-link {
      cursor: pointer;
      margin-right: 2px;
      &:hover {
        color: #0171f6;
      }
    }
  }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
`;
