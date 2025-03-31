import { useHistory } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { isUndefined } from 'lodash';
import styled, { css } from 'styled-components';

import { getGuid } from '@/apis/area/areaCompare';
import { LINK_INFORMATION_TRACE, LINK_AREA_ECONOMY } from '@/configs/routerMap';
import { formatValue } from '@/pages/area/areaCompareAdvance/config';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { getIndicAndUnit } from '@/pages/area/areaCompareAdvance/utils';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import TableCell, { TableCellProps } from './TableCell';

/** 可以跳转区域经济f9的指标 */
const LINL_AREA_INDICATORS = [
  //地区名称（含上级）
  'REGION_10000002',
  //上级地区
  'REGION_10000004',
  //所属省份
  'REGION_10000006',
  //所属地级市
  'REGION_10000008',
  //所属区县
  'REGION_10000468',
];

// 用于显示指标的单元格
export default function IndicatorDataCell({ children, ...props }: TableCellProps) {
  const history = useHistory();
  const {
    state: { date, openSource, handleOpenModal },
  } = useCtx();
  const {
    column: { userProvidedColDef },
    data,
    value,
  } = props || {};

  const { indexId, extraProperties, defaultParamMap } = data || {};
  const { mValue } = value || {};
  const { indicName, unit } = getIndicAndUnit(extraProperties?.indicName || '');

  /** 'region_windows_1' 至 'region_windows_23'才是计算指标 */
  const indicCode = extraProperties?.type?.replace('region_windows_', '');
  /** 判断是不是计算指标 */
  const isCalIncicator = 24 - indicCode > 0;
  /** 判断是不是溯源指标 */
  const isNormalIncicator = extraProperties?.type === 'region_guid';
  /** 是否是可跳转的地区指标 */
  const isLinkAreaIndicator = LINL_AREA_INDICATORS.includes(indexId) && value?.extraProperties?.regionCode;
  /** 判断指标是否飘蓝 */
  const isLink =
    openSource &&
    (isNormalIncicator || isCalIncicator) &&
    !isUndefined(mValue) &&
    isUndefined(value?.extraProperties?.canJump);

  // 获取guid
  const { run } = useRequest(getGuid, {
    manual: true,
    onSuccess: (res: any) => {
      const guId = res?.data;
      if (guId) history.push(urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId })));
    },
  });

  return (
    <IndicatorCellWrapper {...props} isShowTrace={isLink} isLinkArea={isLinkAreaIndicator} noPadding>
      <span
        onClick={() => {
          if (isLink) {
            if (isCalIncicator) {
              // 打开计算指标弹窗
              handleOpenModal?.(
                {
                  title: `${userProvidedColDef?.colId}_${indicName}_${unit}`,
                  regionCode: userProvidedColDef?.field,
                  indicName,
                  unit,
                  year: date,
                  pageCode: 'regionalEconomyCompareTool',
                  regionName: userProvidedColDef?.colId,
                },
                true,
              );
            } else {
              run({
                businessCodeInfo: [userProvidedColDef?.field, '3'],
                indexParam: {
                  indexId,
                  paramMap: { ...defaultParamMap, auditYear: [date] },
                },
              });
            }
          } else if (isLinkAreaIndicator) {
            history.push(
              urlJoin(
                dynamicLink(LINK_AREA_ECONOMY, {
                  code: value.extraProperties.regionCode,
                  key: 'regionEconomy',
                }),
              ),
            );
          }
        }}
      >
        {formatValue(mValue, data)}
      </span>
    </IndicatorCellWrapper>
  );
}

const IndicatorCellWrapper = styled(TableCell)<{
  isSowTrace?: boolean;
  isLinkArea?: boolean;
}>`
  ${({ isShowTrace }) =>
    isShowTrace &&
    css`
      & > span {
        color: #025cdc;
        cursor: pointer;
        text-decoration: underline;
      }
    `}

  ${({ isLinkArea }) =>
    isLinkArea &&
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
