/**
 * @description 模块带状态的组件
 * 标题+筛选+表格/标题+多个子模块
 */
import { ReactElement, FC, memo, useRef, useMemo, useEffect, useState } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import { isSamePageBranchNames } from '@/pages/area/areaCompany/configs';
import Next from '@/pages/area/areaF9/components/next';
import { useSelector } from '@/pages/area/areaF9/context';
import { useNoScrollBar } from '@/pages/area/areaF9/hooks/useNoScrollBar';

import Styles from './style.module.less';
import { SingleLoadingDom } from './styles';

export interface WrapperProps {
  title: string;
  /** 必传，单模块为SingleModuleWrapper，多模块为SubModuleWrapper[] */
  children: any;
  /** 多模块时是全部模块的loading，不做分布加载。单模块loading放到了singleModuleWrapper */
  loading?: boolean;
  /** 首次进入页面的loading */
  firstLoading?: boolean;
  /** 单模块时必传 */
  filterDom?: ReactElement;
  /** 单模块时必传 */
  contentDom?: ReactElement;
  /** 无数据 */
  isEmpty?: boolean;
  error?: boolean | Error;
  /** 筛选无数据 重置 */
  onClear?: Function;
  /** 加载失败重新加载 */
  onReload?: Function;
  id?: string;
  /** 是否有默认筛选 多模块时传，判断页面第一次无数据使用 */
  hasDefaultFilter?: boolean;
  useOutLoadingStatus?: boolean;
  className?: string;
  noTitleWrapper?: boolean;
  moduleWithTab?: boolean;
}

const ModuleWrapper: FC<WrapperProps> = ({
  title,
  children,
  loading,
  className,
  useOutLoadingStatus,
  noTitleWrapper,
  moduleWithTab,
}) => {
  // 包含了筛选的loading
  const { firstLoading, branchId } = useSelector((store) => ({
    firstLoading: store.curModuleFirstLoading,
    branchId: store.curNodeBranchId as unknown,
  }));

  const [firstAndAfterFilterLoading, setFirstAndAfterFilterLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timer>();
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempLoading = !!firstLoading;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tempLoading) {
      setFirstAndAfterFilterLoading(tempLoading);
    } else {
      // 200ms留给筛选组件render，之后一块出现，避免搜索组件偏移的问题
      timerRef.current = setTimeout(() => {
        setFirstAndAfterFilterLoading(tempLoading);
      }, 200);
    }
  }, [firstLoading]);

  const isRefreshPage = useMemo(() => isSamePageBranchNames.some((id) => id === branchId), [branchId]);

  const resultIsLoading = useMemo(
    () => (isRefreshPage ? !!firstLoading : !!firstAndAfterFilterLoading),
    [isRefreshPage, firstAndAfterFilterLoading, firstLoading],
  );

  const hasContentScroll = useNoScrollBar({ scrollWrapRef, contentRef });

  // 多模块
  const isMultiModule = useMemo(() => Array.isArray(children), [children]);

  const isLoading = useMemo(() => {
    if (useOutLoadingStatus) return loading;
    return (isMultiModule ? !!loading : false) || resultIsLoading;
  }, [isMultiModule, loading, resultIsLoading, useOutLoadingStatus]);

  // firstLoading loading时滚动条隐藏
  useEffect(() => {
    const wrap = document.getElementById('area-company-index-container');
    if (wrap) {
      wrap.setAttribute('style', `overflow-y: ${isLoading ? 'hidden !important' : ''}`);
    }
    return () => {
      if (wrap) {
        wrap.style.overflowY = '';
      }
    };
  }, [isLoading]);

  return (
    <IndexContainer
      id="area-company-index-container"
      hasContentScroll={hasContentScroll}
      className={className}
      isLoading={!!isLoading}
      ref={scrollWrapRef}
    >
      <div
        className={cn(moduleWithTab ? Styles.specialWrapper : Styles.wrapper, { [Styles.hasStickyTop]: children })}
        id="area-company-container"
        ref={contentRef}
      >
        {isLoading ? (
          <Spin spinning={isLoading} type="fullThunder">
            <SingleLoadingDom />
          </Spin>
        ) : null}
        <div className="area-company-children-container">
          {noTitleWrapper ? null : <div className={Styles.title}>{title}</div>}
          {children}
        </div>
      </div>
      <Next />
      <BackTop target={() => document.getElementById('area-company-index-container') || document.body} />
    </IndexContainer>
  );
};

export default memo(ModuleWrapper);

