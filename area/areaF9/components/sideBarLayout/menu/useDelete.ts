import { useRef, useEffect, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { WritableDraft } from 'immer';
import { cloneDeep } from 'lodash';

import { message } from '@/components/antd';
import { MenuItemProps } from '@/components/sideMenuF9/types';
import { NodeTypeEnum } from '@/pages/area/areaF9/components/sideBarLayout';
import { useSelector, useDispatch } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';
import { deleteRecommend } from '@/pages/detail/components/sideMenu/api';
import useRequest from '@/utils/ahooks/useRequest';

export default function useDelete() {
  const dispatch = useDispatch();

  const businessTypeRef = useRef('');

  const { collectionData } = useSelector((s) => ({
    collectionData: s.collectionData || [],
  }));

  const { code: regionCode } = useParams();

  const { run, data, loading }: { run: Function; data?: any; loading: boolean } = useRequest(deleteRecommend, {
    manual: true,
  });

  const currentNode = useMemo(() => {
    return collectionData
      .filter((o) => o.nodeType === NodeTypeEnum.RECOMMEND)
      .map((o) => o.businessType)
      .join();
  }, [collectionData]);

  useEffect(() => {
    if (!loading && data) {
      if (data.returncode === 0) {
        const collections = cloneDeep(collectionData) as WritableDraft<MenuItemProps[]>;
        const index = collections.findIndex((o) => o.businessType === businessTypeRef.current);
        if (index > -1) collections.splice(index, 1);
        dispatch((d) => {
          d.collectionData = collections;
        });
        message.success('删除成功');
      }
      if (data.returncode === 200) {
        message.error('删除失败');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, dispatch]);

  return useMemoizedFn(({ businessType, nodeType }: { businessType: string; nodeType?: NodeTypeEnum }) => {
    businessTypeRef.current = businessType;
    if (nodeType === NodeTypeEnum.COMMONUSE) {
      run({ regionCode, deleteNode: encodeURIComponent(businessType), nodeType });
    } else {
      run({ regionCode, deleteNode: encodeURIComponent(businessType), currentNode });
    }
  });
}
