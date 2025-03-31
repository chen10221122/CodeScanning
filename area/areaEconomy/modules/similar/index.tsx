import React, { useMemo } from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';

import { Empty, Row, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import SkeletonScreen from '@/components/skeletonScreen';
import { AREA_IS_CHANGE_STATUS } from '@/configs/localstorage';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import * as S from '@/pages/area/areaEconomy/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import { getUrlSearches } from '@/utils/url';

import useChangeTabError from '../../useChangeTabError';
import getColumns from './columns';
import useSimilar from './useSimilar';

export default function SimilarEconomy() {
  const { pending: loading, data: tableData, error, getDataFromServer, code } = useSimilar();
  const changeTabError = useChangeTabError([error]);
  const isLoading = useLoading(loading);
  useAnchor(isLoading);

  /** 处理加载状态的滚动条 */
  // useEffect(() => {
  //   const outerLayerDom = document.getElementById('tabsWrapper');
  //   if (isLoading && outerLayerDom) {
  //     (outerLayerDom as HTMLElement).style.overflowY = 'hidden';
  //   } else {
  //     (outerLayerDom as HTMLElement).style.overflowY = 'auto';
  //   }
  // }, [isLoading]);

  const { state } = useCtx();

  const columns = useMemo(
    () =>
      getColumns({
        beforeLeave: state.payCheck,
      }),
    [state.payCheck],
  );

  // 表格数据是否为空
  const tableDataEmpty = !tableData.length;

  return loading && sessionStorage.getItem(AREA_IS_CHANGE_STATUS) !== '1' ? (
    <div style={{ height: 'calc(100vh - 264px)' }}>
      <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
    </div>
  ) : !loading && tableDataEmpty ? (
    <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
  ) : (
    <Container>
      <S.Container id="similarContainer">
        {changeTabError ? (
          <Empty type={Empty.LOAD_FAIL} onClick={() => getDataFromServer(code)} style={{ marginTop: '123px' }} />
        ) : (
          <>
            <div className="sticky-top" />
            <div className="screen-wrap custom-area-economy-screen-wrap">
              <Row className="select-wrap">
                <div className="select-right">
                  <ExportDoc
                    condition={{
                      regionCode: getUrlSearches(window.location.search).code,
                      module_type: 'similiar_economic',
                    }}
                    filename={`相似经济${dayjs(new Date()).format('YYYYMMDD')}`}
                  />
                </div>
              </Row>
            </div>
            <div className="sticky-bottom" style={{ marginBottom: 0 }} />

            <div className="similar-table">
              <div>
                <Table
                  pagination={false}
                  isStatic={false}
                  scrollTo={false}
                  showHeader={false}
                  columns={columns}
                  size="small"
                  type="blueBorderInterlaceNoBlueOddBG"
                  dataSource={tableData}
                  scroll={{ x: 1150 }}
                  sticky={{ getContainer: () => document.getElementById('tabsWrapper') || window }}
                />
                <div className="table-remark">
                  备注：展示偏离度绝对值在5%以内的前5个地区，点击地区对比工具查看更多指标。
                </div>
              </div>
            </div>
          </>
        )}
      </S.Container>
    </Container>
  );
}

const Container = styled.div`
  .custom-area-economy-screen-wrap {
    z-index: 99 !important;
    position: relative;
    top: 0 !important;
  }

  .screen-wrap {
    padding-top: 0px !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    transform: translateY(-20px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
`;
