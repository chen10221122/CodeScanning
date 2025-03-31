import { useEffect } from 'react';

import { isEmpty } from 'lodash';

import { getTblData } from '@/apis/area/areaDebt';
import { getAllCustomIndicators } from '@/components/transferSelectNew/modules/customModal/api';
import { CustomIndicatorDataResType } from '@/components/transferSelectNew/modules/customModal/type';
import { conditionType, TblEl, tblDataItem, useCtx } from '@/pages/area/areaDebt/getContext';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { nameValueObj, unitObj, indicatorList } from '../filter/indicator';

interface Props {
  condition: conditionType;
  rowData: TblEl;
}

const DefaultIndicator = {
  unit: '',
  mValue: '',
  guid: '',
  posId: '',
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
  const {
    loading: customTreeLoading,
    data: allCustomIndicators,
    run: getAllCustomIndicatorsInTable,
  } = useRequest(getAllCustomIndicators, {
    manual: true,
    formatResult: (res: CustomIndicatorDataResType) => {
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
      };
      run(param);
      !isEmpty(condition.indexId) && getAllCustomIndicatorsInTable();
    }
  }, [condition, rowData, run, getAllCustomIndicatorsInTable]);

  useEffect(() => {
    if (data && data.data) {
      let result: { [a: number]: { [b: string]: any } } = {};
      const startYear = data.data[0].endDate;
      let years: number[] = Array.from({ length: 5 }).map((_, i) => startYear - i);
      data.data.forEach((o: tblDataItem) => {
        const { endDate } = o;
        if (!result[endDate]) result[endDate] = {};
        let obj = result[endDate];
        o?.indicatorList?.forEach((item) => {
          const { displayCUnit, mValue, guid, posId, indicName, isMissVCA, indexId, custom, caliberDesc } = item;
          // GDP:工业 和 工业增加值 的接口入参分别是工业增加值1、工业增加值2， 但取值为“工业增加值”，
          // 此处是对这两个数据取值逻辑的处理
          if (indicName === '工业增加值') {
            obj['工业增加值1'] = { displayCUnit, mValue, guid, posId, isMissVCA, caliberDesc };
            obj['工业增加值2'] = { displayCUnit, mValue, guid, posId, isMissVCA, caliberDesc };
          } else if (custom && indexId) {
            obj[indexId] = { displayCUnit, mValue, guid, posId, isMissVCA, caliberDesc };
          } else obj[indicName] = { displayCUnit, mValue, guid, posId, isMissVCA, caliberDesc };
        });
      });
      let tableData: TblEl[] = [];
      let customTableData: TblEl[] = [];
      // 常用指标不需要显示在明细弹窗中---普通指标处理
      indicatorList.slice(1).forEach((o) => {
        let nameArr: string[] = o.children.map((o) => o?.value || '');
        let conditionInChild: string[] =
          condition?.indicName && !isEmpty(condition.indicName)
            ? condition?.indicName.filter((indicName: string) => nameArr.indexOf(indicName) !== -1)
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
              obj[`${year}_isMissVCA`] = o.isMissVCA;
              obj[`${year}_caliberDesc`] = o.caliberDesc;
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
      /**自定义指标数据处理 */
      if (
        !customTreeLoading &&
        allCustomIndicators &&
        !isEmpty(allCustomIndicators) &&
        condition.indexId &&
        !isEmpty(condition.indexId)
      ) {
        let conditionIndexInChild: any[] = [];
        allCustomIndicators.forEach((item: any) => {
          if (condition.indexId.includes(item.indexId)) {
            conditionIndexInChild.push(item);
          }
        });
        if (conditionIndexInChild.length) {
          conditionIndexInChild.sort((a, b) => allCustomIndicators.indexOf(a) - allCustomIndicators.indexOf(b));
          let titleObj: TblEl = {
            name: '自定义指标',
            value: '',
            isTitle: true,
            unit: '',
          };
          years.forEach((year) => {
            let o = DefaultIndicator;
            titleObj[year] = o.mValue;
            titleObj[year + '_guId'] = '';
            titleObj[year + '_posId'] = '';
          });
          let children: TblEl[] = [],
            isCategoryEmpty = true;
          conditionIndexInChild.forEach((customItem) => {
            let name = customItem.indexName,
              obj: TblEl = {
                unit: '',
                name,
                value: customItem.indexId,
              };

            let isEmpty = true;
            years.forEach((year) => {
              let o = result[year]?.[customItem.indexId] || DefaultIndicator;
              obj[year] = o.mValue;
              obj[year + '_guId'] = '';
              obj[year + '_posId'] = '';
              obj[`${year}_isMissVCA`] = '';
              obj[`${year}_caliberDesc`] = '';
              obj.custom = true;
              if (typeof o.mValue !== 'undefined' && o.mValue !== '') {
                isEmpty = false;
                isCategoryEmpty = false;
              }
            });
            obj.isEmpty = isEmpty;
            children.push(obj);
          });
          titleObj.isEmpty = isCategoryEmpty;
          customTableData.push(titleObj);
          customTableData.push(...children);
        }
      }
      setTblData(() => {
        return !isEmpty(customTableData) ? [...customTableData, ...tableData] : tableData;
      });
      setYears(() => years);
    }
  }, [setTblData, data, condition, setYears, allCustomIndicators, customTreeLoading]);
  return {
    loading: loading || customTreeLoading,
    tblData,
    years,
  };
}
