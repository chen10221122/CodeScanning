import { useMemo } from 'react';

import {
  newThirdCountColumn,
  stockADistributionColumn,
  newThirdAddColumn,
  stockAIpoColumn,
  stockARefinanceColumn,
  vcColumn,
} from './tableColumns';
import { DetailModalTypeEnum } from './type';
import useCommonColumn from './useCommonColumn';

export interface ModalProps {
  columnType?: DetailModalTypeEnum;
  condition: any;
  page: number;
}

const useModalColumns = ({ columnType = DetailModalTypeEnum.StockAIpo, condition, page }: ModalProps) => {
  const sortInfo = useMemo(() => {
    return { sortKey: condition.sortKey, sortRule: condition.sortRule };
  }, [condition.sortKey, condition.sortRule]);
  const { makeColumns } = useCommonColumn({ sortInfo, page, keyword: condition.keyWord });

  const columnMap = new Map([
    [DetailModalTypeEnum.StockADistribution, makeColumns(stockADistributionColumn)],
    [DetailModalTypeEnum.NewThirdCount, makeColumns(newThirdCountColumn)],
    [DetailModalTypeEnum.NewThirdAdd, makeColumns(newThirdAddColumn)],
    [DetailModalTypeEnum.StockAIpo, makeColumns(stockAIpoColumn)],
    [DetailModalTypeEnum.StockARefinance, makeColumns(stockARefinanceColumn)],
    [DetailModalTypeEnum.VC, makeColumns(vcColumn)],
  ]);

  return columnMap.get(columnType) || [];
};

export default useModalColumns;
