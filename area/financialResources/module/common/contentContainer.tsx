import styled from 'styled-components';

export const ContentContainer = styled.div`
  overflow: inherit !important;
  .module-empty {
    margin-top: 4px;
    margin-bottom: 28px;
  }

  .title-item-container {
    padding: 0;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0;
    z-index: 9;
    height: 34px;
    .select-right {
      font-size: 12px;
      font-weight: 400;
      color: #434343;
    }
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
  }

  .primary-link {
    color: #025cdc !important;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
