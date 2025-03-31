import { useMemo } from 'react';

import Screen, { RowItem, Options } from '@dzh/screen';
import cn from 'classnames';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { useSelector } from '@pages/area/areaF9/context';

// import { Radio } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_F9_REGION_TRENDS, AREA_F9_INDUSTRY_TRENDS, AREA_F9_COMPANY_TRENDS } from '@/configs/localstorage';
import { formatNumber } from '@/utils/format';

import { ModuleEnum } from '../../constant';
import { conditionType } from '../../index';
import TipsPop from '../tipsPop';
// import FilterConfig from './filterConfig';
import S from './style.module.less';

import type { RadioChangeEvent } from 'antd';

interface FilterContentProps {
  /**筛选组件回调 */
  handleScreenChange: (current: RowItem[], index?: number) => void;
  handleRadioChange: (val: RadioChangeEvent) => void;
  handleSearch: (text: string) => void;
  handleTypeScreen: (text: string) => void;
  condition: conditionType;
  /**地区属性 */
  radioValue: string;
  /**数据总计 */
  dataCount: number;
  /**模块类型 */
  moduleType?: string;
  keywordRef: any;
  /**筛选组件key */
  screenKey: any;
  /**重要性受控值 */
  controlledValues: any;
  /* 是否本级城市 */
  isCounty?: boolean;
  /** screen 筛选项 */
  screenCfg: Options[];
}

const FilterContent = ({
  handleScreenChange,
  handleRadioChange,
  handleSearch,
  handleTypeScreen,
  condition,
  radioValue,
  dataCount,
  moduleType,
  keywordRef,
  screenKey,
  controlledValues,
  isCounty,
  screenCfg,
}: FilterContentProps) => {
  const regionName = useSelector((store: any) => store.areaInfo?.regionName) || '';
  // const screenCfg = FilterConfig({ moduleType });
  const commonDataInfo = useMemo(() => {
    let dataKey = '',
      module_type = '',
      fileName = '';
    if (moduleType === ModuleEnum.AREA) {
      dataKey = AREA_F9_REGION_TRENDS;
      module_type = 'web_areaF9_area_yq';
      fileName = '区域动态';
    } else if (moduleType === ModuleEnum.INDUSTRY) {
      dataKey = AREA_F9_INDUSTRY_TRENDS;
      module_type = 'web_areaF9_industry_yq';
      fileName = '行业动态';
    } else {
      dataKey = AREA_F9_COMPANY_TRENDS;
      module_type = 'web_areaF9_company_yq';
      fileName = '企业动态';
    }
    return { dataKey, module_type, fileName };
  }, [moduleType]);

  const sourceComponent = useMemo(
    () =>
      screenCfg[4] ? (
        <Screen
          key={screenKey}
          options={[screenCfg[4]]}
          onChange={(val) => handleScreenChange(val, 4)}
          getPopContainer={() => document.body}
        />
      ) : null,
    [screenCfg, screenKey, handleScreenChange],
  );

  return (
    <div className={S.filterContentWrap}>
      <div className={S.filterWrap}>
        {/* <Radio.Group className={S.radioWrap} onChange={handleRadioChange} value={radioValue}>
          {!isCounty ? <Radio value={'1'}>含下属辖区</Radio> : null}
          <Radio value={'2'}>本级</Radio>
        </Radio.Group> */}
        {/* 舆情动态筛选项调整 为不影响原有逻辑，index使用3*/}
        {!!screenCfg[3] && (
          <div className={S.regionFilter}>
            <Screen
              key={screenKey}
              options={[screenCfg[3]]}
              values={[controlledValues[3]]}
              onChange={(val) => handleScreenChange(val, 3)}
              getPopContainer={() => document.body}
            ></Screen>
          </div>
        )}
        {moduleType === ModuleEnum.COMPANY ? (
          <div className="filter-screen">
            <Screen
              options={[screenCfg[0]]}
              values={[controlledValues[0]]}
              onChange={(val) => handleScreenChange(val, 0)}
              getPopContainer={() => document.body}
            ></Screen>
            <TipsPop
              containerId="area_regionTrends"
              containerStyles={{ left: '-15px' }}
              pointerStyles={{ left: '15px' }}
            />
            <div className={cn('type-screen', condition.riskType ? 'active' : '')}>
              <span onClick={() => handleTypeScreen('open')}>类型筛选</span>
              <i className="icon iconArrow" onClick={() => handleTypeScreen('open')} />
              <i className="icon iconClose" onClick={() => handleTypeScreen('clear')} />
            </div>
            {sourceComponent}
            <Screen
              key={screenKey}
              options={[screenCfg[2]]}
              // values={[controlledValues[1]]}
              onChange={(val) => handleScreenChange(val, 1)}
              getPopContainer={() => document.body}
            ></Screen>
          </div>
        ) : (
          <>
            <div>
              <Screen
                key={screenKey}
                options={[screenCfg[0]]}
                onChange={(val) => handleScreenChange(val)}
                getPopContainer={() => document.body}
              ></Screen>
            </div>
            {sourceComponent}
          </>
        )}
        <div className={S.search}>
          <TopicSearch
            placeholder="请输入"
            onClear={() => {
              handleSearch('');
            }}
            onChange={(value: any) => {
              keywordRef.current = value;
            }}
            onSearch={handleSearch}
            cref={keywordRef}
            dataKey={commonDataInfo.dataKey}
            focusedWidth={224}
          />
        </div>
      </div>
      <ContentWrap>
        <Count>
          共 <span>{dataCount === 10000 ? `${formatNumber(dataCount, 0)}+` : formatNumber(dataCount, 0) || 0}</span> 条
        </Count>
        <ExportWrap>
          <ExportDoc
            condition={{
              module_type: commonDataInfo.module_type,
              moduleType,
              ...condition,
              isPost: true,
              sheetNames: {
                '0': `区域舆情-${commonDataInfo.fileName}资讯导出`,
              },
            }}
            filename={`${regionName}区域舆情-${commonDataInfo.fileName}-${dayjs().format('YYYY.MM.DD')}`}
          />
        </ExportWrap>
        {/* <Subscribe>
          邮件·微信订阅
        </Subscribe> */}
      </ContentWrap>
    </div>
  );
};

export default FilterContent;

const ContentWrap = styled.div`
  display: flex;
  align-items: center;
`;
const Count = styled.div`
  color: #8c8c8c;
  line-height: 20px;
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  span {
    color: #333333;
  }
`;
const ExportWrap = styled.div`
  margin-left: 24px;
  white-space: nowrap;
`;
// const Subscribe = styled.div`
//   position: relative;
//   margin-left: 38px;
//   white-space: nowrap;
//   font-size: 12px;
//   color: #3C3C3C;
//   cursor: pointer;
//   &::before {
//     content: '';
//     position: absolute;
//     width: 14px;
//     height: 14px;
//     top: 3px;
//     left: -13px;
//     background: url(${require('./subscribe.svg')}) no-repeat;
//     background-size: contain;
//       }
// `;
