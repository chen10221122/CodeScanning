import { useMemo, useState } from 'react';

import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@pages/area/areaFinancing/types';

import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';

import useTableColumns from './useTableColumns';

const Content = () => {
  const [plateColumns, entTypeColumns, industryColumns, restTableWidth, secondRestTableWidth] = useTableColumns();
  const { screenConfig, handleMenuChange, loaded } = useScreen({
    extra: { params: { type: EquityYearsEnums.AreaPlatform }, type: ExtraOptionType.Area },
  });
  const tabConfig = useMemo(
    () => [
      {
        tabName: '按板块',
        tabKey: '0',
        tabContent: (
          <CommonTemplate
            pageConfig={{
              scrollX: restTableWidth,
              exportInfo: ExportTableMap.get(ExportTableEnum.AreaPlatformPlate),
              columns: plateColumns,
              screenConfig,
              handleMenuChange,
              defaultCondition: loaded
                ? {
                    sortKey: 'totalCount',
                    sortRule: 'desc',
                    statType: 'ipoPlate',
                    regionLevel: '1',
                    year: '',
                    date: '',
                  }
                : null,
            }}
          />
        ),
      },
      {
        tabName: '按企业性质',
        tabKey: '1',
        tabContent: (
          <CommonTemplate
            pageConfig={{
              scrollX: secondRestTableWidth,
              exportInfo: ExportTableMap.get(ExportTableEnum.AreaPlatformEntType),
              columns: entTypeColumns,
              screenConfig,
              handleMenuChange,
              defaultCondition: {
                sortKey: 'totalCount',
                sortRule: 'desc',
                statType: 'entType',
                regionLevel: '1',
                year: '',
                date: '',
              },
            }}
          />
        ),
      },
      {
        tabName: '按产业',
        tabKey: '2',
        tabContent: (
          <CommonTemplate
            pageConfig={{
              scrollX: secondRestTableWidth,
              exportInfo: ExportTableMap.get(ExportTableEnum.AreaPlatformIndustry),
              columns: industryColumns,
              screenConfig,
              handleMenuChange,
              defaultCondition: {
                sortKey: 'totalCount',
                sortRule: 'desc',
                statType: 'industryType',
                regionLevel: '1',
                year: '',
                date: '',
              },
            }}
          />
        ),
      },
    ],
    [
      entTypeColumns,
      handleMenuChange,
      industryColumns,
      loaded,
      plateColumns,
      restTableWidth,
      screenConfig,
      secondRestTableWidth,
    ],
  );
  const [activeTab, setActiveTab] = useState('0');
  return <BlueTabWithLoading activeKey={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />;
};
export default function AreaPlatform() {
  return (
    <CommonLayout>
      <Content />
    </CommonLayout>
  );
}
