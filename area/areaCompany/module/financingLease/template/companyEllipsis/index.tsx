import { FC, memo, useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { TooltipPlacement } from 'antd/lib/tooltip';
import cn from 'classnames';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap/f9';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { getTextWidth } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import Tag from './tag';

import './style.less';

const MAX_COLUMN_WIDTH = 270;

interface Props {
  text: string; // 显示文字
  code: any; // 企业code
  clamp?: number; // 默认超过折 ? 行 (default 1)
  style?: CSSProperties;
  getPopupContainer?: HTMLElement; // popover挂载元素
  onClick?: Function; // 自定义点击时间
  hoverLink?: boolean; // hover上去显示跳转样式
  content?: ReactNode;
  keyword?: any;
  placement?: TooltipPlacement;
  handTags?: (
    lesseeTag: string,
    historyOverdueTag: string,
    newestRate: string,
    registerStatus: string,
    IsLessee?: boolean,
  ) => any;
  handleTagClick?: (text: any, data: any, code8: string, rate: string) => void;
  data?: any;
  tags?: any;
  rate: string; //评级
  tagName: string;
  codeName: string;
  listName: string;
  itCodeName: string;
  getHeight?: boolean; //是否需要获取表格行高度
  item?: any;
  /* 一行最大宽度 */
  oneLineWidth?: number;
}

const CompanyEllipsis: FC<Props> = ({
  text,
  code,
  clamp = 1,
  style,
  hoverLink,
  keyword,
  handTags,
  handleTagClick,
  data,
  tags,
  rate,
  tagName,
  codeName,
  listName,
  itCodeName,
  item,
  getHeight,
  oneLineWidth = MAX_COLUMN_WIDTH,
}) => {
  const history = useHistory();
  const [showLesseePopover, setShowLesseePopover] = useState(false);
  const [hasMoreBtn, setHasMoreBtn] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const needTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    oneLineWidth < getTextWidth(text) ? setHasMoreBtn(true) : setHasMoreBtn(false);
  }, [text, oneLineWidth]);

  const handleVisibleChange = useMemoizedFn((visible) => {
    setShowLesseePopover(visible);
  });

  const linkToF9 = useMemoizedFn((code) => {
    if (!code) return;
    history.push(
      urlJoin(
        dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
        urlQueriesSerialize({ type: 'company', code: code ? code : '' }),
      ),
      '',
    );
    setShowLesseePopover(false);
  });

  /** 获取表格行高度 */
  const getTableRowHeight = useMemoizedFn((item) => {
    const height = (wrapRef?.current as any)?.offsetHeight;
    if (height) {
      item.height = height;
    }
  });

  useEffect(() => {
    if (getHeight && item) {
      getTableRowHeight(item);
    }
  }, [getHeight, getTableRowHeight, item]);

  return (
    <>
      <Container ref={wrapRef} clamp={clamp} hasMoreBtn={hasMoreBtn} style={style}>
        <div ref={needTextRef} className={cn('text-container')}>
          <span className={cn('no-popover', { link: hoverLink })} onClick={() => linkToF9(code)}>
            <span className="word" title={text}>
              {keyword ? highlight(text as any, keyword) : text}
            </span>
          </span>
          <Tag
            data={tags}
            rate={rate}
            handleClick={(d: any) => handleTagClick?.(d, data, data[0]?.[itCodeName], rate)}
            isArea
          />
          {data.length > 1 ? (
            <Popover
              placement="bottom"
              visible={showLesseePopover}
              destroyTooltipOnHide={true}
              content={data.map((d: any) => {
                const tags: any = handTags?.(
                  d?.[tagName] || '',
                  d?.historyOverdueTag || '0',
                  d?.newestRate || '',
                  d?.registerStatus || '',
                  listName === 'lessee',
                );
                return (
                  <div className={cn('line')} key={d?.[listName]}>
                    <span
                      className={cn('word', { wrap: tags?.length !== 0, 'no-hover': !d?.[codeName] })}
                      onClick={() => linkToF9(d?.[codeName])}
                    >
                      {keyword ? highlight(d?.[listName], keyword) : d?.[listName] || ''}
                    </span>
                    <Tag
                      data={tags}
                      rate={rate}
                      handleClick={(d: any) => handleTagClick?.(d, data, data[0]?.[itCodeName], rate)}
                      isArea
                    />
                  </div>
                );
              })}
              overlayClassName="lessee-popover-content"
              onVisibleChange={handleVisibleChange}
              getPopupContainer={() => document.getElementById('area-company-将到期事件') || document.body}
            >
              <span className={cn('arrow', { top: showLesseePopover })}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
                </svg>
              </span>
            </Popover>
          ) : null}
        </div>
      </Container>
    </>
  );
};

export default memo(CompanyEllipsis);

const Container = styled.div<{ clamp: number; hasMoreBtn: boolean }>`
  margin-bottom: 0;
  height: fit-content;
  .text-container {
    line-height: 20px;
  }
  .no-popover {
    height: 20px;
    line-height: 20px;
    margin-right: ${(props) => (props.hasMoreBtn ? 0 : 6)}px;
    color: #141414;
  }
  .word {
    overflow: hidden;
    display: ${(props) => (props.hasMoreBtn ? '-webkit-box' : 'unset')};
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${(props) => props.clamp};
  }
  .arrow {
    cursor: pointer;
    display: inline-block;
    > svg {
      transition: all 0.3s;
    }

    &.ant-popover-open {
      > svg {
        transform: rotate(180deg);
      }
    }
  }

  .link {
    color: #025cdc !important;
    cursor: pointer !important;
    &:hover {
      text-decoration: underline;
    }
  }
  .hover-link {
    cursor: pointer !important;
    &:hover {
      color: #025cdc !important;
    }
  }
`;
