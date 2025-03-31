import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { ScreenType } from '@/components/screen';
import { IFormatterCheckReturn, IFormatterMenus } from '@/pages/area/financialResources/module/common/type';

// useMenu 入参类型
export interface IMenuConfig {
  creditLimit: any[];
  rate: any[];
}

// 筛选处理
function formatterCheck(arr: any[], fartherKey: string): IFormatterCheckReturn[] {
  return arr.map((item: any) => {
    const { name, value } = item;
    return {
      name,
      oldName: name,
      value,
      key: fartherKey,
    };
  });
}

// 根据筛选接口返回的数据和不变的筛选参数生成筛选项
const useMenu = (menuConfig: IMenuConfig) => {
  const [menuOption, setOption] = useState<IFormatterMenus[] | any[]>([]);
  const formatterMenus = useMemoizedFn(({ creditLimit, rate }: IMenuConfig) => {
    const reportSelect = {
      title: '授信额度',
      formatTitle: (rows: any[]) => {
        return rows.map((item) => item.oldName).join(',');
      },
      option: {
        hasSelectAll: false,
        type: ScreenType.SINGLE,
        children: [...formatterCheck(creditLimit, 'creditLimit')],
      },
    };

    const rateSelect = {
      title: '主体评级',
      formatTitle: (rows: any[]) => {
        return rows.map((item) => item.oldName).join(',');
      },
      option: {
        hasSelectAll: false,
        type: ScreenType.MULTIPLE,
        cascade: true,
        children: [...formatterCheck(rate, 'rate')],
      },
    };

    return [reportSelect, rateSelect];
  });

  useEffect(() => {
    // 判断配置项数据是否为空
    const emptyFlag = Object.entries(menuConfig).every(([, value]) => isEmpty(value));
    if (!emptyFlag) {
      setOption(formatterMenus(menuConfig));
    }
  }, [menuConfig, formatterMenus]);

  return { menuOption };
};

export default useMenu;
