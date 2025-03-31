import { useState } from 'react';

import { getAreaThirdBoardStatistic } from '@/pages/area/areaFinancing/api';
import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useCommonScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';
import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@/pages/area/areaFinancing/types';

import useTableColumns from './useTableColumns';

const Content = () => {
  const columns = useTableColumns();
  const { screenConfig, handleMenuChange, year } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockThird }, type: ExtraOptionType.Year },
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
            exportInfo: ExportTableMap.get(ExportTableEnum.ThirdBoard),
            columns,
            screenConfig,
            handleMenuChange,
            apiName: getAreaThirdBoardStatistic,
            defaultCondition: year ? { sortKey: 'count1', sortRule: 'desc', regionLevel: '1', year, date: '' } : null,
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
            exportInfo: ExportTableMap.get(ExportTableEnum.ThirdBoard),
            columns,
            extraMenu: true,
            screenConfig: screenConfigHistory,
            handleMenuChange: handleMenuChangeHistory,
            apiName: getAreaThirdBoardStatistic,
            defaultCondition: { sortKey: 'count1', sortRule: 'desc', regionLevel: '1', year: '', date: '' },
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return <BlueTabWithLoading activeKey={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />;
};
export default function AreaStockThird() {
  return (
    <CommonLayout>
      <Content />
    </CommonLayout>
  );
}
