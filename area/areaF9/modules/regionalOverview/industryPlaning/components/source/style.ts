import styled from 'styled-components';

export const SourceStyle = styled.div`
  width: 100%;
  padding: 0 14px 0 8px;
  .industry-planing-source-title {
    flex-shrink: 0;
  }
`;

export const SourceItemStyle = styled.div`
  .source-item-title {
    font-size: 13px;
    color: #141414;
    line-height: 20px;
    cursor: pointer;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    &:hover {
      color: #0171f6;
    }
  }
  .source-item-tools {
    display: flex;
    flex-wrap: nowrap;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 18px;
    font-size: 11px;
    color: #8c8c8c;
    line-height: 18px;
    .source-item-time,
    .source-item-dot {
      flex-shrink: 0;
    }
  }
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;
