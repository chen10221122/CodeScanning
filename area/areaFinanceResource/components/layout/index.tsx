import cn from 'classnames';

import NextNode from '@pages/area/areaFinanceResource/components/nextNode';

import { Provider } from './context';

import S from '@/pages/area/areaFinanceResource/style.module.less';

export default function CommonLayout({ needNext, children }: any) {
  return (
    <Provider>
      <div className={cn(S.container, S.customContainer)}>
        {children}
        {needNext && <NextNode />}
      </div>
    </Provider>
  );
}
