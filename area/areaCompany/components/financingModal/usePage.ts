import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';

export default function usePage() {
  const [page, setPage] = useState(1);
  const handleChangePage = useMemoizedFn((c) => {
    setPage(c);
  });
  return { page, setPage, handleChangePage };
}
