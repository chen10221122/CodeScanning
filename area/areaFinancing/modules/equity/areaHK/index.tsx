import { useState } from 'react';

import { getAreaHkStatistic } from '@/pages/area/areaFinancing/api';
import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useCommonScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';
import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@/pages/area/areaFinancing/types';

import useTableColumns from './useTableColumns';

const Content = () => {
  const { columns, restTableWidth } = useTableColumns();
  const { screenConfig, handleMenuChange, year } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockHK }, type: ExtraOptionType.Year },
  });
  const { screenConfig: screenConfigHistory, handleMenuChange: handleMenuChangeHistory } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaStockHK }, type: ExtraOptionType.Area },
  });
  const tabConfig = [
    {
      tabName: '年度',
      tabKey: '0',
      tabContent: (
        <CommonTemplate
          pageConfig={{
            scrollX: restTableWidth,
            exportInfo: ExportTableMap.get(ExportTableEnum.HK),
            tableConf: {
              remark:
                'H股是指在内地注册、在香港交易所发行上市的股票。融资金额以外币披露时，根据融资日的汇率中间价换算为人民币汇总。',
            },
            columns,
            screenConfig,
            handleMenuChange,
            apiName: getAreaHkStatistic,
            defaultCondition: year
              ? { sortKey: 'totalAmount', sortRule: 'desc', regionLevel: '1', year, date: '' }
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
            scrollX: restTableWidth,
            extraMenu: true,
            exportInfo: ExportTableMap.get(ExportTableEnum.HK),
            columns,
            screenConfig: screenConfigHistory,
            handleMenuChange: handleMenuChangeHistory,
            apiName: getAreaHkStatistic,
            tableConf: {
              remark:
                'H股是指在内地注册、在香港交易所发行上市的股票。融资金额以外币披露时，根据融资日的汇率中间价换算为人民币汇总。',
            },
            defaultCondition: { sortKey: 'totalAmount', sortRule: 'desc', regionLevel: '1', year: '', date: '' },
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return <BlueTabWithLoading activeKey={activeTab} setActiveTab={setActiveTab} tabConfig={tabConfig} />;
};
export default function AreaHk() {
  return (
    <CommonLayout>
      <Content />
    </CommonLayout>
  );
}
