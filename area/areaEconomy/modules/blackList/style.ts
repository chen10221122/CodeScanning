import styled from 'styled-components';

import { Empty } from '@/components/antd';

/**
 * 切换tab的loading样式
 */
export const TableChangeLoading = styled.div<any>`
  height: ${({ noContent }) => (noContent ? '100%' : '')};
  > .ant-spin-nested-loading {
    position: ${({ noContent }) => (noContent ? 'initial' : 'relative')};
    height: ${({ noContent }) => (noContent ? '100%' : '')};
    transform: ${({ hasTransfrom }) => (hasTransfrom ? 'translateZ(0)' : '')};
    background: #fff;
    & > div > .ant-spin {
      position: absolute;
      top: ${({ top }) => top};
    }
  }
  .ant-table-container,
  .ant-table-container table > thead > tr:first-child th:first-child {
    padding: 0;
  }
`;

/**
 * 页面加载失败的样式
 */
export const EmptyError = styled.div<{
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  imageBottom?: number;
  imgWidth?: number;
  imgHeight?: number;
  fontSize?: number;
}>`
  .ant-empty {
    margin-top: ${({ marginTop }) => marginTop || 0}px;
    padding-top: ${({ paddingTop }) => paddingTop || 0}px;
    margin-bottom: ${({ marginBottom }) => marginBottom || 0}px;
    .ant-empty-image {
      width: ${({ imgWidth }) => (imgWidth ? imgWidth + 'px' : 'null')};
      height: ${({ imgHeight }) => (imgHeight ? imgHeight + 'px' : 'auto')};
      margin-bottom: ${({ imageBottom }) => (typeof imageBottom === 'number' ? imageBottom : 10)}px;
      img {
        height: 100%;
      }
    }
    .ant-empty-description span {
      font-size: ${({ fontSize }) => fontSize || 13}px;
    }
  }
`;

/**
 * 表格内部loading的样式
 */
export const TableInnerLoading = styled.div<any>`
  // 翻页loading位置
  .ant-spin-spinning {
    position: ${({ clientHeight }) => (clientHeight > 110 ? 'fixed' : 'absolute')} !important;
    top: ${({ top, clientHeight }) => {
      if (clientHeight > 210) {
        return top + 32;
      } else if (clientHeight > 110) {
        return top + clientHeight * 0.25;
      }

      return clientHeight * 0.25;
    }}px !important;
    z-index: 5;
    background-color: rgba(255, 255, 255, 0.9);
    width: 100%;
    height: 100%;
    max-height: ${({ clientHeight }) => (clientHeight ? clientHeight - 32 + 'px' : '100vh')};
    max-width: ${({ maxWidth }) => (maxWidth ? maxWidth + 'px' : '100%')};
    > .ant-spin-dot {
      top: ${({ clientHeight }) => {
        if (clientHeight > 210) return '30%';
      }};
    }
  }
`;

/**
 * 表格内部无数据以及失败样式
 */
export const TableInnerEmptyAndError = styled(Empty)<{ height?: string; heightnumber?: number }>`
  /* 77是1/2的无数据的高度 */
  &.ant-empty {
    ${({ heightnumber }) => {
      return heightnumber
        ? `
        position: relative;
        top: ${heightnumber ? `${Math.max(60, heightnumber * 0.3 - 77)}px` : '0'};
      `
        : '';
    }};
    height: ${({ height }) => height || '100%'};
    .ant-empty-description {
      position: relative;
      top: 25%;
    }
    > .ant-empty-image {
      position: relative;
      top: 25%;
      /* margin: 100px auto 9px; */
      margin-bottom: 9px;
      width: 205px;
      height: 124px;
    }
  }
`;
