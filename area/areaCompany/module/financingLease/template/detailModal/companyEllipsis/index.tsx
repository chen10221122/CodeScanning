import { memo, useEffect, useRef, useState, FC, useMemo } from 'react';

import { useMemoizedFn, useSize } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { dynamicLink, useHistory } from '@/utils/router';
import { getTextWidth } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  /** 企业名称及标签tag信息 */
  data: Record<string, any>[];
  /** tags分类 */
  type?: 'lessee' | 'leaser';
  noTag?: boolean;
  /** 用于关键字高亮 */
  keyword?: string;
  /** 几行高度判断 */
  rowLimit?: number;
  /** hover上去显示样式 */
  hasHoverStyle?: boolean;
  /** 点击文字方法 */
  onClick?: () => void;
  isNormalType?: boolean;
  /** 文字超出限制宽度 */
  textLimitwidth?: number;
}

/** 枚举承租人、出租人类型，增强代码可读性 */
enum LesseeTag {
  '上市' = 3,
  '央企' = 1,
  '国企' = 2,
  '央企子公司' = 14,
  '民企' = 8,
  '发债' = 5,
  '城投子公司' = 9,
  '城投' = 6,
  '高新技术企业' = 10,
  '科技型中小企业' = 11,
  '创新型中小企业' = 19,
  '专精特新小巨人' = 12,
  '专精特新中小企业' = 13,
}
enum LeaserTag {
  '央企' = 1,
  '国企' = 2,
  '民企' = 8,
  '发债' = 5,
  '上市' = 3,
}

const MAX_COLUMN_WIDTH = 300;

const CompanyEllipsis: FC<Props> = ({
  data,
  type,
  noTag,
  keyword,
  isNormalType,
  rowLimit,
  textLimitwidth = MAX_COLUMN_WIDTH,
}) => {
  const wrapRef = useRef<any>(null);
  const contentRef = useRef<any>();
  const [tags, setTags] = useState<string[]>();
  const [hasMoreBtn, setHasMoreBtn] = useState(false);
  const [showLesseePopover, setShowLesseePopover] = useState(false);

  const history = useHistory();
  const { width } = useSize(contentRef.current) || {};

  useEffect(() => {
    if (isNormalType) {
      wrapRef?.current?.scrollHeight > contentRef?.current?.clientHeight ? setHasMoreBtn(true) : setHasMoreBtn(false);
    } else {
      if (textLimitwidth < getTextWidth(data?.[0]?.itname)) {
        setHasMoreBtn(true);
      } else if (width ?? 0 < getTextWidth(data?.[0]?.itname)) {
        setHasMoreBtn(false);
      }
    }
  }, [data, isNormalType, textLimitwidth, width]);

  /** 跳转至企业速览 */
  const linkToF9 = useMemoizedFn((code: string) => {
    history.push(
      urlJoin(
        dynamicLink(LINK_DETAIL_ENTERPRISE, { anchor: '' }),
        urlQueriesSerialize({ type: 'company', code }),
        '#企业速览',
      ),
    );
  });

  const handTags = useMemoizedFn((tg: string): string[] => {
    const tags: string[] =
      (tg
        ?.split(',')
        ?.map((d: any) => {
          if (d) {
            return type === 'lessee' ? LesseeTag[d] : LeaserTag[d];
          }
          return null;
        })
        .filter((d) => !!d) as string[]) || [];
    return tags;
  });

  const getStyleValue = useMemoizedFn((key) => {
    switch (key) {
      case '上市':
        return {
          color: '#20aef5',
          background: '#e8f6fe',
        };
      case '央企':
      case '国企':
      case '央企子公司':
      case '民企':
        return {
          color: '#0086FF',
          background: '#EBF6FF',
        };
      case '发债':
      case '城投子公司':
      case '城投':
        return {
          color: '#7686DE',
          background: '#F1F2FB',
        };
      case '高新技术企业':
      case '科技型中小企业':
      case '创新型中小企业':
      case '专精特新小巨人':
      case '专精特新中小企业':
        return {
          color: '#FF7500',
          background: '#fff4eb',
        };
      default:
        return {};
    }
  });

  const handleVisibleChange = useMemoizedFn((visible) => {
    setShowLesseePopover(visible);
  });

  useEffect(() => {
    /** 接口返回标签字段 */
    const { leaserTag, lesseeTag } = data?.[0] || '';
    !noTag && setTags(handTags(leaserTag || lesseeTag));
  }, [setTags, handTags, data, type, noTag]);

  const Tags = useMemo(() => {
    return tags?.map((tag, index) =>
      tag ? (
        <span className="tag" key={index} style={getStyleValue(tag) || {}}>
          {tag}
        </span>
      ) : null,
    );
  }, [getStyleValue, tags]);
  if (!data?.length) return <span>-</span>;

  return (
    <WrapContent>
      <BusinessScopeWrapper hasMoreBtn={hasMoreBtn} ref={wrapRef} rowLimit={rowLimit!}>
        <div className={cn('business-scope-content')} ref={contentRef}>
          {data?.[0]?.itname?.length ? (
            <span
              className={cn('text', { 'hover-link': data?.[0]?.itcode2 })}
              onClick={() => data?.[0]?.itcode2 && linkToF9(data?.[0]?.itcode2)}
              title={data?.[0]?.itname}
            >
              <span>{keyword ? highlight(data?.[0]?.itname, keyword) : data?.[0]?.itname}</span>
            </span>
          ) : (
            '-'
          )}
          {hasMoreBtn ? null : Tags}
          {data.length > 1 ? (
            <Popover
              destroyTooltipOnHide={true}
              placement="bottom"
              content={data.map((d) => {
                const { leaserTag, lesseeTag } = d || {};
                const tags = !noTag ? handTags(leaserTag || lesseeTag) : [];

                return (
                  <div className={cn('line')} key={d?.lessee}>
                    <span className={cn('word', { 'no-hover': !d?.itcode2 })} onClick={() => linkToF9(d?.itcode2)}>
                      {d?.itname || ''}
                    </span>
                    {tags?.map((tag, index) =>
                      tag ? (
                        <span className="tag" key={index} style={getStyleValue(tag) || {}}>
                          {tag}
                        </span>
                      ) : null,
                    )}
                  </div>
                );
              })}
              overlayClassName="financingLease_censusAnalyse_popover_content"
              onVisibleChange={handleVisibleChange}
            >
              <span className={cn('arrow', { top: showLesseePopover })}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
                </svg>
              </span>
            </Popover>
          ) : null}
        </div>
      </BusinessScopeWrapper>

      {hasMoreBtn ? Tags : null}
    </WrapContent>
  );
};

