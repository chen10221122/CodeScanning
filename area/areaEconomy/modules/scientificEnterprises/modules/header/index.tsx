// import {useState} from 'react'
import { Flex } from '@/components/layout';

import LinkRevoke from '../../components/linkToRevoke';
import { Loop } from '../../components/textLoop';
import styles from './style.module.less';

export const Header = () => {
  return (
    <div className={styles.headerContent}>
      <Flex align="center" id={`tech_enterprise_common_header`}>
        <span className={styles.title}>科技型企业</span>
        <Loop />
      </Flex>

      <div>
        <LinkRevoke />
      </div>
    </div>
  );
};
