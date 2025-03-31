import { useCallback, useMemo } from 'react';

import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import Tooltip from '@pages/area/landTopic/components/tooltip';

import { formatNumber } from '@/utils/format';

interface Props {
  indicator: SelectItem[];
  sortKey?: string;
  sortRule?: string;
}

const useIndicatorColumn = ({ sortKey, sortRule, indicator }: Props) => {
  const getSortOrder = useCallback(
    (dataIndex) => (dataIndex !== sortKey || !sortRule ? null : `${sortRule}end`) as any,
    [sortKey, sortRule],
  );

  /* @ts-ignore */
  const indicatorColumns: ColumnsType<any> = useMemo(() => {
    const getColumnItem = (indicatorItem: SelectItem) => {
      const { dataIndex, description, sorter, tableTitle, unit } = indicatorItem;
      return indicatorItem.children
        ? indicatorItem
        : {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Tooltip title={description} />
                  </span>
                ) : null}
              </>
            ),
            code: dataIndex,
            sortOrder: sorter ? getSortOrder(dataIndex) : undefined,
            features: { sortable: sorter },
            render: (text: any) => {
              const showText = text ? (unit ? formatNumber(text, text.includes('.') ? 2 : 0) : text) : '-';
              return (
                <span className="ellipsis2" title={showText === '-' ? showText : undefined}>
                  {showText}
                </span>
              );
            },
          };
    };
    const getColumns = (sourceData: SelectItem[]) => {
      const newTree = sourceData.map((item, i) => getColumnItem(item));
      /* 有children的递归处理 */
      /* @ts-ignore */
      newTree.forEach((item) => item?.children && (item.children = getColumns(item.children)));
      return newTree;
    };

    return getColumns(cloneDeep(indicator));
  }, [getSortOrder, indicator]);

  return { indicatorColumns, getSortOrder };
};

export default useIndicatorColumn;
