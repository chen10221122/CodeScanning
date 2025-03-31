import { useState } from 'react';

import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useCommonScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';
import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@/pages/area/areaFinancing/types';

import useTableColumns from './useTableColumns';

const Content = () => {
  const { columns, historyColumns, restTableWidth } = useTableColumns();
  const { screenConfig, handleMenuChange, year } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockA }, type: ExtraOptionType.Year },
  });
  const { screenConfig: historyScreenConfig, handleMenuChange: historyHandleMenuChange } = useCommonScreen({
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
            exportInfo: ExportTableMap.get(ExportTableEnum.AShare),
            columns,
            screenConfig,
            handleMenuChange,
            defaultCondition: year
              ? {
                  sortKey: 'totalFinanceAmount',
                  sortRule: 'desc',
                  statType: 'ipoType',
                  regionLevel: '1',
                  year,
                }
              : null,
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
            exportInfo: ExportTableMap.get(ExportTableEnum.AShareHistory),
            columns: historyColumns,
            screenConfig: historyScreenConfig,
            extraMenu: true,
            handleMenuChange: historyHandleMenuChange,
            defaultCondition: {
              sortKey: 'totalFinanceAmount',
              sortRule: 'desc',
              statType: 'ipoType',
              regionLevel: '1',
              year: '',
              date: '',
            },
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return <BlueTabWithLoading activeKey={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />;
};
export default function AreaStockA() {
  return (
    <CommonLayout>
      <Content />
    </CommonLayout>
  );
}
