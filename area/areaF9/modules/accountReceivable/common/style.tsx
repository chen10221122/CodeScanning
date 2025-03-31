import { toNumber } from 'lodash';
import styled from 'styled-components';

import { DEFAULT_NEXT_PAGE_HEIGHT, DEFAULT_PAGE_VERTICAL_MARGIN, getConfig } from '@/app';
import { Icon } from '@/components';

import S from './style.module.less';

const TAB_HEIGHT = 40;

export const NumberWrap = styled.div<{ num: string | number }>`
  color: ${(props) => (toNumber(props.num) === 0 ? 'rgba(0, 0, 0, 0.85)' : '#025cdc')};
  cursor: ${(props) => (toNumber(props.num) === 0 ? 'unset' : 'pointer')};
  &:hover {
    text-decoration: ${(props) => (toNumber(props.num) === 0 ? 'unset' : 'underline')};
  }
`;

export const ContentWrap = styled.div`
  padding-bottom: 16px;
`;

export const EllipseWrap = styled.div<{ row?: number }>`
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.row ? props.row : 1)};
  -webkit-box-orient: vertical;
  white-space: unset !important;
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

export const SearchEmptyContainer = styled.div<{ tabHeight?: number; headFixedPosition?: number }>`
  height: ${({ tabHeight, headFixedPosition }) => `calc(
    100vh - ${getConfig((config) => config.css.pageVerticalMargin, DEFAULT_PAGE_VERTICAL_MARGIN)} - ${
    tabHeight ? tabHeight : TAB_HEIGHT
  }px - 88px - 36px - ${DEFAULT_NEXT_PAGE_HEIGHT}px
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

export const SingleEllipse = styled.div`
  span {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  display: flex;
  align-items: center;
`;
