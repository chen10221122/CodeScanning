import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

import { GroupType } from '@/components/screen/items/types';

export default function useGroup() {
  const [currentGroup, setCurrentGroup] = useState<GroupType>();
  const [currentIndex, setCurrentIndex] = useState<number>();

  const handleSelectChange = useMemoizedFn((group: GroupType, index: number) => {
    setCurrentGroup(group);
    setCurrentIndex(index);
  });

  return {
    groupIndex: currentIndex,
    group: currentGroup,
    handleSelectChange,
  };
}
