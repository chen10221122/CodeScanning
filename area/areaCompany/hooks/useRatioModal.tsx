import { useState, useEffect } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { splitSingleRelation } from '@/pages/detail/modules/enterprise/overview/modules/actualControllerNew/useLogic';
import { getInvestmentLink } from '@/pages/household/group/modules/hierarchy/api';
import { useImmer } from '@/utils/hooks';

const defaultCondition = {
  fromType: 'company',
  fromItCode: '',
  toType: 'company',
  toItCode: '',
  moduleId: 1,
  pageCode: 'groupGraph',
};

const defaultData = {
  contentTitle: {
    bigCompanyName: '',
    smallCompanyName: '',
    ratio: '',
  },
  content: [] as Record<string, any>[],
};

export default () => {
  const [visible, setVisible] = useState(false);
  const [data, updateData] = useImmer(defaultData);
  const [condition, updateCondition] = useImmer<Record<string, any>>(defaultCondition);

  const { run, loading } = useRequest(getInvestmentLink as (params: Record<string, any>) => Promise<any>, {
    manual: true,
    onSuccess: (res: Record<string, any>) => {
      // 第一条应该是表格传进来的，后面的是响应值
      if (res && res.data) {
        const linkArr = res.data.split('\n') || [];
        const formatList: Record<string, any>[] = linkArr.map((ele: any[]) => splitSingleRelation(ele, ''));
        const resultList = formatList.filter((_, idx) => idx % 2);
        updateData((d) => {
          d.content = resultList;
        });
      } else {
        updateData((d) => {
          d = { ...defaultData };
          return d;
        });
      }
    },
    onError() {
      updateData((d) => {
        d = { ...defaultData };
        return d;
      });
    },
  });

  useEffect(() => {
    if (condition.fromItCode && condition.toItCode) {
      run({
        ...condition,
      });
    }
  }, [run, condition]);

  const handleOpenModal = useMemoizedFn((condition: Record<string, any>) => {
    setVisible(true);
    updateData((d) => {
      d.contentTitle = {
        bigCompanyName: condition.bigCompanyName,
        smallCompanyName: condition.smallCompanyName,
        ratio: condition.ratio,
      };
    });
    updateCondition((d) => {
      d.fromItCode = condition.fromItCode;
      d.toItCode = condition.toItCode;
    });
  });

  return {
    condition,
    visible,
    loading,
    data,
    setVisible,
    handleOpenModal,
  };
};
