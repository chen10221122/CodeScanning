import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { getCityInvestLimits } from '@/apis/bond/cityInvestMap';
import NoPowerDialog from '@/app/components/dialog/power/noPayNotice';
import { Empty, Spin } from '@/components/antd';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { DialogContentStyle } from '@/pages/area/areaCompare';
import useMainTop from '@/pages/area/areaEconomy/components/mainTop/useMainTop';
import { Path } from '@/pages/area/areaEconomy/config/pathConfig';
import { Provider, useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { LayoutProvider } from '@/pages/detail/layoutContext';
import { Dispatch } from '@/store';
import useRequest from '@/utils/ahooks/useRequest';
import { dynamicLink } from '@/utils/router';
import { urlJoin, getUrlSearches } from '@/utils/url';

import MainTop from './components/mainTop';
import useInitParams from './useInitParams';

// 地区经济
const AreaEconomy = memo(() => {
  const history = useHistory();
  useInitParams();

  // 权限弹窗区域
  const havePay = useSelector((store: any) => store.user.info).havePay;
  const dispatch: Dispatch = useDispatch();
  const {
    update,
    state: { code: ctxCode },
  } = useCtx();
  const [showPowerMainDialog, setShowPowerMainDialog] = useState(false);
  const payCheck = useCallback(() => {
    if (!havePay) {
      setShowPowerMainDialog(true);
      return false;
    }
    return true;
  }, [havePay]);

  useEffect(() => {
    update((draft) => {
      draft.payCheck = payCheck;
    });
  }, [update, payCheck]);

  useEffect(() => {
    const wrap = document.getElementById('tabsWrapper') as HTMLElement;
    wrap.style.overflow = 'auto';
    return () => {
      wrap.style.overflow = '';
    };
  }, []);
  const { areaDataInfo, modelInfo, code, error, execute, pending } = useMainTop();

  /** 解决bug/#16008退出账号后重新登陆区域经济速览默认只登录上海市且页面无数据 */
  const { code: areaCode } = useParams<{ code: string }>();
  useEffect(() => {
    if (!areaCode) {
      update((d: any) => {
        d.code = '110000'; //若没有code，默认选择北京市的code
      });
    }
  }, [areaCode, update]);

  useEffect(() => {
    update((draft) => {
      draft.mainLoading = pending;
    });
  }, [update, pending]);

  const { runAsync: handleLimits } = useRequest(getCityInvestLimits, { manual: true });

  const historyCallback = useCallback(
    (location: any) => {
      const { pathname, search } = location;
      const newCode = getUrlSearches(search).code || '';
      if (newCode !== ctxCode && pathname === '/area/regionEconomy') {
        handleLimits({ code: newCode, pageCode: 'regionalEconomyQuickView' }).then((res: any) => {
          if (res?.info?.includes('该模块为VIP模块')) {
            const info = res?.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
            if (info.length > 1) {
              update((o) => {
                o.code = newCode;
              });
              dispatch.checkInfo.setRegionEconomyCheckInfo(`今日已查看${info[1]}`);
            }
          }
        });
      }
    },
    [ctxCode, dispatch.checkInfo, handleLimits, update],
  );

  useEffect(() => {
    const unlisten = history.listen(historyCallback);
    return () => {
      unlisten();
    };
  }, [history, historyCallback]);

  if (pending && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1')
    return <Spin type="fullThunder" spinning={true} />;

  return (
    <>
      <Container
        id="area_economy_container"
        style={{
          backgroundColor: error && ![202, 203, 204, 100].includes((error as any).returncode) ? 'white' : '#fafbfc',
          // 和地区切换的loading一个判断条件
          overflow: pending && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) === '1' ? 'hidden' : '',
        }}
        data-trace-module="区域经济速览"
      >
        {/*是否是除无权限外的加载失败*/}
        {error && ![202, 203, 204, 100].includes((error as any).returncode) ? (
          <Empty
            type={Empty.LOAD_FAIL}
            onClick={() => execute({ code })}
            style={{ paddingTop: '30vh', background: 'white' }}
          />
        ) : (
          <div className="area_economy_wrap">
            {/* 切换地区时的loading 带有通明度 */}
            {/* {pending && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) === '1' ? ( */}
            <div className="area_economy_change_area_loading">
              <Spin spinning={pending && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) === '1'} type="square">
                <MainTop areaDataInfo={areaDataInfo} modelInfo={modelInfo} code={code} />
              </Spin>
            </div>
            {/*权限检测*/}
            <NoPowerDialog visible={showPowerMainDialog} setVisible={setShowPowerMainDialog} type="areaDiff">
              <DialogContentStyle />
            </NoPowerDialog>
          </div>
        )}
      </Container>
    </>
  );
});

