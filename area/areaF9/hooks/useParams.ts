import { useParams as useRouterParams } from 'react-router-dom';

import { useQuery } from '@/utils/hooks';

export const useParams = () => {
  const { key, code } = useRouterParams<{ key: string; code: string }>();
  const { module = '', code: searchCode } = useQuery<{ module: string; code?: string }>();

  return {
    /** 动态路由key */
    key,
    /** 地区code */
    code,
    /** 地区code */
    regionCode: code,
    /** hash对应module值 */
    module,
    hash: window.location.hash.slice(1),
    searchCode,
  };
};

export default useParams;
