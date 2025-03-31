import { memo } from 'react';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';

import useChartOption from './useChartOption';

const Bar = ({
  yearData,
  aShareIPOData,
  aShareRefinanceData,
  newThreeIncrease,
  financeCount,
}: {
  yearData: any[];
  aShareIPOData: any[];
  aShareRefinanceData: any[];
  newThreeIncrease: any[];
  financeCount: any[];
}) => {
  const option = useChartOption(yearData, aShareIPOData, aShareRefinanceData, newThreeIncrease, financeCount);
  return <Chart option={option} style={{ height: '169px' }} />;
};

export default memo(Bar);
