import { useCallback, useMemo, useState, useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import { cloneDeep, get } from 'lodash';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';

import { Empty, Row, Spin } from '@/components/antd';
import { Options, Screen, ScreenType } from '@/components/screen';
// import SkeletonScreen from '@/components/skeletonScreen';
import useUpdateTip, { inModalInitparams } from '@/pages/area/areaDebt/components/updateTip';
import { flatData } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { ChangeScreenStyle } from '@/pages/area/areaF9/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

// import { ItemEnum, TitleItem } from '../../../components';
import { useSelector } from '../../../context';
import Chart from './components/chart';
import Export from './components/export';
import Table from './components/table';
import useData from './useData';

// 产业结构
export default function IndustryStructure() {
  const { loading, indicatorList, menuChange, date, code, error: err, execute } = useData();
  const error = err as any;

  const areaInfo = useSelector((store) => store.areaInfo);
  const lastYear = useSelector((store) => store.lastYear)!;

  // 表格排序规则
  const [sortKeyMap, setSortKeyMap] = useState<{ [k: string]: string }>({});
  const domRef = useRef<HTMLDivElement>(null);
  const indicNameRef = useRef('');

  const menuConfig: Options[] = useMemo(() => {
    return [
      {
        title: '年份',
        option: {
          type: ScreenType.SINGLE,
          children: Array.from({ length: 2 }).map((_, index) => ({
            name: String(+lastYear - index),
            value: String(+lastYear - index),
          })),
          default: lastYear,
          value: date,
        },
      },
    ];
  }, [lastYear, date]);

  useAnchor(useLoading(loading));

  let isLoading = useLoading(loading);

  //  隐藏空行
  const [hiddenColumn, setHiddenColumn] = useState(false);
  const handleChangeHidden = useCallback(() => {
    setHiddenColumn((base) => !base);
  }, []);

  const hasTable = useMemo(() => {
    const { value_0, value_1 } = indicatorList[0] || {};
    return !!value_0 || !!value_1;
  }, [indicatorList]);

  const chartDataInfo = useMemo(() => {
    if (Array.isArray(indicatorList)) {
      let [one, ...rest] = indicatorList;
      // 第一年没数据 矩形图放第二年的数据
      if (!one?.value_0) {
        rest = cloneDeep(rest).map((it) => {
          it.value_0 = it.value_1;
          it.percent_0 = it.percent_1;
          return it;
        });
      }
      return rest.sort((a, b) => b.percent_0 - a.percent_0);
    } else return [];
  }, [indicatorList]);

  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    openUpdate,
    traceSource,
    traceCref,
    inModalUpdateTipInfo,
    getInModalUpdateTipInfo,
    handleTblCell,
  } = useUpdateTip({ isLastMonth: true });

  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  useEffect(() => {
    const indicName =
      indicatorList
        ?.map((item: any) => {
          /** 去掉合计 */
          return item?.key === 'total' ? null : item?.key;
        })
        ?.filter((f: any) => !!f)
        ?.join(',') || '';
    if (indicNameRef.current !== indicName && code && indicatorList.length) {
      getInModalUpdateTipInfo({
        ...inModalInitparams,
        /** 请求表格数据时写死了2019年开始 */
        endDate: `[2019,${dayjs().format('YYYY')}]`,
        days: 30,
        regionCode: code,
        indicName,
        pageCode: 'industry',
      });
      indicNameRef.current = indicName;
    }
  }, [indicatorList, code, getInModalUpdateTipInfo]);

  const inModalUpdateTipInfoFlat: any[] = useMemo(() => {
    return flatData(inModalUpdateTipInfo, 'year');
  }, [inModalUpdateTipInfo]);

  const handleChangeTable = useCallback((pagination, filters, sorter) => {
    setSortKeyMap({ [sorter.columnKey]: sorter.order });
  }, []);

  const relodData = useCallback(() => execute({ regionCode: code!, endDate: lastYear }), [code, lastYear, execute]);
  const regionName = useMemo(() => get(areaInfo, 'regionInfo[0].regionName', ''), [areaInfo]);

  const Content = useMemo(
    () => (
      <>
        <ContentContainer>
          {/* <div className="screen-wrap custom-area-economy-screen-wrap" id="underarea_container">
              <Row className="select-wrap">
                <TitleItem type={ItemEnum.CYJG}></TitleItem>
                <div className="select-right" style={{ height: '20px', marginLeft: '24px' }}>
                  <div className="year-screen">{lastYear ? <Screen options={menuConfig} onChange={menuChange} /> : null}</div>
                  <Export
                    sortKeyMap={sortKeyMap}
                    code={code!}
                    date={date!}
                    regionName={regionName}
                    traceCref={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {traceCref}
                        {UpdateTipScreenCref}
                      </div>
                    }
                    onChangeHidden={handleChangeHidden}
                  />
                </div>
              </Row>
            </div> */}
          <div className="area-economy-table-wrap" ref={domRef}>
            {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
              <Empty type={Empty.MODULE_LOAD_FAIL} onClick={relodData} />
            ) : hasTable ? (
              <ChangeScreenStyle>
                <Spin type="square" spinning={loading}>
                  <Wrap>
                    <div className="left">
                      <Chart chartDataInfo={chartDataInfo}></Chart>
                    </div>
                    <div className="right" id="regional_economy_right">
                      <Table
                        hiddenColumn={hiddenColumn}
                        sortKeyMap={sortKeyMap}
                        onChange={handleChangeTable}
                        indicatorList={indicatorList}
                        openSource={traceSource}
                        date={date!}
                        openUpdate={openUpdate.isUpdate}
                        handleTblCell={handleTblCell}
                        inModalUpdateTipInfoFlat={inModalUpdateTipInfoFlat}
                        openModal={openModal}
                        regionName={areaInfo?.regionName || ''}
                        regionCode={code || ''}
                      />
                      {UpdateTipCref}
                      <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current!} />
                      {contetHolder}
                      {/* <div className="remark">
                    注：数据均来源于统计公报、统计年鉴，实际披露中由于部分地区最新年度数据不全，导致年份间数据差距较大
                  </div> */}
                    </div>
                  </Wrap>
                </Spin>
              </ChangeScreenStyle>
            ) : (
              <>
                {!loading && !hasTable ? (
                  <Empty type={Empty.NO_MODULE_RELATED} className="module-empty" />
                ) : // <>
                //   {lastYear === date ? (
                //     <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
                //   ) : (
                //     <Empty
                //       className="noNewRelatedData"
                //       type={Empty.NO_DATA_IN_FILTER_CONDITION}
                //       onClick={() => menuChange([{ name: lastYear, value: lastYear }])}
                //     />
                //   )}
                // </>
                null}
              </>
            )}
          </div>
        </ContentContainer>
      </>
    ),
    [
      error,
      relodData,
      hasTable,
      loading,
      chartDataInfo,
      hiddenColumn,
      sortKeyMap,
      handleChangeTable,
      indicatorList,
      traceSource,
      date,
      openUpdate,
      handleTblCell,
      inModalUpdateTipInfoFlat,
      openModal,
      areaInfo,
      code,
      UpdateTipCref,
      modalInfo,
      closeModal,
      contetHolder,
    ],
  );

  return (
    <WrapperContainer
      loading={isLoading}
      content={Content}
      title="产业结构"
      headerBottomContent={
        <div style={{ marginTop: '8px' }}>
          <Row
            className="select-wrap"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '20px',
              lineHeight: '20px',
            }}
          >
            <div className="year-screen">{lastYear ? <Screen options={menuConfig} onChange={menuChange} /> : null}</div>
            <Export
              sortKeyMap={sortKeyMap}
              code={code!}
              date={date!}
              regionName={regionName}
              traceCref={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {traceCref}
                  {/* {UpdateTipScreenCref} */}
                </div>
              }
              onChangeHidden={handleChangeHidden}
            />
          </Row>
        </div>
      }
    ></WrapperContainer>
  );
}

