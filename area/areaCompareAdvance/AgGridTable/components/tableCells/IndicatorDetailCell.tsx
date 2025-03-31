import { useMemo } from 'react';

import { useRequest } from 'ahooks';
import { message } from 'antd';
import styled from 'styled-components';

import { getCellTransformRequest } from '@dataView/api';
import { relativeMap } from '@dataView/DataView/SheetView/TableView/extras/area/const';

import { formatValue } from '@/pages/area/areaCompareAdvance/config';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { updateAuditYear } from '@/pages/area/areaCompareAdvance/utils';

import TableCell, { TableCellProps } from './TableCell';

// 用于显示指标的单元格
export default function IndicatorDetailCell({ children, ...props }: TableCellProps) {
  const {
    state: { date },
    update,
  } = useCtx();

  const modifedIndicatorParams = useMemo(() => updateAuditYear(props, [date]), [date, props]);
  const {
    data: { extraProperties, indexId, headName, defaultParamMap },
    column: { userProvidedColDef, colId },
    value,
  } = modifedIndicatorParams || {};

  const { runAsync: requestCellModalInfo } = useRequest(getCellTransformRequest, {
    manual: true,
    onError: (e: any) => {
      if (e.type === 'Timeout') {
        message.error({ content: '请求超时，请稍后再试', duration: 3 });
      } else {
        message.error({ content: e.info || '请求异常，请稍后再试', duration: 3 });
      }
    },
  });

  return (
    <IndicatorDetailCellWrapper {...props} noPadding>
      <span
        className="area-link"
        onClick={() => {
          const modalType = relativeMap[extraProperties?.type];

          if (modalType) {
            update((draft) => {
              draft.indicatorDetailParams = {
                type: modalType,
              };
            });

            requestCellModalInfo({
              businessCodeInfo: [userProvidedColDef?.field, '3'],
              indexParam: { indexId, paramMap: defaultParamMap },
            }).then(({ data }) => {
              update((draft) => {
                draft.indicatorDetailParams = {
                  params: data,
                  areaName: colId || '',
                  indicatorName: headName,
                  type: modalType,
                };
              });
            });
          }
        }}
      >
        {formatValue(value.mValue, props.data)}
      </span>
    </IndicatorDetailCellWrapper>
  );
}

const IndicatorDetailCellWrapper = styled(TableCell)`
  .area-link {
    color: #025cdc;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
