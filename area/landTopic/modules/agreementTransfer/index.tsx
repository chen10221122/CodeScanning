import { memo, useEffect } from 'react';

import { Spin } from '@dzh/components';

import CardTable from '@pages/area/landTopic/modules/agreementTransfer/modules/cardTable';
import HeaderFilter from '@pages/area/landTopic/modules/agreementTransfer/modules/headerFilter';
import { Provider, useCtx } from '@pages/area/landTopic/modules/agreementTransfer/provider';

import { useTitle } from '@/app/libs/route';

import useIndicator from '../../useIndicator';

import S from '@pages/area/landTopic/styles.module.less';

const Main = () => {
  const {
    state: { firstLoading },
  } = useCtx();
  const { run } = useIndicator(); // 获取指标树

  useEffect(() => {
    run('2');
  }, [run]);
  return (
    <div className={S['main-content']}>
      {firstLoading ? <Spin spinning={firstLoading} type="fullThunder" className={S['first-loading']} /> : null}
      <HeaderFilter />
      <CardTable />
    </div>
  );
};

const AgreementTransfer = () => {
  useTitle('协议划拨');
  return (
    <Provider>
      <Main />
    </Provider>
  );
};

export default memo(AgreementTransfer);
