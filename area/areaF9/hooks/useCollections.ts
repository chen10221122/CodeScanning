import { useEffect, useState } from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';

import { message } from '@/components/antd';
import { useTab } from '@/libs/route/index';
import { useDispatch } from '@/pages/area/areaF9/context';
import {
  getTreeCollection,
  addTreeCollection,
  deleteTreeCollection,
  editTreeCollection,
} from '@/pages/detail/components/sideMenu/api';

export const useCollections = ({ regionCode }: Record<string, string>) => {
  const dispatch = useDispatch();

  const [collections, setCollections] = useState([]);
  const [isFirstLoadng, setIsFirstLoadng] = useState(true);

  const { run: getTreeCollectionRun } = useRequest(getTreeCollection, {
    manual: true,
    onSuccess(res) {
      const data = res?.data?.collections || [];
      dispatch((d) => {
        d.collectionData = data;
      });
      setCollections(data);
    },
    onError() {
      setCollections([]);
      dispatch((d) => {
        d.collectionData = [];
      });
    },
    onFinally() {
      setIsFirstLoadng(false);
    },
  });

  useTab({
    onActive() {
      !isFirstLoadng && getTreeCollectionRun({ regionCode });
    },
  });

  useEffect(() => {
    if (regionCode) {
      getTreeCollectionRun({ regionCode });
    }
  }, [getTreeCollectionRun, regionCode]);

  const { run: addTreeCollectionRun } = useRequest(addTreeCollection, {
    manual: true,
    onSuccess(res) {
      const data = res?.data?.collections;
      if (data) {
        setCollections(data);
        dispatch((d) => {
          d.collectionData = data;
        });
        message.success('收藏成功');
      } else {
        message.error('添加失败');
      }
    },
    onError() {
      message.error('添加失败');
    },
  });

  const { run: deleteTreeCollectionRun } = useRequest(deleteTreeCollection, {
    manual: true,
    onSuccess(res) {
      const data = res?.data?.collections;
      if (data) {
        setCollections(data);
        dispatch((d) => {
          d.collectionData = data;
        });
        message.success('取消收藏成功');
      } else {
        message.error('取消收藏失败');
      }
    },
    onError() {
      message.error('取消收藏失败');
    },
  });

  const { run: editTreeCollectionRun } = useRequest(editTreeCollection, {
    manual: true,
  });

  const handleCollection = useMemoizedFn((data, isCollection) => {
    if (isCollection) {
      if (collections.length >= 12) {
        return message.error('添加失败，收藏已达上限！');
      }
      addTreeCollectionRun({ businessType: encodeURIComponent(data.businessType), regionCode });
    } else {
      deleteTreeCollectionRun({ businessType: encodeURIComponent(data.businessType), regionCode });
    }
  });

  const handleEditCollection = useMemoizedFn((menus) => {
    const businessTypes = menus.map((o: any) => encodeURIComponent(o.businessType)).join(',');
    editTreeCollectionRun({ businessTypes, regionCode });
  });

  return {
    collections,
    handleCollection,
    handleEditCollection,
  };
};
