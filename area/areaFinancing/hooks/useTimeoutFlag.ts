import { useState } from 'react';

import { useTimeout } from 'ahooks';

export default function useTimeoutFlag() {
  const [flag, setFlag] = useState(false);
  useTimeout(() => {
    setFlag(true);
  }, 500);
  return flag;
}
