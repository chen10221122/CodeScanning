import { request } from '@/app/libs/request';
import { CommonResponse } from '@/utils/utility-types';

import { IParam } from '../types';

const mainIndsProgress = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/get-progress-main-indicators';

const mainIndsProgressModal = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/get-indicator-update-detail';

export const getProgressData = (data: {
  areaCode: string;
  exportFlag?: string;
  statNature?: string | number;
}): Promise<Record<string, any>> => {
  return request.get(mainIndsProgress, {
    params: data,
  });
};

export const getProgressModal = (data: Record<string, any>): Promise<Record<string, any>> => {
  return request.get(mainIndsProgressModal, {
    params: {
      ...data,
    },
  });
};

interface Props {
  exportFlag?: 'true' | 'false';
  restoreDefault?: '0' | '1' | 0 | 1;
  regionCode: string;
  years?: number;
  indexParamList: IParam[];
}

interface IChequerResponse {
  child?: {
    indexId: string;
    paramMap?: Record<string, any>;
    groupName?: string;
    name?: string;
    value?: Record<string, { mValue: string | number; extraProperties?: { color: 1 | 2 } }>;
    nationalRank?: {
      molecule: number | string; // 排名
      denominator: number | string; // 总数
    };
    unit?: string;
    comparison?: number; // 浮动值
    comparisonType?: 'up' | 'down'; // 上升下降
  }[];
  name?: string;
}

export const AreaEconomyAndDebtChequerAPI =
  '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/getAreaEconomyAndDebtChequer';
/**
 * story#22055 区域F9顶部宫格指标卡
 */
export const getAreaEconomyAndDebtChequer = ({
  restoreDefault,
  regionCode,
  indexParamList,
  exportFlag = 'false',
}: Props) => {
  return request.post<CommonResponse<IChequerResponse[]>>(AreaEconomyAndDebtChequerAPI, {
    data: JSON.stringify({
      exportFlag,
      restoreDefault: +restoreDefault!,
      regionCode,
      indexParamList: indexParamList.filter((item) => item !== undefined && item !== null),
      years: 10,
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const AreaEconomyAndDebtNewAPI = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/getAreaEconomyAndDebtNew';
/**
 * story#22055 区域F9列表
 */
export const getAreaEconomyAndDebtNew = ({ restoreDefault, regionCode, indexParamList }: Props) => {
  return request.post(AreaEconomyAndDebtNewAPI, {
    body: JSON.stringify({
      restoreDefault: +restoreDefault!,
      regionCode,
      indexParamList: indexParamList.filter((item) => item !== undefined && item !== null),
      years: 10,
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const EconomyChoiceParamAPI = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/getEconomyChoiceParam';
/**
 * story#22055 获取区域F9指标缓存
 * pageCode: 0：九宫格  1：经济速览列表
 */
export const getEconomyChoiceParam = ({ pageCode }: { pageCode: 0 | 1 }) => {
  return request.get<CommonResponse<{ indicList: IParam[]; restoreDefault: 0 | 1 | '0' | '1' }>>(
    EconomyChoiceParamAPI,
    {
      params: {
        pageCode,
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );
};
