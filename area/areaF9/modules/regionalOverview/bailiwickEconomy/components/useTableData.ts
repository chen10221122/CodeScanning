import { useEffect } from 'react';

import { isEmpty } from 'lodash';

import { getTblData } from '@/apis/area/areaDebt';
import { nameValueObj, unitObj, indicatorList } from '@/pages/area/areaDebt/components/filter/indicator';
import { conditionType, TblEl, tblDataItem, useCtx } from '@/pages/area/areaDebt/getContext';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

interface Props {
  condition: conditionType;
  rowData: TblEl;
}

const DefaultIndicator = {
  unit: '',
  mValue: '',
  guid: '',
  posId: '',
  isMissVCA: 0,
};

export default function UseTableData({ condition, rowData }: Props) {
  const { update } = useCtx();

  const { loading, data, run } = useRequest(getTblData, {
    manual: true,
    formatResult: (res: any) => {
      // 处理非vip用户查看次数的提示内容
      if (res.info?.includes('该模块为VIP模块')) {
        const info = res.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          update((o) => {
            o.requestNum = `今日已查看${info[1]}`;
          });
        }
      }
      // update((o) => {
      //   o.requestNum = res.info;
      // });
      return res.data;
    },
  });
  const [tblData, setTblData] = useImmer<TblEl[]>([]);
  const [years, setYears] = useImmer<number[]>([]);
  // const { state: { year }} = useCtx();

  useEffect(() => {
    if (condition && rowData && rowData.regionCode4) {
      const { regionCode4 } = rowData;
      const param = {
        ...condition,
        regionCode: regionCode4,
        endDate: '(*,*)',
        sort: 'endDate:desc',
        size: 5,
        indexId: '',
        indexSort: '',
      };
      run(param);
    }
  }, [condition, rowData, run]);

  useEffect(() => {
    if (data && data.data) {
      let result: { [a: number]: { [b: string]: any } } = {};
      const startYear = data.data[0].endDate;

      let years: number[] = [];
      if (startYear) {
        years = Array.from({ length: 5 }).map((_, i) => startYear - i);
      }

      data.data.forEach((o: tblDataItem) => {
        const { endDate } = o;
        if (!result[endDate]) result[endDate] = {};
        let obj = result[endDate];
        o?.indicatorList?.forEach((item) => {
          const { displayCUnit, mValue, guid, posId, indicName, isMissVCA } = item;
          // GDP:工业 和 工业增加值 的接口入参分别是工业增加值1、工业增加值2， 但取值为“工业增加值”，
          // 此处是对这两个数据取值逻辑的处理
          if (indicName === '工业增加值') {
            obj['工业增加值1'] = { displayCUnit, mValue, guid, posId, isMissVCA };
            obj['工业增加值2'] = { displayCUnit, mValue, guid, posId, isMissVCA };
          } else obj[indicName] = { displayCUnit, mValue, guid, posId, isMissVCA };
        });
      });
      let tableData: TblEl[] = [];

      // 常用指标不需要显示在明细弹窗中
      indicatorList.slice(1).forEach((o) => {
        let nameArr: string[] = o.children.map((o) => o?.value || '');
        let conditionInChild: string[] =
          condition?.indicName && !isEmpty(condition.indicName)
            ? condition.indicName.filter((indicName: string) => nameArr.indexOf(indicName) !== -1)
            : [];

        if (conditionInChild.length) {
          conditionInChild.sort((a, b) => nameArr.indexOf(a) - nameArr.indexOf(b));

          let titleObj: TblEl = {
            name: o.title,
            value: '',
            isTitle: true,
            unit: '',
          };

          years.forEach((year) => {
            let o = DefaultIndicator;
            titleObj[year] = o.mValue;
            titleObj[year + '_guId'] = o.guid;
            titleObj[year + '_posId'] = o.posId;
          });

          let children: TblEl[] = [],
            isCategoryEmpty = true;

          conditionInChild.forEach((str) => {
            let name = nameValueObj[str],
              obj: TblEl = {
                unit: unitObj[name],
                name,
                value: str,
              };

            let isEmpty = true;
            years.forEach((year) => {
              let o = result[year]?.[str] || DefaultIndicator;
              obj[year] = o.mValue;
              obj[year + '_guId'] = o.guid;
              obj[year + '_posId'] = o.posId;
              obj[year + '_isMissVCA'] = o.isMissVCA;

              if (typeof o.mValue !== 'undefined' && o.mValue !== '') {
                isEmpty = false;
                isCategoryEmpty = false;
              }
            });

            obj.isEmpty = isEmpty;

            children.push(obj);
          });

          titleObj.isEmpty = isCategoryEmpty;
          tableData.push(titleObj);
          tableData.push(...children);
        }
      });

      setTblData(() => tableData);

      setYears(() => years);
    }
  }, [setTblData, data, condition, setYears]);

  // useEffect(() => {
  //   if (data || error) {
  //     update((o) => {
  //       o.requestNum = res.info;
  //     });
  //   }
  // }, [data, error, update]);

  return {
    loading,
    tblData,
    years,
  };
}
