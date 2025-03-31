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
