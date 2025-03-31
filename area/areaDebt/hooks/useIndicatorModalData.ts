import { useEffect, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { getTblData } from '@/apis/area/areaDebt';
import { nameValueObj } from '@/pages/area/areaDebt/components/filter/indicator';
import useRequest from '@/utils/ahooks/useRequest';
import { shortId } from '@/utils/share';

import { useCtx } from '../getContext';
const pageSize = 50;

// 获取表头指标弹窗数据
const useIndicatorModalData = () => {
  // 指标弹窗翻页功能
  const [currentIndictorPage, setCurrentIndictorPage] = useState(1);
  const [total, setTotal] = useState(0);
  const {
    state: { condition, indicator, realIndicator, customIndicator },
    update,
  } = useCtx();

  // 处理数据
  const handleTblData = useMemoizedFn((tblData: any[]) => {
    let newTblData = [];
    if (condition) {
      // handleTblHead();
      newTblData = tblData.map((item) => {
        const obj = item?.indicatorList?.reduce((res: any, d: any) => {
          const indicName = d.indicName;
          const indicatorIndexId = d.indexId;
          let data = {};
          // GDP:工业 和 工业增加值 的接口入参分别是工业增加值1、工业增加值2， 但取值为“工业增加值”，
          // 此处是对这两个数据取值逻辑的处理
          if (indicName === '工业增加值') {
            data = {
              'GDP:工业': Number(d.mValue) ?? '',
              工业增加值: Number(d.mValue) ?? '',
              'GDP:工业_guId': d.guid || '',
              工业增加值_guId: d.guid || '',
              'GDP:工业_posId': d.posId || '',
              工业增加值_posId: d.posId || '',
              'GDP:工业_isMissVCA': d.isMissVCA || '',
              工业增加值_isMissVCA: d.isMissVCA || '',
              'GDP:工业_caliberDesc': d.caliberDesc || '',
              工业增加值_caliberDesc: d.caliberDesc || '',
            };
          } else if (d.custom) {
            data = {
              [indicatorIndexId]: d.mValue ? d.mValue : null,
            };
          } else {
            data = {
              [nameValueObj[indicName]]: Number(d.mValue) ?? '',
              [`${nameValueObj[indicName]}_guId`]: d.guid || '',
              [`${nameValueObj[indicName]}_posId`]: d.posId || '',
              [`${nameValueObj[indicName]}_isMissVCA`]: d.isMissVCA || '',
              [`${nameValueObj[indicName]}_caliberDesc`]: d.caliberDesc || '',
            };
          }
          return {
            ...res,
            ...data,
          };
        }, {});

        return { ...item, ...obj, year: condition?.endDate };
      });
      const shortNameObj: { [a: string]: string } = {
        '150000': '内蒙古',
        '640000': '宁夏',
        '540000': '西藏',
        '650000': '新疆',
        '450000': '广西',
      };

      newTblData.forEach((o) => {
        if (shortNameObj[o.regionCode4]) o.regionName = shortNameObj[o.regionCode4];
      });
    }
    return newTblData;
  });

  const sortParams = useMemo(() => {
    let sort = {};
    if (customIndicator) {
      sort = {
        indexSort: `${customIndicator.indexId}:desc`,
        indexId: customIndicator.indexId,
        indicName: undefined,
      };
    } else {
      sort = {
        sort: `${realIndicator}:desc`,
        indicName: realIndicator,
      };
    }
    return sort;
  }, [customIndicator, realIndicator]);

  const {
    run: getData,
    data,
    loading,
    error,
  } = useRequest(
    () =>
      getTblData({
        ...condition,
        from: (currentIndictorPage - 1) * pageSize,
        size: pageSize,
        pageCode: 'regionalEconomyAll',
        sort: '',
        ...sortParams,
      }),
    {
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
        let data = handleTblData(res.data?.data?.map((item: any) => ({ ...item, downFileId: shortId() })));
        setTotal(res?.data?.total || 0);
        return data;
      },
      onError: (err: any) => {
        if (err?.info?.includes('今日查询次数已达上限')) {
          update((o) => {
            o.requestNum = `今日已查看10/10次`;
          });
        }
      },
    },
  );

  useEffect(() => {
    !!indicator && getData();
  }, [condition, currentIndictorPage, getData, indicator]);

  return {
    currentIndictorPage,
    indicatorData: data,
    indicatorLoading: loading,
    indicatorError: error,
    indicatorDataTotal: total,
    onIndicatorDialogPageChange: setCurrentIndictorPage,
  };
};

export default useIndicatorModalData;
