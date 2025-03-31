import { FC, isValidElement, memo, useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useBoolean, useMemoizedFn, useScroll, useSize } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Empty } from '@/components/antd';
import { NewsListProps } from '@/pages/publicOpinons/apis';
import InfiniteScrollBottom from '@/pages/publicOpinons/components/InfiniteScrollBottom';
import { Tabskey } from '@/pages/publicOpinons/config';

import Card from './card';
import { usePublicOpininsThemeData } from './usePublicOpininsThemeData';

export const PAGESIZE = 15;

export interface NewListProps {
  /** 接口数据 */
  dataInfos?: any;
  /** 默认带入的数据 */
  defaultDataInfos?: any;
  setDefaultDataInfos?: Function;
  loading: boolean;
  /** 更新参数 */
  updateRequestParams?: Function;
  setScrollStatusTrue?: Function;
  /** 修改该组件数据渲染方式 */
  isRefreshRef?: React.MutableRefObject<boolean>;
  /** 是否显示公众号 默认不是 */
  isOfficial?: boolean;
  /** 上拉到底部有图片的文字样式 默认不是 */
  isBottomNoMore?: boolean;
  /** 公众号是否已关注 */
  isAttention?: boolean;
  /** 显示来源弹窗 */
  handleSource?: Function;
  // /** 关注/取消公众号 */
  // handleAttention?: Function;
  /** 页面的 url pathname 用于滚动不重复加载 */
  pageKey?: Tabskey | string;
  /** scrollableTarget 位置 */
  scrollableTarget?: string | HTMLDivElement;
  /** 每个卡片的点击事件 */
  handleClickItem?: Function;
  /** 新闻正文 id  */
  condition?: { id: string | undefined; type: string };
  /** 接口参数相关 */
  requestParams?: NewsListProps;
  /** 更多加载事件 */
  handleAwayLoadMore?: Function;
  /** 高亮关键字 */
  keyword?: string;
  /** 是否显示主题标签 */
  showTheme?: boolean;
  /** 是否显示机构标签 */
  showOrg?: boolean;
  /** 是否显示地区标签 */
  showArea?: boolean;
  showSource?: boolean;
  /** 是否是新闻 */
  isNews?: boolean;
  /** 是否是诚信 */
  isCredit?: boolean;
  /** 是否是研报 */
  isReport?: boolean;
  /** 是否是主题 */
  isTheme?: boolean;
  titleWidth?: number;
  cleatCondition: () => void;
}

