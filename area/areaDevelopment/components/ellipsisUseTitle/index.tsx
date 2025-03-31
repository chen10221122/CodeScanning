import { memo, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import styled from 'styled-components';

interface Props {
  /* 展示的文本信息 */
  text: string;
  /* 可折行的行数 */
  clamp?: number;
}

const EllipsisUseTitle = ({ text, clamp }: Props) => {
  const wrapRef = useRef<any>();
  const [isExceeded, setExceeded] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (wrapRef?.current && text) {
        if (wrapRef.current?.scrollHeight > wrapRef.current?.clientHeight) setExceeded(true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <BusinessScopeWrapper clamp={clamp}>
      <div className={classNames('business-scope-content')} ref={wrapRef}>
        {text && text !== ' ' ? isExceeded ? <span title={text}>{text}</span> : text : '-'}
      </div>
    </BusinessScopeWrapper>
  );
};

export default memo(EllipsisUseTitle);

const BusinessScopeWrapper = styled.div<{ clamp?: number }>`
  height: fit-content;
  .business-scope-content {
    font-size: 13px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${(props) => (props?.clamp ? props.clamp : 1)};
    -webkit-box-orient: vertical;
  }
`;
