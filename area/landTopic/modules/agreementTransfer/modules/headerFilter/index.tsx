import { memo, useMemo, useEffect, useState } from 'react';

import { ProExcelNum } from '@dzh/pro-components';
import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
import styled from 'styled-components';

import { ENTERPRISE_TYPE, LAND_USE, STATISTICAL_RANGE } from '@pages/area/landTopic/commonMenu';
import DateScreen from '@pages/area/landTopic/components/dateScreen';
import { useCtx } from '@pages/area/landTopic/modules/agreementTransfer/provider';

import ExportDoc from '@/components/exportDoc';
import { Options, ScreenType, Screen, quickAreaOptions, ScreenAreaTreeData } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { recursion, removeObjectNil } from '@/utils/share';

import S from '@pages/area/landTopic/styles.module.less';
const { getAllAreaTree } = quickAreaOptions;

const TOPIC_SEARCH_STYLE = { marginLeft: '2px', height: '24px', minWidth: '276px' };

const HeaderFilter = () => {
  const [areaData, setAreaData] = useState<ScreenAreaTreeData[]>([]);
  const {
    state: { total, dateFilter, otherFilter, sortKey, sortRule, keyword, screenKey, headInfo, holdRatio },
    update,
  } = useCtx();

  useRequest(getAllAreaTree, {
    defaultParams: [true],
    onSuccess: ({ data }) => {
      if (isArray(data)) {
        setAreaData(
          recursion(data, (area: ScreenAreaTreeData) => {
            const { province, city, regionCode, value } = area;
            area.value = regionCode || value;
            area.filed = province ? 'provinceCode' : city ? 'cityCode' : 'countyCode';
          }),
        );
      }
    },
  });

  const options: Options[] = useMemo(
    () => [
      {
        title: '地区',
        option: {
          type: ScreenType.MULTIPLE_THIRD_AREA,
          dynamic: false,
          hasAreaSelectAll: false,
          hasSelectAll: false,
          // cascade: true,
          children: areaData,
        },
        formatTitle(selectedRows) {
          let title = '';
          selectedRows.forEach(({ name }, i) => {
            if (i < 10) {
              title = `${title}${i === 0 ? '' : ','}${name}`;
            }
          });
          return title;
        },
      },
      { ...LAND_USE },
      {
        title: '供应方式',
        option: {
          type: ScreenType.SINGLE,
          cancelable: false,
          children: [
            { name: '不限', value: '', unlimited: true, active: true, filed: 'supplyMode' },
            { name: '协议出让', value: '5', filed: 'supplyMode' },
            { name: '划拨', value: '1', filed: 'supplyMode' },
          ],
        },
      },
      { ...STATISTICAL_RANGE },
      { ...ENTERPRISE_TYPE },
    ],
    [areaData],
  );

  const onDateScreenChange = useMemoizedFn((v) => {
    update((draft) => {
      draft.dateFilter = v;
    });
  });

  const onScreenChange = useMemoizedFn((_, allSelected) => {
    const results = allSelected.reduce((pre: any, { value, filed }: { value: string; filed: string }) => {
      if (value) pre[filed] = `${pre[filed] ? `${pre[filed]},` : ''}${value}`;
      return pre;
    }, {});
    update((draft) => {
      draft.otherFilter = results;
    });
  });

  useEffect(() => {
    update((draft) => {
      draft.currentPage = 1;
    });
  }, [dateFilter, otherFilter, keyword, update]);

  const handleSearch = useMemoizedFn((keyword: string) => {
    update((draft) => {
      draft.keyword = keyword;
    });
  });
  const onClear = useMemoizedFn(() => handleSearch(''));

  const exportCondition = useMemo(
    () =>
      removeObjectNil({
        ...dateFilter,
        ...otherFilter,
        holdRatio,
        sort: sortKey && sortRule ? `${sortKey}:${sortRule}` : '',
        keyword,
        size: 50,
        from: 0,
        headInfo,
        exportFlag: true,
        module_type: 'land_protocol_new',
        sheetNames: { '0': '协议划拨_土地明细' },
      }),
    [dateFilter, headInfo, holdRatio, keyword, otherFilter, sortKey, sortRule],
  );
  return (
    <Container>
      <LeftScreen key={screenKey}>
        <DateScreen isDetail onChange={onDateScreenChange} />
        <Screen options={options} onChange={onScreenChange} />
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
        <ExportDoc condition={exportCondition} filename={`协议划拨_土地明细_${dayjs().format('YYYYMMDD')}`} />
      </div>
    </Container>
  );
};

export default memo(HeaderFilter);

const LeftScreen = styled.div`
  display: flex;
  align-items: center;
  flex-flow: wrap;
  row-gap: 4px;
  grid-gap: 4px 0;
`;

const Container = styled.div`
  height: fit-content;
  background: #fff;
  padding: 3px 18px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  .right-export {
    height: 24px;
    margin-left: 40px;
    white-space: nowrap;
  }
`;
