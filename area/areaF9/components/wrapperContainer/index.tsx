import { CSSProperties, FC, ReactNode, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TooltipPlacement } from 'antd/lib/tooltip';
import styled from 'styled-components';

import { Spin, Empty, Popover } from '@/components/antd';
import BackTop from '@/components/backTop';
import {
  LINK_AREA_ECONOMY,
  LINK_AREA_UNDERAREA,
  LINK_AREA_SIMILARECONOMY,
  LINK_AREA_REGIONALLIST,
  LINK_AREA_PUBLISH,
  LINK_AREA_REGION_TRENDS,
  LINK_AREA_INDUSTRY_TRENDS,
  LINK_AREA_COMPANY_TRENDS,
  LINK_AREA_VIEWPOINT,
  LINK_AREA_REGIONSOCIALFINANCE,
  LINK_AREA_LOCALDEBTISSUE,
  LINK_AREA_SPECIALDEBTPROJECTS,
  LINK_AREA_PLATFORMS,
  LINK_AREA_SPREADS,
  LINK_AREA_HIERARCHYBOND,
  LINK_AREA_FINANCIALINSTITUTIONS,
  LINK_AREA_F9DEVELOPMENT,
  LINK_AREA_BRIEF_INTRODUCTION,
  LINK_MAIN_INDICATORS,
  LINK_CREDIT_LINE,
  LINK_CREDIT_DETAIL,
  LINK_REGIONAL_FINANCIAL_SOURCE_SEC,
  LINK_REGIONAL_FINANCIAL_SOURCE_FUND,
  LINK_REGIONAL_FINANCIAL_SOURCE_FUTURES,
  LINK_REGIONAL_FINANCIAL_SOURCE_INSURANCEINSURANCE,
  LINK_AREA_ECONOMY_QM,
  LINK_AREA_INDUSTRIAL_STRUCTURE,
  LINK_AREA_BUSINESSTYPE,
  // LINK_AREA_UNSOLERATE,
  LINK_AREA_AGREEMENTALLOCATION,
  LINK_AREA_LANDTRANSFER,
} from '@/configs/routerMap';
import { useNoScrollBar } from '@/pages/area/areaF9/hooks/useNoScrollBar';
// import { ExternalEntry } from '@/pages/bond/cityInvestSpreadInstrument/components/externalEntry';

import Next from '../next';

interface HeaderContentProps {
  loading?: boolean;
  /**loading到顶部距离 */
  loadingTop?: string | number;
  containerRef?: any;
  /** 大标题 */
  title?: string;
  /** 内容区域 */
  content?: JSX.Element;
  error?: any;
  /** 头部是否sitcky */
  topIsSticky?: boolean;
  /** 头部右侧内容 */
  headerRightContent?: JSX.Element;
  /** 头部下面内容 */
  headerBottomContent?: JSX.Element;
  /** 自定义头部宽度 */
  headerWidth?: string;
  /** loading时是否使用opacity隐藏内容 */
  loadingHideContent?: boolean;
  contentStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  // 是否具有回到顶部功能
  backup?: boolean;
  children?: any;
  /**节点是否需要头部写死的内容 */
  isShowHeader?: boolean;
  popoverInfo?: {
    helpContent: ReactNode | (() => ReactNode);
    trigger?: string | string[];
    placement?: TooltipPlacement;
  };
}

