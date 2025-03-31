import { FC, memo, useRef, useMemo, useEffect } from 'react';

import { message } from '@dzh/components';
import { ProExcelNum, TopicSearch } from '@dzh/pro-components';
import { TopicSearchRef } from '@dzh/pro-components/dist/es/topic-search';
import Screen, { RowItem, ScreenValues } from '@dzh/screen';
import { Updater, useImmer } from '@dzh/utils';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { cloneDeep, isUndefined } from 'lodash';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import { useSelector } from '@/pages/area/areaF9/context';
import { STATIC_TITLE } from '@/pages/area/areaF9/modules/regionalOverview/monitoring/config';
import {
  companyTypeOption,
  riskLevelOption,
  industryOption,
} from '@/pages/publicOpinionPages/monitoring/components/moduleTemp/screenTitle/config';
import { RiskCompanyListApiParam } from '@/pages/publicOpinionPages/monitoring/hooks/useGetTableList';

import { useGetIndustryData } from './useGetData';

/** 筛选默认值 */
const defaultScreenValues: ScreenValues = [[], [], [], []];

const searchLSKey = 'monitoring_search_history';
const baseFilename = `高舆情风险企业-${dayjs().format('YYYYMMDD')}`;
/** 筛选项对应的参数 */
const resultParamKeys = ['companyType', 'riskLevel', 'industryCodeLevel1'];

interface HandlerProps {
  value: string[];
  updater: Updater<ScreenValues>;
  screenItemIdx?: number;
  /** 对应screen配置中的children, 需要是平铺的数据 */
  screenDetailOption?: RowItem[];
  hasCompanyType?: boolean;
}

const paramToValuesHandler = ({ value, screenDetailOption, screenItemIdx = 0, updater }: HandlerProps) => {
  if (screenDetailOption) {
    const valueMap = value.reduce((map, item) => {
      map.set(item, true);
      return map;
    }, new Map() as Map<string, boolean>);
    const screenItems = screenDetailOption.filter((item) => valueMap.get(item.value));
    updater((d) => {
      d[screenItemIdx] = screenItems;
    });
  }
};

const paramKeyToValuesWithHandler: Record<string, (props: HandlerProps) => () => void> = {
  companyType: (props: HandlerProps) => () =>
    paramToValuesHandler({
      ...props,
      screenDetailOption: companyTypeOption.option.children as RowItem[],
    }),
  riskLevel: (props: HandlerProps) => () =>
    paramToValuesHandler({
      ...props,
      screenDetailOption: riskLevelOption.option.children as RowItem[],
    }),
  industryCodeLevel1: (props: HandlerProps) => () => paramToValuesHandler(props),
};

export interface ScreenTitleProps {
  /** 总条数 */
  total: number;
  /** 默认企业类型 清空后使用 */
  defaultCompanyType: string;
  /** 参数 */
  apiParams: RiskCompanyListApiParam;
  /** 更新参数的方法 */
  updateApiParams: Updater<RiskCompanyListApiParam>;
  confirmIsScreenChange: (status: boolean) => void;
}

