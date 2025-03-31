import { request } from '@/app/libs/request';

const GET_FINANCE_LEASE_LIST = '/finchinaAPP/financeLeaseSpecial/getFinanceLeaseList.action';
interface LeaseDetailProps {
  skip: number;
  pageSize?: number;
  sortKey: string;
  sortType: string;
  isLatest: string;
  endDateFrom: string;
  endDateTo: string;
  keyWord: string;
  areaRegionCodeLessee: string;
  areaCityCodeLessee: string;
  areaCountyCodeLessee: string;
}
/** 租赁融资-租赁融资明细 */
export const getFinanceLeaseDetail = (params: LeaseDetailProps) => {
  return request.get(GET_FINANCE_LEASE_LIST, {
    params,
    headers: { pagecode: 'financingLeaseOverview' },
  });
};
