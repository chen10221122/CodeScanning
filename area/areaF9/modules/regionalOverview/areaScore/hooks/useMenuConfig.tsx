import { useMemo } from 'react';

import { Options, ScreenType } from '@dzh/screen';

export default function useMenuConfig(initYear: string) {
  const dataConfig: Options[] = useMemo(() => {
    if (initYear) {
      const currentYear = parseInt(initYear);
      // 计算近五年的年份
      const lastFiveYears: any[] = [];
      for (let i = 0; i < 5; i++) {
        let cur = (currentYear - i).toString();
        lastFiveYears.push({ name: cur, value: cur });
      }

      return [
        {
          formatTitle: (selectedRows: any) => {
            // console.log("selectedRows", selectedRows)
            if (selectedRows.length === 0) return initYear;
            return selectedRows[0].name;
          },
          title: '年份',
          option: {
            type: ScreenType.SINGLE,
            children: lastFiveYears,
            default: lastFiveYears[0],
          },
        },
      ];
    } else {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initYear]);

  return { dataConfig };
}
