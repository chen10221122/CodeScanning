import { FC, Fragment, memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useRequest, useMemoizedFn, useSize } from 'ahooks';
import styled from 'styled-components';

import downSvg from '@pages/area/areaF9/assets/down.svg';
import AreaReportDown from '@pages/area/areaF9/components/header-content/areaReportDown';
import { useSelector } from '@pages/area/areaF9/context';
import { useParams } from '@pages/area/areaF9/hooks';

import { getAppletQrcode, getAppQrcode } from '@/apis/area/areaEconomy';
import { getConfig } from '@/app';
import vip_ico from '@/assets/images/detail/credit_report_vip.png';
import TrialButton from '@/components/trialButton';
import { AREA_COMPARE_SELECTED_CODE } from '@/configs/localstorage';
import { LINK_AREA_COMPARE } from '@/configs/routerMap';
import { useTrackMenuClick } from '@/libs/eventTrack';
import { useTab } from '@/libs/route';
import pkImg from '@/pages/area/areaF9/assets/pk.svg';

import PhoneQrcode from './phone-qrcode';

interface RightContentProps {
  setRightWidth: Function;
}

const RightContent: FC<RightContentProps> = ({ setRightWidth }) => {
  const { code } = useParams();
  const history = useHistory();
  const { trackMenuClick } = useTrackMenuClick();
  const { tab } = useTab();

  const areaInfo = useSelector((store) => store.areaInfo);
  const regionEconomyCheckInfo = useSelector((store) => store.regionEconomyCheckInfo);

  const [appImg, setAppImg] = useState('');
  const [appletImg, setAppletImg] = useState('');
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

  useEffect(() => {
    if (code && areaInfo?.regionName) {
      executeAppQrcode(encodeURIComponent(code), encodeURIComponent(areaInfo?.regionName));
      executeAppletQrcode(encodeURIComponent(code));
    }
  }, [areaInfo?.regionName, code, executeAppQrcode, executeAppletQrcode]);

  useEffect(() => {
    if (dataAppQrcode?.data) {
      setAppImg(dataAppQrcode?.data);
    }
    if (dataAppletQrcode?.data) {
      setAppletImg(dataAppletQrcode?.data);
    }
  }, [dataAppQrcode, dataAppletQrcode?.data]);

  const onTraceClick = useMemoizedFn((title) => {
    trackMenuClick(null, {
      url: window.location.href,
      title,
      from: 'areaPageTop',
      id: code,
      name: areaInfo?.regionName,
      tabName: tab.title,
      event: 'menuClick',
      type: 'area',
    });
  });

  /** 跳转到区域对比页面 */
  const toPK = useMemoizedFn(() => {
    onTraceClick('对比');
    localStorage.setItem(AREA_COMPARE_SELECTED_CODE, code);
    history.push(LINK_AREA_COMPARE);
  });

  const onReportClick = useMemoizedFn(() => onTraceClick('区域报告'));
  const onQRCodeClick = useMemoizedFn(() => onTraceClick('扫一扫'));

  const { width = 0 } = useSize(document.getElementById('right-container-id')) || {};

  useEffect(() => {
    setRightWidth(width);
  }, [setRightWidth, width]);

  return (
    <RightContainer id="right-container-id" className="toptools-wrap">
      {regionEconomyCheckInfo ? (
        <>
          <div className="trial-wrap">
            <TrialButton
              // @ts-ignore
              powerTip={'普通用户每日可查看5个地区，成为VIP会员即可无限次查看'}
              placement={'bottomRight'}
              requestNumText={regionEconomyCheckInfo}
            />
          </div>
          <span className="split-margin"></span>
        </>
      ) : null}
      <div className="pk-btn" onClick={toPK}>
        <img src={pkImg} alt="" className="pk-img" />
        对比
      </div>
      <div onClick={onQRCodeClick}>
        <PhoneQrcode
          executeAppQrcode={() =>
            executeAppQrcode(encodeURIComponent(code!), encodeURIComponent(areaInfo?.regionName!))
          }
          executeAppletQrcode={() => executeAppletQrcode(encodeURIComponent(code!))}
          loading={appQrcodeLoading || qrcodeLoading}
          appQrcodeSrc={appImg}
          showApp={!getConfig((d) => d.modules.hideScanQRCode)}
          showApplet={true}
          appletQrcodeSrc={appletImg}
        />
      </div>
      <div onClick={onReportClick}>
        <AreaReportDown code={code} className="area-report-down">
          <img src={downSvg} alt="" className="down-icon" />
          <span>区域报告</span>
          <img src={vip_ico} alt="" className="vip-icon" />
        </AreaReportDown>
      </div>
    </RightContainer>
  );
};

export default memo(RightContent);

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 24px;
  .trial-wrap {
    & > span {
      position: static;
    }
    .iconfont {
      font-size: 12px;
    }
  }
  .split-margin {
    display: inline-block;
    border: 1px solid #ececec;
    height: 15px;
    margin: 0 16px;
  }
  .pk-btn {
    font-size: 13px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    margin-right: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .pk-img {
      margin-right: 4px;
    }
  }
  .area-report-down {
    margin-left: 16px;
    cursor: pointer;
    font-size: 13px;
    color: #000;
    display: flex;
    align-items: center;
    line-height: 20px;
    .vip-icon {
      width: 22px;
      position: relative;
      top: -5px;
    }
    .down-icon {
      margin-right: 3px;
    }
  }
`;
