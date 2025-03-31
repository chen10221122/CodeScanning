import { FC, memo } from 'react';

import { Spin, Empty } from '@dzh/components';
import { DragPageLayout, DragPageLayoutProps } from '@dzh/pro-components';
import styled from 'styled-components';

import { DEFAULT_NEXT_PAGE_HEIGHT } from '@/app';
import Next from '@/pages/area/areaF9/components/next';
import { SubTitleStyle } from '@/pages/area/areaF9/style';

interface LayoutProps extends DragPageLayoutProps {
  loading: boolean;
  error: boolean;
}

const Layout: FC<LayoutProps> = ({ loading, error, ...props }) => {
  return (
    <LayoutStyle>
      <Spin type="thunder" direction="vertical" spinning={loading}>
        {error ? (
          <EmptyContainer>
            <SubTitleStyle>产业规划</SubTitleStyle>
            <Empty type={Empty.NO_DATA} />
          </EmptyContainer>
        ) : (
          <DragPageLayout {...props} widthTitName="来源" type="leftRight" />
        )}
        <Next />
      </Spin>
    </LayoutStyle>
  );
};

export default memo(Layout);

const LayoutStyle = styled.div`
  width: 100%;
  height: 100%;
  .dzh-content-wrapper {
    padding-top: 0 !important;
  }
  /* 让title的sticky生效 */
  .dzh-content-wrapper,
  .dzh-container-right {
    overflow: initial !important;
  }
  .dzh-page-wrapper {
    height: auto !important;
    min-height: calc(100% - ${DEFAULT_NEXT_PAGE_HEIGHT}px);
    .dzh-content-wrapper {
      .dzh-resizable-box-vertical,
      .react-resizable,
      .dzh-container-right {
        height: initial !important;
      }
    }
  }

  .dzh-spin-spinWrapper .ant-spin-container {
    height: 100%;
  }
`;

const EmptyContainer = styled.div`
  padding: 0 20px 20px;
  height: auto !important;
  min-height: calc(100% - ${DEFAULT_NEXT_PAGE_HEIGHT}px);
`;
