import { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { Popover } from 'antd';
import cn from 'classnames';
import styled, { createGlobalStyle } from 'styled-components';

import 'less/popover.less';

interface CompanyPopoverType {
  /**企业名称集合 */
  nameList: string[];
  /**url集合 */
  urlList: string[];
  ellipsis?: boolean;
}

const CompanyPopover = ({ nameList, urlList, ellipsis }: CompanyPopoverType) => {
  const history = useHistory();
  const [currentVisible, setCurrentVisible] = useState(false);
  const handleVisibleChange = useCallback((v) => {
    setCurrentVisible(v);
  }, []);

  const handleJump = useMemoizedFn((path: string) => {
    setCurrentVisible(false);
    history.push(path);
  });

  // hover弹窗
  let NameContent = (
    <FoldContainer>
      {nameList.slice(1).map((name: string, idx: number) => {
        return (
          <div className="fold-item" key={idx}>
            <div className="abslink">
              <div className="f9-link" onClick={() => handleJump(urlList[idx + 1])}>
                {name}
              </div>
            </div>
          </div>
        );
      })}
    </FoldContainer>
  );

  return (
    <Container ellipsis={ellipsis}>
      <GlobalStyle />
      {nameList?.length ? (
        <>
          <div className={cn('abslink', { ellipsis: ellipsis })}>
            <div title={nameList[0]} className="f9-link" onClick={() => handleJump(urlList[0])}>
              {nameList[0]}
            </div>
          </div>
        </>
      ) : (
        '-'
      )}
      {nameList.length > 1 ? (
        <Popover
          placement={'bottom'}
          content={NameContent}
          trigger={'hover'}
          overlayStyle={{ maxWidth: 300, zIndex: 2000 }}
          overlayClassName="name-fold-popover"
          visible={currentVisible}
          onVisibleChange={handleVisibleChange}
          getPopupContainer={() => document.body}
        >
          <i className="iconfont-size-fold">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
            </svg>
          </i>
        </Popover>
      ) : null}
    </Container>
  );
};

export default memo(CompanyPopover);

const GlobalStyle = createGlobalStyle`
  .name-fold-popover{
    .ant-popover-inner{
      max-height: 200px;
      overflow: auto;
      scrollbar-color: #e0e0e0 transparent;
      &::-webkit-scrollbar,
      &::-webkit-scrollbar-thumb {
        visibility: hidden;
      }
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #e0e0e0;
      }
    }
    .more {
      white-space: nowrap;
      cursor: pointer;
      margin-left: 6px;
      text-align: left;
      color: #0171F6;
      &:hover{
        text-decoration: underline;
      }
    }
    .f9-link{
      color: #141414;
      font-size: 13px !important;
      display: inline-block;
      line-height:20px;
      &:hover{
        cursor: pointer;
      }
    }
    .fold-item{
      font-size: 12px;
    }
  }
  .ant-popover-inner-content{
    padding:8px 16px !important;
  }
  .ant-popover-placement-bottom{
    position:absolute;
    max-width:unset !important
  }
`;
const Container = styled.div<{ ellipsis?: boolean }>`
  display: ${({ ellipsis }) => (ellipsis ? 'block !important' : 'flex !important')};
  align-items: baseline;
  .icon {
    width: 12px;
    height: 12px;
  }
  .iconfont-size-fold {
    display: inline-block;
    font-size: 13px;
    line-height: 13px;
    margin-left: 4px;
    cursor: pointer;
    &:hover {
      transform-origin: center;
      transform: rotate(180deg);
    }
  }
  .iconfont-size-unfold {
    display: inline-block;
    font-size: 13px;
    line-height: 13px;
    margin-left: 6px;
    cursor: pointer;
    transform-origin: center;
    transform: rotate(180deg);
  }
  .f9-link {
    color: #141414;
    &:hover {
      cursor: pointer;
      color: #0171f6;
    }
  }
  .abslink {
    .f9-link {
      &:hover {
        color: #0171f6;
      }
    }
  }
  .ellipsis {
    .f9-link {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
    }
  }
  .f9-link-more {
    &:hover {
      text-decoration: underline;
      text-decoration-color: #0171f6;
    }
    color: #0171f6;
  }
`;
const FoldContainer = styled.span`
  max-height: 300px;
  overflow-y: auto;
  width: calc(100% + 10px);
  .fold-item {
    padding: 4px 0;
    font-weight: 400;
    font-size: 14px;
    color: #141414;
    .abslink {
      .f9-link {
        &:hover {
          color: #0171f6;
        }
      }
    }
  }
`;
