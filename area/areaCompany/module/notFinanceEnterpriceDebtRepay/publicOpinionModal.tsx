import { FC, memo, useEffect, useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router';

import { useMemoizedFn, useRequest } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import shortid from 'shortid';
import styled, { createGlobalStyle } from 'styled-components';

import { Spin, Empty } from '@/components/antd';
import { LINK_INFORMATION_RISK_MONITOR_NEWS } from '@/configs/routerMap';
import { getOpinionInfoList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FullModal from '@/pages/area/areaCompany/components/detailModal/fullModal';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

const TIME_FORMAT = 'YYYY-MM-DD';
const PAGESIZE = 15;
interface modalProps {
  visible: boolean;
  setFalse: () => void;
  companyCode: string;
  companyName: string;
}
const PublicOpinionModal: FC<modalProps> = ({ companyName, companyCode, visible, setFalse }) => {
  const history = useHistory();
  const [isFirst, setIsFirst] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [skip, setSkip] = useState(0);

  const { run, loading } = useRequest(getOpinionInfoList, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      setIsFirst(false);
      if (skip) {
        const resData = res?.data || [];
        setNewsData(newsData.concat(resData));
      } else {
        setNewsData(res?.data || []);
      }
      setSkip(skip + PAGESIZE);
    },
    onError(error: any) {
      setIsFirst(false);
      if (error.returncode !== 100) {
        setNewsData([]);
      }
    },
  });

  const handleLoadMore = useMemoizedFn(() => {
    run({ code: companyCode, skip, type: 'company', importance: '1', negative: '-1' });
  });

  useEffect(() => {
    if (visible && companyCode) handleLoadMore();
  }, [visible, companyCode, handleLoadMore]);

  const closeModalCallback = useMemoizedFn(() => {
    setSkip(0);
    setIsFirst(true);
    return undefined;
  });

  const modalContent = useMemo(() => {
    return isFirst ? (
      <Spin type="fullThunder"></Spin>
    ) : (
      <div className='scroll-wrap' id='scrollWrap' >
        {newsData.length ? (
          <InfiniteScroll
            dataLength={newsData.length}
            hasMore={newsData.length % PAGESIZE === 0}
            next={handleLoadMore}
            scrollThreshold="40px"
            scrollableTarget={'scrollWrap'}
            loader={
              !isFirst && loading ? (
                <div className="loading-container">
                  <i>加载中...</i>
                </div>
              ) : null
            }
          >
            {newsData.map((item: any) => (
              <Card key={shortid()}>
                <div
                  className="title"
                  title={item.title}
                  onClick={() => {
                    history.push(urlJoin(LINK_INFORMATION_RISK_MONITOR_NEWS, urlQueriesSerialize({ id: item.id })));
                  }}
                >
                  {item.title}
                </div>
                <div className="labels">
                  <div className="source-time">
                    {dayjs(item.date).format(TIME_FORMAT)} · {item.source}
                  </div>
                  {item?.related?.length ? item.related.map((info: any) => (<div className={cn('tag', { hasWarning: info.negative === '-1' })} >
                    {info?.lastLevelName}
                  </div>)) : null}
                </div>
              </Card>
            ))}
          </InfiniteScroll>
        ) :
          <Empty type={Empty.NO_DATA_NEW_IMG} full />}
      </div>
    );
  }, [handleLoadMore, history, newsData, isFirst, loading]);

  return (
    <>
      <PublicOpinionGlobalStyle />
      <FullModal
        visible={visible}
        title={companyName}
        setVisible={setFalse}
        pending={false}
        content={modalContent}
        container={document.getElementById('area-company-index-container') as HTMLDivElement}
        wrapClassName={'bond-opinion-modal'}
        maskClosable={true}
        closeModalCallback={closeModalCallback}
      />
    </>
  );
};

export default memo(PublicOpinionModal);

const PublicOpinionGlobalStyle = createGlobalStyle`
  /* 样式覆盖 */
  .bond-opinion-modal {
    &.modal-mask-scroll .ant-modal .ant-modal-content .ant-modal-header {
      padding-bottom: 12px;
    }
    .ant-spin-container {
      height: 100%;
    }
    .full-title {
      margin-left: 16px;
      height: 27px;
      font-size: 18px;
      font-weight: 500;
      text-align: left;
      color: #141414;
      line-height: 27px;
      position: relative;
      &::before {
        top: 8px;
        left: -12px;
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: #fb0c0c;
        border-radius: 50%;
        display: block;
        }
      }
    .scroll-wrap {
      height: 100%;
      margin-bottom: 16px;
      padding: 0 8px 0 20px;
      overflow-y: overlay;
      scrollbar-gutter: stable;
      position: relative;
      ::-webkit-scrollbar-thumb {
        border-width: 3px;
      }
    }
  }
`;

const Card = styled.div`
  padding: 9.5px 12px;
  &:hover {
    border-radius: 6px;
    background: linear-gradient(180deg, #e7f2ff, #ffffff 100%);
  }
  &:last-of-type {
    .labels {
      &::after {
        display: none;
      }
    }
  }
  .title {
    height: 21px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #141414;
    line-height: 21px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    &:hover {
      color: #0171f6;
      cursor: pointer;
    }
  }

  .labels {
    height: 18px;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    color: #5c5c5c;
    line-height: 18px;
    display: flex;
    align-items: center;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      display: block;
      bottom: -9.5px;
      background: #f7f7f7;
    }
    .source-time {
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #797979;
      line-height: 20px;
      margin-right: 16px;
      /*max-width: 324px;
       white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; */
    }
    .tag {
      height: 16px;
      font-size: 12px;
      font-weight: 400;
      color: #3265d0;
      padding: 0 3px;
      background: #f6f7fd;
      line-height: 16px;
      border-radius: 1px;
      white-space: nowrap;
      max-width: 116px;
    }
    .hasWarning {
      color: #ff7e23;
      background: #fff7f1;
    }
  }
`;
