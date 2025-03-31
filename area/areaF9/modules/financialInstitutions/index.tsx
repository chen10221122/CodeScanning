import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Anchor } from 'antd';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import { useParams } from '@pages/area/areaF9/hooks';

import { getInstitutionCount } from '@/apis/area/financialInstitutions';
import { Empty } from '@/components/antd';
import { ItemEnum } from '@/pages/area/areaF9/components';
import MoreBtn from '@/pages/area/areaF9/components/traceBtn/moreBtn';
import * as S from '@/pages/area/areaF9/style';
import { Level } from '@/pages/area/areaF9/types';
import { getAreaChildCodes, getLevel } from '@/pages/area/areaF9/utils';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer, useQuery } from '@/utils/hooks';

import { IInstitutionCount } from './components/tabs';
import linkConfig from './config/linkConfig';
import { TabsMap } from './config/tabsConfig';
import ListItem from './ListItem';

const { Link } = Anchor;
const PAGE_SIZE = 10;
const listMap = [
  {
    id: 'financialInstitutions_bank',
    title: ItemEnum.YH,
    currTabkey: TabsMap.YH,
  },
  {
    id: 'financialInstitutions_bond',
    title: ItemEnum.ZQGS,
    currTabkey: TabsMap.ZQ,
  },
  {
    id: 'financialInstitutions_insurance',
    title: ItemEnum.BXGS,
    currTabkey: TabsMap.BX,
  },
  {
    id: 'financialInstitutions_trust',
    title: ItemEnum.XTGS,
    currTabkey: TabsMap.XT,
  },
  {
    id: 'financialInstitutions_rent',
    title: ItemEnum.ZLGS,
    currTabkey: TabsMap.ZL,
  },
  {
    id: 'financialInstitutions_fund',
    title: ItemEnum.JJGS,
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
  const { code, key } = useParams();

  const { hash } = useLocation();
  const [reloadKey] = useState(0);
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

  const { module } = useQuery();

  useEffect(() => {
    const titleDom = document.getElementById('financialInstitutions_' + module);
    setTimeout(() => {
      titleDom &&
        titleDom.scrollIntoView({
          block: 'start',
        });
    });
  }, [module]);

  useEffect(() => {
    // 当所有的loadings 为 false 的时候就做定位操作, 并且只在第一次有效
    let flag = false;
    Object.values(loadings).forEach((item) => {
      if (item) flag = true;
    });
    if (!flag && loadingsRef.current) {
      const titleDom = document.getElementById('financialInstitutions_' + module);
      setTimeout(() => {
        titleDom &&
          titleDom.scrollIntoView({
            block: 'start',
          });
      });

      loadingsRef.current = false;
    }
  }, [loadings, module]);

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
  useEffect(() => {
    setInstitutionCount(countData || {});
  }, [countData, setInstitutionCount]);

  //地区改变执行的方法
  useEffect(() => {
    delete defaultParams.current.areas;
    delete defaultParams.current.districtCode;
    const level = getLevel(code);
    let codes: any = {};
    if (level === Level.PROVINCE) {
      codes.areas = code;
    } else if (level === Level.CITY) {
      const childCodes = getAreaChildCodes(code!, level);
      codes.districtCode = code + (childCodes ? ',' + childCodes : '');
    } else if (level === Level.COUNTY) {
      codes.districtCode = code;
    }
    defaultParams.current = { ...defaultParams.current, ...codes };
    setPageKey(level + code!);
    setInstitutionCount({});
    // 获取头部数量
    getInstitutionCountData({
      companyType: 'fund,rent,trust,bond,insurance,bank',
      provinceCode: codes.areas,
      districtCode: codes.districtCode,
    });
  }, [code, reloadKey, getInstitutionCountData]);

  useEffect(() => {
    const decodeHash = decodeURIComponent(hash);
    const titleDom = document.getElementById(`${key}_${decodeHash.substr(1)}`);
    setTimeout(() => {
      titleDom &&
        titleDom.scrollIntoView({
          block: 'start',
        });
    }, 300);
  }, [key, hash]);

  const linkTo = useMemo(() => linkConfig[currTabkey], [currTabkey]);

  // 判断 金融机构 下面的 6个 情况是否都没有数据
  const isFinancialEmpty = useMemo(() => {
    // 如果本身为 {} , 表示无数据
    // 如果是 { a: '0', b: '0', c: null } 那么也表示无数据
    const values = Object.values(institutionCount).filter((i) => Number(i) > 0);
    if (isEmpty(institutionCount) || isEmpty(values)) return true;
    return false;
  }, [institutionCount]);

  useEffect(() => {
    if (isFinancialEmpty) {
      setIsFirstLoading(false);
    }
  }, [isFinancialEmpty, setIsFirstLoading]);

  const Content = useMemo(() => {
    return isFinancialEmpty ? (
      <Empty type={Empty.NO_NEW_RELATED_DATA} className="new-no-data" />
    ) : (
      <WrapContainer>
        <Container key={pageKey}>
          <S.Container style={{ padding: '0', marginTop: '-10px' }}>
            {listMap.map(({ title, id, currTabkey }, index: number) => {
              return (
                <div key={id} id={id} style={{ marginTop: index ? '-2px' : '0' }}>
                  <ListItem
                    title={title}
                    currTabkey={currTabkey}
                    institutionCount={institutionCount}
                    setIsFirstLoading={setIsFirstLoading}
                    updateLoadings={updateLoadings}
                  />
                </div>
              );
            })}
          </S.Container>
        </Container>
        <div className="right-tab">
          <Anchor getContainer={() => (document.querySelector('.main-container') as HTMLElement) || window}>
            {listMap.map(({ title, id, currTabkey }) => {
              if (!Number(institutionCount?.[`${currTabkey}Number`])) {
                return <div className="grey-link">{title}</div>;
              } else return <Link href={`#${id}`} title={title} />;
            })}
          </Anchor>
        </div>
      </WrapContainer>
    );
  }, [isFinancialEmpty, institutionCount, pageKey, updateLoadings]);

  return (
    <WrapperContainer
      headerWidth={'calc(100% - 142px)'}
      loadingHideContent={true}
      topIsSticky={false}
      error={error}
      loading={countLoading || (isFinancialEmpty ? isFirstLoading : Object.values(loadings).some(Boolean))}
      content={Content}
      headerRightContent={<MoreBtn linkTo={linkTo} style={{ transform: 'translateY(-1px)' }} />}
    />
  );
}

const WrapContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .right-tab {
    margin-right: 45px;
    position: sticky;
    top: 43px;
    height: 100%;
    .grey-link {
      color: #c4c4c4;
      cursor: not-allowed;
    }
    .ant-anchor-link,
    .grey-link {
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      line-height: 13px;
      padding: 0px 0 14px 12px;
    }
    .ant-anchor-ink::before {
      width: 1px;
    }
    .ant-anchor-ink-ball {
      width: 1px;
      height: 13px;
      border: none;
      border-radius: 0;
      border-left: 1px solid #0171f6;
      background-color: #0171f6;
      transform: translate(-50%, -2px);
    }
  }
`;

const Container = styled.div`
  padding-bottom: 8px;
  width: calc(100% - 142px);
  .module-empty {
    margin-bottom: 24px;
  }

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
    //margin-top: 12px;
    height: 20px;
  }
`;
