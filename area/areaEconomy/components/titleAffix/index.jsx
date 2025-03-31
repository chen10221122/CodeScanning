import { memo } from 'react';

import { Affix } from '@/components/antd';

import styles from './style.module.less';

const TitleAffix = ({ children }) => {
  const tabsWrapper = document.getElementById('tabsWrapper');

  return (
    <Affix target={() => tabsWrapper || window} offsetTop={47} className={styles['affix-area-self']}>
      {children}
    </Affix>
  );
};

export default memo(TitleAffix);
