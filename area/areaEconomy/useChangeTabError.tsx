import { useRef, useEffect, useMemo } from 'react';

const useChangeTabError = ([...errorList]) => {
  const changeTabError = useRef<any>();
  const firstRef = useRef<any>();

  // errorList每个error都要判断一遍，有一个有值就返回true
  const isError = useMemo(
    () => errorList.some((errorInfo: any) => errorInfo && ![202, 203, 204, 100].includes(errorInfo?.returncode)),
    [errorList],
  );

  useEffect(() => {
    if (!firstRef.current) {
      if (isError) {
        changeTabError.current = true;
        firstRef.current = true;
      }
    } else {
      changeTabError.current = null;
    }
  }, [isError]);

  return changeTabError.current;
};

export default useChangeTabError;
