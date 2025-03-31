import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useCtx } from './provider/getContext';

export default function useInitParams() {
  const { code } = useParams<{ code: string }>();
  const { update } = useCtx();

  useEffect(() => {
    update((d) => {
      Object.assign(d, { code });
    });
  }, [code, update]);
}