const IndexContainer = styled.div<{ isLoading: boolean; hasContentScroll: boolean }>`
  width: 100% !important;
  height: 100%;
  overflow: hidden auto !important;
  /* overflow: overlay在chrome114及以上被废弃了 */
  /* 始终会为滚动条占据一部分空间，切换更稳定 */
  /* scrollbar-gutter: ${({ hasContentScroll }) => (hasContentScroll ? 'stable' : 'initial')}; */
  scrollbar-gutter: stable;
  /* 小于等于1279 小于1280才有滚动条 */
  /* @media (max-width: 1279px) {
    overflow: ${({ hasContentScroll }) => (hasContentScroll ? 'hidden' : 'auto')} auto !important;
  } */

  /* overfalo: overlay在chrome114及以上被废弃了 */
  /* 始终会为滚动条占据一部分空间，切换更稳定 */
  #area-company-container {
    /* padding-right: ${({ hasContentScroll }) => (hasContentScroll ? '8px' : '20px')}; */
    padding-right: 8px;
  }

  /** 6.29变更：弹窗底部留26px */
  .ant-modal-wrap {
    bottom: 26px !important;
  }

  @media screen and (max-width: 1279px) {
    .ant-modal-root .modal-mask-sticky .ant-modal {
      height: calc(100vh - 100px);
    }
  }

  .area-company-children-container {
    opacity: ${({ isLoading }) => (isLoading ? 0 : 1)};
  }

  /** 区域融资-债券融资-双表头 */
  .double-table {
    .ant-table-thead > tr > th {
      height: 28px;
      padding: 4px 12px;
      line-height: 18px;
    }
  }

  /** 失信被执行人弹窗 */
  .area-f9-diahonest-modal {
    .ant-modal-body {
      height: calc(100vh - 60px - 47px - 44px) !important;
    }
  }

  /* 租赁融资弹窗 */
  .financing-lease-detail-modal-wrapper {
    .ant-modal-body {
      .ant-spin-container > div:first-child > div:first-child {
        @media screen and (max-width: 1279px) {
          height: calc(100vh - 221px) !important;
        }
      }
    }
  }

  /** 供应商弹窗 */
  #area-company-detail-modal-tableID {
    height: calc(100vh - 206px);
    @media screen and (max-width: 1279px) {
      height: calc(100vh - 218px);
    }
  }

  /** ipo储备企业弹窗 */
  .area-f9-ipo-notice-modal {
    .ant-modal-body {
      scrollbar-gutter: stable;
      height: calc(100vh - 155px);
      > div:first-child {
        padding: 0px 22px 24px 32px !important;
      }
    }
  }

  /* popover样式 */
  .ant-popover-inner-content {
    ::-webkit-scrollbar {
      width: 6px !important;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #cfcfcf;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
    /* 去掉更多筛选中 标题悬浮框文字对齐方式 */
    .explain {
      text-align-last: left;
    }
  }
  .private-tag-popover-content {
    max-width: 215px;
    min-width: 215px;
    .ant-popover-inner {
      padding: 10px 6px 10px 0 !important;
      .ant-popover-inner-content {
        padding: 0 6px 0 6px;
        max-height: 110px;
        overflow-y: overlay;
      }
    }

    .numberModal {
      color: #025cdc;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .detail-arrow-popover-content {
    max-width: 254px;
    min-width: 254px;
    .ant-popover-inner {
      padding: 8px 4px 8px 0 !important;
      .ant-popover-inner-content {
        padding: 0 8px 0 16px;
        max-height: 196px;
        overflow-y: overlay;
      }
    }

    /** 黑名单-登记状态 | 吊销/注销企业-企业状态 悬浮窗内容*/
    .statusPopoverContent {
      > div {
        font-size: 13px;
        font-weight: 400;
        color: #595959;
        line-height: 20px;
        margin-top: 6px;
        .left-title {
          white-space: nowrap;
        }
        .right-txt {
          display: inline-block;
          max-width: 130px;
          font-size: 13px;
          font-weight: 400;
          color: #141414;
          margin-left: 20px;
        }
      }
      .statusMoreText {
        display: flex;
      }
    }

    /** 黑名单-登记状态 */
    &.blacklist-detail-arrow-popover {
      min-width: max-content !important;
      flex-shrink: 0;
      .ant-popover-inner {
        width: max-content !important;
        padding: 9px 12px !important;
        .ant-popover-inner-content {
          min-height: fit-content !important;
          padding: 0px !important;
        }
      }
      .statusPopoverContent {
        > div {
          margin-top: 0 !important;
          > span {
            margin-left: 16px;
            color: #141414;
          }
        }
      }
    }

    /** 吊销/注销企业-企业状态 */
    &.revoke-arrow-popover {
      min-width: max-content !important;
      flex-shrink: 0;
      .ant-popover-inner {
        max-width: 226px;
        padding: 9px 12px !important;
        .ant-popover-inner-content {
          width: max-content;
          max-width: 202px;
          min-height: 50px;
          max-height: 130px;
          padding: 0px !important;
          overflow-y: overlay;
        }
      }
    }
  }
  .industry-arrow-popover-content {
    .ant-popover-content {
      .ant-popover-inner {
        padding: 8px !important;
        .ant-popover-inner-content {
          overflow-y: overlay;
          width: max-content;
          max-width: 238px;
          /* min-height: 40px; */
          max-height: 130px;
          padding: 0px;
          font-size: 13px;
          font-weight: 400;
          color: #141414;
          line-height: 20px;
        }
      }
    }
  }
  .ratio-popover-detail-content {
    width: 366px;
    min-width: initial;
    max-width: initial;
    .ant-popover-content {
      .ant-popover-inner-content {
        padding: 0 8px 0 12px;
      }
    }
  }
`;
