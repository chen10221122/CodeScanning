import { useEffect, useRef } from 'react';
import KeepAlive from 'react-activation';
import { shallowEqual, useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { useModal } from '@/app/components/modal/NoPayNotice';
import { useTitle } from '@/app/libs/route';
import area_diff from '@/assets/images/power/areaFinancing.png';
import BackTop from '@/components/backTop';
import { useTreePush } from '@/components/commonQuickNavigation/utils';
import { LINK_AREA_FINANCING } from '@/configs/routerMap';
import { dynamicLink, useParams } from '@/utils/router';
import RouterView from '@/utils/router/routerView';

import SideMenu from './components/sideMenu';
import { menuArray, sideMenuData, VIP_MENU_KEYS } from './config';
import { Provider, useCtx } from './context';
import S from './style.module.less';

const AreaFinancingContent = () => {
  useTitle('区域融资对比');
  const {
    state: { openKeys, fullLoading },
    update,
  } = useCtx();
  const ref = useRef(null);
  const push = useTreePush();
  const { key } = useParams<{ key?: string }>();
  const firstRef = useRef(true);

  // 用户账号信息
  const userInfo = useSelector((store: any) => store.user.info, shallowEqual);
  useEffect(() => {
    if (ref.current) {
      update((d) => {
        d.wrapperRef = ref.current;
      });
    }
  }, [update]);
  useEffect(() => {
    if (key) {
      update((d: any) => {
        d.tabKey = key === ':key' ? push(dynamicLink(LINK_AREA_FINANCING, { key: 'resourceLoanScale' })) : key;
        if (firstRef.current) {
          d.openKeys = menuArray.map((item: any) => item.label);
          firstRef.current = false;
        }
      });
    }
  }, [key, push, update]);

  const [modal, contextHolder] = useModal();
  /** 点击菜单栏 */
  const handleMenuClick = useMemoizedFn(({ key }: any) => {
    // vip未付费
    if (VIP_MENU_KEYS.includes(key) && !userInfo?.havePay) {
      modal.open({
        permission: {
          title: '权限不足',
          description: `成为正式用户即可查看区域租赁融资`,
          showVipIcon: true,
          exampleRender: () => <DialogContentStyle />,
        },
      });
      return;
    }
    update((d: any) => {
      d.tabKey = key;
    });
    push(dynamicLink(LINK_AREA_FINANCING, { key }));
  });

  return (
    <div className={S.wrapper}>
      <div className={S.main}>
        <div className={S['left-menus']}>
          {!fullLoading ? (
            <SideMenu
              menus={sideMenuData}
              onClick={handleMenuClick}
              selectedKeys={[key] as string[]}
              openKeys={openKeys}
              wrapperClassName="left-menu"
              isOpenAll={true}
            />
          ) : null}
        </div>

        <div className={S.content} id="areaFinancingWrapper" ref={ref}>
          <KeepAlive id={key}>
            <RouterView />
          </KeepAlive>
        </div>
        {contextHolder}
        <BackTop target={() => ref.current || document.body} />
      </div>
    </div>
  );
};

const AreaFinancing = () => {
  return (
    <Provider>
      <AreaFinancingContent />
    </Provider>
  );
};
export const DialogContentStyle = styled.div<any>`
  background: #ffffff;
  border-radius: 4px;
  height: 174px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 7px;
    left: 12px;
    right: 12px;
    bottom: 7px;
    background: url(${area_diff});
    background-size: cover;
  }
`;
export default AreaFinancing;