const AreaEconomyEntry = () => {
  const { key } = useParams<{ key?: string }>();
  // sessionStorage.setItem('AREA_IS_FIRST', '1')
  // setTimeout(() => {
  //  sessionStorage.removeItem('AREA_IS_FIRST')
  // }, 2000)
  //
  if (!key) {
    return (
      <Redirect
        to={`${urlJoin(
          dynamicLink(LINK_AREA_F9, { key: Path.REGION_ECONOMY, code: '110000' }),
          window.location.search,
        )}`}
      />
    );
  }
  return (
    <LayoutProvider>
      <Provider>
        <AreaEconomy />
      </Provider>
    </LayoutProvider>
  );
};

export default memo(AreaEconomyEntry);

const Container = styled.div`
  background-color: #fafbfc;
  min-width: 1226px; // 控制 1280 的时候才出滚动条
  height: 100%;

  //border: 1px solid transparent;
  .area_economy_wrap {
    position: relative;
    /* height: 100%; */

    .area_economy_change_area_loading {
      /* height: 100%; */
      .ant-spin-nested-loading {
        /* height: 100%; */
        & > div > .ant-spin {
          z-index: 5;
          /* height: 100%; */
          max-height: 100vh;
          position: absolute;
          .ant-spin-dot {
            z-index: 5 !important;
          }
        }
        /* .ant-spin-container {
          height: 100%;
        } */
        .ant-spin-blur {
          background-color: rgba(255, 255, 255);
          opacity: 0.1;
          z-index: 4;
        }
      }
    }
    //overflow-y: auto;
    //overflow-x: scroll;
  }

  .noNewRelatedData {
    padding-top: 10vh;
  }

  .smallNoScreenDataClear {
    margin-top: 14px;
    margin-bottom: 44px;
    .ant-empty-image {
      width: 176px;
      height: 106px;
      margin-bottom: 12px;
    }
  }

  @media (min-width: 1366px) {
    .area_economy_wrap {
      box-sizing: border-box;
      /* height: 100%; */
      #area_economy_contentview {
        background-color: #fafbfc !important;
        padding: 0 48px;
        box-sizing: border-box;
        /* height: 100%; */
      }
    }
  }

  /* .area_economy_loading {
    z-index: 4 !important;
    margin-left: 54px;
    margin-top: 52px;
  } */

  .area-economy-divider {
    height: 6px;
    background-color: #f5f5f5;
  }

  #area_economy_contentview {
    // 跟随头部设置最小宽度，否则缩小有空白
    //min-width: 1226px;
    .ant-table-sticky-holder {
      padding-top: 10px;
      margin-top: -10px;
      z-index: 7 !important;
    }
    .content-view {
      overflow: visible !important;

      .ant-tabs {
        overflow: visible !important;
      }
    }
  }

  .chart-wrap-container {
    padding: 8px 0px 0px 0px;
    margin-bottom: 4px;
    background: white;
    font-size: 0;
    .chart-wrap-border {
      border: 1px solid #f4f7f7;
      border-radius: 2px;
      height: 137px;
      padding: 17px 24px 17px 24px;
    }
    .line-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .chart-wrap-item {
        flex: 1;
        margin-right: 10px;
        &.hidden {
          display: block;
          opacity: 0;
        }
        &:last-child {
          margin-right: 0 !important;
        }
      }
    }
  }
`;

// const PaddingWrapper = styled.div`
//   background-color: #fff;
//   padding: 0 20px;
//   margin-bottom: 0 !important;
//   /* min-height: calc(100vh - 185px); */
//   min-height: calc(100vh - 120px);
// `;
