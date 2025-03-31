import { request } from '@/app/libs/request';
import { removeObjectNil } from '@/utils/share';

const GET_SELECT_BY_MODULE = '/finchinaAPP/select/getSelectByModule.action';
const GET_STAT_BY_MODULE = '/finchinaAPP/select/getStatByModule.action';
const GET_TABLE_DATA = '/finchinaAPP/newsPlate/getWebNewsAreaF9.action';

/**获取tab更多筛选弹框接口 */
export const getSelectByModule = (params: any) => {
  return request.get(GET_SELECT_BY_MODULE, {
    params: removeObjectNil(params),
  });
};
/**获取热门分类及统计接口 */
export const getHotClassificationData = (params: any) => {
  return request.post(GET_STAT_BY_MODULE, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: { 'Content-Type': 'application/json' },
  });
};
/**获取列表接口 */
export const getTableData = (params: any) => {
  return request.post(GET_TABLE_DATA, {
    data: JSON.stringify(removeObjectNil(params)),
    headers: { 'Content-Type': 'application/json' },
  });
};
