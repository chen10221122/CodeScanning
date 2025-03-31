/**
 * 区域发布
 */
import { useEffect, useMemo, useState, useCallback } from 'react';

import styled from 'styled-components';

import MoreBtn from '@pages/area/areaEconomy/components/traceBtn/moreBtn';
import { WrapperContainer } from '@pages/area/areaF9/components';
import { useParams } from '@pages/area/areaF9/hooks';

import { LINK_PUBLIC_OPINONS_REGION } from '@/configs/routerMap';
import { getAreaChildCodes } from '@/pages/area/areaF9/utils';
import { Provider, useCtx as usePublicOpinonsCtx } from '@/pages/publicOpinons/context';
import ContentFilter from '@/pages/publicOpinons/modules/region/components/headerFilter';
import { Provider as ReginonProvider, useRegionCtx } from '@/pages/publicOpinons/modules/region/context';

import NewsList from './components/contentNewsList';

const Content = () => {
  const { code } = useParams();
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const {
    state: { listLoading, paramStateStr },
    update: updateRegion, // 更新区域发布的参数,
  } = useRegionCtx();
  const { update: updateParams, state: requestParams } = usePublicOpinonsCtx();

  // dom 事件绑定节点
  const targetWrap = useMemo(() => document.querySelector('.main-container') as HTMLDivElement, []);
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
    updateParams((d: any) => {
      const childCodes = getAreaChildCodes(code!);
      d[paramStateStr] = {
        ...d[paramStateStr],
        regionCode: code + (childCodes ? ',' + childCodes : ''),
      };
    });
  }, [code, paramStateStr, updateParams, updateRegion]);

  // 地区改变需要切换状态
  useEffect(() => {
    updateRegion((draft) => {
      draft.tabChangeLoading = true;
    });
    setIsFirstLoading(true);
  }, [updateRegion]);

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

  const Content = useMemo(() => {
    // 在加载内容时再获取容器，否则页面的滚动加载不生效
    const target = document.querySelector('.main-container') as HTMLDivElement;
    return (
      <>
        <Container id="public_opinons_layout" style={{ opacity: +!isFirstLoading }}>
          <div className="content">
            {requestParams[paramStateStr] && requestParams[paramStateStr].regionCode && (
              <NewsList scrollableTarget={target} cleatCondition={cleatCondition} />
            )}
          </div>
        </Container>
      </>
    );
  }, [cleatCondition, isFirstLoading, paramStateStr, requestParams]);

  return (
    <WrapperContainer
      headerWidth={'100%'}
      loading={isFirstLoading || listLoading}
      content={Content}
      contentStyle={{ marginLeft: '-10px', paddingLeft: '10px', paddingBottom: 0, width: '100%', minWidth: '900px' }}
      headerBottomContent={
        <FilterContainer>
          <ContentFilter hash={hash} showArea={false} showTab={false} hasMore={false} isAreaF9Publish={true} />
        </FilterContainer>
      }
      headerRightContent={<MoreBtn linkTo={LINK_PUBLIC_OPINONS_REGION}></MoreBtn>}
    ></WrapperContainer>
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

const FilterContainer = styled.div`
  width: 100%;
  position: sticky;
  top: 35px;
  .header-tab-container {
    padding: 8px 0 10px 0px !important;
  }

  .publicOptions-center-header {
    padding: 0;
  }
`;

const Container = styled.div`
  width: 100%;
  margin-left: -10px;

  .content {
    > div:nth-child(2) {
      padding-right: 10px;
      padding-left: 10px;
    }
    .tab-content {
      left: 0 !important;
    }

    #options-new-list {
      padding: 0;
    }
    .infinite-scroll-component > div {
      padding-left: 10px;
      padding-right: 0;
    }
    .ant-skeleton-paragraph {
      margin-left: -10px;
    }
  }

  .new-list-con {
    min-height: calc(100vh - 276px);
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
