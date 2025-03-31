import { useState, useLayoutEffect, useRef } from 'react';

import { useBoolean, useMemoizedFn } from 'ahooks';

import IndustrialParkContext from './context';
import Main from './modules/main';
import Map from './modules/map';
import Modal from './modules/modal';

const IndustrialPark = () => {
  const [isOpenEnterprise, { setTrue: setEnterpriseTrue, setFalse: setEnterpriseFalse }] = useBoolean(false);
  const [isOpenMap, { setTrue: setMapTrue, setFalse: setMapFalse }] = useBoolean(false);
  const [enterpriseParams, setEnterpriseParams] = useState({ devZoneCode: '', devZoneName: '' });
  const [mapParams, setMapParams] = useState({
    devZoneName: '',
    devZoneCode: '',
    devZoneSquare: '',
    devZoneArea: '',
    centerCoordinates: '',
    closureCoordinates: '',
    areaCode: '',
  });
  const [areaCode, setAreaCode] = useState('');
  const aMap = useRef<any>(); //地图实例
  const [mapStatus, setMapStatus] = useState(false); //地图状态

  const handleOpenEnterpriseModal = useMemoizedFn((row) => {
    const { devZoneCode, devZoneName } = row;
    setEnterpriseParams({ devZoneCode, devZoneName });
    setEnterpriseTrue();
  });

  const handleOpenMapModal = useMemoizedFn((row) => {
    const { devZoneName, devZoneCode, devZoneSquare, devZoneArea, centerCoordinates, closureCoordinates } = row;
    setMapParams({
      devZoneName,
      devZoneCode,
      devZoneSquare,
      devZoneArea,
      centerCoordinates,
      closureCoordinates,
      areaCode,
    });
    setMapTrue();
  });

  //初始化
  useLayoutEffect(() => {
    if (!process.env.REACT_APP_REMOVR_GD_MAP) {
      import('@amap/amap-jsapi-loader').then((AMapLoader) => {
        AMapLoader.load({
          key: process.env.REACT_APP_GD_MAP!, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((AMap) => {
            aMap.current = AMap;
            setMapStatus(true);
          })
          .catch((e) => {
            console.error('地图加载失败', e);
          });
      });
      return () => {
        aMap.current = null;
      };
    }
  }, []);

  return (
    <IndustrialParkContext.Provider
      value={{
        isOpenEnterprise,
        enterpriseParams,
        isOpenMap,
        mapParams,
        aMap,
        mapStatus,
        setAreaCode,
        setEnterpriseFalse,
        handleOpenEnterpriseModal,
        setMapFalse,
        handleOpenMapModal,
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <Main />
        <Modal />
        <Map />
      </div>
    </IndustrialParkContext.Provider>
  );
};

export default IndustrialPark;
