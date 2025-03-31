import { memo } from 'react';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';

import useChartOption from './useChartOption';

const LineBar = ({ yearData, eventData, amountData }: { yearData: any[]; eventData: any[]; amountData: any[] }) => {
  const option = useChartOption(yearData, eventData, amountData);
  return <Chart option={option} style={{ height: '194px' }} />;
};

export default memo(LineBar);
