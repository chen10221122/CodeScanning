import { useMemo, useRef } from 'react';

import { Empty } from '@dzh/components';
import { useDebounceEffect } from 'ahooks';
import styled from 'styled-components';

import { useSelector } from '@pages/area/areaF9/context';

import { Spin } from '@/components/antd';
import CardHeader from '@/pages/area/areaF9/components/header-content/introduction/header';
import Map from '@/pages/area/areaF9/components/header-content/introduction/map';
import { Title } from '@/pages/area/areaF9/components/header-content/introduction/style';
import Next from '@/pages/area/areaF9/components/next';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';

import AnchorHead from './anchorHead';
import CardContent from './components/CardContent';
import MainIndic from './mainIndic';
import useData from './useData';

export const prefix = getPrefixCls('areaf9-briefIntroduction');
export const css = getStyledPrefixCls('areaf9-briefIntroduction');

const mapWrapperStyle = { padding: '8px 14px' };
const chartsWrapperStyle = { width: '352px', height: '224px', marginTop: '-9px' };

export default () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const jurisdictionCode = useSelector((store) => store.jurisdictionCode);

  const regionCodeRef = useRef('');

  const { data: introductionInfo, run, loading, error } = useData();

  useDebounceEffect(
    () => {
      if (areaInfo?.regionCode && areaInfo?.regionCode !== regionCodeRef.current && areaInfo?.level) {
        const subordinateRegion = areaInfo?.level === 3 && !jurisdictionCode ? areaInfo?.regionCode : jurisdictionCode;
        // if (subordinateRegion) {
        run({
          isF9: true,
          jurisdictionCode: subordinateRegion || areaInfo?.regionCode,
          regionCode: areaInfo?.regionCode,
        });
        regionCodeRef.current = areaInfo?.regionCode;
        // }
      }
    },
    [areaInfo?.regionCode, jurisdictionCode, run, areaInfo?.level],
    { wait: 200 },
  );

  const { indicGraph, indicYear, regionName, indicValue, mainIndic, infos, dataSource } = useMemo(
    () => ({ ...(introductionInfo?.data || {}) }),
    [introductionInfo?.data],
  );

  const anchorList = useMemo(() => infos?.map((info: any) => info?.name) || [], [infos]);

  const hasData = useMemo(() => {
    const isData = mainIndic?.filter((item: any) => item?.indicValue)?.length;
    return infos?.length || isData || indicGraph?.length;
  }, [indicGraph?.length, infos?.length, mainIndic]);

  return (
    <BriefIntroductionWrapper>
      {loading ? (
        <Spin type="thunder" keepCenter direction="vertical" />
      ) : error || !hasData ? (
        <EmptyContainer>
          <Empty style={{ paddingTop: '15%' }} type={error ? Empty.LOAD_FAIL : Empty.NO_DATA} />
        </EmptyContainer>
      ) : (
        <>
          <div className={prefix('wrapper')}>
            <Title mgb={6}>区域简介</Title>
            <div className={prefix('indic-and-map')}>
              <Map
                regionCode={areaInfo?.regionCode || ''}
                indicGraph={indicGraph}
                indicYear={indicYear}
                regionName={regionName}
                indicValue={indicValue}
                isTitle={false}
                visualMapBottom={48}
                mapWrapperStyle={mapWrapperStyle}
                chartsWrapperStyle={chartsWrapperStyle}
              />
              <div>
                <MainIndic data={mainIndic} regionName={regionName} indicYear={indicYear} />
              </div>
            </div>
            <AnchorHead anchorList={anchorList} source={dataSource} />
            {infos?.map((infoItem: any, index: number) => {
              return (
                <ContentWrapper key={infoItem?.name} id={infoItem?.name}>
                  <CardHeader
                    cpTxt={infoItem?.value || ''}
                    url={infoItem?.url || ''}
                    titleInfo={{
                      index,
                      title: infoItem?.name || '',
                    }}
                    mgb={6}
                  />
                  <div className={prefix('card-content')}>
                    <CardContent innerValue={infoItem?.value} />
                  </div>
                </ContentWrapper>
              );
            })}
          </div>
          <Next />
        </>
      )}
    </BriefIntroductionWrapper>
  );
};

const BriefIntroductionWrapper = styled.div`
  position: relative;
  /* max-width: 930px; */
  width: 100%;
  height: 100%;

  ${css('wrapper')} {
    min-height: calc(100vh - 176px);
    padding: 8px 20px 20px;
  }

  .loading-container {
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -36px;
  }
  ${css('indic-and-map')} {
    display: flex;
    align-items: center;
    > div {
      height: 224px;
      border: 1px solid #efefef;
      border-radius: 4px;
    }
    > div:first-child {
      width: 380px;
      margin-right: 10px;
    }
    > div:nth-child(2) {
      width: 470px;
      padding: 8px 18px 11px 18px;
      /* background: linear-gradient(1deg,rgb(250,252,255) 70%, #e5f1ff 100%); */
      background: url(${require('../../../assets/main-indic-bg.png')}) no-repeat #fff;
      background-size: cover;
      background-color: transparent;

      > div:first-child {
        margin-left: -8px !important;
      }
    }
  }
`;

const EmptyContainer = styled.div`
  min-height: calc(100% - 48px);
`;

const ContentWrapper = styled.div`
  max-width: 860px;
  padding-top: 6px;
  ${css('card-content')} {
    width: 100%;
    height: fit-content;
    padding: 8px 24px;
    margin-top: 6px;
    font-size: 13px;
    font-weight: 400;
    color: #141414;
    line-height: 22px;
    background: linear-gradient(90deg, #fbfdff 2%, #f5faff);
    border-radius: 4px;
  }
`;
