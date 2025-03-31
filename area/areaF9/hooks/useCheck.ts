import { useParams } from 'react-router-dom';

import { useMount } from '@dzh/hooks';

import { useDispatch } from '../context';
import { useAreaJumpLimit } from './useAreaJumpLimit';

export default function useCheck() {
  const dispatch = useDispatch();
  const { code } = useParams() as any;
  const { handleLimits } = useAreaJumpLimit();
  useMount(() => {
    handleLimits({ code: code || '110000', pageCode: 'regionalEconomyQuickView' })
      .then(() => {
        dispatch((d) => {
          d.viewTimesOver = false;
        });
      })
      .catch((err) => {
        dispatch((d) => {
          d.viewPowerTip = err.info;
          d.viewTimesOver = true;
        });
      });
  });
}
