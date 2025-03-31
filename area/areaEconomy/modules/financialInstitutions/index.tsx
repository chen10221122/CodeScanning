import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { getInstitutionCount } from '@/apis/area/financialInstitutions';
import { Empty, Row } from '@/components/antd';
import SkeletonScreen from '@/components/skeletonScreen';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer } from '@/utils/hooks';

import { getLevel } from '../../common';
import { getAreaChildCodes } from '../../common/getAreaChild';
import MoreBtn from '../../components/traceBtn/moreBtn';
import { Level } from '../../config';
import * as S from '../../style';
import useChangeTabError from '../../useChangeTabError';
import { IInstitutionCount } from './components/tabs';
import linkConfig from './config/linkConfig';
import { TabsMap } from './config/tabsConfig';
import ListItem from './ListItem';

const PAGE_SIZE = 10;
const listMap = [
  {
    id: 'financialInstitutions_bank',
    title: '银行',
    currTabkey: TabsMap.YH,
  },
  {
    id: 'financialInstitutions_bond',
    title: '证券公司',
    currTabkey: TabsMap.ZQ,
  },
  {
    id: 'financialInstitutions_insurance',
    title: '保险公司',
    currTabkey: TabsMap.BX,
  },
  {
    id: 'financialInstitutions_trust',
    title: '信托公司',
    currTabkey: TabsMap.XT,
  },
  {
    id: 'financialInstitutions_rent',
    title: '租赁公司',
    currTabkey: TabsMap.ZL,
  },
  {
    id: 'financialInstitutions_fund',
    title: '基金公司',
    currTabkey: TabsMap.JJ,
  },
];

interface IParams {
  skip: number;
  pagesize: number;
  isQueryDetailedRegion: number; // 默认查询字段
  companyType?: string;
  areas?: string;
  districtCode?: string;
}

