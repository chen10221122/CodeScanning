import { useCallback, useEffect, useMemo } from 'react';

import { useAsync } from '@/utils/hooks';
import { Key } from '@/utils/utility-types';

import { CommonState, useCtx } from './getContext';

export function useRequest<T extends (...args: any[]) => Promise<any>>(fn: T, contentKey: Key<CommonState>) {
  const { execute, pending, data, error } = useAsync(fn);
  const { state, update } = useCtx();

  const store = useMemo(() => state[contentKey], [contentKey, state]);

  const request = useCallback<(...args: Parameters<T>) => void>(
    (...args) => {
      if (!store) {
        execute(...args);
      }
    },
    [execute, store],
  );

  useEffect(() => {
    if (data) {
      update((d) => {
        // d[contentKey] = data;
      });
    }
  }, [data, contentKey, update]);

  useEffect(() => {
    if (error) {
      update((d) => {
        delete d[contentKey];
      });
    }
  }, [error, contentKey, update]);

  return {
    execute: request,
    data: store,
    pending,
    error,
  };
}
