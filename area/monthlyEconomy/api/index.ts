import { cloneDeep } from 'lodash';

import { request } from '@/app/libs/request';

const GET_PROGRESS_MAIN_INDICATORS = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/get-progress-main-indicators';
const GET_INDICATOR_UPDATE_DETAIL = '/finchinaAPP/v1/finchina-economy/v1/area/areaF9/get-indicator-update-detail';
const GET_MONTH_QUARTER_LIST = '/finchinaAPP/v1/finchina-economy/v1/area/economy/encyclopedia/month-quarter/list';
const GET_MONTH_QUARTER_UPDATE_TIP =
  '/finchinaAPP/v1/finchina-economy/v1/area/economy/encyclopedia/month-quarter/update-tip';
const GET_MONTH_QUARTER_YEARS = '/finchinaAPP/v1/finchina-economy/v1/area/economy/encyclopedia/month-quarter/years';
const GET_MONTH_QUARTER_INDICATOR =
  '/finchinaAPP/v1/finchina-economy/v1/area/economy/encyclopedia/month-quarter/indicator';

const paramsFilter = (obj: any) => {
  let sendObj = cloneDeep(obj);
  let headerObj = sendObj?.pageCode ? { pageCode: sendObj?.pageCode } : {};

  for (let k in sendObj) {
    if (Array.isArray(sendObj[k])) {
      // 筛选条件地区中有重复 全国
      let str = sendObj[k].filter((s: any) => s && s.trim()).join();
      sendObj[k] = Array.from(new Set(str.split(','))).join();
    }
  }
  return { sendObj, headerObj };
};

//区域多指标明细
export const getProgressData = (data: {
  areaCode: string;
  exportFlag?: string;
  statNature?: string | number;
}): Promise<Record<string, any>> => {
  const { sendObj, headerObj } = paramsFilter(data);
  return request.post(GET_PROGRESS_MAIN_INDICATORS, {
    data: JSON.stringify(sendObj),
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...headerObj } as any,
  });
};

export const getProgressModal = (data: Record<string, any>): Promise<Record<string, any>> => {
  return request.get(GET_INDICATOR_UPDATE_DETAIL, {
    params: {
      ...data,
    },
  });
};

//列表接口
export const getTblData = (obj: any) => {
  const { sendObj, headerObj } = paramsFilter(obj);
  return request.post(GET_MONTH_QUARTER_LIST, {
    data: JSON.stringify(sendObj),
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...headerObj } as any,
  });
};

/** 区域经济大全更新指标查询 */
export const getUpdateData = (obj: any) => {
  const { sendObj, headerObj } = paramsFilter(obj);
  return request.post(GET_MONTH_QUARTER_UPDATE_TIP, {
    data: JSON.stringify(sendObj),
    headers: { 'Content-Type': 'application/json; charset=UTF-8', ...headerObj } as any,
  });
};

/**获取默认日期 */
export const getInitYear = () => {
  return new Promise((resolve, reject) => {
    request
      .get(GET_MONTH_QUARTER_YEARS)
      .then((res: any) => {
        resolve(res.data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
/**获取指标配置 */
export const getIndicatorConfig = () => {
  return new Promise((resolve, reject) => {
    request
      .get(GET_MONTH_QUARTER_INDICATOR)
      .then((res: any) => {
        resolve(res.data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
