import { IndicatorCellType, PagePlatform, usePagePlatform } from '@dataView/provider';

import AreaDataCell from './AreaDataCell';
import BondIssuerDataCell from './BondIssuerDataCell';
import NormalCell from './NormalCell';
import { TableCellProps } from './TableCell';

export default function TableCell(props: TableCellProps) {
  const pagePlatform = usePagePlatform();

  switch (props.indexCellType) {
    case IndicatorCellType.Area:
      return <AreaDataCell {...props} />;
    case IndicatorCellType.Issuer:
      return <BondIssuerDataCell {...props} />;
    default: {
      switch (pagePlatform) {
        case PagePlatform.Area:
          return <AreaDataCell {...props} />;
        case PagePlatform.Issuer:
          return <BondIssuerDataCell {...props} />;
        default:
          return <NormalCell {...props} />;
      }
    }
  }
}
