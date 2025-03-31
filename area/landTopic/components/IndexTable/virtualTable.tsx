import { memo, forwardRef, useMemo } from 'react';

import { BaseTable, Classes, BaseTableProps } from 'ali-react-table';
import styled from 'styled-components';

const CUSTOM_STYLE = {
  '--color': '#141414',
  '--row-height': '30px',
  '--hover-bgcolor': '#fff',
  '--header-row-height': '24px',
  '--header-color': '#262626',
  '--header-bgcolor': '#f3f8ff',
  '--cell-padding': '6px 12px 5px',
  '--line-height': '16px',
  '--border-color': '#ebf1fb',
};

const VirtualTable = forwardRef<BaseTable, BaseTableProps>(({ style, ...restProps }, ref) => {
  const rebuildStyle = useMemo(() => ({ ...CUSTOM_STYLE, ...style }), [style]);
  return <StyledBaseTable style={rebuildStyle} ref={ref} {...restProps} />;
});

export default memo(VirtualTable);

const StyledBaseTable = styled(BaseTable)`
  .${Classes.artTable} {
    td {
      &:nth-last-child(2) {
        border-right: none;
      }
    }
    tr:nth-child(even of .art-table-row) > td {
      background: #f7fbff;
    }
    tr .lock-left {
      border-right: 1px solid #e0e7f4;
    }
    .art-table-body table colgroup col:last-child {
      width: 1px !important;
    }

    th {
      padding: 2px 12px;
      text-align: center !important;
      border-bottom: 1px solid #e0e7f4;
      border-right: 1px solid #e0e7f4;
      svg {
        width: 13px !important;
      }
    }
    .art-lock-shadow-mask:last-child {
      display: none;
    }
    .expansion-cell svg {
      display: none;
    }
    tbody tr:hover td {
      border-bottom: 1px solid #99c7ff;
    }
  }

  .${Classes.lockShadowMask} {
    .${Classes.lockShadow} {
      transition: box-shadow 0.3s;
    }
  }
  .art-sticky-scroll {
    opacity: 0.6;
    margin-top: -13px;
    border-top: 1px solid #f0f0f0;
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.35);
      border: 1px solid transparent;

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }
    }

    ::-webkit-scrollbar-track {
      background: #fff;
      opacity: 0.6;
    }
  }
` as unknown as typeof BaseTable;
