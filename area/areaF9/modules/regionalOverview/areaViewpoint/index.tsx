import { useEffect, useMemo } from 'react';

import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';

import * as S from '@/pages/area/areaF9/style';
import { ChangeScreenStyle } from '@/pages/area/areaF9/style';
import useAnchor from '@/pages/detail/hooks/useAnchor';
import useLoading from '@/pages/detail/hooks/useLoading';
import AreaOpinion from '@/pages/detail/modules/bond/areaCastleThrow/modules/areaAnalyse/modules/areaOpinion';

import useData from './useData';

// 区域观点
export default function AreaViewpoint() {
  const { dataList, ...areaOpinionProps } = useData();
  const { opinionLoading: loading } = areaOpinionProps;
  const error = areaOpinionProps.error as any;

  // 判断是否是进入tab页的第一次错误
  useAnchor(useLoading(loading));
  let isLoading = useLoading(loading);
  // dom 事件绑定节点
  const targetWrap = useMemo(() => document.querySelector('.main-container') as HTMLDivElement, []);
  // tab切换滚动条状态
  useEffect(() => {
    if (targetWrap) {
      if (loading) {
        targetWrap.scrollTop = 0;
        targetWrap.style.overflowY = 'hidden';
      } else {
        targetWrap.style.overflowY = 'overlay';
      }
    }
    return () => {
      if (targetWrap) targetWrap.style.overflowY = 'overlay';
    };
  }, [loading, targetWrap]);
  // 无数据
  const isEmpty = !dataList.length;

  const Content = useMemo(() => {
    return (
      <S.Container id="underarea_container">
        <div className="area-economy-table-wrap">
          <Wrap isEmpty={isEmpty}>
            <ChangeScreenStyle>
              <AreaOpinion
                dataList={dataList}
                {...areaOpinionProps}
                scrollableTarget={targetWrap}
                isNewState={true}
                isNewArea={true}
                firstLoading={false}
              />
            </ChangeScreenStyle>
          </Wrap>
        </div>
      </S.Container>
    );
  }, [areaOpinionProps, dataList, isEmpty, targetWrap]);

  return <WrapperContainer error={error} loading={isLoading} content={Content}></WrapperContainer>;
}

const Wrap = styled.div<{ isEmpty: boolean }>`
  margin-top: -8px;
  width: ${({ isEmpty }) => (isEmpty ? '100%' : '898px')};
  .containers .center-content {
    margin-top: 0 !important;
    width: ${({ isEmpty }) => (isEmpty ? '100%' : '900px')};
    .ant-empty {
      margin-top: 74px;
    }
  }
  .containers .screen-filter {
    margin: 0 !important;
    position: sticky;
    top: 43px;
    z-index: 1;
    padding-bottom: 8px;
    background: white;
  }
`;
