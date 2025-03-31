import { useState } from 'react';

import { Rate } from 'antd';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import ScopeDialog from '@/pages/area/areaCompareAdvance/modules/scopeDialog';

import Scope1 from '../../../imgs/scope.png';
import Scope2 from '../../../imgs/scope2.png';
import TableCell, { TableCellProps } from './TableCell';

// 用于显示地区综合评分的单元格
export default function ScopeDateCell(props: TableCellProps) {
  const {
    value,
    column: {
      userProvidedColDef: { colId, field },
    },
  } = props || {};
  const mValue = value?.mValue || '-';

  //地区综合评分弹窗
  const [scopeVisible, setScopeVisible] = useState(false);

  return (
    <>
      <ScopeCellWrapper {...props} noPadding>
        <Rate
          disabled
          allowHalf
          className="rate-comprehensive-score"
          value={mValue > Math.floor(mValue) ? Math.floor(mValue) + 0.5 : Math.floor(mValue)}
        />
        <span
          className="text"
          onClick={() => {
            if (!isUndefined(mValue)) setScopeVisible(true);
          }}
        >
          {mValue}
        </span>
      </ScopeCellWrapper>

      {/* 地区综合评分弹窗 */}
      <ScopeDialog
        visible={scopeVisible}
        regionInfo={{ regionCode: field, regionName: colId }}
        onCancel={() => {
          setScopeVisible(false);
        }}
      />
    </>
  );
}

const ScopeCellWrapper = styled(TableCell)`
  .rate-comprehensive-score {
    color: #ff7500;
    font-size: 10px;
    position: relative;
    top: -1px;
    margin-right: 4px;
  }

  .ant-rate-star:not(:last-child) {
    margin-right: 0px;
  }
  .text {
    cursor: pointer;

    &::after {
      background: url(${Scope1}) no-repeat center;
    }

    &::after {
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      margin-left: 2px;
      background-size: contain;
    }

    &:hover {
      color: #ff7500;
      &::after {
        background: url(${Scope2}) no-repeat center;
        background-size: contain;
      }
    }
  }
`;
