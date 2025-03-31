import { request } from '@/app/libs/request';

// 添加前缀
const addPrefix = (path: string) => `/finchinaAPP/v1${path}`;

const GET_SCREEN_DATA = addPrefix('/finchina-enterprise/v1/enterprise/blackListTopic/getFilterItems');

const GET_LIST_DATA = addPrefix('/finchina-enterprise/v1/enterprise/blackListTopic/getBlackListTopicDetails');

const GET_GEAPH_LIST_DATA = addPrefix('/finchina-enterprise/v1/enterprise/blackListTopic/getBlackListTopicStatistics');

const GET_HOT_SEARCHLIST_DATA = addPrefix('/finchina-enterprise/v1/enterprise/blackListTopic/getBlackListTopicTags');

/**
 * 获取高级搜索筛选项
 * @param optionalCombination 是否只刷新自选组合
 */
export const getScreenData = (optionalCombination?: 1 | 0) => {
  return request.get(GET_SCREEN_DATA, {
    params: {
      optionalCombination,
    },
  });
};

/**
 * 获取表格数据
 * @param params 入参
 */
export const getListData = (params: any) => {
  return request.post(GET_LIST_DATA, {
    data: params,
    requestType: 'json',
  });
};

export const getGraphListData = (params: any) => {
  return request.post(GET_GEAPH_LIST_DATA, {
    data: params,
    requestType: 'json',
  });
};

export const getHotSearchListData = (params: any) => {
  return request.get(GET_HOT_SEARCHLIST_DATA, {
    params,
  });
};
