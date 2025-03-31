import { FC, memo, useEffect, useRef, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn, useDebounceEffect, useSize } from 'ahooks';
// Rate
import { Popover } from 'antd';
import { omit } from 'lodash';
import styled from 'styled-components';

// import AreaRateDetail from '@pages/area/areaEconomy/components/mainTop/areaRateDetail';
import { useDispatch, useSelector } from '@pages/area/areaF9/context';
import { useAreaJumpLimit, useParams } from '@pages/area/areaF9/hooks';

import AreaRateDetail from '@/components/areaEchartTable/areaRateDetail';
import useMainTop from '@/components/areaEchartTable/useMainTop';
import { DataOption, ScreenType, SingleThirdSearchScreen } from '@/components/screen';
import { useLocation } from '@/libs/route';
import Arrow from '@/pages/area/areaF9/assets/arrow.svg';
import ArrowHover from '@/pages/area/areaF9/assets/arrow_hover.svg';
import PopoverBg from '@/pages/area/areaF9/assets/popover_bg.png';
import RateArrowHover from '@/pages/area/areaF9/assets/rate-arrow-hover.png';
import RateArrow from '@/pages/area/areaF9/assets/rate-arrow.svg';
import { formatNumber } from '@/utils/format';
import { useQuery } from '@/utils/hooks';
import { urlQueriesSerialize } from '@/utils/url';

import IndustryPlanTag from './industryPlanTag';
import Introduction from './introduction';
import useData from './introduction/useData';
import MoreTag from './moreTag';
import RiskLevel from './riskLevel';
import TypeTag from './typeTag';
// import useMainTop from './useMainTop';

interface LeftContentProps {
  rightWidth: number;
}

/** 简介popover计算使用，使箭头在[简介]居中 */
const INTRODUCELEFTWIDTH = 192;
/** 评分popover计算使用，使箭头居中 */
const RATELEFTWIDTH = 434;
/** 评分popover计算使用，使popover位置始终可见 */
const RATEOTHERWIDTH = 141;