const ContentContainer = styled.div`
  .module-empty {
    margin-bottom: 12px !important;
  }
  .export-xls-btn {
    margin-left: 24px;
  }

  .custom-area-economy-screen-wrap {
    margin-top: 20px;
    margin-bottom: 12px;
    position: sticky;
    top: 0;
    /** 小了盖不住【主要指标】,大了会遮挡扫一扫提示弹窗 */
    z-index: 9;
  }

  .area-economy-table-wrap {
    width: 100% !important;
    overflow: inherit !important;
  }

  .year-screen {
    margin-right: 24px;
    .screen-wrapper {
      margin-top: 2px;
    }
  }
  .ant-table-thead th.ant-table-column-has-sorters .ant-table-column-sorter {
    margin-bottom: -4px;
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background-color: #f8faff;
  }
`;

const Wrap = styled.div`
  height: 515px;
  display: flex;
  margin-bottom: 27px;
  gap: 12px;
  .left {
    /* min-width: 398px; */
    flex: 0.45;
    flex-shrink: 0.7;
    /* width: 45%; */
    height: 100%;
    // padding: 12px;
    border: 1px solid #efefef;
    border-radius: 4px;
  }
  .right {
    flex: 0.55;
    flex-shrink: 0.3;
    /* margin-left: 12px; */
    min-width: 616px;
    height: 100%;
    /* width: 55%; */
  }
  .ant-table-body {
    /* border-top: none; */
    /* scrollbar-color: #cfcfcf transparent; */
    overflow: overlay !important;
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.12);
      border: 2px solid transparent;
      border-radius: 8px;
      background-clip: padding-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.24);
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
`;
