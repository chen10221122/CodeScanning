import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import { LINK_GO_WILD } from '@/configs/routerMap';
import { downloadFile } from '@/utils/download';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { prefix, css, GlobalStyle } from './style';

interface Iprops {
  /** 复制的文本内容 */
  cpTxt: string;
  /** 链接地址 */
  url: string;
  titleInfo: {
    /** 列表遍历的index直接传进来 */
    index: number;
    title: string;
  };
  /** 下边距 */
  mgb?: number;
}
const RenderHeader = ({ cpTxt, url, titleInfo, mgb }: Iprops) => {
  const history = useHistory();

  const [showPopover, setShowPopover] = useState(false);

  const topRef = useRef(null);

  const handleClickToCopy = useMemoizedFn(() => {
    setShowPopover(true);
    navigator.clipboard.writeText(cpTxt || '');
    setTimeout(() => {
      setShowPopover(false);
    }, 2000);
  });

  const handleClickToLink = useMemoizedFn(() => {
    if (!url) {
      return null;
    }
    const ext = url?.split('.')?.pop()?.toLowerCase();

    if (['docx', 'doc', 'xls', 'xlsx', 'ppt'].includes(ext ?? '')) {
      downloadFile(dayjs().format('YYYY-MM-DD'), url, ext);
    } else {
      let ret = getExternalLink(url);

      if (typeof ret === 'string') {
        history.push(urlJoin(dynamicLink(LINK_GO_WILD), urlQueriesSerialize({ url: encodeURIComponent(ret) })));
      } else {
        history.push(ret);
      }
    }
  });

  return (
    <HeaderWrapper ref={topRef} mgb={mgb}>
      <GlobalStyle />
      <div className={prefix('title-left')}>
        <span className={prefix('card-top-num')}>{`0${titleInfo.index + 1}`}</span>
        <span className={prefix('card-top-title')}>{titleInfo.title || ''}</span>
      </div>
      <div className={prefix('title-right')}>
        {url ? (
          <div className={cn(prefix('right-title'), 'mg-r')} onClick={handleClickToLink}>
            <img src={require('../../../assets/url.png')} alt="" className="co" />
            <div>链接</div>
          </div>
        ) : null}
        <Popover
          content="复制成功"
          getPopupContainer={() => topRef.current!}
          placement="left"
          trigger="click"
          overlayClassName={prefix('copy-success-popover')}
          visible={showPopover}
          destroyTooltipOnHide={true}
        >
          <div className={prefix('right-title')} onClick={handleClickToCopy}>
            <img src={require('../../../assets/copy.png')} alt="" className="co" />
            <div>复制</div>
          </div>
        </Popover>
      </div>
    </HeaderWrapper>
  );
};

export default RenderHeader;

const HeaderWrapper = styled.div<{ mgb?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ mgb }) => mgb || 5}px;
  ${css('title-left')},${css('title-right')} {
    display: flex;
    align-items: center;

    ${css('right-title')} {
      display: flex;
      align-items: center;
      &.mg-r {
        margin-right: 12px;
        cursor: pointer;
        > div {
          &:hover {
            color: #025cdc !important;
            text-decoration: underline;
          }
        }
      }
      > img {
        width: 13px;
        height: 14px;
        margin-right: 4px;
      }
      > div {
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #434343;
        line-height: 17px;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }

  ${css('card-top-num')} {
    display: inline-block;
    width: 18px;
    height: 18px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    color: #127af6;
    line-height: 18px;
    border-radius: 6px 0px 6px 6px;
    background: url(${require('../../../assets/icon-num-bg.png')}) center center no-repeat;
    background-size: 100% 100%;
  }
  ${css('card-top-title')} {
    display: inline-block;
    margin-left: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #0171f6;
    line-height: 18px;
  }
`;