const Content: FC<NewListProps> = (props) => {
  const {
    dataInfos,
    loading,
    setScrollStatusTrue,
    updateRequestParams,
    isRefreshRef,
    isOfficial = false,
    isBottomNoMore = false,
    isAttention = false,
    handleSource,
    // handleAttention,
    scrollableTarget = document.querySelector('.ant-tabs-top'),
    handleClickItem,
    condition,
    requestParams,
    handleAwayLoadMore,
    keyword,
    showTheme,
    showOrg,
    showArea,
    showSource,
    isNews,
    isCredit,
    isReport,
    isTheme,
    titleWidth,
    cleatCondition,
  } = props;

  const [hasFilter, { setTrue, setFalse }] = useBoolean(false);
  const { themeList } = usePublicOpininsThemeData();

  useEffect(() => {
    const filterProps = [
      'bdate',
      'edate',
      'importance',
      'text',
      'itemType',
      'itemCode',
      'itemName',
      'risk',
      'themeCode',
      'timeDefaultValue',
      'newsDate',
    ];

    for (let i = 0; i < filterProps.length; i++) {
      if ((requestParams as any)?.[filterProps[i]] && !isEmpty((requestParams as any)?.[filterProps[i]])) {
        setTrue();
        return;
      } else {
        setFalse();
      }
    }
  }, [requestParams, setFalse, setTrue]);

  const [infoData, setListData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [sourceName, setSourceName] = useState('');
  // skipParam入参
  const skipParamsRef = useRef('');

  const screenHeight = document.body.offsetHeight;
  const rightHeight = (document.getElementById('options-right-con') as HTMLElement)?.offsetHeight;

  useEffect(() => {
    if (dataInfos?.news?.length) {
      const datas = dataInfos || [];
      const dataLen = datas.news.length;
      skipParamsRef.current = datas.news[dataLen - 1].skipParam;
      if (dataLen === PAGESIZE) setHasMore(true);
      if (dataLen < PAGESIZE) setHasMore(false);
      if (isRefreshRef && isRefreshRef.current) {
        setListData(datas.news);
        isRefreshRef.current = false;
      } else {
        setListData((old: any) => old.concat(datas.news));
      }
    }
  }, [dataInfos, isRefreshRef]);

  const handleLoadMore = useMemoizedFn(() => {
    setScrollStatusTrue?.();
    // const { pathname } = getLinkProps(window.location.href);
    // const pathName = pathname?.split('/')[2];

    // if (pathName === pageKey) {
    updateRequestParams?.((draft: { data: { skipParam: string } }) => {
      if (draft && draft.data) {
        draft.data.skipParam = skipParamsRef.current;
      }
    });
    handleAwayLoadMore?.((infoData[infoData.length - 1] as any)?.skipParam);
    // }
  });

  const [newTop, setNewTop] = useState(0);
  const { height } = useSize(document.getElementById('options-new-list')) || {};

  useLayoutEffect(() => {
    setTimeout(() => {
      const _optionsNewsListTop = document.getElementById('options-seize-a-seat') as HTMLElement;
      if (_optionsNewsListTop?.getBoundingClientRect().top) {
        setNewTop(_optionsNewsListTop?.getBoundingClientRect().top);
      }
    }, 100);
  }, [height]);

  const { top = 0 } = useScroll((document.querySelector('.ant-tabs-top') as HTMLElement) || document.body) || {};

  const datas = useMemo(() => {
    return infoData.map((d: any) => {
      if (d.source === sourceName) {
        d.followedOfficialAccounts = isAttention ? 1 : 0;
      }
      return d;
    });
  }, [infoData, sourceName, isAttention]);

  return (
    <>
      <div id="options-seize-a-seat" style={{ position: 'fixed' }}></div>
      <Container
        className="new-list-con"
        id="options-new-list"
        screenHeight={screenHeight}
        optionsNewsListTop={newTop}
        rightHeight={rightHeight}
        top={top}
      >
        {infoData?.length ? (
          <InfiniteScroll
            scrollableTarget={scrollableTarget}
            next={handleLoadMore}
            dataLength={datas.length}
            hasMore={hasMore}
            loader=""
            scrollThreshold="100px"
          >
            {infoData.map((item: {} | null | undefined, index: number) => {
              if (isValidElement(item)) {
                return item;
              }
              return (
                <Card
                  key={index}
                  data={item}
                  condition={condition}
                  requestParams={requestParams}
                  dataInfos={infoData}
                  showSource={showSource}
                  sourceName={sourceName}
                  setSourceName={setSourceName}
                  isOfficial={isOfficial}
                  // isAttention={isAttention}
                  // isOfficial={isOfficial}
                  // handleAttention={handleAttention}
                  handleSource={handleSource}
                  handleClickItem={handleClickItem}
                  keyword={keyword}
                  showTheme={showTheme}
                  showOrg={showOrg}
                  showArea={showArea}
                  isNews={isNews}
                  isCredit={isCredit}
                  isReport={isReport}
                  hasMore={hasMore}
                  isTheme={isTheme}
                  titleWidth={titleWidth}
                  themeList={themeList}
                />
              );
            })}
            <InfiniteScrollBottom
              length={infoData.length}
              loading={loading}
              isReachBottom={!hasMore}
              isBottomNoMore={isBottomNoMore}
              scrollTarget={
                typeof scrollableTarget === 'string'
                  ? (document.querySelector(`#${scrollableTarget}`) as HTMLElement)
                  : (scrollableTarget as HTMLElement)
              }
              next={handleLoadMore}
              newTop={newTop}
            />
          </InfiniteScroll>
        ) : hasFilter ? (
          <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} className="noNewRelatedData" onClick={cleatCondition} />
        ) : (
          <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
        )}
      </Container>
    </>
  );
};

export default memo(Content);

const Container = styled.div<{
  screenHeight: number;
  rightHeight: number;
  optionsNewsListTop: number;
  top: number;
}>`
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  padding: 0 12px;
  overflow-x: hidden;
  min-height: ${({ screenHeight, rightHeight, optionsNewsListTop, top }) => {
    const systemHeight = 54;
    const smallOptionheight = 42 + 4;
    const bottomHeight = 26;

    const optionsHeight = (top || 0) > 10 ? smallOptionheight : 60;
    const headerHeight = (top || 0) > 10 ? 100 : 104;

    if (rightHeight + headerHeight + bottomHeight >= screenHeight) {
      return rightHeight - (optionsNewsListTop - optionsHeight - systemHeight - 15) + 'px';
    } else {
      return `calc(100vh - ${optionsNewsListTop + bottomHeight}px)`;
    }
  }};
`;
