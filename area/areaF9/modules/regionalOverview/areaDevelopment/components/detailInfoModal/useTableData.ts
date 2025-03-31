import { useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getDevZoneContrastDetail } from '@/apis/area/areaDevelopment';
import { tableEl } from '@/pages/area/areaDevelopment/types';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { nameValueObj, unitObj, indicatorList } from '../filter/indicator';

const defaultIndicator = {
  unit: '',
  Mvalue: '',
  Guid: '',
};

export default function UseTableData({ rowData }: tableEl) {
  const [handledTableData, setHandledTableData] = useImmer<tableEl[]>([]);
  const [years, setYears] = useImmer<number[]>([]);
  const { loading, run } = useRequest(getDevZoneContrastDetail, {
    manual: true,
    formatResult: (res: any) => {
      /** 处理非vip用户查看次数的提示内容 */
      if (res.info?.includes('该模块为VIP模块')) {
        const info = res.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          // update((o) => {
          //   o.requestNum = `今日已查看${info[1]}`;
          // });
          // console.log(`今日已查看${info[1]}`);
        }
      }
      handleDetailData(res?.data);
      return res.data;
    },
  });

  useEffect(() => {
    rowData?.DEVZCode && run({ devzCode: rowData?.DEVZCode, specialType: 1 });
  }, [rowData, run]);

  /** 将接口返回的列信息结合指标处理成表格所需的行信息 */
  const handleDetailData = useMemoizedFn((data: any) => {
    if (data?.list) {
      let result: { [a: number]: { [b: string]: any } } = {};
      /** 取接口返回的第一个年份往下顺移四年 */
      const startYear = data.list[0].endDate;
      let years: number[] = Array.from({ length: 5 }).map((_, i) => (startYear as any) - i);

      data.list.forEach((indicatorItem: any) => {
        const { endDate } = indicatorItem;
        if (!result[endDate]) result[endDate] = {};
        let obj = result[endDate];
        indicatorItem?.itemList.forEach((item: any) => {
          const { DisplayCunit, Mvalue, Guid, IndicName2 } = item;
          obj[IndicName2] = { DisplayCunit, Mvalue, Guid };
        });
      });

      let tableData: tableEl[] = [];
      /** 去除指标列表的常用指标项、4817需求要求不展示指标最后一项基本信息 */
      let indicatorListPick = indicatorList.filter(
        (o) => o.title === '经济情况' || o.title === '园区财政' || o.title === '园区债务' || o.title === '产业特色',
      );

      indicatorListPick.forEach((ite) => {
        let nameArr: string[] = ite.children.map((o) => o?.title || '');
        let conditionInChild: string[] = Object.values(nameValueObj).filter(
          (indicName: string) => nameArr.indexOf(indicName) !== -1,
        );
        /** 需要去除重复的键名 */
        let conditionInChildNewSet = Array.from(new Set(conditionInChild));

        if (conditionInChildNewSet.length) {
          conditionInChildNewSet.sort((a, b) => nameArr.indexOf(a) - nameArr.indexOf(b));

          /** 表格标题列信息 */
          let titleObj: tableEl = {
            name: ite.title,
            value: '',
            isTitle: true,
            unit: '',
          };

          years.forEach((year) => {
            titleObj[year] = defaultIndicator.Mvalue;
            titleObj[year + '_guId'] = defaultIndicator.Guid;
          });

          let children: tableEl[] = [],
            isCategoryEmpty = true;

          conditionInChildNewSet.forEach((str) => {
            let name = nameValueObj[str],
              assembledObject: tableEl = {
                unit: unitObj[name], //表格左侧指标列的单位是从前端处理的指标信息得来的
                name,
                value: str,
              };
            let isEmpty = true;

            years.forEach((year) => {
              let middleIndicator = result[year]?.[str] || defaultIndicator;
              assembledObject[year] = middleIndicator.Mvalue || '-';
              assembledObject[year + '_guId'] = middleIndicator.Guid;

              if (typeof middleIndicator.Mvalue !== 'undefined' && middleIndicator.Mvalue !== '') {
                isEmpty = false;
                isCategoryEmpty = false;
              }
            });
            assembledObject.isEmpty = isEmpty;
            children.push(assembledObject);
          });

          titleObj.isEmpty = isCategoryEmpty;
          tableData.push(titleObj);
          tableData.push(...children);
        }
      });
      // console.log('tableDatatableData', tableData);
      setHandledTableData(() => tableData);
      setYears(() => years);
    }
  });

  return {
    loading,
    handledTableData,
    setHandledTableData,
    years,
  };
}
