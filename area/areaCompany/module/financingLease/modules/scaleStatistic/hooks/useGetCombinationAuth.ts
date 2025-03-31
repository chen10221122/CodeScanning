import { useSelector, shallowEqual } from 'react-redux';

const useGetAuth = () => {
  // 用户账号信息
  const userInfo = useSelector((store: any) => store.user.info, shallowEqual);

  const noCombinationAuth = !userInfo?.havePay;
  // !userInfo?.havePay && (combinationList?.length || -1) >= (userInfo?.data?.lv_info?.sub_max || 0);

  return {
    userInfo,
    noCombinationAuth,
    havePay: userInfo?.havePay,
  };
};

export default useGetAuth;
