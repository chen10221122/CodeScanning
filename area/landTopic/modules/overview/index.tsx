import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Spin } from '@dzh/components';
import { DragPageLayout } from '@dzh/pro-components';
import { useSize, useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

// import Resize from '@pages/area/landTopic/components/resize';
import useAreaLists from '@pages/area/landTopic/modules/overview/hooks/useAreaLists';
import CardTable from '@pages/area/landTopic/modules/overview/modules/cardTable';
import HeaderFilter from '@pages/area/landTopic/modules/overview/modules/headerFilter';
import TabsContent from '@pages/area/landTopic/modules/overview/modules/tabsContent';
import { Provider, useCtx } from '@pages/area/landTopic/modules/overview/provider';

import { useTitle } from '@/app/libs/route';
import { IRootState } from '@/store';

import useIndicator from '../../useIndicator';

import S from '@pages/area/landTopic/styles.module.less';

const TAB_HEIGHT = 30;

const Main = () => {
  const { run } = useIndicator(); // 获取指标树

  const {
    state: { firstLoading },
    update,
  } = useCtx();

  const resizeContainerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(resizeContainerRef) || { width: 0, height: 0 };
  const [hasMount, setHasMount] = useState(false);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const [expand, setExpand] = useState(true);

  useEffect(() => {
    update((draft) => {
      draft.hasPay = hasPay;
    });
  }, [hasPay, update]);

  useAreaLists();

  useEffect(() => {
    run('1');
    setHasMount(true);
  }, [run]);

  const onMaxLimitChange = useMemoizedFn((visible) => {
    setExpand(visible);
  });

  const topMaxHeight = useMemo(() => height - 6 - TAB_HEIGHT, [height]);

  return (
    <Container className={S['main-content']} expand={expand} top_max_height={topMaxHeight}>
      {firstLoading ? <Spin spinning={firstLoading} type="fullThunder" className={S['first-loading']} /> : null}
      <HeaderFilter />
      <div className="resize-wrapper" ref={resizeContainerRef}>
        {hasMount ? (
          <DragPageLayout
            type="topBottom"
            dragRef={dragRef}
            pagePaddingTop={0}
            topNode={<CardTable />}
            bottomNode={<TabsContent dragRef={dragRef} />}
            startHeight={height * 0.4}
            tabHeight={TAB_HEIGHT}
            distanceMaxHeight={136}
            onMaxLimitChange={onMaxLimitChange}
          />
        ) : null}
      </div>
    </Container>
  );
};

const Overview = () => {
  useTitle('招拍挂');
  return (
    <Provider>
      <Main />
    </Provider>
  );
};

export default memo(Overview);

const Container = styled.div<{ expand: boolean; top_max_height: number }>`
  .resize-wrapper {
    min-height: 0;
    flex: 1;
  }
  .dzh-container-top {
    height: calc(100% - 4px);
    border-top: none;
  }
  .dzh-container-bottom {
    border-bottom: none;
  }
  .dzh-content-wrapper {
    padding-top: 0px !important;
  }
  /* .resize-container {
    .resize-top-container {
      background: #fff;
      padding: 10px 2px 10px 10px;
    }
    .resizable-handle-line {
      background: #f6f6f6;
    }
  } */
  .top-table-loading {
    .ant-spin-show-text {
      top: 30% !important;
      z-index: 1000 !important;
    }
    .ant-spin-container {
      height: 100%;
      opacity: 1;
    }
    .ant-spin-blur::after {
      height: calc(100% - 47px);
      opacity: 0.7;
      top: 47px;
    }
  }
  .dzh-lock-layer-wrapper,
  .dzh-lock-layer-content {
    height: 100%;
  }
  .dzh-container-bottom {
    cursor: ${({ expand }) => (expand ? 'pointer' : 'normal')};
  }
  .dzh-container-top {
    max-height: ${({ top_max_height }) => `${top_max_height}px`};
  }
`;
