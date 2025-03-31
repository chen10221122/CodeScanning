import { CSSProperties, FC, memo, useEffect, useMemo } from 'react';

import styled from 'styled-components';

import { Spin, Empty } from '@/components/antd';
import Next from '@/pages/area/areaF9/components/next';

interface HeaderContentProps {
  loading?: boolean;
  /** 大标题 */
  title?: string;
  /** 内容区域 */
  content?: JSX.Element;
  error?: any;
  /** 标题sitcky */
  titleSticky?: number;
  /** 头部右侧内容 */
  headerRightContent?: JSX.Element;
  /** 头部下面内容 */
  headerBottomContent?: JSX.Element;
  /** 自定义头部宽度 */
  headerWidth?: string;
  /** loading时是否使用opacity隐藏内容 */
  loadingHideContent?: boolean;
  contentStyle?: CSSProperties;
  headerRightFix?: boolean;
}

const WrapperContainer: FC<HeaderContentProps> = (props) => {
  const {
    loading,
    titleSticky,
    content,
    headerBottomContent,
    error,
    headerWidth = '100%',
    title,
    headerRightContent,
    loadingHideContent = false,
    contentStyle,
    headerRightFix,
  } = props;

  useEffect(() => {
    const wrap = document.querySelector('.main-container') as HTMLElement;
    if (wrap) {
      if (loading) {
        wrap.style.overflowY = 'hidden';
      } else {
        wrap.style.overflowY = 'auto';
        wrap.style.overflowY = 'overlay';
      }
    }
  }, [loading]);

  const Content = useMemo(() => {
    return (
      <Container className="main-container" style={{ width: '100% !important' }}>
        {error ? (
          <EmptyContainer>
            <Empty style={{ paddingTop: '15%' }} type={Empty.LOAD_FAIL_WITH_BGCOLOR} />
          </EmptyContainer>
        ) : (
          <ContentContainer className="main-content">
            {headerRightFix ? (
              <Header
                className="main-content-header"
                style={contentStyle}
                headerWidth={headerWidth}
                titleSticky={titleSticky}
              >
                <div className="top">
                  <div className="titleWrap">
                    <p className={'main-title'}>{title}</p>
                  </div>
                  {headerRightContent ? <div className="fixed-right">{headerRightContent}</div> : null}
                </div>
                <div className="shadow"></div>
              </Header>
            ) : (
              <Header
                className="main-content-header"
                style={contentStyle}
                headerWidth={headerWidth}
                titleSticky={titleSticky}
              >
                <div className="top">
                  <div className="titleWrap">
                    <p className={'main-title'}>{title}</p>
                  </div>
                  {headerRightContent ? <div className="right">{headerRightContent}</div> : null}
                </div>

                {headerBottomContent ? <div className="bottom">{headerBottomContent}</div> : null}
              </Header>
            )}
            {content}
          </ContentContainer>
        )}
        <Next></Next>
      </Container>
    );
  }, [
    content,
    contentStyle,
    error,
    headerBottomContent,
    headerRightContent,
    headerRightFix,
    headerWidth,
    title,
    titleSticky,
  ]);

  return loadingHideContent ? (
    <>
      {loading ? (
        <Spin spinning={loading} type={'thunder'} tip="加载中">
          <div />
        </Spin>
      ) : null}
      <div style={{ height: loading ? 0 : '100%', opacity: loading ? 0 : 1 }}>{Content}</div>
    </>
  ) : (
    <>
      {loading ? (
        <SpinWrapper>
          <Spin spinning={loading} type={'thunder'} tip="加载中"></Spin>
        </SpinWrapper>
      ) : null}
      <div style={{ height: loading ? 0 : '100%', opacity: loading ? 0 : 1 }}>{Content}</div>
    </>
  );
};
export default memo(WrapperContainer);

const SpinWrapper = styled.div`
  /* 解决加载icon不居中 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-spin-container {
    height: 100%;
  }
`;

const Container = styled.div`
  /* 解决y滚动条占位，加载时页面抖动问题 */
  height: 100% !important;
  width: 100% !important;
  overflow-y: overlay;
  scrollbar-gutter: stable;
  @media (max-width: 1279px) {
    /* 12 横向滚动条高度 */
    /* min-height: calc(100vh - 128px - 12px); */
  }
  .new-no-data {
    padding-top: 11vh;
    padding-bottom: 2vh;
  }
`;

const ContentContainer = styled.div`
  padding: 0px 8px 0 20px;
  // 48 下一节点容器高度
  min-height: calc(100% - 48px);
`;

const EmptyContainer = styled.div`
  min-height: calc(100% - 48px);
`;

const Header = styled.div<{ headerWidth?: string; titleSticky?: number }>`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  padding-top: 12px;
  z-index: 7;
  background: white;
  width: ${(props) => props.headerWidth};
  position: ${(props) => (props.titleSticky ? `sticky` : 'static')};
  top: ${(props) => (props.titleSticky ? `${props.titleSticky}px` : '0')};
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 7;
  }
  .shadow {
    background: #fff;
    width: 98%;
    height: 43px;
    z-index: 6;
    position: absolute;
    top: 0;
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
  .fixed-right {
    position: absolute;
    right: 20px;
    z-index: 10;
  }
  .right {
    display: flex;
    align-items: center;
    height: 23px;
  }

  .headerRightFix {
    position: fixed;
    right: 20px;
    z-index: 100;
    background: #fff;
  }

  .ant-radio-group {
    .ant-radio-checked::after {
      display: none;
    }
  }

  // 修改antd自带的样式
  .ant-radio-group {
    margin-right: 8px;

    .ant-radio-wrapper {
      margin-right: 16px;
      font-size: 13px;

      .ant-radio {
        & ~ span {
          padding: 0;
        }

        padding-right: 6px;
        /* top: 0.1em; */
        top: 1px;

        .ant-radio-inner {
          width: 12px;
          height: 12px;

          &::after {
            width: 12px;
            height: 12px;
            margin-top: -6px;
            margin-left: -6px;
            background-color: #fff;
          }
        }
      }

      &.ant-radio-wrapper-checked {
        color: #0171f6 !important;

        .ant-radio-checked {
          .ant-radio-inner {
            padding: 2px;
            background-color: #0171f6;
          }
        }
      }
    }
  }

  .question-icon {
    font-size: 13px;
    width: 14px;
    height: 13px;
    line-height: 13px;
    color: #0171f5;
    margin-right: 4px;
    vertical-align: middle;
    // transform: translateY(-1px);
    cursor: pointer;
  }

  .question-text {
    //cursor: pointer;
    font-size: 13px;
  }

  .right {
    > a {
      background: #ffffff;
      border: 1px solid rgba(59, 126, 238, 0.2);
    }
  }
`;