const ScreenTitle: FC<ScreenTitleProps> = ({
  total,
  defaultCompanyType,
  apiParams,
  updateApiParams,
  confirmIsScreenChange,
}) => {
  const areaInfo = useSelector((s) => s.areaInfo);
  const prevApiParams = useRef<RiskCompanyListApiParam>({});
  const searchRef = useRef<TopicSearchRef>(null);
  const [screenValues, updateScreenValues] = useImmer(defaultScreenValues);

  const industryData = useGetIndustryData();

  const filename = useMemo(
    () => `${areaInfo?.regionName ? `${areaInfo?.regionName}-` : ''}${baseFilename}`,
    [areaInfo?.regionName],
  );
  const exportCondition = useMemo(() => {
    return {
      module_type: 'negative_news_list',
      sheet_name: STATIC_TITLE,
      ...apiParams,
    };
  }, [apiParams]);

  /** 行业筛选项 */
  const industryResultOption = useMemo(() => {
    const newIndustryOption = cloneDeep(industryOption);
    if (industryData) {
      newIndustryOption!.option!.children = industryData;
    }
    return newIndustryOption;
  }, [industryData]);

  /** 最终的筛选项 拼接成的 */
  const resultOptions = useMemo(
    () => [companyTypeOption, riskLevelOption, industryResultOption],
    [industryResultOption],
  );

  /** 筛选变动 */
  const handleScreenChange = useMemoizedFn((current: RowItem[], allSelectedRows: RowItem[], index: number) => {
    // 更新参数
    updateApiParams((d) => {
      const key = resultParamKeys[index];
      if (key === 'companyType' && !current.length) {
        // 企业类型 清空后特殊处理
        d.companyType = defaultCompanyType;
      } else {
        d[key as keyof RiskCompanyListApiParam] = current.map((item) => item.value).join(',');
      }
      // 筛选重置翻页
      d.skip = '0';
    });
    confirmIsScreenChange(true);
  });

  /** 搜索 */
  const onSearch = useMemoizedFn((value) => {
    if (!value) {
      // 清空
      updateApiParams((d) => {
        d.query = '';
      });
    } else if (value.length < 2) {
      message.error('请输入2个及以上关键字');
    } else {
      updateApiParams((d) => {
        d.query = value;
        // 筛选重置翻页
        d.skip = '0';
      });
    }
    confirmIsScreenChange(true);
  });

  // 根据params对screen组件受控 以及设置search组件的value
  useEffect(() => {
    if (industryData) {
      for (let key in paramKeyToValuesWithHandler) {
        if (!isUndefined(resultParamKeys.includes(key))) {
          const getHandler = paramKeyToValuesWithHandler[key as keyof typeof paramKeyToValuesWithHandler];
          const values = apiParams[key as keyof RiskCompanyListApiParam];
          const prevValues = prevApiParams.current[key as keyof RiskCompanyListApiParam];
          // 判断是否变化
          if (values !== prevValues) {
            let screenDetailOption: RowItem[];
            if (key === 'industryCodeLevel1') {
              screenDetailOption = industryData as RowItem[];
            }
            getHandler({
              value: ((values as string) || '').split(','),
              screenDetailOption: screenDetailOption!,
              updater: updateScreenValues,
              screenItemIdx: resultParamKeys.findIndex((item) => item === key),
            })();
          }
        }
      }
      searchRef.current?.set(apiParams.query || '');
      prevApiParams.current = apiParams;
    }
  }, [industryData, apiParams, updateScreenValues]);

  return (
    <ScreenTitleContainer>
      <div className="screen-title-detail">
        <Screen values={screenValues} options={resultOptions} onChange={handleScreenChange} />
        <TopicSearch
          ref={searchRef}
          onSearch={onSearch}
          focusedWidth={224}
          persistenceKey={`${searchLSKey}_${STATIC_TITLE}`}
          persistenceType="localStorage"
          className="screen-title-detail-search"
        />
      </div>
      <div className="screen-title-tools">
        <div className="screen-title-tools-excelnum">
          <ProExcelNum total={total} className="screen-title-excelnum" />
        </div>
        <ExportDoc usePost filename={filename} condition={exportCondition} />
      </div>
    </ScreenTitleContainer>
  );
};

export default memo(ScreenTitle);

const ScreenTitleContainer = styled.div`
  height: 28px;
  padding: 0 0 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  position: sticky;
  top: 35px;
  z-index: 4;
  .screen-title-detail {
    display: flex;
    align-items: center;
    gap: 12px;
    .screen-title-detail-search {
      .dzh-topic-input .ant-input-group .ant-input-affix-wrapper input.ant-input {
        height: 22px;
        line-height: 22px;
        &::placeholder {
          color: rgb(40, 40, 40) !important;
        }
      }
      .dzh-topic-input.active .ant-input-group .ant-input-affix-wrapper input.ant-input {
        &::placeholder {
          color: rgb(140, 140, 140) !important;
        }
      }
      .ant-input-prefix svg {
        color: #0171f6;
      }
    }
  }
  .screen-title-tools {
    display: flex;
    align-items: center;
    gap: 24px;
    .screen-title-tools-excelnum {
      display: flex;
      align-items: center;
    }
    .screen-title-excelnum {
      margin-right: 4px;
      .dzh-excel-num-total {
        color: #333333;
      }
    }
  }
`;
