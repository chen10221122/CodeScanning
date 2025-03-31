import { useEffect, useRef, useState, useCallback } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEqual, isEmpty } from 'lodash';
import styled from 'styled-components';

import { Empty, Row, Spin } from '@/components/antd';
import BackTop from '@/components/backTop';
import SkeletonScreen from '@/components/skeletonScreen';
import { IAreaTreeItem, ICardInfo } from '@/pages/enterprise/technologyEnterprise/types';
import { useImmer } from '@/utils/hooks';

import * as S from '../../../../style';
import { useGetCardInfo } from '../../hooks/useCardRequest';
import useFilterRequest from '../../hooks/useFilterRequest';
import { useCtx } from '../../provider/ctx';
import Filter from '../Filter';
import { TechEnterpriseTable } from '../table';
import styles from './style.module.less';

export const MainContent = () => {
  const {
    state: { enterpriseStatus, selectedAreaList, selectedTarget, areaOrTagChangeMaskLoading, emptyStatus },
    update,
  } = useCtx();

  // 这个是整体数据的请求
  const { data } = useGetCardInfo();

  const area = useRef<IAreaTreeItem[]>();
  const target = useRef<ICardInfo | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const TIMER = useRef<any>();
  const loadingCounterRef = useRef(0);
  const mountedRef = useRef<HTMLDivElement>(null);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  // 筛选项状态改变的 筛选类型以及筛选数据
  const [filterParams, updateFilterParams] = useImmer({
    filterType: '',
    filterValue: '',
  });

  const { changeFilter, empty } = useFilterRequest({ updateFilterParams });

  // 改变筛选项
  const handleChange = useCallback(
    (type, value) => {
      // 请求筛选后全部的数据
      changeFilter(type, value);
    },
    [changeFilter],
  );

  // hash 作为 筛选组件的标识
  const [hash, setHash] = useState(0);

  // 清除筛选项
  const clearCondition = useMemoizedFn(() => {
    // 清除筛选项
    setHash(Math.random());
    // 重置请求
    changeFilter('clearCondition', null);
  });

  useEffect(() => {
    if (
      (!isEqual(selectedTarget, target.current) || !isEqual(selectedAreaList, area.current)) &&
      loadingCounterRef.current > 1
    ) {
      update((o) => {
        o.areaOrTagChangeMaskLoading = true;
      });
      area.current = selectedAreaList;
      target.current = selectedTarget;
    }
  }, [selectedAreaList, selectedTarget, update]);

  useEffect(() => {
    loadingCounterRef.current++;
  }, [selectedAreaList, selectedTarget]);

  useEffect(() => {
    if (areaOrTagChangeMaskLoading) {
      setLoading(true);
    } else {
      TIMER.current = setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => {
      if (TIMER.current) clearTimeout(TIMER.current);
    };
  }, [areaOrTagChangeMaskLoading, TIMER]);

  return (
    <div className={styles.wapper}>
      {isFirstLoading ? (
        <div style={{ width: '100%', height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
        </div>
      ) : null}
      <Container
        isFirstLoading={isFirstLoading}
        className={styles['mainContent']}
        id={`tech_enterprise_${enterpriseStatus}`}
        ref={mountedRef}
      >
        <Spin type={'thunder'} spinning={loading} translucent keepCenter>
          {/* 初始的时候该地区是否有数据 */}
          {emptyStatus ? <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" /> : null}
          <S.Container
            style={emptyStatus ? { opacity: '0', position: 'fixed', zIndex: -10 } : { paddingBottom: '4px' }}
          >
            <div className="screen-wrap custom-area-economy-screen-wrap">
              <Row className="select-wrap">
                <div className="select-right">
                  <Filter change={handleChange} setIsFirstLoading={setIsFirstLoading} hash={hash} />
                </div>
              </Row>
            </div>
            {empty ? (
              <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION} className="noNewRelatedData" onClick={clearCondition} />
            ) : null}
            <span style={empty ? { opacity: '0', position: 'fixed', zIndex: -10 } : {}}>
              {!isEmpty(data?.list)
                ? data.list.map((i: any, index: number) => {
                    // if (index > 0) return null;
                    return (
                      <div key={i?.TagCode}>
                        <TechEnterpriseTable
                          item={i}
                          filterParams={filterParams}
                          clearCondition={clearCondition}
                          hasBottomLine={index !== data.list.length - 1}
                        />
                      </div>
                    );
                  })
                : null}
            </span>
          </S.Container>
        </Spin>
        <BackTop target={() => mountedRef.current as HTMLDivElement} />
      </Container>
    </div>
  );
};

const Container = styled.div<{ isFirstLoading: boolean }>`
  display: ${(props) => (props.isFirstLoading ? 'none' : 'block')};
  .custom-area-economy-screen-wrap {
    padding-top: 0 !important;
    z-index: 99 !important;
    position: relative;
    top: 0 !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    transform: translateY(-17px);
    z-index: 99;
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
`;
