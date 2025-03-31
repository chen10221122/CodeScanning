import { FC, memo, useMemo, useEffect, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { OpenDataSourceDrawer } from '@/components/dataSource';
import { Screen, ScreenType, Options, RowItem } from '@/components/screen';
import { TransferSelect } from '@/components/transferSelectNew';
import { LINK_AREA_DEBT } from '@/configs/routerMap/area';
import { setConditionItem } from '@/pages/area/areaDebt/components/filter';
import { indicatorList } from '@/pages/area/areaDebt/components/filter/indicator';
import useFilter from '@/pages/area/areaDebt/components/filter/useFilter';
import ControlledScreenWrapper from '@/pages/bond/cityInvestMap/components/controlledScreenWrapper';
import CountExport from '@/pages/bond/cityInvestMap/components/countExport';
import { OVERLAY_STYLE } from '@/pages/bond/cityInvestMap/content';
import { useImmer } from '@/utils/hooks';

import AreaInfoDialog from '../components/areaInfoDialog';
import IndicatorDialog from '../components/indicatorDialog';
import { useCtx } from '../context';
/** 区域间比较导出参数compareLevel的取值 */
enum CompareLevel {
  /** 省级比较（直辖市也算省级） */
  Province = '0',
  /** 地级市级比较 */
  City = '1',
  /** 区县比较 */
  County = '2',
}

interface FilterCondition {
  from: number;
  size: number;
  sort: string;
  /** 年份 */
  endDate: string;
  /** 指标名称拼接 */
  indicName?: string;
}

interface Props {
  /** 要跳转的地区code */
  regionCode?: string;
  /** 当前选中的地区code */
  curRegionCode?: string;
  /** 区域间比较必传的导出参数，当前地区的名称 */
  localCity?: string;
  /** 导出的module_type */
  moduleType?: string;
  /** 是否是城投全景下的内容 */
  isCityInvestMapContent?: boolean;
  UpdateTip?: React.ReactElement;
  pageCode?: string;
  openDataSource?: OpenDataSourceDrawer;
}

const Filter: FC<Props> = ({
  curRegionCode,
  regionCode,
  localCity,
  moduleType = 'regional_economies_compare',
  isCityInvestMapContent = false,
  UpdateTip,
  pageCode,
  openDataSource,
}) => {
  const {
    state: { total, openSource, year, tblData, condition, infoDetail, requestParams, sortName, screenKey },
    update,
  } = useCtx();
  const domRef = useRef<HTMLDivElement>(null);
  const { data: yearStr } = useFilter();
  const [indicators, setIndicators] = useImmer<RowItem[] | undefined>([]);

  const yearConfig: Options[] = useMemo(() => {
    if (yearStr) {
      let yearOption = [];
      for (let i = new Date().getFullYear(); i > 1957; i--) {
        let s = i.toString();
        yearOption.push({
          name: s,
          value: s,
          key: 'endDate',
        });
      }

      return [
        {
          title: '年份',
          option: {
            type: ScreenType.SINGLE,
            children: yearOption,
            default: yearStr,
            cancelable: false,
          },
          overlayStyle: OVERLAY_STYLE,
        },
      ];
    }
    return [];
  }, [yearStr]);

  useEffect(() => {
    let condition: FilterCondition = {
      from: 0, //  起始值
      size: 10000, // 每页显示条数
      sort: '', // 排序规则，如地区生产总值: desc，多个逗号分割
      endDate: year,
    };
    if (indicators) setConditionItem(condition, indicators, 'indicName');
    if (year && year.length) {
      update((o) => {
        o.condition = condition;
      });
    }
  }, [indicators, update, year]);

  const onYearChange = useMemoizedFn((currentSelected) => {
    update((draft) => {
      draft.year = currentSelected?.[0].value ?? '';
    });
  });

  const onTraceSourceChange = useMemoizedFn((check) =>
    update((draft) => {
      draft.openSource = check;
    }),
  );

  const onIndicatorChange = useMemoizedFn((selectedRows) => setIndicators(() => selectedRows));

  const AreaInfoDialogShow = useMemo(() => {
    return !isEmpty(infoDetail);
  }, [infoDetail]);

  const closeInfoDialog = useMemoizedFn(() => {
    update((draft) => {
      draft.infoDetail = {};
    });
  });

  const closeIndicatorDialog = useMemoizedFn(() => {
    update((o) => {
      o.indicator = '';
    });
  });

  const compareLevel = useMemo(() => {
    if (!localCity || !curRegionCode) return undefined;
    if (curRegionCode.substring(curRegionCode.length - 2) !== '00') return CompareLevel.County;
    else if (curRegionCode.substring(curRegionCode.length - 4) === '0000') return CompareLevel.Province;
    else return CompareLevel.City;
  }, [localCity, curRegionCode]);

  const screenNode = useMemo(
    () => (
      <Screen
        key={`${screenKey}_screen`}
        options={yearConfig}
        onChange={onYearChange}
        getPopContainer={() => (document.querySelector('.side-page-content') as HTMLElement) || document.body}
      />
    ),
    [onYearChange, yearConfig, screenKey],
  );

  const transferSelectNode = useMemo(
    () => (
      <TransferSelect
        key={`${screenKey}_indic`}
        className="transfer-select"
        title="指标"
        data={indicatorList}
        moduleCode="qyjjdq"
        forbidEmptyCheck
        pageCode=""
        onChange={onIndicatorChange}
        getPopupContainer={() => (document.querySelector('.side-page-content') as HTMLElement) || document.body}
        //@ts-ignore
        overlayStyle={OVERLAY_STYLE}
      />
    ),
    [onIndicatorChange, screenKey],
  );

  return (
    <>
      <Wrapper ref={domRef}>
        <div className="flex-style">
          {isCityInvestMapContent ? (
            <>
              <ControlledScreenWrapper>{screenNode}</ControlledScreenWrapper>
              <ControlledScreenWrapper isTransferSelect>{transferSelectNode}</ControlledScreenWrapper>
            </>
          ) : (
            <>
              {screenNode}
              {transferSelectNode}
            </>
          )}
        </div>
        <CountExport
          exportProps={{
            condition: {
              ...requestParams,
              indexId: '',
              indexSort: '',
              indicName: requestParams.indicName || '',
              localCity,
              compareLevel,
              sort: sortName,
              module_type: moduleType,
              fromSource: 'pc-web',
              exportFlag: 'true',
              sheetNames: { '0': '辖区经济' },
            },
            filename: `${localCity}辖区经济${dayjs(new Date()).format('YYYYMMDD')}`,
          }}
          totalNum={total}
          link={`${LINK_AREA_DEBT}?year=${year}${regionCode ? '&regionCode=' + regionCode : ''}${
            regionCode
              ? moduleType === 'regional_economies_compare'
                ? '&getChild=true'
                : '&getChild=true&getSelf=true'
              : ''
          }`}
          onTraceSourceChange={onTraceSourceChange}
          traceSourceFlag={openSource}
          container={document.querySelector('.side-page-content') as HTMLElement}
          UpdateTip={UpdateTip}
        />
      </Wrapper>

      <AreaInfoDialog
        show={AreaInfoDialogShow}
        close={closeInfoDialog}
        pageCode={pageCode}
        hideUpdateTip={false}
        openDataSource={openDataSource}
      />
      <IndicatorDialog
        data={tblData}
        year={condition?.endDate}
        close={closeIndicatorDialog}
        pageCode={pageCode}
        condition={requestParams}
        hideUpdateTip={false}
        openDataSource={openDataSource}
      />
    </>
  );
};

export default memo(Filter);

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  line-height: 20px;
  .flex-style {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }
  .transfer-select {
    margin-left: 24px;
  }
  .ant-dropdown-trigger {
    white-space: nowrap;
  }
`;
