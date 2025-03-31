import { memo, useEffect, useMemo, useState, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isArray } from 'lodash';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';
import { useParams } from '@pages/area/areaF9/hooks';

import { useLocation } from '@/libs/route';
import { isCounty } from '@/pages/area/areaF9/utils';
import { useImmer } from '@/utils/hooks';

import Filter from './components/filter';
import FilterConfig from './components/filter/filterConfig';
import TabFilter from './components/tabFilter';
import IndustryFilter from './components/tabFilter/industryFilter';
import useTabFilterData from './components/tabFilter/useTabFilterData';
import Table from './components/table';
import { modulTypeMap, ModuleEnum, PAGESIZE, STARTHMS, ENDHMS } from './constant';

export interface conditionType {
  /**区域代码 */
  regionCode: string;
  /**区域类型 */
  regionSelectType?: string;
  /**重要性 */
  importance: string;
  /**正负面 */
  negative: string;
  /**查询日期 */
  startDate: string;
  endDate: string;
  /**企业类型 */
  companyType: string;
  /**搜索 */
  text: string;
  /** 行业属性 */
  swBusinessType?: string;
  /** 来源 */
  sourceType?: string;
  [k: string]: string | number | undefined;
}

type SimpleConditionType = keyof Pick<
  conditionType,
  'importance' | 'negative' | 'companyType' | 'swBusinessType' | 'sourceType'
>;

