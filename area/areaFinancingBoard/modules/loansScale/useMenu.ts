import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { ScreenType } from '@/components/screen';

// useMenu 入参类型
export interface IMenuConfig {
  reportPeriod: any[];
}

export interface IFormatterCheckReturn {
  name: string;
  value: string;
  key: string;
}

export interface IFormatterMenus {
  title: string;
  formatTitle: (rows: any[]) => string;
  option: {
    hasSelectAll: boolean;
    type: ScreenType;
    cascade: boolean;
    children: IFormatterCheckReturn[];
  };
}

// 筛选处理
function formatterCheck(arr: any[], fartherKey: string): IFormatterCheckReturn[] {
  return arr.map((item: any) => {
    const { name, value } = item;
    return {
      name: name,
      oldName: name,
      value,
      key: fartherKey,
    };
  });
}

// 根据筛选接口返回的数据和不变的筛选参数生成筛选项
const useMenu = (menuConfig: IMenuConfig, lastYear: string) => {
  const [menuOption, setOption] = useState<IFormatterMenus[] | any[]>([]);
  const formatterMenus = useMemoizedFn(({ reportPeriod }: IMenuConfig, lastYear: string) => {
    const reportSelect = {
      title: '报告',
      option: {
        hasSelectAll: false,
        type: ScreenType.SINGLE,
        default: lastYear,
        cancelable: false,
        children: [...formatterCheck(reportPeriod, 'reportPeriod')],
      },
    };

    return [reportSelect];
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
