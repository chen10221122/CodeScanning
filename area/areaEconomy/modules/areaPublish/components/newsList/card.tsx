import { FC, memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Space } from 'antd';
import cn from 'classnames';
import dayJs from 'dayjs';
import styled from 'styled-components';

import { getConfig } from '@/app';
import {
  LINK_PUBLIC_OPINONS_NEWSDETAIL,
  LINK_PUBLIC_OPINONS_FINANCIAL_THEME,
  // LINK_PUBLIC_OPINONS_NEWS,
  LINK_DETAIL_ENTERPRISE,
  LINK_AREA_F9,
  LINK_PUBLIC_OPINONS_SINGLE_THEME,
} from '@/configs/routerMap';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useLimits from '@/pages/area/areaEconomy/useLimits';
import Ellipsis from '@/pages/publicOpinons/components/ellipsis';
import { formatDate } from '@/utils/date';
import { highlight } from '@/utils/dom';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { NewListProps } from './index';

const splitDot = '·';

interface Props {
  data: any;
  showTag?: boolean;
  // isAttention?: boolean;
  sourceName?: string;
  setSourceName?: Function;
  hasMore?: boolean;
  isTheme?: boolean;
  titleWidth?: number;
  cardClassName?: string;
  showSource?: boolean;
  themeList: any[]; // 所有主题列表，目标主题在此列表内则跳转至舆情/主题页面，否则跳转至单个主题页面
}

export type CommonType = Pick<
  NewListProps,
  | 'keyword'
  | 'condition'
  | 'handleClickItem'
  | 'handleSource'
  // | 'handleAttention'
  | 'dataInfos'
  | 'isOfficial'
  | 'requestParams'
  | 'showTheme'
  | 'showOrg'
  | 'showArea'
  | 'isNews'
  | 'isCredit'
  | 'isReport'
>;