const LeftContent: FC<LeftContentProps> = ({ rightWidth }) => {
  const { modelInfo } = useMainTop();

  const dispatch = useDispatch();
  const areaInfo = useSelector((store) => store.areaInfo);
  const jurisdictionCode = useSelector((store) => store.jurisdictionCode);
  const econmyAreaTree = useSelector((state) => state.econmyAreaTree);
  // const areaDataInfo = useSelector((store) => store.areaDataInfo);
  const location = useLocation();

  const history = useHistory();
  const { code } = useParams();
  const query = useQuery();

  // 切换地区埋点
  const regionSwitchRef = useRef<any>(null);
  const regionNameRef = useRef<HTMLDivElement>(null);
  const regionCodeRef = useRef('');
  const headLeftRef = useRef<any>(null);
  // 榜单标签是否展示更多
  const [moreType, setMoreType] = useState('');
  const [introduceVisible, setVisible] = useState(true);
  const [isScreenChange, setIsScreenChange] = useState(false);
  const { handleLimit } = useAreaJumpLimit(regionSwitchRef.current!, isScreenChange);

  /* 与src\pages\area\areaF9\hooks\useCheck.ts 中逻辑重复，删除这里 */
  // useEffect(() => {
  //   code && handleLimits({ code: code || '110000', pageCode: 'regionalEconomyQuickView' });
  //   // eslint-disable-next-line
  // }, [handleLimits]);

  const { data: introductionInfo, run /**loading */ } = useData();

  const introductionData = useMemo(() => introductionInfo?.data, [introductionInfo?.data]);

  useDebounceEffect(
    () => {
      if (areaInfo?.regionCode && areaInfo?.regionCode !== regionCodeRef.current && areaInfo?.level) {
        const subordinateRegion = areaInfo?.level === 3 && !jurisdictionCode ? areaInfo?.regionCode : jurisdictionCode;
        // if (subordinateRegion) {
        run({
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

  const handleChange = useMemoizedFn((data) => {
    setIsScreenChange(true);
    const regionCode = data.value;
    const jurisdictionCode = data?.children?.map((d: any) => d?.value)?.join(',') || '';

    regionCode &&
      handleLimit(regionCode, () => {
        handleJump(regionCode, jurisdictionCode);
      });
  });

  // 更新地区 code
  const handleJump = useMemoizedFn((code, jurisdictionCode) => {
    dispatch((d) => {
      d.jurisdictionCode = jurisdictionCode;
    });
    const urls = location.pathname.split('/');
    const newQuery = omit(query, 'showPowerDialog');
    const queryobj = code && newQuery?.code && code !== newQuery?.code ? { ...newQuery, code } : newQuery;
    urls?.splice(0, 2);
    history.push('/' + code + '/' + urls.join('/') + urlQueriesSerialize(queryobj) + location.hash);
  });

  const areaOption: DataOption = useMemo(() => {
    return [
      {
        title: '地区接口',
        option: {
          type: ScreenType.SINGLE_THIRD_AREA,
          children: econmyAreaTree,
        },
      },
    ];
  }, [econmyAreaTree]);

  const rating = useMemo(() => {
    dispatch((d) => {
      d.loading = false;
    });
    return Number(modelInfo?.complexScore);
  }, [dispatch, modelInfo]);

  const { width } = useSize(regionSwitchRef) || {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const popoverLeft = useMemo(() => RATEOTHERWIDTH - (regionSwitchRef.current?.offsetLeft || RATEOTHERWIDTH), [width]);

  /** 534-悬浮窗宽度一半 ，INTRODUCELEFTWIDTH-除了地区名称的左侧宽度之和 */
  const introduceOffsetLeft = INTRODUCELEFTWIDTH + (regionNameRef.current?.offsetWidth || 0) - 534;

  const content = (
    <AreaRateDetail
      data={modelInfo?.indicScoreList}
      leftTitleContent={null}
      complexScore={modelInfo?.complexScore}
      fivePointComplexScore={modelInfo?.fivePointComplexScore}
      scrollY={511}
    />
  );
  const IntroductionContent = (
    <Introduction data={introductionData || {}} regionCode={areaInfo?.regionCode || ''} closePopover={setVisible} />
  );

  // const { width = 0 } = useSize(document.getElementById('tabsWrapper')) || {};
  const { width: headerWidth = 0 } = useSize(document.getElementById('header-container-id')) || {};
  const { width: preWidth = 0 } = useSize(document.getElementById('left-content-id')) || {};
  const { width: tagsWidth = 0 } = useSize(document.getElementById('other-tag-id')) || {};

  const populationSize = useMemo(() => introductionData?.populationSize || '', [introductionData?.populationSize]);
  const cityParty = useMemo(() => introductionData?.cityParty || '', [introductionData?.cityParty]);
  const typeTagData = useMemo(() => {
    return { cityCircle: introductionData?.cityCircle };
  }, [introductionData?.cityCircle]);
  useEffect(() => {
    if (headerWidth > 0) {
      const leftContentWidth = headerWidth - rightWidth - 48 || 0;
      const cityWidth = cityParty ? 104 : 0;
      const testWidth = leftContentWidth - preWidth - tagsWidth;
      const newTestWidth = testWidth - cityWidth;
      const flagWidth = populationSize ? 334 : 240;
      if (testWidth < flagWidth) {
        if (newTestWidth < 152) {
          setMoreType('2');
        } else {
          setMoreType('1');
        }
      } else {
        setMoreType('');
      }
    }
  }, [populationSize, preWidth, rightWidth, tagsWidth, headerWidth, cityParty]);

  return (
    <LeftContainer ref={regionSwitchRef} popoverLeft={popoverLeft} introduceOffsetLeft={introduceOffsetLeft}>
      <div className="left-content" id="left-content-id" ref={headLeftRef}>
        <BreadcrumbItem mgr={10} ref={regionNameRef} title={areaInfo?.regionName}>
          {areaInfo?.regionName}
        </BreadcrumbItem>

        {code && econmyAreaTree.length ? (
          <ScreenContainer>
            <SingleThirdSearchScreen
              onChange={handleChange}
              options={areaOption}
              value={code}
              getPopContainer={() => regionSwitchRef.current!}
            />{' '}
          </ScreenContainer>
        ) : null}

        {/* 简介 */}
        {introductionData && introduceVisible ? (
          <Popover
            content={IntroductionContent}
            getPopupContainer={() => regionSwitchRef.current!}
            placement="bottom"
            overlayClassName="area-introduce"
          >
            <div className="area-introduce-text">简介</div>
          </Popover>
        ) : introductionData && !introduceVisible ? (
          <div className="area-introduce-text">简介</div>
        ) : null}

        {/* 产业规划标签 */}
        {introductionData?.industryPlan ? (
          <IndustryPlanTag content={introductionData.industryPlan} getPopupContainer={() => regionSwitchRef.current!} />
        ) : null}

        {/* 浮窗 */}
        <Popover
          content={content}
          getPopupContainer={() => regionSwitchRef.current}
          placement="bottom"
          overlayClassName="area-rate-detail"
        >
          {rating ? (
            <div className="rate">
              <div className="rate-word" />

              <div className="rate-star-wrap">
                <span className="rate-num">{formatNumber(rating)}</span>
                <span className="rate-chart">
                  {/* <Rate
                  className="rate-start"
                  allowHalf
                  defaultValue={rating > Math.floor(rating) ? Math.floor(rating) + 0.5 : Math.floor(rating)}
                  value={rating > Math.floor(rating) ? Math.floor(rating) + 0.5 : Math.floor(rating)}
                  disabled
                /> */}
                </span>
              </div>
            </div>
          ) : null}
        </Popover>
        {/*  风险等级 */}
        <RiskLevel code={areaInfo?.regionCode} getPopupContainer={() => regionSwitchRef.current!} />
      </div>
      <div className="tags-content">
        {/*  标签 */}
        <div id="other-tag-id">
          <TypeTag data={typeTagData} />
        </div>
        <MoreTag moreType={moreType} populationSize={populationSize} cityParty={cityParty} />
      </div>
    </LeftContainer>
  );
};

export default memo(LeftContent);

const LeftContainer = styled.div<{ popoverLeft: number; introduceOffsetLeft: number }>`
  display: flex;
  align-items: center;
  height: 100%;
  .left-content {
    display: flex;
    align-items: center;
  }
  /* .area-introduce-content {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  } */
  .tags-content {
    display: flex;
    align-items: center;
  }
  .area-introduce {
    z-index: 1060 !important;
    top: 26px !important;
    > div {
      &.ant-popover-content {
        > div {
          &.ant-popover-arrow {
            transform: translateX(
              ${({ introduceOffsetLeft }) => (introduceOffsetLeft > 0 ? 0 : introduceOffsetLeft)}px
            ) !important;
          }
        }
      }
    }

    .ant-popover-inner-content {
      padding: 0 !important;
    }
  }
  .area-rate-detail {
    left: -50px !important;
    top: 27px !important;
    z-index: 1060 !important;

    .ant-popover-inner {
      transform: translateX(${({ popoverLeft }) => popoverLeft}px);
    }

    .ant-popover-inner-content {
      padding: 31px 24px !important;
    }

    .ant-popover-content {
      .ant-popover-arrow {
        z-index: 12;
        left: ${RATELEFTWIDTH}px !important;
      }
    }
  }
  .area-introduce-text {
    width: auto;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    text-align: left;
    color: #0171f6;
    line-height: 18px;
    margin-left: 10px;
    padding: 0 5px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(1, 113, 246, 0.2);
    border-radius: 2px;
    white-space: nowrap;
    cursor: pointer;
    &::after {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: 2px;
      background: url(${Arrow}) center center no-repeat;
      background-size: 100% 100%;
      transform: translate(0, 1px);
    }
    &:hover {
      &::after {
        content: '';
        background: url(${ArrowHover});
        transform: translate(0, 1px);
      }
    }
  }
  .rate {
    position: relative;
    width: 108px;
    height: 20px;
    /* background: #fbf5ec; */
    border: 1px solid rgba(255, 117, 0, 0.2);
    border-radius: 2px;
    margin-left: 6px;
    padding: 0 5px;
    cursor: pointer !important;
    font-weight: 400;
    line-height: 18px;
    display: flex;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      top: 5px;
      right: 6px;
      width: 10px;
      height: 10px;
      background: url(${RateArrow}) center center no-repeat;
      background-size: 10px;
    }
    &:hover {
      &::after {
        content: '';
        width: 10px;
        height: 10px;
        background: url(${RateArrowHover}) center center no-repeat;
        background-size: 10px;
      }
    }
    .rate-word {
      background: url(${require('@/assets/images/area/rate-word@2x.png')}) no-repeat center;
      display: inline-block;
      width: 54px;
      height: 18px;
      background-size: contain;
    }
    .rate-star-wrap {
      .rate-num {
        color: #ff7500;
        font-size: 12px;
        line-height: 18px;
        margin-left: 3px;
        margin-right: 5px;
        font-weight: 500;
        display: inline-block;
      }
      .rate-chart {
        display: inline-block;
        position: relative;
        top: -1px;
        .ant-rate-star:not(:last-child) {
          margin-right: 2px !important;
        }
        .ant-rate-star > div:hover,
        .ant-rate-star > div:focus {
          -webkit-transform: scale(1) !important;
          transform: scale(1) !important;
        }
        .rate-start {
          color: #ff9032;
          font-size: 10px;
        }
      }
    }
  }
  .risk-level-popover {
    margin-left: 6px;
    .ant-popover-inner {
      background: linear-gradient(360deg, #f4f8ff 0%, #fafcff 100%);
    }
    .ant-popover-inner-content {
      background-image: url(${PopoverBg});
      background-position: bottom;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
`;

const ScreenContainer = styled.div`
  height: 24px;

  > div:first-child {
    > div:first-child {
      line-height: 1;
      height: 24px;
      display: flex;
      align-items: center;
      .ant-select {
        width: 124px;
        .ant-select-selector {
          height: 24px;
          .ant-select-selection-search input {
            height: 22px;
            line-height: 22px;
          }
          .ant-select-selection-placeholder {
            line-height: 22px;
          }
        }
      }
    }

    .screen-wrapper {
      transform: translateY(-30px);
    }
  }
`;

const BreadcrumbItem = styled.div<{ mgr?: number }>`
  max-width: 180px;
  font-size: 16px;
  font-weight: 500;
  color: #141414;
  margin-right: ${({ mgr }) => mgr || 0}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
