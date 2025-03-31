import { useCreation } from 'ahooks';
import { ColumnsType } from 'antd/es/table';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorColumn from '@pages/area/landTopic/modules/overview/modules/cardTable/hooks/useIndicatorColumn';

interface Props {
  indicator: SelectItem[];
  dateWidth: number;
  dataSource: any[];
  sortKey?: string;
  sortRule?: string;
}
const useColumns = ({ sortKey, sortRule, indicator, dateWidth, dataSource }: Props) => {
  const { indicatorColumns } = useIndicatorColumn({
    sortKey,
    sortRule,
    indicator,
  });

  const columns: ColumnsType<any> = useCreation(
    () => [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: dateWidth,
        align: 'center',
        fixed: 'left',
      },
      ...indicatorColumns,
    ],
    [indicatorColumns, dataSource],
  );

  return columns;
};

export default useColumns;
