import { FC, Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import styled from 'styled-components';

import useRequest from '@/utils/ahooks/useRequest';

import { getTargetNames } from '../../api';

type TTagProps = {
  tag: string | null;
  count: string | number | null;
  /** 是否需要挂载在指定父容器上 挂载后的副作用为当数据只有一条或少量时 会出现popover被遮挡的问题 */
  needContainer?: boolean | undefined;
};

const ShowOtherTitleAndCount: FC<TTagProps> = ({ tag, count }) => {
  const mountedRef = useRef(null);
  const [shouldDoRequest, setShouldDoRequest] = useState(false);
  const { loading, data, run } = useRequest(getTargetNames, {
    manual: true,
    onSuccess: (data) => {},
  });

  /** 鼠标进入即请求数据 */
  useEffect(() => {
    if (shouldDoRequest && tag) {
      run(tag);
    }
  }, [shouldDoRequest, run, tag]);

  const content = useMemo(() => {
    if (!loading && data?.data) {
      return (
        <div>
          {data?.data?.map((i: string, idx: number, arr: any[]) => {
            return (
              <Fragment key={idx}>
                <div
                  style={{
                    height: '13px',
                    marginBottom: arr.length - 1 === idx ? '' : '8px',
                    fontSize: '13px',
                    lineHeight: '13px',
                    color: '#262626',
                    textOverflow: 'ellipsis',
                    wordBreak: 'keep-all',
                    whiteSpace: 'nowrap',
                  }}
                  key={idx}
                >
                  {i}
                </div>
              </Fragment>
            );
          })}
        </div>
      );
    }
    return <></>;
  }, [loading, data]);

  const doRequestAndOpenPopover = useMemoizedFn(() => {
    setShouldDoRequest(true);
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {count && tag ? (
        /** 鼠标移入 icon 时开始请求数据 */
        <Container ref={mountedRef} onMouseEnter={doRequestAndOpenPopover}>
          {
            <Popover
              trigger={'hover'}
              content={content}
              getPopupContainer={() => document.body}
              placement={'bottom'}
              overlayStyle={{
                zIndex: 110,
              }}
              overlayInnerStyle={{
                minWidth: '112px',
                minHeight: `${24 + (Number(count) - 1) * 21 + 13}px`, // 上下 padding + (n-1) * 每个的高度 + 最后一个的高度
              }}
            >
              {count}
            </Popover>
          }
        </Container>
      ) : (
        '-'
      )}
    </div>
  );
};

export default memo(ShowOtherTitleAndCount);

const Container = styled.span`
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
  background: #fef7f2;
  border: 1px solid #ffe4cc;
  border-radius: 11px;
  color: #ff7500;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
  & > .ant-popover-inner-content {
    padding: 0 !important;
  }
`;
