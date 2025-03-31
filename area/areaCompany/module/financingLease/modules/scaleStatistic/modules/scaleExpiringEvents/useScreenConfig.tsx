import { useMemo } from 'react';

import { ScreenType } from '@/components/screen';
import { defaultValueDateBySeason } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/screen';
import { ChangeFilter } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/config';
import { useSelector } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/context';
import useGetAllScreenOption from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/hooks/useGetAllScreenOption';

const dateMap = ['', 'month', 'quarter', 'year'];

export const useScreenConfig = ({ ctrl }: { ctrl: string }) => {
  const { screenAllData, loading } = useGetAllScreenOption();
  const lesseeClassifyActive = useSelector((state) => state.activeAll[ChangeFilter.LESSEE_TYPE]);
  const industryActive = useSelector((state) => state.activeAll[ChangeFilter.INDUSTRY]);

  const screenData = useMemo(
    () => [
      {
        label: '登记到期日',
        key: 'statisticTime',
        changeFlag: false,
        values: [ctrl],
        style: { marginRight: '6px' },
        itemConfig: [
          {
            /** 此处配置完全兼容公共组件screen */
            title: '全部',
            formatTitle: (rows: any) => rows.map((d: Record<string, any>) => d.name).toString(),
            option: {
              type: ScreenType.SINGLE,
              hasSelectAll: true,
              cancelable: false,
              ellipsis: 10,
              children: [
                { name: '按月', value: '1', filed: 'statisticTime' },
                { name: '按季', value: '2', filed: 'statisticTime' },
                { name: '按年', value: '3', filed: 'statisticTime' },
              ],
            },
          },
        ],
      },
      {
        label: '',
        key: 'time',
        domKey: JSON.stringify(ctrl),
        type: 'rangePick',
        defaultValueDate: defaultValueDateBySeason.get(ctrl)![1],
        _type: dateMap[Number(ctrl)],
      },
      {
        label: '行业',
        key: ChangeFilter.INDUSTRY,
        changeFlag: industryActive,
        style: { marginRight: '16px' },
        itemConfig: screenAllData?.industryGB,
      },
      {
        label: '承租人',
        key: ChangeFilter.LESSEE_TYPE,
        changeFlag: lesseeClassifyActive, // 控制是否选中状态，选中后边框会有蓝色高亮
        style: { marginRight: '16px' },

        itemConfig: [
          {
            /** 此处配置完全兼容公共组件screen */
            title: '全部',
            option: {
              type: ScreenType.MULTIPLE,
              children: screenAllData?.lesseeType?.children || [],
            },
          },
        ],
      },
    ],
    [screenAllData, lesseeClassifyActive, industryActive, ctrl],
  );

  return {
    screenData,
    loading,
  };
};
