import { useEffect, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';

import { ScreenType } from '@/components/screen';
import { IFormatterMenus } from '@/pages/area/financialResources/module/common/type';

import { filterConfig, filterKeyMap } from '../common/const';
import { IMenuConfig, PageFlag } from '../common/type';
import { formatterCheck } from '../common/utils';

// 根据筛选接口返回的数据和不变的筛选参数生成筛选项
const useMenu = (menuConfig: IMenuConfig, pageFlag: PageFlag) => {
  const [menuOption, setOption] = useState<IFormatterMenus[] | any[]>([]);
  const formatterMenus = useMemoizedFn((menuConfig: IMenuConfig) => {
    const config = filterConfig[pageFlag];
    const seleact = [];
    const moreData = [];
    // 处理筛选配置
    for (const { key, type } of config) {
      if (type !== ScreenType.MULTIPLE_TILING) {
        const select = {
          title: filterKeyMap[key],
          formatTitle: (rows: any[]) => {
            return rows.map((item) => item.oldName).join(',');
          },
          option: {
            hasSelectAll: false,
            type: type,
            cascade: true,
            children: [...formatterCheck(menuConfig[key], key)],
          },
        };
        seleact.push(select);
      } else {
        const data = {
          title: filterKeyMap[key],
          hasSelectAll: false,
          multiple: false,
          data: [{ name: '不限', value: '', unlimited: true, key }, ...formatterCheck(menuConfig[key], key, true)],
        };
        moreData.push(data);
      }
    }

    const moreSelect = {
      title: '更多',
      overlayClassName: 'screen-more-config',
      option: {
        type: ScreenType.MULTIPLE_TILING,
        children: [...moreData],
      },
    };

    return [...seleact, moreSelect];
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
