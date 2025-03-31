import { memo } from 'react';

import Chart from '@/pages/area/areaFinancingBoard/components/Chart';

import useChartOption from './useChartOption';

const Pie = ({ tableData }: { tableData: any[] }) => {
  const option = useChartOption(tableData);

  return <Chart option={option} />;
};

export default memo(Pie);
