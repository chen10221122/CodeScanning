import { useCallback, useMemo, useState } from 'react';

import { SortOrder } from 'antd/es/table/interface';

import { Empty, Row, Spin } from '@/components/antd';
import { Options, Screen, ScreenType } from '@/components/screen';
import SkeletonScreen from '@/components/skeletonScreen';
import { LINK_AREA_DEBT } from '@/configs/routerMap';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';

import { IndustryName } from '../../config/underArea';
import { ChangeScreenStyle } from '../../style';
import * as S from '../../style';
import useChangeTabError from '../../useChangeTabError';
import Export from './components/export';
import Table from './components/table';
import useUnderArea from './useUnderArea';

// 辖区经济
export default function UnderArea() {
  const {
    loading,
    tableData,
    menuChange,
    date,
    code,
    error: err,
    reladData,
    setSort,
    requestParams,
    hasNextRegion,
  } = useUnderArea();
  const error = err as any;
  const {
    state: { lastYear, mainLoading },
  } = useCtx();
  // 增加排序受控
  const [sortKeyMap, setSortKeyMap] = useState<{ [k: string]: SortOrder }>({
    [Object.keys(IndustryName)[0]]: 'descend',
  });
  // 判断是否是进入tab页的第一次错误
  const changeTabError = useChangeTabError([error]);

  const menuConfig: Options[] = useMemo(() => {
    return [
      {
        title: '年份',
        option: {
          type: ScreenType.SINGLE,
          children: Array.from({ length: 10 }).map((_, index) => ({
            name: String(+lastYear - index),
            value: String(+lastYear - index),
          })),
          default: lastYear,
          cancelable: false,
        },
      },
    ];
  }, [lastYear]);

  // 溯源状态
  const [traceType, setTraceType] = useState(false);

  useAnchor(useLoading(!!loading));
  let isLoading = useLoading(!!loading);

  // 溯源状态 切换
  const handleChangeData = useCallback(() => {
    setTraceType((base) => !base);
  }, []);

  const handleChangeSort = useCallback(
    (pagination, filters, sorter) => {
      setSortKeyMap({ [sorter.columnKey]: sorter.order });
      setSort({ field: sorter.columnKey, order: sorter.order });
    },
    [setSort],
  );

  const hasTable = tableData?.length;
  const handleEmptyClick = useCallback(() => reladData({ code, date: lastYear }), [reladData, code, lastYear]);

  return isLoading && !mainLoading ? (
    <div style={{ height: 'calc(100vh - 264px)' }}>
      <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
    </div>
  ) : !hasNextRegion ? (
    <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
  ) : (
    <S.Container id="underarea_container">
      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={handleEmptyClick} style={{ marginTop: '123px' }} />
      ) : (
        <>
          <div className="sticky-top" />
          <div className="screen-wrap custom-area-economy-screen-wrap" style={{ top: '86px' }}>
            <Row className="select-wrap">
              {lastYear ? <Screen options={menuConfig} onChange={menuChange} /> : null}
              <div className="select-right" style={{ height: '20px' }}>
                <div style={{ width: '24px' }} />
                <Export
                  onChange={handleChangeData}
                  requestParams={requestParams}
                  linkTo={`${LINK_AREA_DEBT}?year=${date}&areaCode=${code}`}
                />
              </div>
            </Row>
          </div>
          <div className="sticky-bottom" />
          <div className="area-economy-table-wrap">
            {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
              <Empty type={Empty.MODULE_LOAD_FAIL} onClick={handleEmptyClick} />
            ) : hasTable ? (
              <ChangeScreenStyle>
                <Spin type="square" spinning={loading && !mainLoading}>
                  <div>
                    <Table
                      onChange={handleChangeSort}
                      sortKeyMap={sortKeyMap}
                      openSource={traceType}
                      tableData={tableData}
                    />
                  </div>
                </Spin>
              </ChangeScreenStyle>
            ) : (
              <>
                {!loading && !hasTable ? <Empty type={Empty.NO_RELATED_DATA} style={{ paddingTop: '90px' }} /> : null}
              </>
            )}
          </div>
        </>
      )}
    </S.Container>
  );
}
