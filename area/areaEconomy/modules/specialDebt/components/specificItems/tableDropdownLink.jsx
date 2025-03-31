import { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Popover } from 'antd';
import classNames from 'classnames';
import styled, { createGlobalStyle } from 'styled-components';

import 'less/popover.less';

const DropLink = ({ nameList, urlList, additionDom, triggerType, jumpType = '_blank', tabId = '', zIndex = 2000 }) => {
  const history = useHistory();
  const [currentVisible, setCurrentVisible] = useState(false);
  const toggleIcon = useCallback(() => setCurrentVisible(!currentVisible), [currentVisible]);
  const handleVisibleChange = useCallback((v) => {
    setCurrentVisible(v);
  }, []);

  const handleJump = (path) => {
    if (jumpType !== '_blank') {
      history.push(path);
      return;
    }
    // window.open(urlList[0]);
    if (path) {
      history.push(path);
    }
  };

  // hover弹窗
  let NameContent = (
    <FoldContainer currentVisible={true}>
      {nameList.map((name, idx) => {
        return (
          <div className="fold-item" key={idx}>
            <MoreName
              link={urlList[idx] ? true : false}
              onClick={() => handleJump(urlList[idx])}
              rel="noopener noreferrer"
            >
              {name}
            </MoreName>
            {additionDom[idx] ? <span>{additionDom[idx]}</span> : null}
          </div>
        );
      })}
    </FoldContainer>
  );

  return (
    <Container>
      <GlobalStyle />
      {nameList?.length ? (
        <>
          {/* 有可跳转链接才变蓝色 */}
          <FirstName link={urlList[0] ? true : false} onClick={() => handleJump(urlList[0])} rel="noopener noreferrer">
            <span title={nameList[0]}>{nameList[0]}</span>
          </FirstName>
          {additionDom?.length ? <span>{additionDom[0]}</span> : null}
        </>
      ) : (
        '-'
      )}
      {nameList.length > 1 ? (
        <Popover
          id="popover"
          placement="bottom"
          content={NameContent}
          trigger={triggerType}
          overlayStyle={{ maxWidth: 300, minWidth: 200, zIndex }}
          overlayClassName="name-fold-popover"
          onVisibleChange={handleVisibleChange}
          getPopupContainer={() => (tabId ? document.querySelector(`#${tabId}`) : document.body)}
        >
          {triggerType === 'hover' ? (
            <i className="iconfont-size-fold">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
              </svg>
            </i>
          ) : (
            <i
              className={classNames({ 'iconfont-size-fold': !currentVisible, 'iconfont-size-unfold': currentVisible })}
              onClick={toggleIcon}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconContent_icon_gengduo_zt2x"></use>
              </svg>
            </i>
          )}
        </Popover>
      ) : null}
    </Container>
  );
};

DropLink.defaultProps = {
  nameList: [],
  urlList: [],
  additionDom: [],
  triggerType: 'hover',
};

export default memo(DropLink);

const GlobalStyle = createGlobalStyle`

.name-fold-popover{
  #popover{
    max-height: 200px;
    overflow: auto;

    ::-webkit-scrollbar {
      width: 6px; /*对垂直流动条有效*/
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #cfcfcf;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
  }
  .more {
    white-space: nowrap;
    cursor: pointer;
    margin-left: 6px;
    text-align: left;
    color: #025cdc;
    &:hover{
      text-decoration: underline;
    }
  }
  .fold-item{
    font-size: 12px;
  }
}
`;

const Container = styled.div`
  display: flex;
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
`;
const FoldContainer = styled.span`
  max-height: 300px;
  overflow-y: auto;
  width: calc(100% + 10px);
  .fold-item {
    padding: 5px 0;
    font-weight: 400;
    font-size: 14px;
    color: #141414;
  }
`;
const FirstName = styled.div`
  color: ${(props) => (props.link ? '#025cdc' : '#141414')};
  &:hover {
    color: ${(props) => (props.link ? '#025cdc' : '#141414')};
    cursor: ${(props) => (props.link ? 'pointer' : 'text')};
    text-decoration: ${(props) => (props.link ? 'underline' : 'unset')};
  }
`;
const MoreName = styled.div`
  color: ${(props) => (props.link ? '#025cdc' : '#141414')};
  font-size: 13px !important;
  display: inline-block;
  &:hover {
    color: ${(props) => (props.link ? '#025cdc' : '#141414')};
    cursor: ${(props) => (props.link ? 'pointer' : 'text')};
    text-decoration: underline;
  }
`;