const PublicSentimentTrends = () => {
  const { pathname } = useLocation();
  const { regionCode } = useParams(); //区域code
  const defaultRegionSelectType = isCounty(regionCode) ? '2' : '1'; // 创建一个新的参数 表示单签选中的是 含下属辖区1 还是 本级2
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [screenLoading, setScreenLoading] = useState(false);
  const [firstTimeNoData, setFirstTimeNoData] = useState(false);
  const [screenKey, setScreenKey] = useState(0); // 筛选组件的key
  const [radioValue, setRadioValue] = useState(defaultRegionSelectType); //区域类型
  const [dataCount, setDataCount] = useState(0); //数据统计数
  const [current, setCurrent] = useState(1);
  const [keyWord, setKeyWord] = useState(''); //搜索关键字
  const containerRef = useRef<any>();
  const contentRef = useRef();
  const keywordRef = useRef<any>();

  const moduleType = useMemo(() => {
    //模块类型
    let pageType = pathname.split('/')[3];
    return modulTypeMap.get(pageType);
  }, [pathname]);

  const screenCfg = FilterConfig({ moduleType });

  /* 企业动态company需要特殊处理 */
  const isCompany = useMemo(() => moduleType !== ModuleEnum.COMPANY, [moduleType]);

  const defalutCondition = useMemo(
    () =>
      Object.assign(
        {
          regionCode,
          // regionSelectType: defaultRegionSelectType,
          importance: isCompany ? '' : '1',
          negative: '',
          startDate: '',
          endDate: '',
          companyType: '',
          sourceType: '',
          text: '',
        },
        isCompany ? { swBusinessType: '' } : {},
      ),
    [isCompany, regionCode],
  );
  const [screenCondition, setScreenCondition] = useImmer<conditionType>(defalutCondition);
  const [condition, setCondition] = useImmer<conditionType>({ ...defalutCondition, pagesize: PAGESIZE, skip: 0 });
  const [controlledValues, setControlledValues] = useImmer([[isCompany ? '' : '1'], []]);
  // 行业筛选受控值
  const [industryFilterVals, updateIndustryFilterVals] = useImmer({
    tileValues: [] as string[],
    moreScreenValues: [] as string[],
  });
  const [tabFilterValues, setTabFilterValues] = useState('');

  const helpContent = <HelpWrap>精选注册地属于当前地区(本级/含下属辖区)的企业的正面或负面新闻。</HelpWrap>;

  const { tabDataList, industryDataList, industryList } = useTabFilterData({ moduleType, screenCondition });

  const scrollTop = useMemoizedFn(() => {
    containerRef.current.scrollTop = 0;
  });

  const handleScreenChange = useMemoizedFn((currentSelectedRows: any[], index: number) => {
    /**顶部筛选组件回调 */
    let regionList: string[] = [], // 下属辖区
      date: any = null;

    // 根据type收集value
    const screenKeyMap: Map<SimpleConditionType, string[]> = new Map([
      ['importance', []],
      ['negative', []],
      ['companyType', []],
      ['swBusinessType', []],
      ['sourceType', []],
    ]);
    currentSelectedRows.forEach((item: any) => {
      if (screenKeyMap.get(item.key)) {
        const target = screenKeyMap.get(item.key)!;
        target?.push(item.value);
        screenKeyMap.set(item.key, target);
      } else {
        if (item.__key === 'area') {
          //下属辖区
          regionList.push(item.value);
        } else {
          //查询日期
          date = isArray(item.value)
            ? `${item.value[0].format('YYYYMMDD')}${STARTHMS},${item.value[1].format('YYYYMMDD')}${ENDHMS}`
            : item.value;
        }
      }
    });
    // console.log('currentSelectedRows===', currentSelectedRows);
    if (index === 0) {
      const targetList = screenKeyMap.get('importance')!;
      setControlledValues((d) => {
        d[0] = targetList.length ? targetList : [''];
      });
      return;
    } else if (index === 1) {
      setControlledValues((d) => {
        d[1] = currentSelectedRows;
      });
    } else if (index === 3) {
      setControlledValues((d) => {
        d[3] = currentSelectedRows;
      });
      setScreenCondition((old) => {
        old.regionCode = regionList?.length ? regionList.join(',') : regionCode;
      });
    }
    setScreenCondition((old) => {
      const simpleScreen = Array.from(screenKeyMap.entries()).reduce((result, [key, list]) => {
        result[key] = list.join(',');
        return result;
      }, {} as Record<string, string>);
      return {
        ...old,
        ...simpleScreen,
        startDate: date?.length ? date.split(',')[0] : '',
        endDate: date?.length ? date.split(',')[1] : '',
      };
    });

    updateIndustryFilterVals((d) => {
      d.tileValues = [];
      d.moreScreenValues = [];
    });
  });

  const handleAreaItemClick = useMemoizedFn((code: string) => {
    handleResetNoEffect();
    setControlledValues(() => [[isCompany ? '' : '1'], [], [], [code]]);
    setScreenCondition(() => ({
      ...defalutCondition,
      regionCode: code,
    }));
  });

  const handleTabChange = useMemoizedFn((val: any[], type: string) => {
    /**tab筛选回调 */
    scrollTop();
    setCurrent(1);
    const valStr = val.map((el: any) => el.id).join();
    if (type === 'table') {
      if (moduleType === ModuleEnum.INDUSTRY) {
        handleReset(false);
        // 表格中关联行业在更多筛选中
        updateIndustryFilterVals((d) => {
          d.tileValues = [];
          d.moreScreenValues = val.map((el: any) => el.id);
        });
      } else {
        handleReset();
        setTabFilterValues(valStr);
      }
    }
    const resultVal = valStr === '不限类型' ? '' : valStr;
    if (moduleType === ModuleEnum.AREA) {
      setCondition((old) => {
        old.financeType = resultVal;
      });
    } else if (moduleType === ModuleEnum.INDUSTRY) {
      setCondition((old) => {
        old.swBusinessType = resultVal;
      });
    } else {
      setCondition((old) => {
        old.riskType = resultVal;
      });
    }
  });

  const hanldeIndustryChange = useMemoizedFn((selected: string[], tile: string[], more: string[]) => {
    /**tab筛选回调 */
    scrollTop();
    setCurrent(1);
    setCondition((old) => {
      old.swBusinessType = selected.join();
    });
    setScreenCondition((d) => {
      d.swBusinessType = selected.join();
    });
    updateIndustryFilterVals((d) => {
      d.moreScreenValues = more;
      d.tileValues = tile;
    });
  });

  useEffect(() => {
    setScreenLoading(true);
    setCondition((d) => ({ ...d, ...screenCondition }));
    scrollTop();
    setCurrent(1);
  }, [screenCondition, setCondition, scrollTop]);

  const handleRadioChange = useMemoizedFn((e: any) => {
    //区域类型回调
    setScreenLoading(true);
    setRadioValue(e.target.value);
    setScreenCondition((d) => {
      d.regionSelectType = e?.target?.value || '';
    });
  });
  const handleSearch = useMemoizedFn((text: any) => {
    //搜索回调
    if (keyWord === text) return;
    setScreenLoading(true);
    setScreenCondition((d) => {
      d.text = text;
    });
    setKeyWord(text);
  });

  const handleResetNoEffect = useMemoizedFn(() => {
    /**清除筛选 */
    setCurrent(1);
    setRadioValue(defaultRegionSelectType);
    setScreenKey(Math.random());
    setKeyWord('');
    keywordRef.current.setInputValue('');
    //@ts-ignore
    contentRef.current?.handleRest();
  });

  const handleReset = useMemoizedFn((resetIndustryFilter = true) => {
    /**清除筛选 */
    setCurrent(1);
    setRadioValue(defaultRegionSelectType);
    setScreenKey(Math.random());
    setControlledValues(() => [[isCompany ? '' : '1'], []]);
    setScreenCondition(() => defalutCondition);
    setKeyWord('');
    keywordRef.current.setInputValue('');
    if (resetIndustryFilter) {
      //@ts-ignore
      contentRef.current?.handleRest();
      updateIndustryFilterVals((d) => {
        d.tileValues = [];
        d.moreScreenValues = [];
      });
    }
  });

  /* 类型筛选 */
  const handleTypeScreen = useMemoizedFn((type: string) => {
    if (type === 'clear') {
      //@ts-ignore
      contentRef.current?.handleRest();
      setCondition((old) => {
        old.riskType = '';
      });
    } else {
      //@ts-ignore
      contentRef.current?.setVisible(true);
    }
  });

  const hasTabData = useMemo(() => tabDataList.length > 0, [tabDataList.length]);

  const industryTabFilter = useMemo(
    () =>
      moduleType === ModuleEnum.INDUSTRY ? (
        <IndustryFilter
          // ref={contentRef}
          tabDataList={tabDataList}
          industryDataList={industryList}
          tabFilterValues={industryFilterVals}
          // @ts-ignore
          onChange={hanldeIndustryChange}
        />
      ) : null,
    [moduleType, tabDataList, industryList, industryFilterVals, hanldeIndustryChange],
  );

  const tabFilter = useMemo(
    () =>
      tabDataList.length ? (
        moduleType !== ModuleEnum.INDUSTRY ? (
          <TabFilter
            tabDataList={tabDataList}
            industryDataList={industryDataList}
            moduleType={moduleType}
            ref={contentRef}
            tabFilterValues={tabFilterValues}
            // @ts-ignore
            onChange={handleTabChange}
          />
        ) : (
          industryTabFilter
        )
      ) : null,
    [tabDataList, industryDataList, industryTabFilter, moduleType, tabFilterValues, handleTabChange],
  );

  const Content = useMemo(
    () => (
      <>
        {!firstTimeNoData ? (
          <HeadConent>
            {/**筛选部分 */}
            <Filter
              // @ts-ignore
              handleScreenChange={handleScreenChange}
              handleRadioChange={handleRadioChange}
              handleSearch={handleSearch}
              handleTypeScreen={handleTypeScreen}
              condition={condition}
              radioValue={radioValue}
              controlledValues={controlledValues}
              dataCount={dataCount}
              moduleType={moduleType}
              keywordRef={keywordRef}
              // renderRef={renderRef}
              screenKey={screenKey}
              isCounty={!!isCounty(regionCode)}
              screenCfg={screenCfg}
            />
            {/**tab部分 */}
            {tabFilter}
          </HeadConent>
        ) : null}
        {/**表格部分 */}
        <Table
          condition={condition}
          moduleType={moduleType}
          keyWord={keyWord}
          total={dataCount}
          current={current}
          // regionCode={regionCode}
          containerRef={containerRef}
          firstTimeLoading={firstTimeLoading}
          screenLoading={screenLoading}
          firstTimeNoData={firstTimeNoData}
          hasTabData={hasTabData && isCompany}
          setFirstTimeLoading={setFirstTimeLoading}
          setScreenLoading={setScreenLoading}
          setFirstTimeNoData={setFirstTimeNoData}
          setCurrent={setCurrent}
          setDataCount={setDataCount}
          // @ts-ignore
          handleTabChange={handleTabChange}
          handleAreaItemClick={handleAreaItemClick}
          handleReset={handleReset}
          scrollTop={scrollTop}
        />
      </>
    ),
    [
      tabFilter,
      radioValue,
      controlledValues,
      hasTabData,
      moduleType,
      condition,
      dataCount,
      // renderRef,
      keyWord,
      screenKey,
      current,
      regionCode,
      containerRef,
      firstTimeLoading,
      screenLoading,
      firstTimeNoData,
      isCompany,
      screenCfg,
      setFirstTimeLoading,
      setScreenLoading,
      setFirstTimeNoData,
      setCurrent,
      setDataCount,
      handleScreenChange,
      handleRadioChange,
      handleSearch,
      handleTabChange,
      // handelCellClick,
      handleReset,
      scrollTop,
      handleTypeScreen,
      handleAreaItemClick,
    ],
  );

  return (
    <WrapperContainer
      containerRef={containerRef}
      loading={firstTimeLoading}
      loadingTop={'-20%'}
      topIsSticky={false}
      content={Content}
      popoverInfo={{ helpContent }}
      backup
      contentStyle={{
        paddingBottom: 0,
        marginBottom: 0,
      }}
      containerStyle={{
        minWidth: '930px',
        overflow: 'hidden scroll',
      }}
    ></WrapperContainer>
  );
};
export default memo(PublicSentimentTrends);

const HeadConent = styled.div`
  display: block;
  position: sticky;
  padding-top: 7px;
  top: 0;
  z-index: 8;
  background-color: #fff;
`;

const HelpWrap = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #434343;
`;
