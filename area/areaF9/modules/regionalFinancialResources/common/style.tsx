import styled from 'styled-components';

import { DEFAULT_NEXT_PAGE_HEIGHT, DEFAULT_PAGE_VERTICAL_MARGIN, getConfig } from '@/app';
import { Icon } from '@/components';

import S from './styles.module.less';

const TAB_HEIGHT = 40;

export const EnterpriseWrap = styled.div`
  overflow: hidden;
  display: unset;
  flex-direction: column;
  -webkit-line-clamp: 3;
  white-space: break-spaces !important;
  &.link {
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
    cursor: pointer;
  }
  &.openSource {
    color: #025cdc;
    text-decoration: underline;
    cursor: pointer;
  }
  &.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
`;

export const EllipsisWrap = styled.div`
  white-space: nowrap;
  &.link {
    color: #025cdc;
    &:hover {
      text-decoration: underline;
    }
    cursor: pointer;
  }
  &.openSource {
    color: #025cdc;
    text-decoration: underline;
    cursor: pointer;
  }
  &.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
`;

export const loadingTips = (
  <span className={S.loadingTips}>
    <Icon
      style={{ width: 24, height: 24, marginTop: 20, zIndex: 1 }}
      image={require('@/assets/images/common/loading.gif')}
    />
    <span className={S.loadingText}>加载中</span>
  </span>
);

export const ContentWrap = styled.div`
  padding-bottom: 16px;
`;

export const EmptyContainer = styled.div`
  min-height: calc(100% - 48px);
`;

export const SearchEmptyContainer = styled.div<{ tabHeight?: number; headFixedPosition?: number }>`
  height: ${({ tabHeight, headFixedPosition }) => `calc(
    100vh - ${getConfig((config) => config.css.pageVerticalMargin, DEFAULT_PAGE_VERTICAL_MARGIN)} - ${
    tabHeight ? tabHeight : TAB_HEIGHT
  }px - 48px - 36px - ${DEFAULT_NEXT_PAGE_HEIGHT}px
  )`};
  position: relative;
  min-height: 380px;
  .ant-empty {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    height: auto !important;
  }
  @media screen and (max-height: 648px) {
    .ant-empty {
      top: 80px;
      transform: translate(-50%, 0);
    }
  }
`;

export const Ellipsis = styled.span`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
`;

export const WrapLine = styled.div`
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  box-sizing: border-box;
`;

export const TableWrapper = styled.div`
  .ant-table-thead > tr > th.pdd-8 {
    padding-left: 8px;
    padding-right: 8px;
  }
  .ant-table-thead > tr > th.before-tag-show {
    z-index: 5;
  }
  .ant-table-thead > tr > th.first-tag-show {
    z-index: 4;
  }
  .ant-table-column-title {
    position: static;
  }
  .dzh-table-pagination {
    margin-bottom: 0;
    margin-top: 4px;
  }
  .ant-pagination.ant-pagination-mini .ant-pagination-prev,
  .ant-pagination.ant-pagination-mini .ant-pagination-next {
    min-width: 20px;
    height: 20px;
    margin: 0;
    line-height: 20px;
    margin-right: 4px;
  }
  .ant-pagination.ant-pagination-mini .ant-pagination-next {
    margin-right: 0;
  }
  .ant-pagination.ant-pagination-mini .ant-pagination-item {
    min-width: 20px;
    height: 20px;
    margin: 0;
    line-height: 20px;
    margin-right: 4px;
  }
  .ant-pagination-item a {
    color: #595959;
  }
  .ant-pagination-item-active a {
    color: #0171f6;
  }
  .dzh-empty-sm .ant-empty-image {
    margin-top: 20vh;
  }
  .primary-link {
    color: #025cdc !important;
    &:hover {
      text-decoration: underline;
    }
    cursor: pointer;
  }
`;

export const HeaderModalWrapper = styled.div`
  display: flex;
  align-items: center;
  .num {
    font-size: 13px;
    color: #666;
    line-height: 20px;
    margin-right: 16px;
    span {
      color: #ff7500;
    }
  }
`;
