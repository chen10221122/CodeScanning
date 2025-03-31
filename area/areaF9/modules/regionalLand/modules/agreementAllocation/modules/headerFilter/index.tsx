import { memo, useEffect, useRef } from 'react';

import { ProExcelNum, ExportDoc } from '@dzh/pro-components';
import Screen, { Options } from '@dzh/screen';
import { useMemoizedFn, useSize } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { useSelector } from '@pages/area/areaF9/context';
import DateScreen from '@pages/area/landTopic/components/dateScreen';

import TopicSearch from '@/components/topicSearch';
import {
  ENTERPRISE_TYPE,
  LAND_USE,
  MORE_SCREEN,
  MORE_SCREEN_NEW,
} from '@/pages/area/areaF9/modules/regionalLand/commonMenu';
import { useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/provider';
import { removeObjectNil } from '@/utils/share';

import S from '@pages/area/landTopic/styles.module.less';

const TOPIC_SEARCH_STYLE = { marginLeft: '2px', height: '24px', minWidth: '276px' };
interface Props {
  pageType: string;
  areaCodeObj: { [x: string]: string | undefined };
}
const HeaderFilter = ({ pageType, areaCodeObj }: Props) => {
  const {
    state: {
      total,
      dateFilter,
      otherFilter,
      statisticsScope,
      sortKey,
      sortRule,
      keyword,
      screenKey,
      headInfo,
      holdRatio,
      headerHeight,
    },
    update,
  } = useCtx();
  const headerRef = useRef<HTMLDivElement>(null);
  const { height } = useSize(headerRef) || { height: 0 };
  useEffect(() => {
    update((draft) => {
      draft.headerHeight = Math.max(36, height - 1);
    });
  }, [headerHeight, height, update]);
  const options: Options[] = [{ ...LAND_USE }, { ...ENTERPRISE_TYPE }, { ...MORE_SCREEN }];
  const newOptions: Options[] = [{ ...LAND_USE }, { ...ENTERPRISE_TYPE }, { ...MORE_SCREEN_NEW }];
  const screenOptions = pageType === '2' ? options : newOptions;

  const onDateScreenChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.dateFilter = v;
      draft.currentPage = 1;
    });
  });

  const onScreenChange = useMemoizedFn((_, allSelected) => {
    const results = allSelected.reduce((pre: any, { value, filed }: { value: string; filed: string }) => {
      if (value) pre[filed] = `${pre[filed] ? `${pre[filed]},` : ''}${value}`;
      return pre;
    }, {});
    update((draft) => {
      draft.otherFilter = results;
      draft.currentPage = 1;
    });
  });

  function extractYearFromDateString(dateString: string) {
    // 去掉方括号
    const dateRange = dateString.replace(/^$|$$/g, '');
    // 分割日期范围
    const dates = dateRange.split(',').map((date) => date.trim());
    // 提取年份
    const year = dates[0].split('-')[0];
    return year;
  }

  function getYearFromFilter(filter: any) {
    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key) && typeof filter[key] === 'string') {
        const year = extractYearFromDateString(filter[key]);
        if (year) {
          return year;
        }
      }
    }
    return null;
  }

  const year = getYearFromFilter(dateFilter)?.replace(/^\[/, '');
  const areaInfo = useSelector((store) => store.areaInfo);

  const filename =
    pageType === '2'
      ? `${year}年${areaInfo?.shortName}市协议划拨_土地明细`
      : `${year}年${areaInfo?.shortName}市招拍挂_土地出让明细`;

  const handleSearch = useMemoizedFn((keyword: string) => {
    update((draft) => {
      draft.keyword = keyword;
      draft.currentPage = 1;
    });
  });
  const onClear = useMemoizedFn(() => handleSearch(''));

  const exportCondition = removeObjectNil({
    ...dateFilter,
    ...otherFilter,
    ...areaCodeObj,
    statisticsScope,
    holdRatio,
    sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
    keyword,
    size: 50,
    from: 0,
    headInfo,
    exportFlag: true,
    module_type: pageType === '2' ? 'land_protocol_new' : 'landTheme_detail_new',
    sheetNames: pageType === '2' ? { '0': '协议划拨_土地明细' } : { '0': '招拍挂_土地出让明细' },
  });
  return (
    <ExportDoc.Provider>
      <Container ref={headerRef}>
        <LeftScreen key={screenKey}>
          <DateScreen isDetail={pageType === '2' ? true : false} onChange={onDateScreenChange} />
          <Screen options={screenOptions} onChange={onScreenChange} />
          <div style={{ width: '11px' }} />
          <div className="topicSearch" style={{ width: '324px' }}>
            <TopicSearch
              style={TOPIC_SEARCH_STYLE}
              onClear={onClear}
              onChange={() => {}}
              onSearch={handleSearch}
              dataKey="land_topic_agreement_transfer"
              placeholder="宗地编号/地块名称/企业/电子监管号/土地坐落"
              focusedWidth={324}
            />
          </div>
        </LeftScreen>
        <div className={`${S['num-export']} right-export`}>
          <ProExcelNum total={total} />
          <ExportDoc
            condition={exportCondition}
            getContainer={(document.getElementById('main-container') as HTMLDivElement) || window}
            filename={`${filename}_${dayjs().format('YYYYMMDD')}`}
          />
        </div>
      </Container>
    </ExportDoc.Provider>
  );
};

export default memo(HeaderFilter);

export const LeftScreen = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  row-gap: 4px;
  grid-gap: 4px 0;
`;

export const Container = styled.div`
  height: fit-content;
  background: #fff;
  padding: 4px 8px 8px 8px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: sticky;
  z-index: 7;
  top: 0px;
  .right-export {
    font-size: 13px !important;
    height: 24px;
    margin-left: 40px;
    white-space: nowrap;
  }
  .dzh-excel-num .dzh-excel-num-total {
    color: #3e3e3e;
  }
`;