export default memo(CompanyEllipsis);

const BusinessScopeWrapper = styled.div<{ hasMoreBtn: boolean; rowLimit: number }>`
  height: fit-content;
  .business-scope-content {
    font-size: 13px;
    line-height: 20px;
    &::before {
      content: '';
      float: right;
      width: 0;
      height: 22px;
    }
    &.expanded {
      -webkit-line-clamp: unset;
      white-space: normal;
      height: auto;
      &::before {
        display: none;
      }
    }
  }
  .text {
    margin-right: 4px;
    overflow: hidden;
    white-space: ${(props) => (props.hasMoreBtn ? '' : 'nowrap')};
    display: ${(props) => (props.hasMoreBtn ? '-webkit-box' : 'unset')};
    -webkit-line-clamp: ${(props) => (props?.rowLimit ? props?.rowLimit : 1)};
    -webkit-box-orient: vertical;
  }
  .hover-link {
    color: #025cdc;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .arrow {
    cursor: pointer;
    display: inline-block;
    margin-left: 4px;
    > svg {
      transition: all 0.3s;
    }
    &.ant-popover-open {
      > svg {
        transform: rotate(180deg);
      }
    }
  }
`;

const WrapContent = styled.div`
  .view-more {
    font-size: 13px;
    line-height: 18px;
    color: #0171f6;
    cursor: pointer;
    img {
      width: 11px;
      height: 11px;
      margin-left: 4px;
      /* transition: all 0.5s; */
      &.imgExpanded {
        transform: rotateX(180deg);
        margin-top: -2px;
      }
    }
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
    white-space: nowrap;
  }
`;
