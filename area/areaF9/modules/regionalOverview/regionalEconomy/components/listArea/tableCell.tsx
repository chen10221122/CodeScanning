import { useHistory } from 'react-router-dom';

import { isNil } from 'lodash';
import styled, { css } from 'styled-components';

import { areaLinkType, areaModalType } from '@dataView/const';
import {
  dollarBondType,
  dollarBondNumType,
  hasDetailTypes,
  technologyInnovationType,
  enterpriseRankType,
  newRegisteredEnterprise,
  revocationOrCancelEnterprise,
} from '@dataView/DataView/SheetView/TableView/extras/area/const';
// import { AreaSheetViewContext, useSheetView } from '@dataView/provider';

import { LINK_AREA_ECONOMY } from '@/configs/routerMap';
import TableCell, {
  TableCellProps,
} from '@/pages/dataView/DataView/SheetView/TableView/components/tableCell/TableCell';
import { dynamicLink } from '@/utils/router';

/**
 * 列表单元格 从区域数据浏览器迁移的
 * @param param0.isShowUpdate 是否显示更新提示
 * @param param0.isShowTrace 是否显示溯源
 * @returns
 */
export default function ListTableCell({
  isShowTrace,
  isShowUpdate,
  children,
  ...props
}: TableCellProps & { isShowUpdate: boolean; isShowTrace: boolean }) {
  const history = useHistory();
  const { extraProperties } = props || {};
  const { type, color, regionCode, guId } = extraProperties || {};

  let { isShowTraceLink, hasDetailModal } = getIsTraceAndHasDetail(isShowTrace, props.value, type, guId);

  const link =
    type === 'region' && regionCode ? dynamicLink(LINK_AREA_ECONOMY, { code: regionCode, key: 'regionEconomy' }) : '';

  // //开发区中 特点指标 屏蔽溯源
  // if (isShowTraceLink && props.data.type === 'develop' && type?.includes('region_windows_')) {
  //   let t = type.replace('region_windows_', '');
  //   if (t && !isNaN(t) && 23 - t >= 0) isShowTraceLink = false;
  // }

  return (
    <AreaTableCellWrapper
      {...props}
      isShowTrace={isShowTraceLink}
      hasDetailModal={hasDetailModal}
      isShowUpdate={isShowUpdate}
      backgroundColor={color}
    >
      <span
        className={link ? 'area-link' : ''}
        onClick={() => {
          if (link) history.push(link);
        }}
        data-click-area={true}
      >
        {children}
      </span>
    </AreaTableCellWrapper>
  );
}

export function getIsTraceAndHasDetail(isShowTrace: boolean, value: any, type: any, guId?: any) {
  return {
    isShowTraceLink: isShowTrace && !isNil(value) && (type === areaLinkType || areaModalType.includes(type) || guId),
    /* 明细弹窗 || 科创企业 || 中资美元债 || 版单 */
    hasDetailModal:
      [
        ...hasDetailTypes,
        ...dollarBondType,
        ...dollarBondNumType,
        technologyInnovationType,
        enterpriseRankType,
        newRegisteredEnterprise,
        revocationOrCancelEnterprise,
      ].includes(type) && !isNil(value),
  };
}

enum Color {
  Yellow = 1,
  Red = 2,
}

const AreaTableCellWrapper = styled(TableCell)<{
  isShowTrace?: boolean;
  isShowUpdate?: boolean;
  backgroundColor?: Color;
  hasDetailModal: boolean;
}>`
  /* 覆盖掉引入的padding-right的12px */
  ${({ noPadding }) =>
    !noPadding &&
    css`
      padding: 0px 0px 0px 12px;
    `}
  .area-link {
    color: #025cdc;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  ${({ isShowUpdate, backgroundColor }) =>
    isShowUpdate
      ? backgroundColor === Color.Yellow
        ? css`
            cursor: pointer;
            background-color: #ffe9d7;
          `
        : backgroundColor === Color.Red
        ? css`
            cursor: pointer;
            background-color: #ffd6d6;
          `
        : ''
      : ''};
  ${({ isShowTrace }) =>
    isShowTrace &&
    css`
      & > span {
        color: #025cdc;
        cursor: pointer;
        text-decoration: underline;
        position: relative;
      }
    `}

  ${({ hasDetailModal }) =>
    hasDetailModal &&
    css`
      & > span {
        color: #025cdc;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    `}
`;
