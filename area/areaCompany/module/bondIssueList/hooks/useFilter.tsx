import { useEffect, useState, useMemo } from 'react';

import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { find, concat } from 'lodash';

import RangePicker from '@/components/antd/rangePicker';
import { ScreenType, Options } from '@/components/screen';
import { getBondFilterData } from '@/pages/area/areaCompany/api/screenApi';
import { getOptionItem } from '@/pages/area/areaCompany/components/filterInfo/menuConf';
import { REGIONAL_PAGE, BondParamMap } from '@/pages/area/areaCompany/configs';
import { dateRange } from '@/pages/area/areaCompany/module/bondIssueList/constants';
import { shortId } from '@/utils/share';

const useFilter = (pageType: REGIONAL_PAGE) => {
  const screenKey = useMemo(() => shortId(), []);
  const [menuOption, setMenuOption] = useState<Options[]>([]);

  const { run, loading: screenLoading } = useRequest(getBondFilterData, {
    manual: true,
    onSuccess(res: any) {
      const { data } = res;
      // console.log('data==', data);
      if (data?.length) {
        /** 是否是非金融企业债券发行列表*/
        const isNonFinancial = pageType === REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE_LIST;
        /** 是否是金融企业债券发行列表*/
        const isFinancial = pageType === REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE_LIST;

        /** 是否是非金融企业债券发行列表筛选配置 */
        const baseOptions: { title: string; cascade?: boolean }[] = isNonFinancial
          ? [{ title: '债券类型' }, { title: '行业' }]
          : [{ title: '企业类型', cascade: true }];
        if(isNonFinancial || isFinancial) {
          baseOptions.push({ title: '存续状态' })
        }
        const moreOptions = isNonFinancial
          ? [
              { title: '发行期限' },
              { title: '是否含权' },
              { title: '是否城投' },
              { title: '企业性质' },
              { title: '主体评级' },
              { title: '债项评级' },
              { title: '上市市场' },
            ]
          : [
              { title: '发行期限' },
              { title: '是否含权' },
              { title: '主体评级' },
              { title: '债项评级' },
              { title: '上市市场' },
            ];

        /** 合并多个筛选 */
        const baseList = baseOptions.map(({ title, cascade }) => {
          const whichMultiple = cascade ? ScreenType.MULTIPLE_THIRD : ScreenType.MULTIPLE;
          const currentFilter = find(data, (item: Record<string, string>) => item.name === title);

          return {
            title,
            formatTitle: (row: Record<string, any>[]) => row.map((item) => item.name).toString(),
            option: {
              cascade,
              hideSearch: false,
              cancelable: title === '存续状态',
              hasSelectAll: currentFilter.hasSelectAll,
              type: currentFilter.multiple ? whichMultiple : ScreenType.SINGLE,
              children: getOptionItem(currentFilter.children, currentFilter.value),
            },
          };
        });
        /** 更多筛选 */
        const moreList = moreOptions.map(({ title }) => {
          const currentFilter = find(data, (item: Record<string, string>) => item.name === title);
          return {
            title,
            multiple: currentFilter.multiple,
            hasSelectAll: currentFilter.hasSelectAll,
            data: getOptionItem(currentFilter.children, currentFilter.value),
          };
        });
        setMenuOption([
          ...concat(
            {
              title: '发行日期',
              formatTitle: (select) => {
                if (select?.length) {
                  const { name, value } = select[0];
                  if (name === '自定义') {
                    const [start, end] = value;
                    return (
                      <span className="date-format-title">
                        {dayjs(start).format('YYYY-MM-DD')} 至 {dayjs(end).format('YYYY-MM-DD')}
                      </span>
                    );
                  }
                  return name;
                }
                return;
              },
              /** @ts-ignore */
              option: {
                type: ScreenType.SINGLE,
                children: [
                  { name: '不限', value: '', unlimited: true, key: 'changeDate' },
                  { name: '今天', value: dateRange.TODAY_RANGE, key: 'changeDate' },
                  { name: '明天', value: dateRange.TOMORROW_RANGE, key: 'changeDate' },
                  { name: '近一周', value: dateRange.WEEK_RANGE, key: 'changeDate' },
                  {
                    name: '自定义',
                    key: 'changeDate',
                    render: () => <RangePicker size="small" keepValidValue={true} disabledDate={() => false} />,
                  },
                ],
              },
            },
            baseList,
          ),
          {
            title: '更多筛选',
            option: {
              type: ScreenType.MULTIPLE_TILING,
              children: moreList,
            },
          },
        ]);
      }
    },
    onError() {
      setMenuOption([]);
    },
  });

  useEffect(() => {
    const params = BondParamMap.get(pageType);
    params && run({ ...params, tabType: '3' });
  }, [pageType, run]);

  return {
    screenLoading,
    screenKey,
    menuOption,
  };
};
export default useFilter;
