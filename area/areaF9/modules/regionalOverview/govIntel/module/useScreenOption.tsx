import { useMemo, useState, useEffect } from 'react';

import { Options, ScreenType } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import { isEmpty, map, range } from 'lodash';

import { initJurisdictionsOption } from '@pages/area/areaCompany/utils/filter';
import { useSelector } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

import RangePicker from '@/components/antd/rangePicker';
import { getFiveYearPlan } from '@/pages/information/govIntel/api';
import useRequest from '@/utils/ahooks/useRequest';
import { setLocalStorageData, getLocalStorageData } from '@/utils/localstorageWithExpiretime';

const FIVE_YEAR_PLAN_INFO = 'area-five-year-plan-info';

const useScreenOption = ({ isGovWork }: { isGovWork: boolean }) => {
  const { regionCode } = useParams();
  const { areaTree } = useSelector((state) => ({
    areaTree: state?.areaTree || [],
  }));

  const [fiveYearInfo, setFiveYear] = useState({});

  const { runAsync: getFiveYearPlanData } = useRequest(getFiveYearPlan, {
    manual: true,
    onSuccess: ({ data }) => {
      if (!isEmpty(data)) {
        setFiveYear(data);
        setLocalStorageData({ key: FIVE_YEAR_PLAN_INFO, data });
      }
    },
  });

  /** 设置了请求缓存 */
  useEffect(() => {
    if (!isGovWork) {
      const cachedData = getLocalStorageData(FIVE_YEAR_PLAN_INFO)?.data;
      if (!isEmpty(cachedData)) setFiveYear(cachedData);
      else getFiveYearPlanData();
    }
  }, [isGovWork, setFiveYear, getFiveYearPlanData]);

  const disabledDate = useMemoizedFn((current) => {
    // 允许选择的日期范围是 2010 年到列表中出现的最新年份
    return current && (current.year() < 2010 || current.year() > 2025);
  });

  const dictionsOpt = useMemo(() => {
    let dictionsOpt = !isEmpty(areaTree)
      ? initJurisdictionsOption({ list: areaTree, code: regionCode, isNewAreaScreen: true })
      : undefined;
    // 如果区域下面没有下属辖区，清空选项
    dictionsOpt = dictionsOpt?.option!.children!.length ? dictionsOpt : undefined;
    return dictionsOpt as Options;
  }, [areaTree, regionCode]);

  const screenOptions: Options[] = useMemo(() => {
    //列表中年份会不定期更新，后续需要根据列表中的年份来手动更新
    const currentYear = 2025;
    const govYearOption = isGovWork
      ? /** 动态生成近五年的年份数据 */
        map(range(5), (n) => ({
          name: String(currentYear - n),
          value: String(currentYear - n),
          key: 'yearsNum',
        })).concat([
          {
            name: '时间范围',
            value: '',
            key: 'rangePicker',
            /** @ts-ignore */
            render: (wrapper) => (
              <RangePicker
                size="small"
                picker="year"
                separator="至"
                disabledDate={disabledDate}
                activePlaceHolder={['YYYY', 'YYYY']}
                getPopupContainer={() => wrapper.current || document.body}
              />
            ),
          },
        ])
      : Object.entries(fiveYearInfo).map(([name, value]) => ({
          name,
          value,
          key: 'period',
        }));

    return [
      {
        title: isGovWork ? '报告年份' : '规划期',
        option: {
          ellipsis: 30,
          type: ScreenType.SINGLE,
          children: govYearOption,
        },
      },
      dictionsOpt,
    ];
  }, [dictionsOpt, disabledDate, fiveYearInfo, isGovWork]);
  return { screenOptions };
};

export default useScreenOption;