// 金融机构
export default function FinancialInstitutions() {
  const { state } = useCtx();

  const { key } = useParams<{ key: string }>();
  const { hash } = useLocation();
  // 重新加载数据  key
  const [reloadKey, setReloadKey] = useState(0);
  // 当前选择的tab
  const [currTabkey] = useState(TabsMap.YH);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const loadingsRef = useRef(true);
  // 等所有的页面的loading都加载完成之后再定位处理
  const [loadings, updateLoadings] = useImmer({
    [TabsMap.YH]: true,
    [TabsMap.ZQ]: true,
    [TabsMap.BX]: true,
    [TabsMap.XT]: true,
    [TabsMap.ZL]: true,
    [TabsMap.JJ]: true,
  });

  useEffect(() => {
    // 当所有的loadings 为 false 的时候就做定位操作, 并且只在第一次有效
    let flag = false;
    Object.values(loadings).forEach((item) => {
      if (item) flag = true;
    });
    if (!flag && loadingsRef.current) {
      const decodeHash = decodeURIComponent(hash);
      const titleDom = document.getElementById(`${key}_${decodeHash.substr(1)}`);
      setTimeout(() => {
        titleDom &&
          titleDom.scrollIntoView({
            block: 'start',
          });
      }, 1000);
      loadingsRef.current = false;
    }
  }, [hash, key, loadings]);

  const [pageKey, setPageKey] = useState('0');
  // 金融结构数量
  const [institutionCount, setInstitutionCount] = useState<IInstitutionCount>({});
  // 默认请求参数
  const defaultParams = useRef<IParams>({
    skip: 0,
    pagesize: PAGE_SIZE,
    isQueryDetailedRegion: 1,
    companyType: currTabkey,
  });

  // 请求配置参数
  const requestConfig = {
    manual: true,
    formatResult(data: any) {
      return data?.data ?? {};
    },
  };
  // 获取金融结构数据
  const {
    data: countData,
    run: getInstitutionCountData,
    error,
    loading: countLoading,
  } = useRequest(getInstitutionCount, requestConfig);
  // 判断是否是进入tab页的第一次错误
  const changeTabError = useChangeTabError([error]);
  useEffect(() => {
    setInstitutionCount(countData || {});
  }, [countData, setInstitutionCount]);

  //地区改变执行的方法
  useEffect(() => {
    delete defaultParams.current.areas;
    delete defaultParams.current.districtCode;
    const code = state.code;
    const level = getLevel(code);
    let codes: any = {};
    if (level === Level.PROVINCE) {
      codes.areas = code;
    } else if (level === Level.CITY) {
      const childCodes = getAreaChildCodes(code, level);
      codes.districtCode = code + (childCodes ? ',' + childCodes : '');
    } else if (level === Level.COUNTY) {
      codes.districtCode = code;
    }
    defaultParams.current = { ...defaultParams.current, ...codes };
    setPageKey(level + code);
    setInstitutionCount({});
    // 获取头部数量
    getInstitutionCountData({
      companyType: 'fund,rent,trust,bond,insurance,bank',
      provinceCode: codes.areas,
      districtCode: codes.districtCode,
    });
  }, [state.code, reloadKey, getInstitutionCountData]);

  useEffect(() => {
    const decodeHash = decodeURIComponent(hash);
    const titleDom = document.getElementById(`${key}_${decodeHash.substr(1)}`);
    setTimeout(() => {
      titleDom &&
        titleDom.scrollIntoView({
          block: 'start',
        });
    });
  }, [key, hash]);

  const linkTo = useMemo(() => linkConfig[currTabkey], [currTabkey]);

  const relodData = useCallback(() => {
    setReloadKey((d) => d + 1);
  }, [setReloadKey]);

  // 判断 金融机构 下面的 6个 情况是否都没有数据
  const isFinancialEmpty = useMemo(() => {
    // 如果本身为 {} , 表示无数据
    // 如果是 { a: '0', b: '0', c: null } 那么也表示无数据
    const values = Object.values(institutionCount).filter((i) => Number(i) > 0);
    if (isEmpty(institutionCount) || isEmpty(values)) return true;
    return false;
  }, [institutionCount]);

  return (
    <>
      {isFirstLoading ? (
        <div style={{ height: 'calc(100vh - 264px)' }}>
          <SkeletonScreen num={2} firstStyle={{ paddingTop: '23px' }} otherStyle={{ paddingTop: '22px' }} />
        </div>
      ) : null}
      {changeTabError ? (
        <Empty type={Empty.LOAD_FAIL} onClick={relodData} style={{ paddingTop: '123px' }} />
      ) : !isFirstLoading && isFinancialEmpty && !countLoading ? (
        <Empty type={Empty.NO_NEW_RELATED_DATA} className="noNewRelatedData" />
      ) : (
        <>
          <Container isFirstLoading={isFirstLoading || countLoading} key={pageKey}>
            <S.Container style={{ padding: '0' }}>
              <div className="screen-wrap custom-area-economy-screen-wrap">
                <Row className="select-wrap">
                  <div className="select-right">
                    <MoreBtn linkTo={linkTo} />
                  </div>
                </Row>
              </div>
              {listMap.map(({ title, id, currTabkey }, index: number) => {
                return (
                  <div key={id}>
                    <ListItem
                      titleID={id}
                      title={title}
                      currTabkey={currTabkey}
                      institutionCount={institutionCount}
                      setIsFirstLoading={setIsFirstLoading}
                      updateLoadings={updateLoadings}
                    />
                    {index !== 5 && <BottomLine />}
                  </div>
                );
              })}
            </S.Container>
          </Container>
        </>
      )}
    </>
  );
}

const Container = styled.div<{ isFirstLoading: boolean }>`
  padding-bottom: 4px;
  display: ${(props) => (props.isFirstLoading ? 'none' : 'block')};

  .custom-area-economy-screen-wrap {
    z-index: 99;
    position: relative;
    top: 0 !important;
    padding-top: 0 !important;
  }

  .screen-wrap .select-wrap {
    min-height: 0;
  }

  .select-right {
    height: 0 !important;
    a {
      transform: translateY(-16px);
      z-index: 99;
    }
  }

  .custom-area-economy-screen-wrap {
    top: 86px;
  }
  .company-name {
    cursor: pointer;
    color: rgb(2, 92, 220);
    &:hover {
      text-decoration: underline;
    }
  }
  .filter-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    height: 20px;
  }
`;

const BottomLine = styled.div`
  width: calc(100% + 40px);
  height: 6px;
  background: #fafbfc;
  margin-left: -20px;
`;
