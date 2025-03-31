import { useEffect } from 'react';

import { useMemoizedFn, useRequest } from 'ahooks';
import { mergeWith, concat, isEmpty } from 'lodash';

import { getMainTableData } from '@/pages/area/areaCompareAdvance/api';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import { generateResultTree, flatDefaultIndexParam } from '@/pages/area/areaCompareAdvance/utils';

const useAreaOperate = () => {
  const {
    state: { date, indexIds, indicatorTree, preSelectAreaRef },
    update,
  } = useCtx();

  const { runAsync: requestMainData, loading } = useRequest(getMainTableData, {
    manual: true,
  });

  useEffect(() => {
    update((draft) => {
      draft.screenLoading = loading;
    });
  }, [loading, update]);

  /** 筛选请求公用逻辑 */
  const screenRequestData = useMemoizedFn((params) => {
    const regionCodes = preSelectAreaRef?.code;
    const curDate = params.date ?? date;
    if (!isEmpty(regionCodes)) {
      requestMainData({
        exportFlag: false,
        date: curDate,
        regionCodes: regionCodes,
        indexParamList: flatDefaultIndexParam(
          params.indicatorTreeList ?? indicatorTree,
          params.indexIdList ?? indexIds,
          [curDate],
        ),
      }).then((res: any) => {
        updateAreaSimilarOperation(preSelectAreaRef.code, res?.data);
      });
    }
  });

  /** 更新操作公用方法 */
  const updateAreaSimilarOperation = useMemoizedFn((codeList, areaList) => {
    update((draft) => {
      draft.isCompareHistory = true;
      draft.areaInfo = areaList?.area;
      draft.rowDatas = generateResultTree(indicatorTree, areaList);
      draft.preSelectAreaRef = {
        code: codeList.toString(),
        data: areaList,
      };
    });
  });

  /** 添加地区-增量查询 */
  const addArea = useMemoizedFn((newCode: string[]) => {
    const { code = '', data: { area = [], data: PData = {}, indexIdList = [] } = {} } = preSelectAreaRef || {};
    const { existedData, diffCode } = newCode.reduce(
      (previous: { existedData: Record<string, any>; diffCode: string[] }, areaCode: string) => {
        if (!code.split(',').includes(areaCode)) {
          previous.diffCode.push(areaCode);
        } else {
          const existedAreaItem = area?.filter((item: any) => item.regionCode === areaCode);
          previous.existedData.area.push(...existedAreaItem);
          previous.existedData.data[areaCode] = PData[areaCode];
          previous.existedData.indexIdList = indexIdList;
        }
        return previous;
      },
      {
        existedData: {
          area: [],
          data: {},
          indexIdList: [],
        },
        diffCode: [] as string[],
      },
    );
    /** 增量查询 */
    if (diffCode?.length) {
      requestMainData({
        date,
        exportFlag: false,
        regionCodes: diffCode.toString(),
        indexParamList: flatDefaultIndexParam(indicatorTree, indexIds, [date]),
      }).then((res: any) => {
        const newData = mergeWith({}, existedData, res?.data, (preValue, curValue, key) => {
          if (key === 'area') return concat(preValue ?? [], curValue ?? []);
        });
        updateAreaSimilarOperation(newCode, newData);
      });
      /** 已有数据，从上次结果集中查找 */
    } else {
      updateAreaSimilarOperation(newCode, existedData);
    }
  });

  /** 替换地区 */
  const replaceArea = useMemoizedFn((replaceCode: string, areaChangeIndex) => {
    const { code = '', data: { area = [], data: PData = {}, indexIdList = [] } = {} } = preSelectAreaRef || {};
    const preCodeList: string[] = code.split(',');
    const preCode = preCodeList[areaChangeIndex];

    /** 替换地区选择为空，根据当前点击地区code删除对应的数据 */
    if (isEmpty(replaceCode)) {
      const updatedPD = { ...PData };
      delete updatedPD[preCode];
      updateAreaSimilarOperation(preCodeList.filter((code) => code !== preCode).toString(), {
        area: [...area].filter((item) => item.regionCode !== preCode),
        data: updatedPD,
        indexIdList,
      });
    } else {
      /** 替换的地区是在已有的结果集中，根据当前点击地区索引删除对应的数据 */
      if (preCodeList.includes(replaceCode)) {
        const updatedPD = { ...PData };
        delete updatedPD[preCode];
        updateAreaSimilarOperation(preCodeList.filter((_, index) => index !== areaChangeIndex).toString(), {
          area: [...area].filter((_, index) => index !== areaChangeIndex),
          data: updatedPD,
          indexIdList,
        });
      } else {
        /** 替换的地区为新地区，需要请求数据 */
        requestMainData({
          date,
          exportFlag: false,
          regionCodes: replaceCode,
          indexParamList: flatDefaultIndexParam(indicatorTree, indexIds, [date]),
        }).then((res: any) => {
          if (res) {
            const { area: nowArea, data: nowData } = res.data;
            const updatedCode = [...preCodeList];
            const updatedArea = [...area];
            const updatedPD = { ...PData };
            updatedCode[areaChangeIndex] = replaceCode;
            updatedArea?.splice(areaChangeIndex, 1, ...nowArea);
            delete updatedPD[preCode];
            updateAreaSimilarOperation(updatedCode.toString(), {
              area: updatedArea,
              data: { ...updatedPD, ...nowData },
              indexIdList,
            });
          }
        });
      }
    }
  });

  /** 删除列 */
  const removeColumn = useMemoizedFn((removeCode) => {
    const { code = '', data: { area = [], data: PData = {}, indexIdList = [] } = {} } = preSelectAreaRef || {};
    const updatedCode = code.split(',').filter((code: string) => code !== removeCode);
    const updatedArea = [...area].filter((item) => item.regionCode !== removeCode);
    const updatedPD = { ...PData };
    delete updatedPD[removeCode!];

    updateAreaSimilarOperation(updatedCode.toString(), {
      area: updatedArea,
      data: updatedPD,
      indexIdList,
    });
  });

  return { addArea, replaceArea, removeColumn, screenRequestData };
};

export default useAreaOperate;
