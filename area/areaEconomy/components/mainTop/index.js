import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { Popover, Rate } from 'antd';

import { getAppletQrcode, getAppQrcode } from '@/apis/area/areaEconomy';
import { getConfig } from '@/app';
import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { useTitle } from '@/app/libs/route';
import TrialButton from '@/components/trialButton';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useLoading from '@/pages/detail/hooks/useLoading';
import useRequest from '@/utils/ahooks/useRequest';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import AreaRateDetail from './areaRateDetail';
import AreaTag from './components/AreaTag';
import PhoneQrcode from './components/phoneQrcode';
import TabArea from './components/TabArea';
import MulScreen from './screen';
import * as S from './style';
import useTabsConfig from './useTabsConfig';
// 头部的布局内容
function MainTop(options) {
  const { areaDataInfo, modelInfo, code } = options;
  const { key, code: urlCode } = useParams();

  const [popoverLeft, setPopoverLeft] = useState(0);
  const [jumpToAreaRank, setJumpToAreaRank] = useState(0);
  const [toolShow] = useState(false);
  const { tabsConfig, setTabsConfig } = useTabsConfig();
  const history = useHistory();
  const scrollWrapper = useRef();
  const isTabFixed = useRef(false);
  const lastTimeScrollTop = useRef(0);
  const [title, setTitle] = useState();
  const [appImg, setAppImg] = useState();
  const [appletImg, setAppletImg] = useState();
  const {
    data: dataAppQrcode,
    run: executeAppQrcode,
    loading: appQrcodeLoading,
  } = useRequest(getAppQrcode, { manual: true });

  const {
    data: dataAppletQrcode,
    run: executeAppletQrcode,
    loading: qrcodeLoading,
  } = useRequest(getAppletQrcode, { manual: true });

  const {
    update,
    state: { showPowerDialog },
  } = useCtx();

  const regionEconomyCheckInfo = useSelector((store) => store.checkInfo.regionEconomyCheckInfo);

  useEffect(() => {
    const title = modelInfo?.country_name
      ? modelInfo?.country_name
      : modelInfo?.municipal_name
      ? modelInfo?.municipal_name
      : modelInfo?.province_name;

    setTitle(title);
  }, [modelInfo?.country_name, modelInfo?.municipal_name, modelInfo?.province_name]);

  useEffect(() => {
    if (code && title) {
      executeAppQrcode(encodeURIComponent(code), encodeURIComponent(title));
      executeAppletQrcode(encodeURIComponent(code));
    }
  }, [code, executeAppQrcode, executeAppletQrcode, title]);

  useEffect(() => {
    if (dataAppQrcode?.data) {
      setAppImg(dataAppQrcode?.data);
    }
    if (dataAppletQrcode?.data) {
      setAppletImg(dataAppletQrcode?.data);
    }
  }, [dataAppQrcode, dataAppletQrcode?.data]);

  /**
   * 处理 Tab 切换时重定向
   */
  const handleTabChange = useCallback(
    (targetKey) => {
      if (scrollWrapper.current) {
        lastTimeScrollTop.current = scrollWrapper.current.scrollTop;
        if (!isTabFixed.current) scrollWrapper.current.scrollTop = 0;
      }
      const keys = targetKey.split('#');
      const _key2 = keys?.[1] ? `#${keys[1]}` : `#${keys[0]}`;
      if (urlCode) {
        history.push(
          urlJoin(dynamicLink(LINK_AREA_F9, { key: keys[0], code: urlCode }), window.location.search, _key2),
        );
      } else {
        history.push(urlJoin(dynamicLink(LINK_AREA_F9, { key: keys[0] }), window.location.search, _key2));
      }
    },
    [history, urlCode],
  );

  // 根据当前路由 key 设置默认的 key
  useEffect(() => {
    setTabsConfig((d) => {
      d.forEach((tab) => {
        tab.active = tab.key === key;
      });
    });
  }, [key, setTabsConfig, tabsConfig]);

  useEffect(() => {
    // 滚动发生在 id 为 tabsWrapper 的 div 元素上
    const _n = document.getElementById('tabsWrapper');
    if (_n) scrollWrapper.current = _n;
  }, []);

  const content = <AreaRateDetail data={modelInfo} />;

  useEffect(() => {
    setPopoverLeft(141 - (document.getElementById('area_economy_top_empty')?.offsetLeft || 141));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.getElementById('area_economy_top_empty')?.offsetLeft]);
  const isLoading = useLoading(appQrcodeLoading || qrcodeLoading);

  useTitle(areaDataInfo?.regionInfo?.[0]?.regionName || '区域经济速览');

  return (
    <S.Container id="top_container">
      <div className="area-top">
        {/* 权限判断 */}
        <NoPayDialog
          visible={showPowerDialog}
          setVisible={() => {
            update((d) => {
              d.showPowerDialog = false;
            });
          }}
          type={'areaEconomyQuickView'}
        />
        {/* 地区名和切换城市 */}
        <div className="title" id="area_economy_title">
          {/* 标题 */}
          {areaDataInfo?.regionInfo?.length ? <h1> {areaDataInfo.regionInfo[0].regionName}</h1> : null}

          {/* 切换地区 */}
          <MulScreen code={code} getPopContainer={() => document.getElementById('area_economy_title')} />

          {/* 分割线 */}
          {areaDataInfo?.regionInfo?.length && areaDataInfo?.rating ? (
            <div className="divider" id="area_economy_top_divider" />
          ) : null}

          <div className="divider_empty" id="area_economy_top_empty" />

          <S.GlobalStyle popoverLeft={popoverLeft} />

          {/* 浮窗 */}
          <Popover
            content={content}
            getPopupContainer={() => document.getElementById('area_economy_top_empty')}
            placement="bottom"
            overlayClassName="area-rate-detail"
          >
            {areaDataInfo?.rating ? (
              <div className="rate">
                <div className="rate-word" />

                <div className="rate-star-wrap">
                  <span className="rate-num">{formatNumber(areaDataInfo.rating)}</span>
                  <span className="rate-chart">
                    <Rate
                      className="rate-start"
                      allowHalf
                      defaultValue={
                        areaDataInfo.rating > Math.floor(areaDataInfo.rating)
                          ? Math.floor(areaDataInfo?.rating) + 0.5
                          : Math.floor(areaDataInfo.rating)
                      }
                      value={
                        areaDataInfo.rating > Math.floor(areaDataInfo.rating)
                          ? Math.floor(areaDataInfo?.rating) + 0.5
                          : Math.floor(areaDataInfo.rating)
                      }
                      disabled
                    />
                  </span>
                </div>
              </div>
            ) : null}
          </Popover>

          <AreaTag jumpToAreaRank={jumpToAreaRank} setJumpToAreaRank={setJumpToAreaRank} />

          <div className="toptools-wrap">
            {regionEconomyCheckInfo ? (
              // uInfo.hasOwnProperty('havePay') && !uInfo.havePay ? (
              <>
                <div className="trial-wrap">
                  <TrialButton
                    // @ts-ignore
                    powerTip={'普通用户每日可查看5个地区，成为VIP会员即可无限次查看'}
                    placement={'bottomRight'}
                    requestNumText={regionEconomyCheckInfo}
                  />
                </div>
                {/* <div className="split-margin" /> */}
              </>
            ) : null}
            <PhoneQrcode
              executeAppQrcode={() => executeAppQrcode(encodeURIComponent(code), encodeURIComponent(title))}
              executeAppletQrcode={() => executeAppletQrcode(encodeURIComponent(code))}
              style={{ marginRight: `${toolShow ? '16px' : null}` }}
              isPopover={true}
              loading={isLoading}
              appQrcodeSrc={appImg}
              showApp={!getConfig((d) => d.modules.hideScanQRCode)}
              showApplet={true}
              appQrcodeLoading={appQrcodeLoading}
              qrcodeLoading={qrcodeLoading}
              appletQrcodeSrc={appletImg}
              code={code}
            />
            {/*{toolShow ? (*/}
            {/*  <TopTool content="收藏" icon={require('@/assets/images/area/qrscan_icon.png')} />*/}
            {/*) : null}*/}
          </div>
        </div>
        <div className="border_bottom_title" />
        {/*tab选项切换*/}
        <TabArea handleTabChange={handleTabChange} jumpToAreaRank={jumpToAreaRank} />
      </div>
    </S.Container>
  );
}

export default memo(MainTop);
