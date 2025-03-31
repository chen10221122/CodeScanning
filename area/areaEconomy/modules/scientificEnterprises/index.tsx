import { useMount } from 'ahooks';

import { useGetAreaOptions } from './hooks/useGetAreaOptions';
import { MainContent } from './modules';
import { Provider, useCtx } from './provider/ctx';
import styles from './styles.module.less';

const TechnologyEnterprise = () => {
  useGetAreaOptions();
  const { update } = useCtx();

  useMount(() => {
    update((o) => {
      o.enterpriseStatus = 1;
    });
  });

  return (
    <div className={styles.wapper} style={{ opacity: 1 }}>
      <MainContent></MainContent>
    </div>
  );
};

export default () => {
  return (
    <Provider>
      <TechnologyEnterprise />
    </Provider>
  );
};
