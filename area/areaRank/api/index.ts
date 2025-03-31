import { request } from '@/app/libs/request';
import { CommonResponse } from '@/utils/utility-types';

type IProps = Record<string, any>;
const api_prefix = '/finchinaAPP/v1';

export interface RankItem {
  announcementDate: string;
  code: string;
  dataSource: string;
  department: string;
  departmentCode: string;
  name: string;
  type: string;
  url: string;
  year: string;
  isHotList: string; //是否热门榜单
}
export interface CategoryItem {
  code: string;
  isInnerType?: string;
  name: string;
  number: number;
}
export interface RankDetailItem {
  announcementDate: string;
  areaCode: string;
  areaName: string;
  /** 数据来源 */
  dataSource: string;
  /** 单位 */
  department: string;
  rank: string;
  value: string;
  key?: string | number;
}
export interface RankDetailApiData {
  /** 是否有指标列 */
  hasIndicators?: '1' | '0';
  /** 是否有排名 */
  hasRanking?: '1' | '0';
  /** 指标名称 */
  indexName: string;
  itemList: RankDetailItem[];
  /** 总条数 */
  total: string;
}
export const getAreaRankList = ({
  category,
  isHotList,
  skip,
  keyWord,
  department,
  year,
  sortKey,
  sortRule,
}: IProps) => {
  return request.get<CommonResponse<{ data: RankItem[] }>>(`${api_prefix}/finchina-economy/v1/area/list/list`, {
    params: { category, isHotList, skip, keyWord, department, year, sortKey, sortRule, pageSize: 50 },
  });
};

export const getRankDetail = ({ fields, pageSize, skip, tagCode }: IProps) => {
  return request.get<CommonResponse<RankDetailApiData>>(`${api_prefix}/finchina-economy/v1/area/list/list_detail`, {
    params: { fields, pageSize, skip, tagCode },
  });
};

export const getRankCategory = () => {
  return request.get<CommonResponse<CategoryItem[]>>(`${api_prefix}/finchina-economy/v1/area/list/statistics`, {});
};
