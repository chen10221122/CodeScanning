import { useEffect, useState } from 'react';

import { useRequest } from 'ahooks';

import { getDebtList } from '@/pages/bond/overdue/api';

export type Condition = {
  cityCode: string;
  countyCode: string;
  provCode: string;
  industryFirstCode: string;
  keyword: string;
  publishDateFrom: string;
  publishDateTo: string;
  size: number;
  from: number;
  keywordEnum?: string;
  isHKListed: string;
  isHSJListed: string;
  isIssued: string;
  isNewThirdBoardListed: string;
  isUrban: string;
  isUrbanChild: string;
  enterpriseNature: string;
  sortKeyEnum: string;
  sortOrder: string;
  endDate: string;
  isNotListed: string;
  debtorBusinessType?: string;
  industrySecCode: string;
  subId: string;
};

export type RequestData = {
  [k: string]: any;
};
export default function useTableData(condition: Condition) {
  const [tableData, setTableData] = useState<RequestData>({});

  const { loading, data, run, error } = useRequest(getDebtList, {
    manual: true,
  });
  useEffect(() => {
    if (condition.publishDateFrom || condition.publishDateTo) {
      run(condition);
    }
  }, [condition, run]);

  useEffect(() => {
    if (data?.data) {
      const list = data.data.list.map((item: any, index: number) => {
        return {
          index: condition.from + index + 1,
          obl: {
            obligorName: item.obligorName,
            obligorCode: item.obligorCode,
            labelList: item.labelList,
          },
          discloser: {
            discloserCode: item.discloserCode,
            discloserName: item.discloserName,
          },
          creditor: {
            creditorName: item.creditorName,
            creditorCode: item.creditorCode,
          },
          acceptor: {
            acceptorName: item.acceptorName,
            acceptorCode: item.acceptorCode,
          },
          historyModal: {
            history: item.historyTime,
            acceptorName: item.acceptorName,
            acceptorCode: item.acceptorCode,
          },
          area: item.province + item.city ?? '' + item.county ?? '',
          ...item,
        };
      });
      setTableData({
        list,
        total: data.data.total,
      });
    } else {
      setTableData({
        list: [],
        total: 0,
      });
    }
  }, [condition.from, data]);

  return {
    loading,
    data: tableData,
    error,
  };
}
