import { useRequest } from 'ahooks';

import { useConditionCtx } from '@/pages/area/areaFinanceResource/components/layout/context';
import { CommonResponse } from '@/utils/utility-types';

interface props {
  /**@description 表格api请求函数 */
  api: (params: any) => any;
  /**@description 表格数据格式化函数 */
  dataFormatFn?: (data: CommonResponse<any>) => any;
}

export default function useTableData({ api, dataFormatFn }: props) {
  const {
    state: { condition, ready, isFirstLoad },
    update,
  } = useConditionCtx();

  useRequest(() => api(condition), {
    ready: ready,
    refreshDeps: [condition],
    onSuccess: (data: CommonResponse<any>) => {
      if (data.data) {
        if (dataFormatFn) {
          dataFormatFn(data);
        } else {
          // 若不需特殊处理
          update((d) => {
            d.tableData = data.data.data.map((item: any, index: number) => ({
              ...item,
              index: condition.skip + index + 1,
            }));
            d.total = data.data.total;
            d.tableLoading = false;
            if (isFirstLoad) {
              d.isFirstLoad = false;
            }
          });
        }
      }
    },
    onError: () => {
      update((d) => {
        d.tableData = [];
        d.total = 0;
        d.tableLoading = false;
        d.isFirstLoad = false;
      });
    },
  });
}
