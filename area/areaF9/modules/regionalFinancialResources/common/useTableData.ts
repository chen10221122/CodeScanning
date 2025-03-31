import { useMemo } from 'react';

import { useRequest } from 'ahooks';

import { getDistributionByBankList, getDistributionByTypeList, getNoneBankList, getScaleList } from '../api';
import { useCtx } from '../context';
import { pageType } from '../type';

export default function useTableData() {
  const {
    state: { code, page, tableCondition },
    update,
  } = useCtx();

  const tableDataApi = useMemo(() => {
    switch (page) {
      case pageType.SCALE:
        return getScaleList;
      case pageType.BYTYPE:
        return getDistributionByTypeList;
      case pageType.BYBANK:
        return getDistributionByBankList;
      case pageType.NONE:
        return getNoneBankList;
    }
  }, [page]);

  useRequest(() => tableDataApi(tableCondition), {
    refreshDeps: [tableCondition],
    ready: !!code,
    onSuccess: (data) => {
      if (data.data) {
        const tableData = data.data.data.map((item, index) => ({
          index: tableCondition?.skip + index + 1,
          ...item,
        }));
        update((d) => {
          d.total = data.data.total;
          d.tableData = tableData;
        });
      } else {
        update((d) => {
          d.total = 0;
          d.tableData = [];
        });
      }
    },
    onError: () => {
      update((d) => {
        if (d.firstLoading) {
          d.tableError += 1;
        }
        d.total = 0;
        d.tableData = [];
      });
    },
    onFinally: () => {
      update((d) => {
        d.conditionChangeLoading = false;
        d.firstLoading = false;
      });
    },
  });

  // useEffect(() => {
  //   if (code) {
  //     getScaleListData(tableCondition);
  //   }
  // }, [code, getScaleListData, tableCondition, update]);
}
