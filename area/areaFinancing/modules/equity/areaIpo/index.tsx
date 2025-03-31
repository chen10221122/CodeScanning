import { getAreaIpoStatistic } from '@/pages/area/areaFinancing/api';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';
import CommonTemplate from '@/pages/area/areaFinancing/components/commonTemplate';
import useCommonScreen, { ExtraOptionType } from '@/pages/area/areaFinancing/hooks/useCommonScreen';
import { EquityYearsEnums, ExportTableEnum, ExportTableMap } from '@/pages/area/areaFinancing/types';

import useTableColumns from './useTableColumns';

const Content = () => {
  const columns = useTableColumns();
  const { screenConfig, handleMenuChange } = useCommonScreen({
    extra: { params: { type: EquityYearsEnums.AreaIpo }, type: ExtraOptionType.Area },
  });
  return (
    <CommonTemplate
      pageConfig={{
        exportInfo: ExportTableMap.get(ExportTableEnum.IPO),
        columns,
        screenConfig,
        handleMenuChange,
        apiName: getAreaIpoStatistic,
        defaultCondition: { sortKey: 'count1', sortRule: 'desc', statType: 'ipoType', regionLevel: '1' },
        headerFixConfig: { screenTop: 0, tableTop: 40 },
      }}
    />
  );
};
export default function AreaIpo() {
  return (
    <CommonLayout>
      <div style={{ flex: 1 }}>
        <Content />
      </div>
    </CommonLayout>
  );
}
