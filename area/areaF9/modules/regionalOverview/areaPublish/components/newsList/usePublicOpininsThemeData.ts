import { pick } from 'lodash';

import { getThemeList } from '@/pages/publicOpinons/apis';
import { useRequest } from '@/utils/hooks';

export const usePublicOpininsThemeData = () => {
  const { data: themeList } = useRequest(getThemeList, {
    manual: false,
    formatResult: (res: any) => {
      const themeClass = res?.data?.themes?.filter((item: any) => item.title !== '主题事件');

      return (
        themeClass
          ?.map((item: any) => {
            return item?.themes?.map((theme: any) => pick(theme, ['title', 'themeCode', 'collection', 'detail']));
          })
          ?.flat() || []
      );
    },
  });

  return { themeList };
};
