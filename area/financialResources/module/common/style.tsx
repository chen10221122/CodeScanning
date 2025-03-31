import styled from 'styled-components';

import { Icon } from '@/components';

import S from './style.module.less';

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
  min-height: 603px;
`;

export const EmptyContent = styled.div<{ tabHeight?: number; headFixedPosition?: number }>`
  /* height: calc(100vh - 156px); */
  height: calc(100% - 26px);
  position: relative;
  min-height: 380px;
  .ant-empty {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -30%);
    height: auto !important;
  }
`;
