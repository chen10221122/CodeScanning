import { ScreenType } from '@/components/screen';

export interface Pager {
  pageSize: number;
  current: number;
  total: number;
}

export interface IFormatterCheckReturn {
  name: string;
  value: string;
  key: string;
}

export interface IFormatterMenus {
  title: string;
  formatTitle: (rows: any[]) => string;
  option: {
    hasSelectAll: boolean;
    type: ScreenType;
    cascade: boolean;
    children: IFormatterCheckReturn[];
  };
}

export type detailType = {
  type?: string;
  year?: string;
  code: string;
  name: string;
  columnName: string;
};