const Card: FC<Props & CommonType> = (props) => {
  let {
    data = {},
    showTag = true,
    isOfficial = false, // 是否是公众号列表 默认不是
    setSourceName,
    handleSource, //打开公众号来源弹窗
    // handleAttention, // 取消/关注公众号
    dataInfos,
    handleClickItem,
    keyword,
    condition,
    requestParams,
    showTheme = true,
    showOrg = true,
    showArea = true,
    showSource = true,
    hasMore,
    isTheme,
    titleWidth = 511,
    cardClassName = '',
    themeList = [],
  } = props;
  const {
    state: { code: regionCode },
  } = useCtx();
  const { push } = useHistory();
  const { handleLimit } = useLimits();
  const theme = data?.theme && (Array.isArray(data?.theme) ? data.theme.slice(0, 1) : [data.theme]);
  // 是否关注了公众号
  // const isAttentionFlag = useMemo(() => {
  //   return data?.followedOfficialAccounts === 1;
  // }, [data?.followedOfficialAccounts]);

  // 新闻code
  const code = data?.newsCode;

  // 诚信
  const isCredit = data.serviceType === 'creditBigData';
  // 研报
  const isReport = data.serviceType === 'research';

  const title = data?.title;
  // let _title = title ? isCredit ? '诚信 | ' + title : isReport ? '研报 | ' + title : title : ''

  const jumpNewsDetail = useMemoizedFn(() => {
    delete requestParams?.timeDefaultValue;
    if (code) {
      push({
        pathname: dynamicLink(LINK_PUBLIC_OPINONS_NEWSDETAIL, { code }),
        state: {
          currentNews: data,
          dataInfos,
          requestParams,
          isCredit,
          isReport,
          hasMore,
        },
      });
      handleClickItem?.(code);
    }
  });

  const themeJump = useMemoizedFn(
    (code: string, tabCode: string, themeTitle: string, attentionStatus: boolean, detail: string) => {
      const targetTheme = themeList?.filter((theme: any) => theme.themeCode === code)?.[0];
      const state = {
        themeName: themeTitle,
        attentionStatus,
        themeCode: code,
        detail,
      };

      !getConfig((d) => d.commons.notToPublicOpinons) &&
        push({
          pathname: targetTheme ? LINK_PUBLIC_OPINONS_FINANCIAL_THEME : LINK_PUBLIC_OPINONS_SINGLE_THEME,
          state: targetTheme
            ? {
                theme: {
                  code,
                  tabCode,
                  themeTitle,
                  attentionStatus,
                },
              }
            : state,
        });
      !targetTheme && window.localStorage.setItem('theme_linkto_single', JSON.stringify(state));
    },
  );

  const organizationJump = useMemoizedFn((data: { code: string; type: string; name: string }) => {
    if (data?.code) {
      const type = data?.type;
      push(urlJoin(dynamicLink(LINK_DETAIL_ENTERPRISE), urlQueriesSerialize({ code: data.code, type })), {
        title: data?.name,
      });
    }
  });

  // 地区跳转
  const handleAreaJump = useMemoizedFn((areaCode) => {
    areaCode &&
      handleLimit(areaCode, () => {
        push(urlJoin(dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: areaCode })));
      });
  });

  // 处理最后一个指标
  const lastTargetArrs = [];
  if (isReport) {
    if (data?.itname) {
      lastTargetArrs.push(data.itname);
    }
    if (data?.authors) {
      lastTargetArrs.push(data.authors);
    }
  }

  if (isCredit && data?.processOrganization) {
    lastTargetArrs.push(data.processOrganization);
  }

  // if (data?.source) {
  //   lastTargetArrs.push(data.source);
  // }

  // const time = data?.newsDate ? formatDate(dayJs(Number(data?.newsDate)).format('YYYYMMDDHHmmss')) : null;
  const lastTargetArrsHasData = lastTargetArrs.length > 0;

  return (
    <Container
      code={code}
      titleWidth={titleWidth}
      className={cn(
        {
          active: condition?.id === code,
          [`active-${code}`]: condition?.id === code,
        },
        cardClassName,
      )}
    >
      <div className="left-wrap">
        <Ellipsis className="title" hasHoverStyle={code} onClick={jumpNewsDetail} text={title} keyword={keyword} />
        <Space className="sub-content" wrap size={6}>
          <div className="subtitle-3">
            {/*日期*/}
            {data?.newsDate ? <>{formatDate(dayJs(Number(data?.newsDate)).format('YYYYMMDDHHmmss'))}</> : ''}
            {/*来源*/}
            {data?.source && showSource ? (
              <>
                <span className="split-dot">{splitDot}</span>
                {data.source}
              </>
            ) : (
              ''
            )}{' '}
          </div>

          {/*机构*/}
          {showOrg && !isReport
            ? (data?.relatedOrgs?.length ? data?.relatedOrgs : data?.otherOrgs)?.map(
                (item: { name: string; shortname?: string; code: string; type: string }, index: number) => (
                  <div key={index} className="subtitle-relatedOrgs" onClick={() => organizationJump(item)}>
                    {item?.shortname || item?.name}
                  </div>
                ),
              )
            : null}

          {/*地区*/}
          {showArea && !isReport && !isCredit
            ? data?.areaClassify?.map?.(
                (item: { classifyCode: string | number; classifyName: string }, index: number) =>
                  item?.classifyCode !== regionCode ? (
                    <div key={index} className="subtitle-area" onClick={() => handleAreaJump(item?.classifyCode)}>
                      {item?.classifyName}
                    </div>
                  ) : (
                    <div key={index} className="disable">
                      {item?.classifyName}
                    </div>
                  ),
              )
            : null}

          {/*主题*/}
          {!isTheme && showTheme && !isReport && !isCredit
            ? theme?.map?.(
                (
                  item: { themeCode: string; supCode: string; title: string; collection: number; detail: string },
                  index: number,
                ) => (
                  <div
                    key={index}
                    className="subtitle-theme"
                    onClick={() =>
                      themeJump(item?.themeCode, item?.supCode, item?.title, !!item?.collection, item?.detail)
                    }
                  >
                    # {item?.title}
                  </div>
                ),
              )
            : null}
          {/*公众号*/}
          {data?.source && isOfficial && !showSource ? (
            <div className="subtitle-4">
              <span className="line"></span>
              <img src={require('@/pages/publicOpinons/images/gongzhonghao@2x.png')} alt="" className="source-icon" />
              <span
                className={cn('source-title', { 'red-word': keyword === data?.source })}
                onClick={() => {
                  setSourceName?.(data?.source);
                  handleSource?.(data?.source, data?.followedOfficialAccounts === 1);
                }}
              >
                {keyword ? highlight(data?.source, keyword) : data?.source}
              </span>
            </div>
          ) : (
            ''
          )}

          {lastTargetArrsHasData ? (
            <span className="split-dot" style={{ paddingLeft: 0, marginLeft: '-2px' }}>
              {splitDot}
            </span>
          ) : null}

          <div className="subtitle-3">
            {lastTargetArrsHasData ? (
              <>
                <span
                  className="last-sbutitle-text"
                  dangerouslySetInnerHTML={{
                    __html: lastTargetArrs.join(`<span class='split-dot'>${splitDot}</span>`),
                  }}
                />
              </>
            ) : null}
            {/*{lastTargetArrsHasData && time ? <span className="split-dot">{splitDot}</span> : null}*/}
            {/*{time}*/}
          </div>
        </Space>
      </div>

      {showTag && data?.label?.text ? (
        <div className="tag" style={{ background: data.label?.color }}>
          {data.label.text}
        </div>
      ) : null}
    </Container>
  );
};

