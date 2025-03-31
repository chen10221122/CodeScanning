import { request } from '@/app/libs/request';
import { removeObjectNil } from '@/utils/share';

const api_prefix = '/finchinaAPP/v1/finchina-economy/v1/economy/land/';

const HEADERS = { 'Content-Type': 'application/json; charset=UTF-8' };

/** 宗地详情 */
export const getLandMainDetail = (mainCode: string, landCode: string) =>
  request.get(`${api_prefix}detail`, { params: { mainCode, ...(landCode ? { landCode } : {}) } });

/** 指标树 */
export const getIndexTree = (type: string) => request.get(`${api_prefix}/indexTree`, { params: { type } });

/** 招拍挂-历年出让 */
export const getLandAnnualSales = (params: any) =>
  request.post(`${api_prefix}land-annual-sales`, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: HEADERS,
  });

/** 招拍挂-下属辖区 */
export const getLandArea = (params: any) =>
  request.post(`${api_prefix}land-area`, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: HEADERS,
  });

/** 招拍挂-土地明细 */
export const getLandDetail = (params: any) =>
  request.post(`${api_prefix}land-detail`, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: HEADERS,
  });

/** 招拍挂-全国土地信息 */
export const getLandInfo = (params: any) =>
  request.post(`${api_prefix}land-info`, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: HEADERS,
  });

/** 协议划拨 */
export const getProtocol = (params: any) =>
  request.post(`${api_prefix}protocol`, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: HEADERS,
  });
