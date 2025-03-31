import { RowItem } from '@dzh/screen';

export interface BaseContext {
  /* 加载状态 */
  loading: boolean;
  /* 露出表头 */
  onlyBodyLoading: boolean;
  /* 总条数 */
  count: number;
  /* 是否重置 */
  renderScreen: boolean;
  /* 重置 */
  handleReset: () => void;
  /* 筛选方法 */
  handleMenuChange: (_: unknown, allSelectedRows: RowItem[]) => void;
  /* 搜索方法 */
  handleSearch: (value: string) => void;
  /* 排序 */
  handleTableChange: (this: any, pagination: unknown, filters: unknown, sorter: any) => void;
  /* 翻页 */
  handlePageChange: (page: number, pageSize?: number | undefined) => void;
}

export interface RequestParams {
  exportFlag?: string; //是否导出
  sortKey?: string; //排序字段
  sortRule?: string; //排序规则
}

// 筛选参数
export type screenType = {
  name: string;
  value: string;
  children?: screenType[];
};
