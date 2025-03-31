import cn from 'classnames';

import NextNode from '@pages/area/areaFinancing/components/nextNode';

import { Provider } from './context';

import S from '@/pages/area/areaFinancing/style.module.less';

export default function CommonLayout({ needNext, children, noProvider }: any) {
  return noProvider ? (
    <div className={cn(S.container, S.customContainer)}>
      {children}
      {needNext && <NextNode />}
    </div>
  ) : (
    <Provider>
      <div className={cn(S.container, S.customContainer)}>
        {children}
        {needNext && <NextNode />}
      </div>
    </Provider>
  );
}
