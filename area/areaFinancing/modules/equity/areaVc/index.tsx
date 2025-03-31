import { useState } from 'react';

import { getAreaVcStatistic } from '@/pages/area/areaFinancing/api';
import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useCommonScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';
import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@/pages/area/areaFinancing/types';

import useTableColumns from './useTableColumns';

const Content = () => {
  const { columns, restTableWidth } = useTableColumns();
  const { screenConfig, handleMenuChange, year } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockA }, type: ExtraOptionType.Year },
  });
  const { screenConfig: screenConfigHistory, handleMenuChange: handleMenuChangeHistory } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockA }, type: ExtraOptionType.Area },
  });

  const tabConfig = [
    {
      tabName: '年度',
      tabKey: '0',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            scrollX: restTableWidth,
            exportInfo: ExportTableMap.get(ExportTableEnum.Vc),
            columns,
            screenConfig,
            handleMenuChange,
            apiName: getAreaVcStatistic,
            defaultCondition: year ? { sortKey: 'amount', sortRule: 'desc', regionLevel: '1', year, date: '' } : null,
          }}
        />
      ),
    },
    {
      tabName: '历史累计',
      tabKey: '1',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            scrollX: restTableWidth,
            exportInfo: ExportTableMap.get(ExportTableEnum.Vc),
            extraMenu: true,
            columns,
            screenConfig: screenConfigHistory,
            handleMenuChange: handleMenuChangeHistory,
            apiName: getAreaVcStatistic,
            defaultCondition: { sortKey: 'amount', sortRule: 'desc', regionLevel: '1', year: '', date: '' },
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return <BlueTabWithLoading activeKey={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />;
};
export default function AreaVc() {
  return (
    <CommonLayout>
      <Content />
    </CommonLayout>
  );
}
