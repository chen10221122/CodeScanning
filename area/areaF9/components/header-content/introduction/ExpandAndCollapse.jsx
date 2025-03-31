import { memo, useEffect, useRef, useState, useMemo } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

import { useWindowSize } from '@/utils/hooks';

import CardContent from '../../../modules/regionalOverview/briefIntroduction/components/CardContent';

const preHeight = 20;

const BusinessScopeInfo = ({ txt }) => {
  const wrapRef = useRef();
  const [hasMoreBtn, setHasMoreBtn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { width } = useWindowSize();

  // 处理是否显示展开/收起
  useEffect(() => {
    let timer = setTimeout(() => {
      let rows = Math.ceil(wrapRef.current.clientHeight / preHeight);
      if (wrapRef?.current && txt) {
        if (wrapRef.current.scrollHeight > wrapRef.current.clientHeight || rows > 10) {
          setHasMoreBtn(true);
        } else {
          setHasMoreBtn(false);
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [txt, width]);

  /** 收起、展开文字 */
  const creatElement = useMemo(
    () => (
      <span
        className={classNames('view-more', { expanded: !isExpanded })}
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? '收起' : '...展开'}
      </span>
    ),
    [isExpanded],
  );

  return (
    <BusinessScopeWrapper contentHeight={hasMoreBtn && !isExpanded ? '180px' : '0'}>
      <div className={classNames('business-scope-content', { expanded: isExpanded })}>
        {hasMoreBtn && !isExpanded ? creatElement : null}
        <div ref={wrapRef}>
          <CardContent innerValue={txt} />
        </div>
        {hasMoreBtn && isExpanded ? creatElement : null}
      </div>
    </BusinessScopeWrapper>
  );
};

export default memo(BusinessScopeInfo);

const BusinessScopeWrapper = styled.div`
  height: fit-content;
  .business-scope-content {
    position: relative;
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #141414;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({ row }) => (row ? row : 10)};
    -webkit-box-orient: vertical;
    &::before {
      content: '';
      float: right;
      width: 0;
      height: ${({ contentHeight }) => (contentHeight ? contentHeight : '')};
    }
    &.expanded {
      -webkit-line-clamp: unset;
      white-space: normal;
      &::before {
        display: none;
      }
    }
    &.isExpend {
      cursor: default !important;
    }

    &.isnotExpend {
      cursor: pointer;
    }
    .view-more {
      font-size: 13px;
      color: #0171f6;
      cursor: pointer;
      text-indent: 0;

      &.expanded {
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 54px;
        text-align: right;
        background-image: linear-gradient(270deg, #fcfdff 70%, rgba(248, 251, 255, 0));
      }
    }
  }
`;
