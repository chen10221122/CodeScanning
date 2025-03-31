import { useRef, useState, useMemo } from 'react';

import { useDebounceEffect, useSize, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE, LINK_DETAIL_BOND } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { useWindowSize } from '@/utils/hooks';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

type Prop = {
  /** 显示文字 */
  text: string;
  /** 跳转code */
  code?: string;
  /** 跳转f9类型 */
  type?: string;
  /** 设置的折行数，几行显示... */
  clamp?: number;
  /** 标签 */
  tags?: string[];
  /** 外部传入的class类名 */
  className?: string;
  /** 用于关键字高亮 */
  keyword?: string;
  /** 单行最大宽度 */
  maxWidth?: number;
  /** 字符串为空样式 */
  emptyClassName?: string;
};

const TagNameTitle = ({
  text,
  code,
  tags,
  type = 'company',
  className,
  clamp = 1,
  emptyClassName,
  keyword,
  maxWidth,
}: Prop) => {
  const { width } = useWindowSize();
  const history = useHistory();

  /** 是否展示title*/
  const [show, setShow] = useState<boolean>(false);
  const wrapRef = useRef<any>();
  const contentRef = useRef<any>();
  const wrapSize = useSize(wrapRef);

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

  const getStyleValue = useMemoizedFn((key) => {
    switch (key) {
      case '港':
      case '三板':
      case '上市':
      case '央企':
      case '国企':
      case '央企子公司':
      case '民企':
      case '城投':
        return {
          color: '#0086FF',
          background: '#EBF6FF',
        };
      case '发债人':
      case '城投子公司':
        return {
          color: '#7686DE',
          background: '#F1F2FB',
        };
      case '高新技术企业':
      case '科技型中小企业':
      case '专精特新小巨人':
      case '专精特新中小企业':
        return {
          color: '#FF7500',
          border: '1px solid rgb(255, 117, 0, 0.2)',
          lineHeight: '16px',
        };
      default:
        return {};
    }
  });

  const Tags = useMemo(() => {
    return (
      <div className="tagsWrap">
        {tags?.map((tag, index) =>
          tag ? (
            <span className="tag" key={index} style={getStyleValue(tag) || {}}>
              {tag}
            </span>
          ) : null,
        )}
      </div>
    );
  }, [getStyleValue, tags]);

  /** 跳转至企业速览 */
  const linkToF9 = useMemoizedFn((code: string) => {
    history.push(
      urlJoin(
        dynamicLink(type === 'company' ? LINK_DETAIL_ENTERPRISE : LINK_DETAIL_BOND, { anchor: '' }),
        urlQueriesSerialize({ type, code }),
      ),
    );
  });

  if (!text || text === '-') return <div className={emptyClassName}>-</div>;

  return (
    <WrapContent>
      <OverflowWrap ref={wrapRef} row={clamp} className={className} maxWidth={maxWidth}>
        <div className={cn('content')} ref={contentRef}>
          <div className="titleNew" title={show ? text : undefined}>
            <div className={cn('text', { 'hover-link': code?.length })} onClick={() => code && linkToF9(code)}>
              <span>{keyword ? highlight(text, keyword) : text}</span>
            </div>
          </div>
        </div>
      </OverflowWrap>
      {Tags}
    </WrapContent>
  );
};

export default TagNameTitle;

const WrapContent = styled.div`
  display: inline-flex;
  .tagsWrap {
    flex-shrink: 0;
  }
  .tag {
    display: inline-block;
    padding: 0 3px;
    border-radius: 2px;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    font-weight: 400;
    min-width: 30px;
    text-align: center;
    box-sizing: border-box;
    margin-right: 4px;
  }
`;

const OverflowWrap = styled.div<{ row: number; maxWidth?: number }>`
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props?.row ? props?.row : 1)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  .content {
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
      color: #141414;
      line-height: 20px;
      margin-right: 4px;
    }
    .hover-link {
      color: #025cdc;
      cursor: pointer;

      > span {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;