const WrapperContainer: FC<HeaderContentProps> = (props) => {
  const {
    containerRef,
    loading,
    topIsSticky = true,
    content,
    headerBottomContent,
    error,
    headerWidth = '100%',
    title,
    headerRightContent,
    loadingHideContent = false,
    loadingTop = '',
    contentStyle,
    containerStyle,
    backup = true,
    children,
    isShowHeader = true,
    popoverInfo,
  } = props;
  const { pathname } = useLocation();
  const [_title, setTitle] = useState('');
  const domRef = useRef(null);
  // const scrollWrapRef = useRef<HTMLDivElement>(null);
  const [showHelpIcon, setShowHelpIcon] = useState(false);

  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasContentScroll = useNoScrollBar({ scrollWrapRef: containerRef || domRef, contentRef });
  const timerRef = useRef<any>();

  useEffect(() => {
    const titleArr = [
      { path: LINK_AREA_ECONOMY, title: '地区经济' },
      { path: LINK_AREA_INDUSTRIAL_STRUCTURE, title: '产业结构' },
      { path: LINK_AREA_ECONOMY_QM, title: '月度季度数据' },
      { path: LINK_AREA_UNDERAREA, title: '辖区经济' },
      { path: LINK_AREA_F9DEVELOPMENT, title: '开发区经济' },
      { path: LINK_AREA_SIMILARECONOMY, title: '相似经济' },
      { path: LINK_AREA_BRIEF_INTRODUCTION, title: '区域简介' },
      { path: LINK_AREA_REGIONALLIST, title: '区域榜单' },
      { path: LINK_AREA_PUBLISH, title: '区域舆情' },
      { path: LINK_AREA_REGION_TRENDS, title: '区域动态', showHelpIcon: true },
      { path: LINK_AREA_INDUSTRY_TRENDS, title: '行业动态' },
      { path: LINK_AREA_COMPANY_TRENDS, title: '企业动态' },
      { path: LINK_AREA_VIEWPOINT, title: '区域观点' },
      { path: LINK_AREA_REGIONSOCIALFINANCE, title: '地区社融' },
      { path: LINK_AREA_LOCALDEBTISSUE, title: '地方债发行' },
      { path: LINK_AREA_SPECIALDEBTPROJECTS, title: '专项债项目' },
      { path: LINK_AREA_PLATFORMS, title: '城投平台' },
      { path: LINK_AREA_SPREADS, title: '地区利差', showHelpIcon: true },
      { path: LINK_AREA_HIERARCHYBOND, title: '股权链路图' },
      { path: LINK_AREA_FINANCIALINSTITUTIONS, title: '金融机构' },
      { path: LINK_MAIN_INDICATORS, title: '属地银行主要财务指标' },
      { path: LINK_CREDIT_LINE, title: '银行区域授信规模' },
      { path: LINK_CREDIT_DETAIL, title: '获授信企业明细' },
      { path: LINK_REGIONAL_FINANCIAL_SOURCE_SEC, title: '证券公司' },
      { path: LINK_REGIONAL_FINANCIAL_SOURCE_FUND, title: '基金公司' },
      { path: LINK_REGIONAL_FINANCIAL_SOURCE_FUTURES, title: '期货公司' },
      { path: LINK_REGIONAL_FINANCIAL_SOURCE_INSURANCEINSURANCE, title: '保险公司名录' },
      { path: LINK_AREA_BUSINESSTYPE, title: '土地成交统计(按企业类型)' },
      // { path: LINK_AREA_UNSOLERATE, title: '土地成交统计(按流拍率)' },
      { path: LINK_AREA_AGREEMENTALLOCATION, title: '协议划拨明细' },
      { path: LINK_AREA_LANDTRANSFER, title: '历年土地出让趋势' },
    ];
    if (pathname) {
      const matchItem = titleArr.filter((item) => {
        const path = item.path.replace(/\/:code\?/, '');
        return pathname.includes(path);
      });
      setTitle(matchItem?.[0]?.title);
      if (matchItem?.[0]?.showHelpIcon) setShowHelpIcon(true);
    }
  }, [pathname, setTitle]);

  useEffect(() => {
    const wrap = document.querySelector('.side-page-content') as HTMLElement;
    if (wrap) {
      if (loading) {
        wrap.style.overflowY = 'hidden';
      } else {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          wrap.style.overflowY = 'auto';
        }, 500);
      }
    }
  }, [loading]);

  const HelpPopover = useMemo(() => {
    return (
      <Popover
        getPopupContainer={() => containerRef.current || scrollWrapRef.current}
        content={popoverInfo?.helpContent}
        placement={popoverInfo?.placement || 'bottomLeft'}
      >
        <span className="helpIcon"></span>
      </Popover>
    );
  }, [popoverInfo, containerRef, scrollWrapRef]);

  const Content = useMemo(() => {
    return (
      <>
        <Container
          hasContentScroll={loading ? false : hasContentScroll}
          ref={containerRef || domRef}
          className="main-container"
          style={{ ...containerStyle, overflowY: loading ? 'hidden' : 'auto' }}
        >
          {error ? (
            <EmptyContainer>
              <Empty style={{ paddingTop: '15%' }} type={Empty.LOAD_FAIL_WITH_BGCOLOR} />
            </EmptyContainer>
          ) : (
            <ContentContainer ref={contentRef} hasContentScroll={hasContentScroll} className="main-content">
              {isShowHeader ? (
                <Header
                  className="main-content-header"
                  style={contentStyle}
                  headerWidth={headerWidth}
                  topIsSticky={topIsSticky}
                >
                  <div className="top">
                    <div className="titleWrap">
                      <p className={'main-title'}>{title || _title}</p>
                      {showHelpIcon ? HelpPopover : null}
                      {/* {_title === '地区利差' ? <ExternalEntry /> : null} */}
                    </div>
                    {headerRightContent ? <div className="right">{headerRightContent}</div> : null}
                  </div>
                  {headerBottomContent ? <div className="bottom">{headerBottomContent}</div> : null}
                </Header>
              ) : null}
              {children ?? content}
            </ContentContainer>
          )}
          <Next></Next>
        </Container>
        {backup && <BackTop target={() => containerRef?.current! || domRef.current!} />}
      </>
    );
  }, [
    _title,
    content,
    children,
    contentStyle,
    containerStyle,
    error,
    headerBottomContent,
    headerRightContent,
    headerWidth,
    title,
    topIsSticky,
    hasContentScroll,
    backup,
    loading,
    isShowHeader,
    showHelpIcon,
    containerRef,
    HelpPopover,
  ]);

  return loadingHideContent ? (
    <>
      {loading ? (
        <Spin spinning={loading} type={'thunder'} tip="加载中">
          <div />
        </Spin>
      ) : null}
      <div style={{ height: loading ? 0 : '100%', overflowY: loading ? 'hidden' : 'visible' }}>{Content}</div>
    </>
  ) : (
    <>
      {loading ? (
        <SpinWrapper loadingTop={loadingTop} className="spining-wrap-box">
          <Spin spinning={loading} type={'thunder'} tip="加载中"></Spin>
        </SpinWrapper>
      ) : null}
      <div style={{ height: loading ? 0 : '100%', overflowY: loading ? 'hidden' : 'visible' }}>
        {Content}
        {/* <BackTop target={() => document.getElementsByClassName('main-container')?.[0]! as HTMLElement} /> */}
      </div>
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

const Container = styled.div<{ hasContentScroll: boolean }>`
  /* 解决y滚动条占位，加载时页面抖动问题 */
  height: 100%;
  overflow-y: overlay;
  scrollbar-gutter: ${({ hasContentScroll }) => (hasContentScroll ? 'stable' : 'initial')};
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
  // .ant-popover {
  //   left: 70px !important;
  //   top: 30px !important;
  //   .ant-popover-inner .ant-popover-inner-content {
  //     padding: 8px !important;
  //   }
  // }
`;

const ContentContainer = styled.div<{ hasContentScroll: boolean }>`
  height: auto;
  padding: ${({ hasContentScroll }) => (hasContentScroll ? '0px 8px 0 20px' : '0px 20px 0 20px')};
  // 48 下一节点容器高度
  min-height: calc(100% - 48px);
`;

const EmptyContainer = styled.div`
  min-height: calc(100% - 48px);
`;

const Header = styled.div<{ headerWidth?: string; topIsSticky?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  margin-bottom: 4px;
  position: ${(props) => (props.topIsSticky ? 'sticky' : 'static')};
  top: 0px;
  padding-top: 12px;
  z-index: 7;
  background: #fff;
  width: ${(props) => props.headerWidth};

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .titleWrap {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    > div {
      margin-left: 16px;
    }
  }
  .helpIcon {
    cursor: pointer;
    &::after {
      content: '';
      display: inline-block;
      position: relative;
      width: 12px;
      height: 12px;
      margin-left: 4px;
      top: 1px;
      background: url(${require('./helpIcon.svg')}) no-repeat;
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
    flex-shrink: 0;
    margin-left: 24px;
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
