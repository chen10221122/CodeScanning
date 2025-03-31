import { request } from '@/app/libs/request';

const GET_SCREEN_OPTIONS = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/filter';
const GET_SCALE_STATISTICS_LIST = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/scale-stat';
const GET_FINANCING_LIST = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/list';
const GET_PLEDGOR_LIST = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/pledgor-stat';
const GET_PLEDGEE_LIST = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/pledgee-stat';
const POST_PLEDGOR_DETAILS = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/pledgor-details';
const POST_PLEDGEE_DETAILS = '/finchinaAPP/v1/finchina-enterprise/v1/enterprise/receivable-financing/pledgee-details';

export const getScreenOptions = (params: any) => {
  return request.get(GET_SCREEN_OPTIONS, {
    params,
  });
};

export const getScaleStatisticsList = (params: any) => {
  return request.post(GET_SCALE_STATISTICS_LIST, {
    data: params,
    requestType: 'json',
  });
};

export const getFinancingList = (params: any) => {
  return request.post(GET_FINANCING_LIST, {
    data: params,
    requestType: 'json',
  });
};

export const getPledgorList = (params: any) => {
  return request.get(GET_PLEDGOR_LIST, {
    params,
  });
};

export const postPledgorList = (params: any) => {
  return request.post(GET_PLEDGOR_LIST, {
    data: params,
    requestType: 'json',
  });
};

export const getPledgeeList = (params: any) => {
  return request.get(GET_PLEDGEE_LIST, {
    params,
  });
};

export const postPledgeeList = (params: any) => {
  return request.post(GET_PLEDGEE_LIST, {
    data: params,
    requestType: 'json',
  });
};

export const postPledgorDetails = (params: any) => {
  return request.post(POST_PLEDGOR_DETAILS, {
    data: params,
    requestType: 'json',
  });
};

export const postPledgeeDetails = (params: any) => {
  return request.post(POST_PLEDGEE_DETAILS, {
    data: params,
    requestType: 'json',
  });
};
