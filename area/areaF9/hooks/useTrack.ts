import { useMemoizedFn } from 'ahooks';

import { useTrackMenuClick } from '@/libs/eventTrack';
import { useSelector } from '@/pages/area/areaF9/context';

export const useTrack = () => {
  const { trackMenuClick } = useTrackMenuClick();
  const areaInfo = useSelector((state) => state.areaInfo);

  const track = useMemoizedFn((menu, from) => {
    trackMenuClick(null, {
      url: window.location.href,
      title: menu.title,
      titleId: menu.key,
      from,
      type: 'area',
      id: areaInfo?.regionCode,
      name: areaInfo?.regionName,
      businessType: menu.businessType,
    });
  });

  return track;
};
