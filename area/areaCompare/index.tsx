import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { getAreaCompareInfo, getInitYear } from '@/apis/area/areaCompare';
import { AreaCompare } from '@/apis/area/type.define';
import NoPowerDialog from '@/app/components/dialog/power/noPayNotice';
import { Button, Checkbox, Modal } from '@/components/antd';
import BackTop from '@/components/backTop';
import Icon from '@/components/icon';
import { defaultAreas, LIMIT_SELECT } from '@/pages/area/areaCompare/const';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import NewUpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
// import TraceModal from '@/pages/area/areaDebt/components/modal/traceModal';
// import useTraceModalFn from '@/pages/area/areaDebt/hooks/useTraceModalFn';
// import useUpdateModalFn from '@/pages/area/areaDebt/hooks/useUpdateModalFn';
import useShareSelectedAreas from '@/pages/area/hooks/useShareSelectedAreas';
import { useDomScroll, useImmer, usePromise } from '@/utils/hooks';
import { useLocation } from '@/utils/router';

import useStandardPadding from '../hooks/useDynamicPadding';
import { getStyleText, removeSpecialChar } from './common';
import AreaSelectDialog from './components/AreaSelectorModal';
import { getValueFromAreaItem } from './components/AreaSelectorModal/utils';
import CompareRecord from './components/compareRecord';
import DragArea from './components/dragList';
import { SingleSelectCheckbox } from './components/singleSelectCheckbox';
import { AreaContext, Provider, useCtx } from './context';
import FilterIndicator from './modules/filterIndicator';
import IndicatorDialog from './modules/IndicatorDialog';
import ScopeDialog from './modules/scopeDialog';
import { GlobalStyle, OuterLay, SideStyle, FixedBanner, FixedLine, TitleWrapperBG } from './styles';
import Title from './title';

export const scrollLimit: number = 54;

