import { useEffect, useRef } from 'react';
import KeepAlive from 'react-activation';

import { useMemoizedFn } from 'ahooks';

import { SideMenu } from '@/components';
import BackTop from '@/components/backTop';
import { LINK_AREA_FINANCE_RESOURCE } from '@/configs/routerMap';
import { dynamicLink, useHistory, useParams } from '@/utils/router';
import RouterView from '@/utils/router/routerView';

import { menuArray, sideMenuData } from './config';
import { Provider, useCtx } from './context';
import S from './style.module.less';

const Content = () => {
  const {
    state: { openKeys, fullLoading },
    update,
  } = useCtx();
  const ref = useRef(null);
  const { push } = useHistory();
  const firstRef = useRef(true);

  const { key } = useParams<{ key?: string }>();

  useEffect(() => {
    if (ref.current) {
      update((d) => {
        d.wrapperRef = ref.current;
      });
    }
  }, [update]);
  useEffect(() => {
    if (key) {
      setTimeout(() => {
        update((d: any) => {
          d.tabKey = key;
          if (firstRef.current) {
            d.openKeys = menuArray.map((item: any) => item.label);
            firstRef.current = false;
          }
        });
      }, 200);
    }
  }, [key, update]);

  /** 点击菜单栏 */
  const handleMenuClick = useMemoizedFn(({ key }: any) => {
    update((d: any) => {
      d.tabKey = key;
    });
    document.getElementById('areaFinancingWrapper-contentWrap')?.scrollIntoView();
    push(dynamicLink(LINK_AREA_FINANCE_RESOURCE, { key }));
  });

  return (
    <div className={S.wrapper}>
      <div className={S.main}>
        <div className={S['left-menus']}>
          {!fullLoading ? (
            <SideMenu
              menus={sideMenuData}
              selectedKeys={[key] as string[]}
              wrapperClassName="left-menu"
              isOpenAll={true}
              openKeys={openKeys}
              onClick={handleMenuClick}
            />
          ) : null}
        </div>
        <div className={S.content} id="areaFinancingWrapper" ref={ref}>
          <KeepAlive id={key}>
            <RouterView />
          </KeepAlive>
          <BackTop target={() => ref.current!} />
        </div>
      </div>
    </div>
  );
};

const FinanceResource = () => {
  return (
    <Provider>
      <Content />
    </Provider>
  );
};

export default FinanceResource;
