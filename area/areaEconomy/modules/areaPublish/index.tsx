/**
 * 区域发布
 */
import { useEffect, useMemo, useState, useCallback } from 'react';

import styled from 'styled-components';

import SkeletonScreen from '@/components/skeletonScreen';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { Provider, useCtx as usePublicOpinonsCtx } from '@/pages/publicOpinons/context';
import ContentFilter from '@/pages/publicOpinons/modules/region/components/headerFilter';
import { Provider as ReginonProvider, useRegionCtx } from '@/pages/publicOpinons/modules/region/context';

import { getAreaChildCodes } from '../../common/getAreaChild';
import NewsList from './components/contentNewsList';

const Content = () => {
  const { state } = useCtx();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const {
    state: { listLoading, paramStateStr },
    update: updateRegion, // 更新区域发布的参数,
  } = useRegionCtx();
  const { update: updateParams, state: requestParams } = usePublicOpinonsCtx();

  // dom 事件绑定节点
  const targetWrap = useMemo(() => document.querySelector('#area_economy_container') as HTMLDivElement, []);
  // tab切换滚动条状态
  useEffect(() => {
    if (targetWrap) {
      if (listLoading) {
        targetWrap.scrollTop = 0;
        targetWrap.style.overflowY = 'hidden';
      } else {
        targetWrap.style.overflowY = 'overlay';
      }
    }
    return () => {
      if (targetWrap) targetWrap.style.overflowY = 'overlay';
    };
  }, [listLoading, targetWrap]);

  //地区改变和tab切换执行的方法
  useEffect(() => {
    const code = state.code;
    updateParams((d: any) => {
      const childCodes = getAreaChildCodes(code);
      d[paramStateStr] = {
        ...d[paramStateStr],
        regionCode: code + (childCodes ? ',' + childCodes : ''),
      };
    });
  }, [state.code, paramStateStr, updateParams, updateRegion]);

  // 地区改变需要切换状态
  useEffect(() => {
    updateRegion((draft) => {
      draft.tabChangeLoading = true;
    });
    setIsFirstLoading(true);
  }, [state.code, updateRegion]);

  useEffect(() => {
    if (!listLoading) {
      updateRegion((draft) => {
        draft.tabChangeLoading = false;
      });
      setIsFirstLoading(false);
    }
  }, [listLoading, updateRegion]);

  const [hash, setHash] = useState(0);
  // 清除筛选项
  const cleatCondition = useCallback(() => {
    // 需要先将 important 参数修改掉，再处理 hash 才能使得 Switch 组件更新成功
    updateParams((d: any) => {
      d[paramStateStr] = {
        ...d[paramStateStr],
        importance: '',
      };
    });
    // 清除筛选项
    setHash(Math.random());
  }, [paramStateStr, updateParams]);

  return (
    <>
      {isFirstLoading ? (
        <div style={{ height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
        </div>
      ) : null}
      <Container id="public_opinons_layout" style={{ opacity: +!isFirstLoading }}>
        <div className="content">
          <ContentFilter hash={hash} showArea={false} showTab={false} hasMore={true} />
          {requestParams[paramStateStr] && requestParams[paramStateStr].regionCode && (
            <NewsList scrollableTarget={targetWrap} cleatCondition={cleatCondition} />
          )}
        </div>
      </Container>
    </>
  );
};

const AreaPublish = () => {
  return (
    <Provider>
      <ReginonProvider>
        <Content />
      </ReginonProvider>
    </Provider>
  );
};

export default AreaPublish;

const Container = styled.div`
  width: 920px;
  margin-left: -10px;
  .content {
    > div:first-child {
      top: 102px;
      margin-right: 10px;
      background-color: #fff;
    }
    > div:nth-child(2) {
      padding-right: 10px;
      padding-left: 10px;
    }
    .tab-content {
      left: 0 !important;
    }
    .header-tab-container {
      padding-top: 9px;
      padding-left: 10px;
      padding-bottom: 10px;
    }
    .publicOptions-center-header {
      padding: 0;
    }
    #options-new-list {
      padding: 0;
    }
    .infinite-scroll-component > div {
      padding-left: 10px;
      padding-right: 10px;
    }
    .ant-skeleton-paragraph {
      margin-left: -10px;
    }
  }
  .more-btn {
    position: sticky;
    top: 103px;
    padding-right: 10px;
    height: 0;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
  }
`;
