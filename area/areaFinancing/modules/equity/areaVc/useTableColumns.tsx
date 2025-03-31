import { useMemo } from 'react';

import { useConditionCtx } from '@pages/area/areaFinancing/components/commonLayout/context';
import IconIntro from '@pages/area/areaFinancing/components/iconIntro';
import useCommonColumn, { RenderMode } from '@pages/area/areaFinancing/hooks/useCommonColumn';
import { DetailModalTypeEnum } from '@pages/area/areaFinancing/types';

import { calcPercentage } from '../../../utils';

export default function useTableColumns() {
  const {
    state: { condition },
  } = useConditionCtx();
  // 设计稿表格宽度，用于计算列宽和scrollX
  const restTableWidth = useMemo(() => {
    return condition?.regionLevel === '3' ? 1130 : 1036;
  }, [condition?.regionLevel]);

  const areaColumn = useMemo(() => {
    return {
      title: '地区',
      dataIndex: 'regionName',
      fixed: 'left',
      width: condition?.regionLevel === '3' ? calcPercentage(218, restTableWidth) : calcPercentage(128, restTableWidth),
      renderMode: RenderMode.Area,
    };
  }, [condition?.regionLevel, restTableWidth]);

  const { makeColumns, indexColumn } = useCommonColumn();
  const columns = makeColumns([
    { ...indexColumn, fixed: 'left' },
    areaColumn,
    {
      title: '新增创投事件',
      dataIndex: 'event_num',
      align: 'right',
      renderMode: RenderMode.ModalText,
      modalType: DetailModalTypeEnum.Vc,
      // width: '10.8%',
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>创投融资金额 (亿元)</div>
          <IconIntro content={'融资金额以外币披露时，根据融资日的汇率中间价换算为人民币汇总。'} />
        </div>
      ),
      dataIndex: 'amount',
      align: 'right',
      width: calcPercentage(132, restTableWidth),
    },
    {
      title: '获投企业数量',
      dataIndex: 'ITCode2_num',
      align: 'right',
      width: calcPercentage(112, restTableWidth),
      renderMode: RenderMode.NumberText,
      toFixed: 0,
    },
    {
      title: '投资机构数量',
      children: [
        {
          title: '合计',
          dataIndex: `investITCode2_num`,
          width: calcPercentage(66, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
        {
          title: '头部机构',
          dataIndex: `investTopITCode2_num`,
          width: calcPercentage(88, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
      ],
    },
    {
      title: '各轮次企业数量',
      children: [
        {
          title: '种子轮/天使轮',
          dataIndex: `ITCode2_1_num`,
          width: calcPercentage(120, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
        {
          title: 'A轮',
          dataIndex: `ITCode2_2_num`,
          width: calcPercentage(66, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
        {
          title: 'B轮',
          dataIndex: `ITCode2_3_num`,
          width: calcPercentage(66, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
        {
          title: 'C轮及以后',
          dataIndex: `ITCode2_4_num`,
          width: calcPercentage(98, restTableWidth),
          renderMode: RenderMode.NumberText,
          toFixed: 0,
        },
      ],
    },
  ]);
  return {
    restTableWidth,
    columns,
  };
}
