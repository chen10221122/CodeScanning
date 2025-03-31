import { useEffect, useMemo } from 'react';

import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import AreaOpinion from '@/pages/detail/modules/bond/areaCastleThrow/modules/areaAnalyse/modules/areaOpinion';

import * as S from '../../style';
import { ChangeScreenStyle } from '../../style';
import useChangeTabError from '../../useChangeTabError';
import useData from './useData';

// 区域观点
export default function AreaViewpoint() {
  const { dataList, ...areaOpinionProps } = useData();
  const { opinionLoading: loading } = areaOpinionProps;
  const error = areaOpinionProps.error as any;

  // 判断是否是进入tab页的第一次错误
  const changeTabError = useChangeTabError([error]);
  useAnchor(useLoading(loading));
  let isLoading = useLoading(loading);
  // dom 事件绑定节点
  const targetWrap = useMemo(() => document.querySelector('#area_economy_container') as HTMLDivElement, []);
  // tab切换滚动条状态
  useEffect(() => {
    if (targetWrap) {
      if (isLoading) {
        targetWrap.scrollTop = 0;
        targetWrap.style.overflowY = 'hidden';
      } else {
        targetWrap.style.overflowY = 'overlay';
      }
    }
    return () => {
      if (targetWrap) targetWrap.style.overflowY = 'overlay';
    };
  }, [isLoading, targetWrap]);
  // 无数据
  const isEmpty = !dataList.length;
  return isLoading ? (
    <div style={{ height: 'calc(100vh - 264px)' }}>
      <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
    </div>
  ) : (
    <S.Container id="underarea_container">
      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={() => {}} style={{ marginTop: '123px' }} />
      ) : (
        <div className="area-economy-table-wrap">
          {error && ![202, 203, 204, 100].includes(error?.returncode) ? (
            <Empty type={Empty.MODULE_LOAD_FAIL} onClick={() => {}} />
          ) : (
            <Wrap isEmpty={isEmpty}>
              <ChangeScreenStyle>
                <Spin type="square" spinning={loading}>
                  <AreaOpinion
                    dataList={dataList}
                    {...areaOpinionProps}
                    scrollableTarget={targetWrap}
                    isNewState={true}
                    firstLoading={false}
                  />
                </Spin>
              </ChangeScreenStyle>
            </Wrap>
          )}
        </div>
      )}
    </S.Container>
  );
}

const Wrap = styled.div<{ isEmpty: boolean }>`
  margin-top: -8px;
  width: ${({ isEmpty }) => (isEmpty ? '100%' : '902px')};
  .containers .center-content {
    width: ${({ isEmpty }) => (isEmpty ? '100%' : '900px')};
    .ant-empty {
      margin-top: 74px;
    }
  }
  .containers .screen-filter {
    margin-left: 0;
  }
`;
