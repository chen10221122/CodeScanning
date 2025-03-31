import { CSSProperties, FC, memo, useMemo, useRef } from 'react';

import styled from 'styled-components';

import { Spin, Empty } from '@/components/antd';
import BackTop from '@/components/backTop';
import Next from '@/pages/area/areaF9/components/next';

interface HeaderContentProps {
  loading?: boolean;
  /**loading到顶部距离 */
  loadingTop?: string | number;
  /** 大标题 */
  title?: string;
  /** 内容区域 */
  content?: JSX.Element;
  error?: any;
  /** 头部右侧内容 */
  headerRightContent?: JSX.Element;
  containerStyle?: CSSProperties;
  children?: any;
}

//为了不影响其他模块的样式，参照src\pages\area\areaF9\components\wrapperContainer\index.tsx抽离的样式文件
const WrapperContainer: FC<HeaderContentProps> = (props) => {
  const { loading, content, error, title, headerRightContent, loadingTop = '', containerStyle, children } = props;

  const scrollWrapRef = useRef<HTMLDivElement>(null);

  const Content = useMemo(() => {
    return (
      <>
        <Container
          ref={scrollWrapRef}
          className="main-container"
          style={{ ...containerStyle, overflowY: loading ? 'hidden' : 'auto' }}
        >
          {error ? (
            <EmptyContainer>
              <Empty style={{ paddingTop: '15%' }} type={Empty.LOAD_FAIL_WITH_BGCOLOR} />
            </EmptyContainer>
          ) : (
            <ContentContainer className="main-content">
              <Header className="main-content-header">
                <div className="top">
                  <div className="titleWrap">
                    <p className={'main-title'}>{title}</p>
                  </div>
                  {headerRightContent ? <div className="right">{headerRightContent}</div> : null}
                </div>
              </Header>
              {children ?? content}
            </ContentContainer>
          )}
          <Next></Next>
        </Container>
        <BackTop target={() => scrollWrapRef.current!} />
      </>
    );
  }, [children, containerStyle, content, error, headerRightContent, loading, title]);

  return (
    <>
      {loading ? (
        <SpinWrapper loadingTop={loadingTop} className="spining-wrap-box">
          <Spin spinning={loading} type={'thunder'} tip="加载中"></Spin>
        </SpinWrapper>
      ) : null}
      <div style={{ height: loading ? 0 : '100%', overflowY: loading ? 'hidden' : 'visible' }}>{Content}</div>
    </>
  );
};
export default memo(WrapperContainer);

const SpinWrapper = styled.div<{ loadingTop: string | number }>`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
  .loading-container {
    position: relative;
    top: ${({ loadingTop }) => loadingTop};
  }
`;

const Container = styled.div`
  /* 解决y滚动条占位，加载时页面抖动问题 */
  height: 100%;
  overflow-y: overlay;
  .new-no-data {
    padding-top: 11vh;
    padding-bottom: 2vh;
  }
  .score-wrapper {
    width: 1026px;
    /**节点安全距离 */
    padding-bottom: 16px;
    .left > .chart {
      position: relative;
      width: 360px;
      height: 339px;
    }
  }
`;

const ContentContainer = styled.div`
  height: auto;
  padding: 0px 14px;
  // 48 下一节点容器高度
  min-height: calc(100% - 48px);
`;

const EmptyContainer = styled.div`
  min-height: calc(100% - 48px);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 0 6px 8px;
  background: #fff;
  top: 0;
  position: sticky;
  z-index: 7;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .titleWrap {
    display: flex;
    align-items: center;
    > div {
      margin-left: 16px;
    }
  }

  .main-title {
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 23px;
    position: relative;
    margin-bottom: 0 !important;

    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: -8px;
      top: 4px;
      width: 3px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    height: 23px;
    > a {
      background: #ffffff;
      border: 1px solid rgba(59, 126, 238, 0.2);
    }
  }
`;
