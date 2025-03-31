import { useState } from 'react';

import { cloneDeep } from 'lodash';

import { selectItem } from '@/components/transferSelect/types';
import { getIndicatorConfig } from '@/pages/area/monthlyEconomy/api';
import useRequest from '@/utils/ahooks/useRequest';

export interface IDicatorConfig {
  title: string;
  key?: string;
  children: ItemConfig[];
}
export interface ItemConfig extends selectItem {
  /**筛选项名称 */
  title: string;
  /**筛选项值 */
  value?: string;
  /**筛选项对应的表格标题 */
  indicShowNameWithUnit?: string;
  key?: string;
  /**选中状态 */
  active?: boolean;
  /**悬浮框描述文字 */
  describe?: string;
}

export default () => {
  const [indicatorList, setIndicatorList] = useState<IDicatorConfig[]>([]);
  useRequest(getIndicatorConfig, {
    onSuccess: (data) => {
      let indicatorArr = cloneDeep(data) as IDicatorConfig[];
      let indicatorCfg: IDicatorConfig[] = [];
      if (data) {
        /**获取常用指标 */
        const commonIndicators = indicatorArr[0]?.children.map((item: any) => ({
          title: item.title,
          ignoreIndicator: true,
          key: `use_${item.title}`,
          associatedKey: [item.value],
        }));
        const commonIndicatorsTitles = commonIndicators.map((item: any) => item.title);
        indicatorArr.forEach((item: any) => {
          if (item.title === '常用指标') {
            item.children = commonIndicators;
          } else {
            item.children.forEach((el: any) => {
              el.key = el?.key || el.value;
              if (commonIndicatorsTitles.includes(el.title)) {
                el.active = true;
                el.associatedKey = [`use_${el.title}`];
              }
              delete el.children;
            });
          }
          indicatorCfg.push(item);
        });
      }
      setIndicatorList(() => indicatorCfg);
    },
  });
  return { indicatorList };
};
