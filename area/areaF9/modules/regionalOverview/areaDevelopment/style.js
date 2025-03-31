import styled from 'styled-components';

import { DEFAULT_PAGE_OFFSET, getConfig } from '@/app';
import { Icon } from '@/components';
import { Switch } from '@/components/antd';

export const ExportAndTotal = styled.div`
  float: right;
  display: flex;
  align-items: center;
  // line-height: 36px;
  .total {
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    color: #8c8c8c;
    margin-right: 24px;
    span {
      color: rgb(51, 51, 51);
    }
  }
  .traceabilityBtn {
    width: 12px;
    height: 12px;
    margin: -2px 2px 0 0;
    cursor: pointer;
  }
  .traceability {
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    color: #595959;
    cursor: pointer;
  }
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;

export const IconStyle = styled(Icon)`
  margin-right: 2px;
  transform: scale(${12 / 13});
`;

export const SwitchStyle = styled(Switch)`
  transform: scale(${26 / 32});
  /* transform-origin: left top; */
  margin: 0 24px 0 4px;
`;

export const LoadingStyle = styled.div`
  height: calc(100vh - ${getConfig((d) => d.css.pageOffset, DEFAULT_PAGE_OFFSET)}px) !important;
  background: #ffffff;

  & > div:first-child {
    padding-top: 25% !important;
  }

  .ant-row-middle {
    align-items: stretch !important;
  }
`;
