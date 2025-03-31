import { TableCellType } from '@/pages/area/areaCompareAdvance/types';

// import AreaDataCell from './AreaDataCell';
import CompareScopeDateCell from './CompareScopeDateCell';
import DollorBondCell from './DollorBondCell';
import IndicatorDataCell from './IndicatorDataCell';
import IndicatorDetailCell from './IndicatorDetailCell';
import ScopeDateCell from './ScopeDateCell';
import { TableCellProps } from './TableCell';
import TechnologyCell from './TechnologyCell';

export default function TableCell(props: TableCellProps) {
  switch (props.indexCellType) {
    // case TableCellType.Area:
    //   return <AreaDataCell {...props} />;
    case TableCellType.CompareArea:
      return <CompareScopeDateCell {...props} />;
    case TableCellType.AreaScope:
      return <ScopeDateCell {...props} />;
    case TableCellType.IndicatorDetail:
      return <IndicatorDetailCell {...props} />;
    case TableCellType.Technology:
      return <TechnologyCell {...props} />;
    case TableCellType.DollorBond:
      return <DollorBondCell {...props} />;
    default:
      return <IndicatorDataCell {...props} />;
  }
}
