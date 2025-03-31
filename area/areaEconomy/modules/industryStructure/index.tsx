import { useCallback, useMemo, useState } from 'react';

import { cloneDeep, get } from 'lodash';
import styled from 'styled-components';

import { Empty, Row, Spin } from '@/components/antd';
import { Options, Screen, ScreenType } from '@/components/screen';
import SkeletonScreen from '@/components/skeletonScreen';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import * as S from '../../style';
import { ChangeScreenStyle } from '../../style';
import useChangeTabError from '../../useChangeTabError';
import Chart from './components/chart';
import Export from './components/export';
import Table from './components/table';
import useData from './useData';

// 产业结构
export default function IndustryStructure() {
  const { loading, indicatorList, menuChange, date, code, error: err, execute } = useData();
  const error = err as any;
  const {
    state: { lastYear, areaInfo },
  } = useCtx();
  // 表格排序规则
  const [sortKeyMap, setSortKeyMap] = useState<{ [k: string]: string }>({});
  // 判断是否是进入tab页的第一次错误
  const changeTabError = useChangeTabError([error]);

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

  // 溯源状态
  const [openSource, setOpenSource] = useState(false);
  const handleChangeData = useCallback(() => {
    setOpenSource((base) => !base);
  }, []);

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

  const handleChangeTable = useCallback((pagination, filters, sorter) => {
    setSortKeyMap({ [sorter.columnKey]: sorter.order });
  }, []);

  const relodData = useCallback(() => execute({ regionCode: code, endDate: lastYear }), [code, lastYear, execute]);
  const regionName = useMemo(() => get(areaInfo, 'regionInfo[0].regionName', ''), [areaInfo]);
  return isLoading ? (
    <div style={{ height: 'calc(100vh - 264px)' }}>
      <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
    </div>
  ) : (
    <S.Container>
      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={relodData} style={{ marginTop: '123px' }} />
      ) : (
        <>
          <div className="sticky-top" />
          <div className="screen-wrap custom-area-economy-screen-wrap" id="underarea_container">
            <Row className="select-wrap">
              {lastYear ? <Screen options={menuConfig} onChange={menuChange} /> : null}
              <div className="select-right" style={{ height: '20px' }}>
                <div style={{ width: '24px' }} />
                <Export
                  sortKeyMap={sortKeyMap}
                  code={code}
                  date={date}
                  regionName={regionName}
                  onChange={handleChangeData}
                  onChangeHidden={handleChangeHidden}
                />
              </div>
            </Row>
          </div>
          <div className="sticky-bottom" />
          <div className="area-economy-table-wrap">
            {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
              <Empty type={Empty.MODULE_LOAD_FAIL} onClick={relodData} />
            ) : hasTable ? (
              <ChangeScreenStyle>
                <Spin type="square" spinning={loading}>
                  <Wrap>
                    <div className="left">
                      <Chart chartDataInfo={chartDataInfo}></Chart>
                    </div>
                    <div className="right">
                      <Table
                        hiddenColumn={hiddenColumn}
                        sortKeyMap={sortKeyMap}
                        onChange={handleChangeTable}
                        indicatorList={indicatorList}
                        openSource={openSource}
                        date={date}
                      />
                      <div className="remark">
                        注：数据均来源于统计公报、统计年鉴，实际披露中由于部分地区最新年度数据不全，导致年份间数据差距较大
                      </div>
                    </div>
                  </Wrap>
                </Spin>
              </ChangeScreenStyle>
            ) : (
              <>
                {!loading && !hasTable ? (
                  <>
                    {lastYear === date ? (
                      <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
                    ) : (
                      <Empty
                        className="noNewRelatedData"
                        type={Empty.NO_DATA_IN_FILTER_CONDITION}
                        onClick={() => menuChange([{ name: lastYear, value: lastYear }])}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}
          </div>
        </>
      )}
    </S.Container>
  );
}

const Wrap = styled.div`
  height: 515px;
  display: flex;
  margin-bottom: 27px;
  .left {
    min-width: 504px;
    width: 45%;
    height: 100%;
    padding: 12px;
    border: 1px solid #efefef;
    border-radius: 4px;
  }
  .right {
    margin-left: 24px;
    min-width: 643px;
    height: 100%;
    width: 55%;
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
  .remark {
    height: 14px;
    font-size: 13px;
    font-weight: 300;
    text-align: left;
    color: #8c8c8c;
    line-height: 14px;
    margin-top: 13px;
  }
`;
