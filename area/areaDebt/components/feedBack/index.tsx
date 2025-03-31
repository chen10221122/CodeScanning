import { useMemo, memo, FC } from 'react';

import { useMemoizedFn } from 'ahooks';

import backIcon from '@pages/area/areaDebt/images/back.svg';

import Icon from '@/components/icon';
import { LINK_USER_PROFILE_FEEDBACK } from '@/configs/routerMap';
import { useHistory } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import styles from './style.module.less';

type Prop = {
  rootRef: any;
  defaultTitle?: string;
};
const Feedback: FC<Prop> = ({ rootRef, defaultTitle }) => {
  const history = useHistory();
  const handleOnClick = useMemoizedFn(() => {
    history.push(urlJoin(LINK_USER_PROFILE_FEEDBACK), { isCorrection: false, defaultTitle });
  });

  const headRight = useMemo(() => {
    return (
      <div className={styles.headRight}>
        <Icon image={backIcon} size={13} style={{ marginBottom: '1px' }} />
        <div className={styles.text} onClick={handleOnClick}>
          意见反馈
        </div>
      </div>
    );
  }, [handleOnClick]);
  return <div className={styles.container}>{headRight}</div>;
};
export default memo(Feedback);
