import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { ScreenType } from '@/components/screen';
import { IFormatterCheckReturn, IFormatterMenus } from '@/pages/area/financialResources/module/common/type';

// useMenu 入参类型
export interface IMenuConfig {
  year: any[];
  reportDateType: any[];
  bankType: any[];
}

// 筛选处理
function formatterCheck(arr: any[], fartherKey: string): IFormatterCheckReturn[] {
  return arr.map((item: any) => {
    const { name, key } = item;
    return {
      name: name,
      oldName: name,
      value: `${key}`,
      key: fartherKey,
    };
  });
}

// 根据筛选接口返回的数据和不变的筛选参数生成筛选项
const useMenu = (menuConfig: IMenuConfig, lastYear: string) => {
  const [menuOption, setOption] = useState<IFormatterMenus[] | any[]>([]);
  const formatterMenus = useMemoizedFn(({ year, reportDateType, bankType }: IMenuConfig, lastYear: string) => {
    // TODO 默认值是多少
    const yearSelect = {
      title: '年份',
      option: {
        hasSelectAll: false,
        type: ScreenType.SINGLE,
        default: lastYear,
        cancelable: false,
        children: [...formatterCheck(year, 'year')],
      },
    };

    const reportSelect = {
      title: '报告',
      option: {
        hasSelectAll: false,
        type: ScreenType.SINGLE,
        default: '4',
        cancelable: false,
        children: [...formatterCheck(reportDateType, 'reportDateType')],
      },
    };

    const bankTypeSelect = {
      title: '银行类型',
      formatTitle: (rows: any[]) => {
        return rows.map((item) => item.oldName).join(',');
      },
      option: {
        hasSelectAll: false,
        type: ScreenType.MULTIPLE,
        cascade: true,
        children: [...formatterCheck(bankType, 'bankType')],
      },
    };

    return [yearSelect, reportSelect, bankTypeSelect];
  });

  useEffect(() => {
    // 判断配置项数据是否为空
    const emptyFlag = Object.entries(menuConfig).every(([, value]) => isEmpty(value));
    if (!emptyFlag && lastYear) {
      setOption(formatterMenus(menuConfig, lastYear));
    }
  }, [menuConfig, formatterMenus, lastYear]);

  return { menuOption };
};

export default useMenu;
