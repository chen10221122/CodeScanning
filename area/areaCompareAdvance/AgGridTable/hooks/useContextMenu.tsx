import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ColDef, RowNode } from 'ag-grid-community';
import { useMemoizedFn } from 'ahooks';
import { Modal, message } from 'antd';
import { slice } from 'lodash';

import { Image } from '@/components/layout';
import { LINK_AREA_ECONOMY } from '@/configs/routerMap';
import { FADE_DELAY, FLASH_DELAY } from '@/pages/area/areaCompareAdvance/config';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import useAreaOperate from '@/pages/area/areaCompareAdvance/hooks/useAreaOperate';
import { RowConfig } from '@/pages/area/areaCompareAdvance/types';
import { dynamicLink } from '@/utils/router';
import { copyToClipBoard } from '@/utils/share';
import { urlJoin } from '@/utils/url';

export default function useContextMenu() {
  const {
    state: { columnDefs, grid, areaSelectCode },
    update,
  } = useCtx();
  // 锁定重新构建colu
  const [contextParam, setContextParam] = useState<any>();
  const [visible, updateContextVisible] = useState(false);

  const history = useHistory();

  const { removeColumn } = useAreaOperate();

  /** 表格点击事件 */
  const onBodyContextMenu = useMemoizedFn((e, params) => {
    setContextParam({ target: 'body', ...params });

    e.stopPropagation();
    e.preventDefault();
    updateContextVisible(false);
    Promise.resolve().then(() => {
      updateContextVisible(true);
    });
  });

  /** 表头点击事件 */
  const onHeaderContextMenu = useMemoizedFn((e, params) => {
    setContextParam({ target: 'header', ...params });
    e.stopPropagation();
    e.preventDefault();
    updateContextVisible(false);
    Promise.resolve().then(() => {
      updateContextVisible(true);
    });
  });

  const onReplaceArea = useMemoizedFn((params) => {
    const {
      column: {
        userProvidedColDef: { field },
      },
    } = params;

    if (field) {
      const replaceAreaIndex = areaSelectCode.split(',').findIndex((item: string) => item === field);
      update((d) => {
        d.selectAreaModalVisible = true;
        d.areaChangeIndex = replaceAreaIndex;
      });
    }
  });

  /** 查看地区 */
  const onViewRow = useMemoizedFn((rowInfo: RowConfig) => {
    if (rowInfo) {
      history.push(
        urlJoin(
          dynamicLink(LINK_AREA_ECONOMY, { code: rowInfo.column.userProvidedColDef.field || '', key: 'regionEconomy' }),
        ),
      );
    }
  });

  /** 删除整列 */
  const onRemoveColumn = useMemoizedFn(() => {
    const colDef = contextParam.column.getColDef() as ColDef | undefined;
    if (colDef && colDef.colId && colDef.field) {
      const filterColumn = columnDefs.filter((l) => l.colId !== colDef.colId);
      removeColumn(colDef.field);
      update((d) => {
        d.columnDefs = filterColumn;
        d.areaSelectCode = slice(filterColumn, 1, -1)
          .map((o) => o.field)
          .toString();

        d.selectedAreaDataWithSelfLevel = d.selectedAreaDataWithSelfLevel.filter(
          (v: any) => v.regionCode !== colDef.field,
        );
      });
    }
  });

  /** 删除所有列 */
  const onRemoveColumnAll = useMemoizedFn(() => {
    if (grid) {
      Modal.confirm({
        title: '确认清空地区吗',
        closable: true,
        icon: (
          <Image
            src={require('@/assets/images/modal/alarm.png')}
            src1x={require('@/assets/images/modal/alarm.png')}
            src2x={require('@/assets/images/modal/alarm@2x.png')}
          ></Image>
        ),
        closeIcon: (
          <Image
            src={require('@/assets/images/blank/close.png')}
            src1x={require('@/assets/images/blank/close.png')}
            src2x={require('@/assets/images/blank/close@2x.png')}
          />
        ),
        width: 438,
        content: <span>清空后无法恢复，是否确定清空地区？</span>,
        className: 'yjt-confirm-dialog',
        cancelText: '确定',
        okText: '再想想',
        centered: true,
        onCancel() {
          update((d) => {
            d.areaSelectCode = '';
            d.selectedAreaDataWithSelfLevel = [];
          });
        },
      });
    }
  });

  const onCopy = useMemoizedFn((option: { row?: RowNode<RowConfig>; cell?: boolean } = { cell: true }) => {
    const { row, cell } = option;
    const { target, data } = contextParam;
    if (cell) {
      copyToClipBoard(target === 'header' ? contextParam.displayName : contextParam.value.mValue, () => {
        if (data) {
          contextParam.api.flashCells({
            rowNodes: [contextParam.node],
            columns: [contextParam.column.colId],
            flashDelay: FLASH_DELAY,
            fadeDelay: FADE_DELAY,
          });
        }
        message.success('文字已复制到剪切板');
      });
    } else if (row) {
      const values = areaSelectCode
        .split(',')
        .map((code: string) => data[code].mValue || '-')
        .join('\t');

      copyToClipBoard(values, () => {
        if (contextParam && contextParam.api) {
          contextParam.api.flashCells({ rowNodes: [row] });
        }
        message.success('内容已复制到剪切板');
      });
    }
  });

  return {
    visible,
    updateContextVisible,
    onHeaderContextMenu,
    onBodyContextMenu,
    contextParam,
    onViewRow,
    onRemoveColumn,
    onRemoveColumnAll,
    onCopy,
    onReplaceArea,
  };
}