export default memo(Card);

const Container = styled.div<{ code: string; titleWidth: number }>`
  padding: 10px 12px;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  position: relative;

  &.active {
    background: rgba(1, 113, 245, 0.08);
  }

  &:after {
    position: absolute;
    content: '';
    bottom: -1px;
    right: 12px;
    left: 12px;
    height: 1px;
    background: #f6f6f6;
  }

  &:hover {
    background: linear-gradient(180deg, #e7f2ff, #ffffff 100%);
    border: 1px solid #edf5ff;
    border-radius: 6px;

    &:after {
      background: transparent;
    }
  }

  .left-wrap {
    .title {
      font-size: 15px;
      font-weight: 400;
      color: #141414;
      line-height: 23px;
      max-width: ${({ titleWidth }) => titleWidth + 'px'};
      cursor: ${(code) => (code ? 'pointer' : 'default')};

      &:hover {
        color: ${(code) => (code ? '#0171f6' : '#141414')};
      }
    }

    .sub-content {
      .subtitle-area {
        max-width: 290px;
        text-overflow: ellipsis;
        overflow: hidden;
        border-radius: 2px;
        white-space: nowrap;
        background: transparent url(${require('@/pages/publicOpinons/images/area.svg')}) no-repeat 6px center;
        background-size: 10px;
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 12px;
        padding: 4px 6px 4px 19px;
        cursor: pointer;
        color: #0171f6;

        &:hover {
          background-color: rgba(1, 113, 246, 0.06);
        }
      }
      .disable {
        max-width: 290px;
        text-overflow: ellipsis;
        overflow: hidden;
        border-radius: 2px;
        white-space: nowrap;
        background-size: 10px;
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 12px;
        padding: 4px 6px 4px 19px;
        color: #333333;
        background: transparent url(${require('@/pages/publicOpinons/images/areaDisable.svg')}) no-repeat 6px center;
      }

      .subtitle-theme {
        white-space: nowrap;
        max-width: 202px;
        text-overflow: ellipsis;
        overflow: hidden;
        height: 20px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        padding: 4px 6px;
        cursor: pointer;
        color: #0171f6;

        &:hover {
          background-color: rgba(1, 113, 246, 0.06);
        }

        //background: rgba(57, 111, 242, 0.06);
      }

      .subtitle-relatedOrgs {
        max-width: 290px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        border-radius: 2px;
        background: transparent url(${require('@/pages/publicOpinons/images/cardListTag.svg')}) no-repeat 6px center;
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 12px;
        padding: 4px 6px 4px 19px;
        color: #0171f6;
        cursor: pointer;
        margin-right: -6px;

        &:hover {
          background-color: rgba(1, 113, 246, 0.06);
        }
      }

      .subtitle-3 {
        white-space: nowrap;
        display: flex;
        align-items: center;
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: #5c5c5c;
        line-height: 20px;

        .last-sbutitle-text {
          margin-left: -6px;
          display: inline-block;
          max-width: 264px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .subtitle-4 {
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
        display: flex;
        align-items: center;

        .line {
          width: 1px;
          height: 14px;
          border-right: 1px solid #d8d8d8;
          margin: 0 10px 0 4px;
        }
        .source-icon {
          width: 14px;
          height: 14px;
          margin-top: -1px;
        }
        .source-title {
          color: #0171f6;
          line-height: 18px;
          position: relative;
          margin-left: 3px;
          max-width: 204px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          &:hover {
            cursor: pointer;
          }
          &.red-word {
            color: #fe3a2f;
          }
        }
      }
    }
  }

  .tag {
    align-self: flex-start;
    font-size: 13px;
    font-weight: 400;
    color: #ffffff;
    padding: 1px 6px 0;
    background: #f78182;
    line-height: 19px;
    border-radius: 1px;
    white-space: nowrap;
    max-width: 116px;
  }

  .split-dot {
    display: inline-block;
    padding: 0 4px;
  }
`;