function Main() {
  const {
    state: { selectedAreaDataWithSelfLevel, chartModalVisible, indicatorTree, indexIds },
    update,
  } = useCtx();
  const havePay = useSelector((store: any) => store.user.info).havePay;

  // 其他页面跳转到区域对比，获取地区名称和code
  const { state }: Record<string, any> = useLocation();
  // console.log('indicatorTree, indexIds', indicatorTree, indexIds);

  const handleClear = useMemoizedFn(() => {
    if (!havePay) {
      setShowPowerDialog(true);
      return;
    }
    // @ts-ignore
    Modal.confirm({
      title: '提示',
      icon: (
        <Icon
          symbol="iconClose-Circle-Fill2x"
          style={{ float: 'left', width: '21px', height: '21px', margin: '0 16px 40px 0' }}
        />
      ),
      content: '确定要一键清空所有地区数据吗，是否确认删除？',
      onOk() {
        setAreaData((arr) => (arr = []));
        setSearchAreaData((arr) => (arr = []));
        update((d) => {
          d.areaChangeIndex = -1;
        });
      },
      onCancel() {},
    });
  });
  //对比记录弹窗
  const [recordVisible, setRecordVisible] = useState(false);
  //地区综合评分弹窗
  const [scopeVisible, setScopeVisible] = useState(false);
  // 设置标题
  const [visible, setVisible] = useState(false); //dialog显示
  // const [openSource, setOpenSource] = useState(false); //溯源
  const [hoverIdx, setHoverIdx] = useState(-1); //hover 行

  const [checkBoxVal, setCheckBoxVal] = useImmer<string[]>([]);
  const [sticky, setSticky] = useState(false); //只做样式判断
  const [areas, setAreas] = useImmer<AreaCompare.areaItem[]>([]); //dialog框 搜索地区值
  const [areaData, setAreaData] = useImmer<AreaCompare.areaIndicator[]>([]); //显示数据
  const [selectYear, setSelectYear] = useState<string>('');
  const [showPowerDialog, setShowPowerDialog] = useState(false);
  const areaDataRef = useRef(areaData);

  const [closeIndicators, setCloseIndicators] = useImmer<string[]>([]); //折叠指标
  const closeIndicatorsRef = useRef(closeIndicators);
  const [indicators, setIndicators] = useState<AreaCompare.indicator[] | null>(null); //指标栏，数据为空时显示上次数据指标
  // 获得分享的数据
  const { year: initialYear, sharedAreas } = useShareSelectedAreas();
  // 若分享数据存在，则使用分享的数据。反之使用默认数据
  const { scrollTop } = useDomScroll('#tabsWrapper');

  const [searchAreaData, setSearchAreaData] = useImmer<AreaCompare.areaItem[][]>(defaultAreas); //搜索的地区列表（全路径）
  const searchAreaDataRef = useRef(searchAreaData);
  const getAreaCompareInfoPromise = usePromise(getAreaCompareInfo);
  const getInitYearPromise = usePromise(getInitYear);
  const [condition, setCondition] = useState({ code: '', date: '' }); // 导出excel参数

  // 标准边距
  const dynamicPadding = useStandardPadding('#area-compare-page');

  const scrollDom = useRef(null);

  // 获取相似经济跳转本页面的地区参数
  useEffect(() => {
    if (sharedAreas.length) setSearchAreaData(() => sharedAreas);
  }, [setSearchAreaData, sharedAreas]);

  // 获取区域经济大全、区域经济跳转本页面的地区参数
  useEffect(() => {
    if (state) {
      const { regionCode, regionName } = state || {};
      setSearchAreaData(() => [[{ label: regionName, value: regionCode }]]);
    }
  }, [setSearchAreaData, state]);

  const checkboxOptions = useMemo(
    () => [
      { label: '隐藏空行', value: 'equal', disabled: areaData.length <= 1 },
      // { label: '显示最高项', value: 'max', disabled: areaData.length <= 1 },
      // { label: '显示最低项', value: 'min', disabled: areaData.length <= 1 },
    ],
    [areaData],
  );

  useEffect(() => {
    //获取时间选择初始状态
    getInitYearPromise()
      .then((res) => {
        const y = initialYear ? initialYear : res.data.split('-')[0];
        setSelectYear(y);
        update((d) => {
          d.date = y;
        });
      })
      .catch((e) => setSelectYear('2019'));
  }, [setSelectYear, getInitYearPromise, initialYear, update]);

  useEffect(() => {
    areaDataRef.current = areaData;

    if (areaData.length === 1) setCheckBoxVal((o) => (o = []));
  }, [areaData, setCheckBoxVal]);

  useEffect(() => {
    closeIndicatorsRef.current = closeIndicators;
  }, [closeIndicators]);

  useEffect(() => {
    searchAreaDataRef.current = searchAreaData;
  }, [searchAreaData]);

  /** 获取筛选的地区数据 */
  const getAreasData = useCallback(
    (areaList: AreaCompare.areaItem[][], year) => {
      indicatorTree?.length &&
        getAreaCompareInfoPromise({ areaList, year, indicatorTree, indexIds }).then((res) => {
          let copy = cloneDeep(res);
          // 将省市本级的节点添加标记
          if (selectedAreaDataWithSelfLevel?.length && copy?.[0]) {
            selectedAreaDataWithSelfLevel.forEach((o: any) => {
              copy.forEach((item: any) => {
                // 后2位是00代表省或者市本级
                if (String(item.value) === String(o.value) || /^\d{4}00$/.test(String(item.value))) {
                  item.isSelfLevel = o.isSelfLevel;
                }
              });
            });
          }
          setAreaData((o) => (o = copy));
          if (copy[0]) setIndicators(copy[0].indicators);
        });
      // .catch((e) => {
      //   if (e.returncode === 202) setShowPowerDialog(false);
      //   setAreaData((o) => (o = fakeData as any));
      //   setIndicators(fakeData[0].indicators as any);
      // });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getAreaCompareInfoPromise, searchAreaData, selectedAreaDataWithSelfLevel, setAreaData, indicatorTree, indexIds],
  );

  useEffect(() => {
    //请求展示数据
    if (selectYear) {
      getAreasData(searchAreaData, selectYear);
      const regionCode = searchAreaData
        .map((item) => {
          return item?.find((i) => !!i.value)?.value || '';
        })
        .join(',');
      setCondition({ date: selectYear, code: regionCode });
    }
  }, [getAreasData, searchAreaData, selectYear, indicatorTree, indexIds]);
  // 地区选择弹窗
  const opts = {
    visible,
    setVisible,
    closeIndicators,
    searchAreaData,
    setSearchAreaData,
  };

  //监听滚动设置补充吸顶样式
  useEffect(() => {
    setSticky(scrollTop > scrollLimit);
  }, [scrollTop, setSticky]);

  const ToggleIndicator = useCallback(
    (str) => {
      let v = removeSpecialChar(str);

      let idx = closeIndicatorsRef.current.indexOf(v);
      setCloseIndicators((arr) => {
        idx !== -1 ? arr.splice(idx, 1) : arr.push(v);
      });
    },
    [setCloseIndicators],
  );

  const onCheckBoxChange = useCallback(
    (checkedValues) => {
      setCheckBoxVal((o) => (o = checkedValues));
    },
    [setCheckBoxVal],
  );

  const onSelectCheckBoxChange = useMemoizedFn((select) => {
    setCheckBoxVal((o) => (o = select));
  });

  /**
   * 根据指标添加类名和样式
   */
  const StyleContent = useMemo(() => {
    return indicators ? getStyleText(indicators) : null;
  }, [indicators]);

  const FixedBannerJSX = useMemo(
    () =>
      !sticky ? null : (
        <>
          <FixedBanner />
          <FixedLine />
        </>
      ),
    [sticky],
  );

  /** 计算指标溯源弹窗 */
  const {
    // UpdateTipCref,
    // UpdateTipScreenCref,
    // openUpdate,
    traceSource,
    traceCref,
    // tipLoading: loading2,
    // tipData: updateData,
    // getTipData,
  } = useUpdateTip({});

  /** 更新提示弹窗 */
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  const filterOpts = { selectYear, setSelectYear, traceCref };

  const closeIndicatorDialog = useMemoizedFn(() => {
    update((draft) => {
      draft.chartModalVisible = false;
    });
  });

  return (
    <AreaContext.Provider
      value={{
        areaData,
        setAreaData,
        setAreas,
        setVisible,
        scrollTop,
        indicators,
        setSearchAreaData,
        openSource: traceSource,
        hoverIdx,
        setHoverIdx,
      }}
    >
      <GlobalStyle />

      {/* 第一列指标的样式 */}
      <Helmet>
        <style>{StyleContent}</style>
      </Helmet>

      {/* 页面头部吸顶元素 */}
      <TitleWrapperBG />

      <OuterLay
        id="area-compare-page"
        // style={{ background: 'rgb(246, 246, 246)' }}
        className={classNames({ noPower: showPowerDialog })}
        ref={scrollDom}
        dynamicPadding={dynamicPadding}
        sticky={sticky}
      >
        <div className="container-custom">
          <TitleWrapper dynamicPadding={dynamicPadding} sideMenuWidth={0}>
            <h1>区域对比工具</h1>

            <span
              className="btn"
              onClick={() => {
                setRecordVisible(true);
              }}
            >
              <Icon image={require('./imgs/icon_gsgy_x.png')} style={{ width: 12, height: 12, marginRight: 4 }} />
              对比历史
            </span>
          </TitleWrapper>

          <div className="main">
            <div className={classNames(['content', ...closeIndicators, { sticky }, ...checkBoxVal])}>
              <SideStyle>
                <div className="opt-select">
                  <div className="inner">
                    <h2>
                      {searchAreaData?.length
                        ? `已选${searchAreaData.length}/${havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL}`
                        : '暂无对比'}
                    </h2>
                    {searchAreaData?.length ? (
                      <span className="clear-btn" onClick={handleClear}>
                        清空
                      </span>
                    ) : null}
                    <Checkbox.Group options={checkboxOptions} onChange={onCheckBoxChange} value={checkBoxVal} />
                    <SingleSelectCheckbox
                      disabled={areaData.length <= 1}
                      onSelectCheckBoxChange={onSelectCheckBoxChange}
                    />
                  </div>
                </div>
                {/* 时间和指标筛选、溯源和导出 */}
                <FilterIndicator {...filterOpts} condition={condition} />

                {/* 表格 */}
                <Title toggleIndicator={ToggleIndicator} />
              </SideStyle>

              <div className={classNames(['drag-area', { noData: !areaData.length }])}>
                {areaData.length ? null : (
                  <div className="add-area">
                    <div>
                      <h3>添加地区</h3>
                      <p>请点击按钮添加地区，最多可添加8个地区</p>
                      <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                          setAreas((o) => (o = []));
                          setVisible(true);
                        }}
                      >
                        点击添加
                      </Button>
                    </div>
                  </div>
                )}
                {/* <DragAreaWrapper> */}
                <DragArea setShowPowerDialog={setShowPowerDialog} selectYear={selectYear} openModal={openModal} />
                {/* </DragAreaWrapper> */}
              </div>
            </div>
          </div>
        </div>
        <BackTop target={() => scrollDom.current!} />
      </OuterLay>

      <NoPowerDialog visible={showPowerDialog} setVisible={setShowPowerDialog} type="areaDiff">
        <DialogContentStyle />
      </NoPowerDialog>

      {/* 固定头部背景 */}
      {FixedBannerJSX}
      {/* 地区选择弹窗 */}
      <AreaSelectDialog key={getValueFromAreaItem(areas)} {...opts} />
      {/* 对比记录 */}
      {recordVisible && (
        <CompareRecord
          visible={recordVisible}
          onCancel={() => {
            setRecordVisible(false);
          }}
          onSelect={(d) => {
            setSearchAreaData((o) => (o = d.data));
            setRecordVisible(false);
          }}
        />
      )}

      <IndicatorDialog
        data={[]}
        indicator=""
        indicatorName=""
        visible={chartModalVisible}
        onClose={closeIndicatorDialog}
        condition={{}}
      />

      {/* 溯源弹窗 */}
      <NewUpdateModal {...modalInfo} onClose={closeModal} container={scrollDom.current! || document.body} />

      <div
        style={{
          position: 'sticky',
          textAlign: 'right',
          bottom: '400px',
        }}
        onClick={() => {
          setScopeVisible(true);
        }}
      >
        地区综合评分
      </div>

      {/* 地区综合评分弹窗 */}
      <ScopeDialog
        visible={scopeVisible}
        regionInfo={{ regionCode: '110000', regionName: '北京' }}
        onCancel={() => {
          setScopeVisible(false);
        }}
      />

      {contetHolder}
    </AreaContext.Provider>
  );
}
function AreaComparePage() {
  return (
    <Provider>
      <Main />
    </Provider>
  );
}

export default AreaComparePage;

export const DialogContentStyle = styled.div`
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
    background: url(${require('@/assets/images/power/area_diff.png')}) center center;
    background-size: cover;
  }
`;

const TitleWrapper = styled.div<{ dynamicPadding: number; sideMenuWidth: number }>`
  height: 36px;
  width: 100%;
  background: #fff;
  padding-left: 24px;
  //background: url(${require('@/assets/images/topic/head.png')}) no-repeat;
  background-size: 100% 100%;
  position: relative;
  z-index: 2;
  //border-bottom: 1px solid rgba(1, 113, 246, 0.3);
  &:after {
    content: '';
    width: ${({ sideMenuWidth }) => `calc(100vw - ${sideMenuWidth}px)`};
    position: absolute;
    left: -${({ dynamicPadding }) => dynamicPadding}px;
    border-bottom: 1px solid rgba(1, 113, 246, 0.3);
    display: inline-block;
    min-width: 1226px;
  }

  .btn {
    cursor: pointer;
    position: absolute;
    left: 97px;
    top: 9px;
    border-radius: 13px;
    color: #0171f6;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
  }

  h1 {
    opacity: 1;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 36px;
    margin: 0 !important;
  }
`;
