import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { useImmer } from '@/utils/hooks';

interface SelectRowsProp {
  selectedRowKeys: Array<any>;
  selectedRows: Array<any>;
}

export const useTableSelect = () => {
  const [hasSelect, setHasSelect] = useState(false);
  const [selectRows, updateSelectRows] = useImmer<SelectRowsProp>({
    selectedRowKeys: [],
    selectedRows: [],
  });

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setHasSelect(!!selectedRowKeys.length);
      updateSelectRows((d: SelectRowsProp) => {
        d.selectedRowKeys = selectedRowKeys;
        d.selectedRows = selectedRows;
      });
    },
    selectedRowKeys: selectRows.selectedRowKeys,
    columnWidth: '35px',
  };

  // 清除列表选中项
  const clearSelect = useMemoizedFn(() => {
    rowSelection.onChange([], []);
  });

  return {
    selectRows,
    rowSelection,
    hasSelect,
    clearSelect,
  };
};
