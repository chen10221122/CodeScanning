import { useEffect, useRef } from 'react';

import { isEmpty } from 'lodash';

import useRequest from '@/utils/ahooks/useRequest';

import { getStatistics } from '../api';
import { useCtx, ENTERPRISE_STATUS } from '../provider/ctx';
import { IAreaTreeItem } from '../types';

/** 请求的模块类型 */
enum ERequestType {
  /** 行业分布 */
  INDUSTRY = 3,
  /** 地区分布 */
  AREA = 2,
}

/** 地区层级 */
enum EAreaLevel {
  _,
  /** 一级地区 */
  LEVEL_1,
  /** 二级地区 */
  LEVEL_2,
  /** 三级地区 */
  LEVEL_3,
}

const CHINA_CODE = '100000';

type TUseGetChartsData = {
  requestModule: 'INDUSTRY' | 'AREA';
};

export const useGetChartsData = ({ requestModule }: TUseGetChartsData) => {
  const {
    state: { selectedAreaList, selectedTarget, enterpriseStatus },
  } = useCtx();

  const requestParamsRef = useRef<any>(null);

  const { loading, data, run } = useRequest(getStatistics, {
    manual: true,
    onSuccess(data) {},
    formatResult(res: { data: { list: any } }) {
      return res?.data?.list;
    },
  });

  useEffect(() => {
    if (selectedTarget && enterpriseStatus && !isEmpty(selectedAreaList)) {
      const params = {
        cityCode: '' /** 市级代码筛选,多个逗号隔开 */,
        countryCode: '' /** 区县代码筛选,多个逗号隔开 */,
        provinceCode: '' /** 省份代码筛选 */,
        tagCode: enterpriseStatus === ENTERPRISE_STATUS.NOT_REVOKE ? selectedTarget.TagCode : '' /** 选中卡片 */,
        /** 是否被撤销 */
        tagCode2: enterpriseStatus === ENTERPRISE_STATUS.NOT_REVOKE ? '' : selectedTarget.TagCode,
        techType: enterpriseStatus,
        statisticType: ERequestType[requestModule],
      };

      const goalArea = selectedAreaList.slice(-1)?.[0] as IAreaTreeItem;
      switch (goalArea?.key) {
        case EAreaLevel.LEVEL_1:
          /** 地区层级为1 && 不是全国 */
          if (goalArea.value !== CHINA_CODE) {
            params.provinceCode = goalArea.value;
          }
          break;
        case EAreaLevel.LEVEL_2:
          params.cityCode = goalArea.value;
          break;
        case EAreaLevel.LEVEL_3:
          params.countryCode = goalArea.value;
          break;
      }
      if (JSON.stringify(requestParamsRef.current) !== JSON.stringify(params)) {
        run(params);
        requestParamsRef.current = params;
      }
    }
  }, [selectedAreaList, selectedTarget, enterpriseStatus, requestModule, run]);

  return {
    loading,
    data,
  };
};
