import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Icon } from '@/components';
import { LINK_GO_WILD, LINK_AREA_F9 } from '@/configs/routerMap';
import { useParams } from '@/pages/area/areaF9/hooks/useParams';
import { downloadFile } from '@/utils/download';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import sourceIcon from '../../../assets/icon_source.png';
import { CardItem } from './cardItem';
import { InfoItem } from './index';
import { Title, prefix, css } from './style';

interface Iprops {
  dataSource?: string;
  regionName?: string;
  url?: string;
  infos?: InfoItem[];
  closePopover: (show: boolean) => void;
}
export default (props: Iprops) => {
  const { dataSource, infos, url, closePopover } = props;
  const history = useHistory();
  const { code } = useParams();

  const handleFile = useMemoizedFn(() => {
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

  const handleLinkToDetail = useMemoizedFn(() => {
    history.push(urlJoin(dynamicLink(LINK_AREA_F9, { key: 'briefIntroduction', code }), urlQueriesSerialize({ code })));
    closePopover(false);
    return setTimeout(() => closePopover(true), 100);
  });

  return (
    <DetailWrapper>
      <Title>
        区域简介
        <div className={prefix('right')}>
          <span className={prefix('text')}>来源：</span>
          <span className={prefix('source')}>{dataSource || '-'}</span>
          {url ? (
            <>
              <img src={sourceIcon} alt="" />
              <span className={prefix('url')} onClick={handleFile}>
                查看原网址
              </span>
            </>
          ) : null}
          <div className={prefix('link')}>
            <div onClick={handleLinkToDetail}>详情</div>
            <Icon symbol="iconico_qiyeF9_right2x" style={{ width: 6, height: 10 }} />
          </div>
        </div>
      </Title>
      <div className={prefix('content')}>
        <div className={prefix('content-scroll-box')}>
          {infos?.map((info: InfoItem, idx: number) => (
            <CardItem info={info} idx={idx} />
          ))}
        </div>
      </div>
    </DetailWrapper>
  );
};

const DetailWrapper = styled.div`
  height: 100%;

  ${css('right')} {
    display: flex;
    align-items: center;
    ${css('text')} {
      width: 36px;
      font-size: 12px;
      font-weight: 400;
      margin-right: 2px;
      text-align: left;
      color: #878787;
      line-height: 17px;
    }
    ${css('source')} {
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #141414;
      line-height: 20px;
    }

    ${css('link')} {
      display: flex;
      align-items: center;
      margin-left: 16px;
      width: auto;
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #0171f6;
      line-height: 20px;
      > div {
        margin-right: 4px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    ${css('url')} {
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      color: #0171f6;
      line-height: 20px;
      cursor: pointer;
      > div {
        color: transparent;
      }
    }
    > img {
      width: 14px;
      height: 14px;
      margin: 0 4px 0 16px;
    }
  }

  ${css('content')} {
    width: 624px;
    height: 403px;
    overflow: hidden;
    background: linear-gradient(360deg, #fbfdff, #f6faff);
    border: 1px solid #edf6ff;
    border-radius: 4px;
    padding: 0 2px 10px 16px;
  }

  ${css('content-scroll-box')} {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 9px;
    padding-right: 4px;
    overflow: hidden;
    scrollbar-gutter: stable;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 31px;
      width: 126px;
      height: 41px;
      background: url(${require('../../../assets/area_introduce_bg.png')}) center center no-repeat;
      background-size: cover;
    }

    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &:hover {
      overflow: hidden scroll;
    }

    > div:not(:last-child) {
      padding-bottom: 8px;
    }
  }
`;
