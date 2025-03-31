import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useMemoizedFn, useDebounce, useCreation } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import styled from 'styled-components';

import IndexSvg from '@/assets/images/area/index.svg';
import { Empty, Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
// import { Screen } from '@/components/screen';
import Table from '@/components/tableFinance';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useUpdateTip from '@/pages/area/areaDebt/components/updateTip';
import { getIndicAndUnit } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { WrapperContainer } from '@/pages/area/areaF9/components';
import { useSelector } from '@/pages/area/areaF9/context';
import * as S from '@/pages/area/areaF9/style';
import useLoading from '@/pages/detail/hooks/useLoading';
import { formatNumber } from '@/utils/format';
import useWindowSize from '@/utils/hooks/useWindowSize';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import InfoModal from '../regionalEconomy/infoModal';
import { currentYear /** options */ } from './constant';
import Header from './header';
import useListData from './useListData';

/**
 * code snippets from
 *
 * `src/pages/area/areaF9/modules/regionalOverview/regionalEconomy/index.js`
 */

export default function StatByMonth() {
  const domRef = useRef();
  const scrollRef = useRef();
  const backTopMounted = useRef();
  const areaInfo = useSelector((store) => store.areaInfo);
  const { code } = useParams();
  const [activeTab] = useState(2);
  const [quarterFlag, setQuarterFlag] = useState(false);
  const history = useHistory();
  const { width } = useWindowSize();

  /** 隐藏空行 */
  const [hiddenChecked, setHiddenChecked] = useState(true);
  /** 隐藏空列 */
  const [hiddenEmptyCols, setHiddenEmptyCols] = useState(true);

  const {
    pending: loading,
    tableData,
    handleChangeData,
    traceType,
    hasData,
  } = useListData({ hiddenChecked, hiddenEmptyCols, tabIndex: activeTab, quarterFlag });

  const [modal, setModal] = useState({
    show: false,
    title: '',
    data: '',
  });

  const { UpdateTipCref, openUpdate, traceSource, traceCref, handleTblCell } = useUpdateTip({ isLastWeek: true });

  /** 更新提示弹窗 */
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  // 无数据时不显示滚动条
  useEffect(() => {
    const wrap = document.getElementById('tabsWrapper');
    if (wrap) {
      wrap.style.overflowY = !hasData ? 'hidden' : '';
    }
    return () => {
      if (wrap) wrap.style.overflowY = '';
    };
  }, [hasData]);

  /** 隐藏空行 */
  const handleChangeHidden = useCallback(() => {
    setHiddenChecked((base) => !base);
  }, []);

  const handleChangeColsHidden = useMemoizedFn(() => {
    setHiddenEmptyCols((base) => !base);
  });

  //弹窗
  const handleShowModal = useCallback(
    (name, data) => {
      const regionName = areaInfo?.regionName || '';
      // const unUnitName = name?.lastIndexOf('(') ? name.slice(0, name.lastIndexOf('(')) : name;
      setModal({
        show: true,
        title: regionName + name,
        name,
        data,
        hasChart: 1,
        chartType: 'bar',
      });
    },
    [areaInfo?.regionName],
  );

  const handleClose = useCallback(() => {
    setModal((base) => {
      return { ...base, show: false };
    });
  }, []);

  // const onScreenChange = useMemoizedFn((row) => {
  //   if (isEmpty(row)) {
  //     setCurrentStat([]);
  //   } else {
  //     setCurrentStat(row.map((i) => i.value));
  //   }
  // });

  const finalColumns = useCreation(() => {
    const cloneInitColumn = [
      {
        title: '指标',
        align: 'left',
        fixed: true,
        width: 284,
        resizable: { min: 284, max: 780 },
        className: 'padding-left24 align-left',
        dataIndex: 'paramName',
        render: (text, row) => {
          const dataobj = cloneDeep(row.paramDetailArr) || {};
          /** 不展示预期目标列数据 */
          if (Object.keys(dataobj).includes(currentYear)) {
            delete dataobj[currentYear];
          }
          const hasHisitoryData = Object.keys(dataobj).length > 0;

          if (row.specialTitle) {
            return <span className="orange-title">{row.specialTitle}</span>;
          }
          return (
            <span
              onClick={() => {
                hasHisitoryData && handleShowModal(text, dataobj);
              }}
            >
              {text}
              {hasHisitoryData && (
                <img style={{ cursor: 'pointer', marginLeft: 8, width: 12, height: 12 }} src={IndexSvg} alt="" />
              )}
            </span>
          );
        },
      },
    ];

    tableData?.colKey?.forEach((o, i) => {
      /** 是否是预期目标列 */
      const isExpectCol = i === 0 && activeTab === 1;
      const [_y, _d] = o.split('-');
      cloneInitColumn.push({
        title: `${_y}年${Number(_d)}月`,
        width: 158,
        // className: i !== tableData?.colKey?.length - 1 ? 'padding-10 align-right' : 'align-right',
        align: 'right',
        dataIndex: o,
        resizable: { max: 780 },
        onCell: (record) => {
          const isUpdateItem = record?.paramDetailArr?.[o]?.updateValue;
          return !record?.[o]
            ? {}
            : handleTblCell({
                isUpdateItem,
                onClick: () => {
                  const { indicName: unUnitName, unit } = getIndicAndUnit(record?.paramName);
                  let tab2Info;
                  if (activeTab === 2) {
                    tab2Info = record?.[o + 'indicCode'];
                  }
                  openModal(
                    {
                      title: `${o}${activeTab === 1 ? '年' : ''}_${areaInfo?.regionName}_${record?.paramName}`,
                      regionCode: code || '',
                      indicName: unUnitName,
                      // indicName2: sourceValueObj[record?.paramName],
                      indicName2: `${isUpdateItem?.indicName}`,
                      unit,
                      year: o,
                      pageCode: 'areaF9PlatformEconomy',
                      regionName: areaInfo?.regionName,
                      activeTab: activeTab,
                      tab2Info,
                    },
                    specialIndicList.includes(unUnitName) && activeTab !== 2,
                    !record[o + 'guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
                  );
                },
                defaultClassName: i !== tableData?.colKey?.length - 1 ? 'padding-10 align-right' : 'align-right',
              });
        },
        render: (text, row) => {
          if (row.specialTitle) return null;
          const noTraceList = ['城投平台有息债务', '城投平台有息债务(本级)'];
          const isUpdateItem = row?.paramDetailArr?.[o]?.updateValue;
          const { indicName: unUnitName, unit } = getIndicAndUnit(row?.paramName);
          const isSpecial = specialIndicList.includes(unUnitName);
          const res = formatNumber(text);
          return !res ? (
            <>-</>
          ) : traceSource ? (
            row[o + 'guId'] ? (
              isUpdateItem && openUpdate.isUpdate ? (
                <span className="trace-link-span">{text || '-'}</span>
              ) : (
                <span
                  className="trace-link-span"
                  onClick={() => {
                    history.push(
                      urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: row[tableData.colKey[i] + 'guId'] })),
                    );
                  }}
                >
                  {text || '-'}
                </span>
              )
            ) : isSpecial && !noTraceList.includes(unUnitName) ? (
              <span
                className="trace-link-span"
                onClick={() => {
                  openModal(
                    {
                      title: `${o}${activeTab === 1 ? '年' : ''}_${areaInfo?.regionName}_${row?.paramName}`,
                      regionCode: code || '',
                      indicName: unUnitName,
                      // indicName2: sourceValueObj[row?.paramName],
                      indicName2: `${isUpdateItem?.indicName}`,
                      unit,
                      year: o,
                      pageCode: 'areaF9PlatformEconomy',
                      regionName: areaInfo?.regionName,
                      activeTab: activeTab,
                    },
                    true,
                  );
                }}
              >
                {text || '-'}
              </span>
            ) : (
              <span className={cn({ 'clamp-col': isExpectCol })} title={text}>
                {text || '-'}
              </span>
            )
          ) : (
            <span className={cn({ 'clamp-col': isExpectCol })} title={text}>
              {text || '-'}
            </span>
          );
        },
      });
    });

    if (
      width >
      213 /** menu width */ +
        40 /** content padding */ +
        cloneInitColumn?.reduce((prev, curr) => prev + curr?.width, 0) /** total width */
    ) {
      cloneInitColumn.push({
        title: '',
        dataIndex: 'blank',
        className: 'no-padding',
      });
    }

    return cloneInitColumn;
  }, [
    history,
    handleTblCell,
    tableData?.colKey,
    traceSource,
    openUpdate.isUpdate,
    code,
    openModal,
    areaInfo?.regionName,
    handleShowModal,
    activeTab,
    width,
  ]);

  const debounceLoading = useDebounce(loading, {
    wait: 1000,
    leading: true,
  });

  const isLoading = useLoading(debounceLoading);

  useEffect(() => {
    if (debounceLoading) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debounceLoading]);

  const handleOnlyQ = useMemoizedFn((e) => {
    setQuarterFlag(e.target.checked);
  });

  return (
    <WrapperContainer
      topIsSticky={true}
      loading={isLoading}
      loadingHideContent={false}
      ref={backTopMounted}
      headerRightContent={
        <>
          <Header
            code={code}
            handleChangeColsHidden={handleChangeColsHidden}
            hiddenEmptyCols={hiddenEmptyCols}
            onChange={handleChangeData}
            checked={traceType}
            hiddenChecked={hiddenChecked}
            onChangeHidden={handleChangeHidden}
            filename={`${areaInfo?.regionNameAll ?? ''}月度季度数据-${dayjs(new Date()).format('YYYYMMDD')}`}
            exportCondition={
              activeTab === 2
                ? {
                    areaCode: code,
                    exportFlag: true,
                    statNature: quarterFlag ? '1,3' : '',
                    quarterFlag,
                    module_type: 'web_progress_area_indicators',
                  }
                : undefined
            }
            updateTip={traceCref}
            exportDisabled={!hasData}
            onlyQuarter={{
              default: false,
              currentVal: quarterFlag,
              onChange: handleOnlyQ,
            }}
          />
        </>
      }
      containerStyle={{ minWidth: '930px' }}
    >
      <ContentContainer>
        <S.Container>
          <div ref={scrollRef} style={{ position: 'relative', top: '-43px' }}></div>
          <ListWrapper ref={domRef}>
            {modal.show ? <InfoModal name={undefined} {...modal} onClose={handleClose} /> : null}
            <div className="area-economy-table-wrap">
              {hasData ? (
                <Spin type="square" spinning={debounceLoading} style={{ position: 'absolute', minHeight: `${44}px` }}>
                  <Table
                    sticky={{
                      offsetHeader: debounceLoading ? 0 : 43,
                      getContainer: () => document.querySelector('.main-container'),
                    }}
                    scroll={{
                      x: 'max-content',
                    }}
                    stripe={true}
                    type="stickyTable"
                    columns={finalColumns}
                    dataSource={tableData?.data}
                    rowKey={(_, index) => index}
                    key={activeTab}
                    trimRow={true}
                    trimCols={true}
                    trimCol={true}
                  />
                  {UpdateTipCref}
                </Spin>
              ) : null}
              {!loading && isEmpty(tableData?.data) ? (
                quarterFlag ? (
                  <Empty type={Empty.NO_DATA_NEW_IMG} className="module-empty" />
                ) : (
                  <Empty
                    type={Empty.NO_SCREEN_DATA_CLEAR}
                    onClick={() => setQuarterFlag(false)}
                    className="module-empty"
                  />
                )
              ) : null}
            </div>
            <UpdateModal {...modalInfo} onClose={closeModal} container={scrollRef.current} />
            {contetHolder}
          </ListWrapper>
        </S.Container>
      </ContentContainer>
      <BackTop target={() => document.querySelector('.main-container') || window} />
    </WrapperContainer>
  );
}

const ListWrapper = styled.div`
  overflow: visible;

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
  }

  .module-empty {
    margin-top: 10% !important;
  }

  .no-padding {
    padding: 0 !important;
    min-width: 0;
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
