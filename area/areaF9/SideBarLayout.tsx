import { memo, ReactNode, FC, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { DragPageLayout } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { contentOffset, pageOffset } from '@/app/less.config';
import BackTop from '@/components/backTop';
import { useCommonNavStatus, quickCommonNavigationHeight } from '@/components/commonQuickNavigation/utils';
import DataSource, { useDataSource, OpenDataSourceDrawer } from '@/components/dataSource';
import { useDispatch } from '@/pages/area/areaF9/context';
import { IRootState } from '@/store';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

import ViewPermissionModal from './components/viewPermissionModal';

const prefix = getPrefixCls('side-page');
const css = getStyledPrefixCls('side-page');

export enum SideLayoutChildTypeEnum {
  /** 头部 */
  HEADER = 'HEADER',
  /** 侧边 */
  SIDE = 'SIDE',
  /** 主题内容 */
  CHILDREN = 'CHILDREN',
}

export enum NodeTypeEnum {
  /** 推荐节点 */
  RECOMMEND = '1',
  /** 常用节点 */
  COMMONUSE = '2',
}

interface SideLayoutProps {
  /** 头部节点 */
  header?: ReactNode;
  /** 侧边栏节点 */
  side?: ReactNode;
  /** 主体内容节点 */
  children?: ReactNode | FC[];
  /** 隐藏滚动条 */
  hideScrollBar?: boolean;
  /** 侧边宽度 */
  sideWidth?: number;
}

const SideLayout: FC<SideLayoutProps> = ({ header, side, children, hideScrollBar, sideWidth }) => {
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const isCommonNavigation = useCommonNavStatus();

  /** children是单个元素 */
  const isSingleChild = !Array.isArray(children);

  let sideVdom = null;
  let headerVdom = null;
  let childrenVdom: any[] = [];

  const dispatch = useDispatch();

  if (!isSingleChild) {
    children.forEach((vdom) => {
      // @ts-ignore
      switch (vdom?.props?.type) {
        case SideLayoutChildTypeEnum.HEADER:
          headerVdom = vdom;
          break;
        case SideLayoutChildTypeEnum.SIDE:
          sideVdom = vdom;
          break;
        case SideLayoutChildTypeEnum.CHILDREN:
          childrenVdom.push(vdom);
          break;
        default:
          childrenVdom.push(vdom);
      }
    });
  }

  const kxBoxHeight = useSelector((store: IRootState) => store.common.kxBoxHeight);

  /**是否存在快捷导航栏 */
  const hasQuickNavigation = useSelector((store: IRootState) => store.common.hasQuickNavigation);
  const quickNavigationHeight = useSelector((store: IRootState) => store.common.quickNavigationHeight);

  // 关闭左侧目录树
  const dragRef = useRef<any>();
  const closeDragPageLayout = useMemoizedFn(() => {
    dragRef?.current?.onCloseSideFn();
  });
  const {
    info: dataSourceInfo,
    openDrawer,
    closeDrawer: closeDataSource,
  } = useDataSource({
    moduleCode: 'queryEconomy',
  }); // 不同的业务需要传递不同的 moduleCode, 不传递默认是财务数据
  const openDataSource: OpenDataSourceDrawer = useMemoizedFn(({ posIDs, jumpToPdf, isPdfCallback }) => {
    openDrawer({ posIDs, jumpToPdf, isPdfCallback });
    closeDragPageLayout();
  });

  useEffect(() => {
    dispatch((d) => {
      d.openDataSource = openDataSource;
    });
  }, [openDataSource, dispatch]);

  useEffect(() => {
    dispatch((d) => {
      d.dataSourceInfo = dataSourceInfo;
    });
  }, [dataSourceInfo, dispatch]);

  return (
    <Container
      kxBoxHeight={kxBoxHeight}
      hasQuickNavigation={hasQuickNavigation}
      quickNavigationHeight={quickNavigationHeight}
      isCommonNavigation={isCommonNavigation}
      className={cn(prefix('container'), {
        'hide-scroll-bar': hideScrollBar,
        'area-dataSource': dataSourceInfo?.visible,
      })}
    >
      <div className={prefix('header')}>{header || headerVdom}</div>
      <div className={prefix('section')}>
        <DragPageLayout
          dragRef={dragRef}
          widthTitName={'目录'}
          maxWidth={400}
          startWidth={216}
          type="rightLeft"
          pagePaddingTop={0}
          leftNode={
            <div style={{ width: '100%', paddingRight: 3 }} id="area-left-node">
              {side || sideVdom}
            </div>
          }
          rightNode={
            <DataSourceWrapper>
              <div
                style={{ height: '100%', overflow: 'auto', flex: 1 }}
                ref={scrollContentRef}
                className="side-page-content"
              >
                <ViewPermissionModal>{isSingleChild ? children : childrenVdom}</ViewPermissionModal>
              </div>
              {/* 精准溯源弹窗 */}
              <DataSource {...dataSourceInfo} onClose={closeDataSource} />
            </DataSourceWrapper>
          }
        />
        <BackTop target={() => scrollContentRef.current!} />
      </div>
    </Container>
  );
};

export default memo(SideLayout);

const DataSourceWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Container = styled.div<{
  kxBoxHeight: number;
  hasQuickNavigation: boolean;
  quickNavigationHeight: number;
  isCommonNavigation: boolean | undefined;
}>`
  height: calc(
    100vh - ${contentOffset} - ${(props) => props.kxBoxHeight}px -
      ${({ hasQuickNavigation, quickNavigationHeight }) => (hasQuickNavigation ? `${quickNavigationHeight}px` : '0px')} -
      ${({ isCommonNavigation }) => (isCommonNavigation ? `${quickCommonNavigationHeight}` : 0)}px
  );
  @media (max-width: 1279px) {
    /* 小于1280时最外层容器会有一个滚动条高度 */
    height: calc(
      100vh - ${contentOffset} - 12px - ${(props) => props.kxBoxHeight}px -
        ${({ hasQuickNavigation, quickNavigationHeight }) =>
          hasQuickNavigation ? `${quickNavigationHeight}px` : '0px'} -
        ${({ isCommonNavigation }) => (isCommonNavigation ? `${quickCommonNavigationHeight}` : 0)}px
    );
    overflow-x: auto;
  }
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  overflow-y: hidden;

  &.hide-scroll-bar {
    overflow: hidden;
    ${css('content')} {
      overflow: hidden;
    }
  }

  &.area-dataSource {
    min-width: unset;
    .main-container {
      overflow-x: hidden;
    }
  }

  ${css('header')} {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    /* font-weight: 500; */
    color: #141414;
    margin-bottom: 4px;
    background: #fafafa;
  }

  ${css('section')} {
    height: calc(100vh - ${pageOffset});
    display: flex;
    background: #fff;
    overflow-y: hidden;

    > .react-resizable {
      height: 100% !important;
    }
    .dzh-page-wrapper .dzh-container-vertical {
      background: #f6f6f6;
    }
    .dzh-container-left,
    .dzh-container-right {
      border-top: none;
      border-bottom: none;
    }
    .dzh-container-left {
      overflow: unset;
    }
    .dzh-page-wrapper {
      width: 100%;
      .dzh-content-wrapper {
        padding-top: 0;
      }
    }

    .dzh-container-right {
      flex: 1;
      overflow-y: auto;
      overflow-y: overlay;
      position: relative;
      will-change: width;
    }
  }
`;
