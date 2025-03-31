import { request } from '@/app/libs/request';

interface MainProp {
  date?: string;
  singleSort?: string;
  regionCodes: string;
  indexParamList: any[];
  exportFlag: boolean;
}

/** 获取主体表格数据 */
export const getMainTableData = (data: MainProp) =>
  request.post('/finchinaAPP/v1/finchina-economy/v1/area/areaF9/getRegionCompareData', {
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
