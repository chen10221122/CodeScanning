import { useRef, useState, useMemo, useEffect } from 'react';

import { Empty, Checkbox } from '@dzh/components';
import { useDebounce, useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import ResetIcon from '@/assets/images/area/reset_icon@2x.png';
// import BackTop from '@/components/backTop'
import { WrapperContainer } from '@/pages/area/areaF9/components';
import * as S from '@/pages/area/areaF9/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import ChartLayOutContainer from './components/chartLayOutContainer';
import List from './components/listArea';
import { useIndicatorTree } from './hooks';
import { ModalType, ResetBtnType } from './types';

export default function Region() {
  const [cardFirstLoading, setCardFirstLoading] = useState(true);
  const [listFirstLoading, setListFirstLoading] = useState(true);
  const [reseting, setReseting] = useState(false);
  const [resetType] = useState(ResetBtnType.CARD);
  const [hiddenEmptyCard, setHiddenEmptyCard] = useState(true);
  const domRef = useRef();
  // 自定义指标弹窗的恢复默认按钮的状态，false 为无需恢复默认
  const [resetFlagState, setResetFlagState] = useState({
    cardResetFlag: false,
    listResetFlag: false,
  });
  const handleResetRef = useRef({
    cardResetHandle: () => undefined,
    listResetHandle: () => undefined,
  });
  const [loadingState, setLoadingState] = useState({
    cardLoading: true,
    listLoading: true,
  });
  // 宫格和列表是否有数据，用于加载失败状态的判断
  const [hasData, setHasData] = useState({
    cardHasData: true,
    listHasData: true,
  });
  useEffect(() => {
    // setReseting(loadingState.cardLoading || loadingState.listLoading);
    switch (resetType) {
      case ResetBtnType.CARD:
        setReseting(loadingState.cardLoading);
        break;
      case ResetBtnType.LIST:
        setReseting(loadingState.listLoading);
        break;
      case ResetBtnType.CAL:
        setReseting(loadingState.cardLoading || loadingState.listLoading);
        break;
      default:
        break;
    }
  }, [loadingState.cardLoading, loadingState.listLoading, resetType]);

  const resetVisible = useMemo(() => {
    switch (resetType) {
      case ResetBtnType.CARD:
        return resetFlagState.cardResetFlag;
      case ResetBtnType.LIST:
        return resetFlagState.listResetFlag;
      case ResetBtnType.CAL:
        return resetFlagState.cardResetFlag || resetFlagState.listResetFlag;
      default:
        return;
    }
  }, [resetFlagState.cardResetFlag, resetFlagState.listResetFlag, resetType]);
  // const scrollTop = useRef();

  const handleChangeReserFlag = useMemoizedFn((resetFlag, modalType) => {
    if (modalType === ModalType.CARD) setResetFlagState((d) => ({ ...d, cardResetFlag: resetFlag }));
    else setResetFlagState((d) => ({ ...d, listResetFlag: resetFlag }));
  });
  const handleChangeResetHandle = useMemoizedFn((modalType, handle) => {
    if (modalType === ModalType.CARD) handleResetRef.current.cardResetHandle = handle;
    else handleResetRef.current.listResetHandle = handle;
  });
  const handleChangeLoading = useMemoizedFn((modalType, loading) => {
    if (modalType === ModalType.CARD) setLoadingState((d) => ({ ...d, cardLoading: loading }));
    else setLoadingState((d) => ({ ...d, listLoading: loading }));
  });
  const handleChangeHasData = useMemoizedFn((modalType, hasData) => {
    if (modalType === ModalType.CARD) setHasData((d) => ({ ...d, cardHasData: hasData }));
    else setHasData((d) => ({ ...d, listHasData: hasData }));
  });

  const isLoading = useLoading(cardFirstLoading, listFirstLoading);

  const indicatorTreeParams = useIndicatorTree();

  useAnchor(isLoading);

  const handleChangeHidden = useMemoizedFn(() => setHiddenEmptyCard((hidden) => !hidden));
  const handleReset = useMemoizedFn(() => {
    setReseting(true);
    switch (resetType) {
      case ResetBtnType.CARD:
        resetFlagState.cardResetFlag && handleResetRef.current.cardResetHandle();
        break;
      case ResetBtnType.LIST:
        resetFlagState.listResetFlag && handleResetRef.current.listResetHandle();
        break;
      case ResetBtnType.CAL:
        resetFlagState.cardResetFlag && handleResetRef.current.cardResetHandle();
        resetFlagState.listResetFlag && handleResetRef.current.listResetHandle();
        break;
      default:
        break;
    }
  });

  const debounceLoading = useDebounce(isLoading, {
    wait: 1000,
    leading: true,
  });

  return (
    // <div  ref={scrollTop}>
    <Container>
      <WrapperContainer
        topIsSticky={false}
        loading={debounceLoading}
        loadingHideContent={true}
        content={
          <ContentContainer ref={domRef} id="wrapperContainer__ContentContainer">
            <ChartLayOutContainer
              setLoading={setCardFirstLoading}
              changeResetFlag={handleChangeReserFlag}
              changeResetHandle={handleChangeResetHandle}
              changeLoadingHandle={handleChangeLoading}
              hiddenEmptyCard={hiddenEmptyCard}
              changeHasData={handleChangeHasData}
              indicatorTreeParams={indicatorTreeParams}
            />
            <S.Container style={{ display: hasData.cardHasData ? 'block' : 'none' }}>
              <List
                setLoading={setListFirstLoading}
                changeResetFlag={handleChangeReserFlag}
                changeResetHandle={handleChangeResetHandle}
                changeLoadingHandle={handleChangeLoading}
                indicatorTreeParams={indicatorTreeParams}
              />
              {/* <IndustryStructure /> */}
              {/* <BackTop target={() => domRef.current || document.body}/> */}
            </S.Container>
            {!hasData.cardHasData ? <Empty type={Empty.LOAD_FAIL} /> : null}
          </ContentContainer>
        }
        // containerStyle={{
        //   minWidth: '1072px',
        //   padding: '0 6px 0 0',
        //   overflowX: 'hidden',
        // }}
        headerRightContent={
          !loadingState.cardLoading && hasData.cardHasData ? (
            <HeaderRightContainer>
              <Checkbox checked={hiddenEmptyCard} onChange={handleChangeHidden}>
                隐藏空卡片
              </Checkbox>
              {resetType !== ResetBtnType.NONE && resetVisible && (
                <Reset onClick={handleReset} aria-disabled={reseting}>
                  <span className="reset-icon" />
                  <span className="text">恢复默认</span>
                </Reset>
              )}
            </HeaderRightContainer>
          ) : null
        }
      ></WrapperContainer>
    </Container>
    //   <BackTop target={() => scrollTop.current || document.body}/>
    // </div>
  );
}

const Container = styled.div`
  width: 100%;
  // min-width: 1072px;
  height: 100%;
  // min-height: calc(100% - 48px);

  .main-content {
    padding: 0 20px 0 20px !important;
  }
`;
const ContentContainer = styled.div`
  /* min-width: 1026px; */
  overflow: inherit !important;
  .module-empty {
    margin-top: 4px;
    margin-bottom: 28px;
  }
  .chart-wrap-container {
    padding: 0;
    background: white;
    font-size: 0;

    .chart-wrap-border {
      border: 1px solid #f4f7f7;
      border-radius: 2px;
      height: 137px;
      /* padding: 16px 18px; */
      padding: 16px 14px;
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

  // .chart-wrap-border {
  //   display: flex;
  //   align-items: center;
  //   padding: 0 18px;
  //   height: 137px;
  //   border: 1px solid #f4f7f7;
  //   border-radius: 2px;
  // }

  .title-item-container {
    padding: 0;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0;
    z-index: 9;
    height: 34px;
    .select-right {
      font-size: 12px;
      font-weight: 400;
      color: #434343;
    }
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
  }
`;
const HeaderRightContainer = styled.div`
  // width: max-content;
  display: flex;
  // align-items: center;
  justify-content: flex-end;
`;
const Reset = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  width: 72px;
  height: 16px;
  // background: #f8fbff;
  border-radius: 2px;
  cursor: pointer;

  .reset-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    margin-right: 4px;
    background: url('${ResetIcon}');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .text {
    display: inline-block;
    width: 48px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
    text-align: left;
    color: #141414;
  }
`;
