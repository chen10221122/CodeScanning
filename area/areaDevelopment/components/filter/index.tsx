import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

import Screen, { Options, quickAreaOptions, ScreenAreaTreeData, ScreenType } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { getConfig } from '@/app';
import vipSvg from '@/assets/images/common/vip.svg';
import { Icon } from '@/components';
import TopicSearch from '@/components/topicSearch';
import { TransferSelect } from '@/components/transferSelectNew';
import { AREA_DEVELOPMENT_HISTORY } from '@/configs/localstorage';
import { LINK_AREA_DEVELOPMENT } from '@/configs/routerMap';
import UpdateTipComponents from '@/pages/area/components/areaUpdateTip';
import { ScreenAreaItemType } from '@/pages/bond/areaFinancingPlatform/components/filter';
import { initUniqueKeyMenu, makeResult } from '@/pages/bond/areaFinancingPlatform/components/filter/handleAreaConfig';
import useRequest from '@/utils/ahooks/useRequest';
import { useGetAuth, useQuery } from '@/utils/hooks';
import { recursion } from '@/utils/share';

import { developCategory, indicatorList } from './indicator';

const { formatSelectAllTitle, hasAreaSelectAll, getAllAreaTree } = quickAreaOptions;

interface Props {
  /** 接口获取的年份信息 */
  screenYearList: { data: [] };
  /** 搜索关键词 */
  keywordRef: { current: string };
  /** 传递修改当前页码 */
  onSetCurentPage: Function;
  /** 传递当前勾选指标 */
  onSetIndicators: Function;
  /** 传递表格loadingType种类 */
  onSetLoadingType: Function;
  /** 传递筛选回到表格头部方法 */
  onScrollToTop: Function;
  /** 传递表格分页排序加载露出表头的top动态值方法 */
  onSetTableHeadTopHeight: Function;
  /** 更新表格入参方法 */
  onUpdateParams: (data: any) => void;
  /** 地区vip权限弹窗 */
  havePay: boolean;
  handleAreaClick: () => void;
}
const isXinsight = getConfig((d) => d.platform.IS_XINSIGHT_APP);
const Filter: FC<Props> = ({
  screenYearList,
  keywordRef,
  onSetCurentPage,
  onSetIndicators,
  onSetLoadingType,
  onScrollToTop,
  onSetTableHeadTopHeight,
  havePay,
  onUpdateParams,
  handleAreaClick,
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const keyWordDomRef = useRef();
  const [initCodes, setInitCodes] = useState(['']);
  const initCodeRef = useRef<string[]>(['']);
  const { regionCode, year: defaultYear } = useQuery();
  const [pageMenus, setPageMenus] = useState<Options[]>([]);
  const { svip } = useGetAuth();

  /** 公用ref节点 */
  const popUpContainer = useMemoizedFn(() => domRef.current || document.body);
  /** 搜索组件样式，直接写对象传参，会造成多次render，所以提出来用useMemo包一下 */
  const searchStyle = useMemo(() => {
    return {
      height: 24,
      position: 'relative',
      top: '-1px',
    };
  }, []);

  /** 年份筛选配置处理 */
  const yearConfig: Options[] = useMemo(() => {
    if (screenYearList) {
      let yearOption: any[] = [];
      screenYearList?.data?.forEach(
        (
          ite: {
            EndDate: number;
            doc_count: number;
          },
          idx: number,
        ) => {
          let yearItem = ite?.EndDate.toString();
          yearOption.push({
            name: yearItem,
            value: yearItem,
            key: 'endDate',
            /** 有defaultYear就取defaultYear，否则就取 最新年份有数据的园区数 > 10，则 默认勾选最新年份；反之，默认勾选有数据的：（最新年份Y）- 1 */
            active: defaultYear
              ? defaultYear === yearItem
              : (screenYearList as any).data[0]?.['doc_count'] > 10
              ? idx === 0
              : idx === 1,
          });
        },
      );
      return [
        {
          title: '年份',
          option: {
            type: ScreenType.SINGLE,
            children: yearOption,
            cancelable: false,
          },
        },
      ];
    }
    return [];
  }, [defaultYear, screenYearList]);

  /** 更新表格入参公用方法 */
  const updateIntegration = useMemoizedFn((key: string, value: any) => {
    let obj: Record<string, any> = {};
    obj[key] = value;
    onSetLoadingType('SCREEN');
    onScrollToTop();
    onSetCurentPage(1);
    onUpdateParams((data: any) => {
      data.requestParams = { ...data.requestParams, ...obj, devzFrom: '0' };
    });
  });

  /** 地区筛选配置处理 */
  const areaConfig = useMemo(
    () => (!isEmpty(pageMenus) ? initUniqueKeyMenu(pageMenus, regionCode) : []),
    [pageMenus, regionCode],
  );

  useEffect(() => {
    if (JSON.stringify(initCodeRef.current) !== JSON.stringify(initCodes)) {
      initCodeRef.current = initCodes;
      updateIntegration('cr0231_013', initCodes.toString());
    }
  }, [initCodes, updateIntegration]);

  const vipIcon = useMemo(
    () => (
      <span>
        <Icon
          image={vipSvg}
          size={12}
          className="vip-icon"
          style={{
            verticalAlign: '-2px',
            marginLeft: '2px',
          }}
        />
      </span>
    ),
    [],
  );

  useRequest(getAllAreaTree as any, {
    onSuccess(data: any) {
      setInitCodes(data.remember?.split(',') || []);
      setPageMenus([
        {
          title: (
            <span style={{ marginLeft: 0 }} onClick={handleAreaClick}>
              地区{vipIcon}
              <UpdateTipComponents position={{ x: 26, y: -20 }} visibleKey="areaDevelopment_UpdateTipComponents" />
            </span>
          ),
          option: {
            type: ScreenType.MULTIPLE_THIRD_AREA,
            children: makeResult(data.data),
            formatSelectAllTitle,
            hasAreaSelectAll,
            isIncludingSameLevel: false,
            areaMemorizeKey: isXinsight ? '' : LINK_AREA_DEVELOPMENT,
            dynamic: true,
            limit: svip && havePay ? -1 : 1000,
          },
          formatTitle: (selectedRows) => selectedRows.map((item) => item.name).join(','),
        },
      ]);
    },
    defaultParams: [true, false, LINK_AREA_DEVELOPMENT],
    formatResult: ({ data, remember }: any) => {
      return {
        remember,
        data: recursion<ScreenAreaItemType>(data as ScreenAreaItemType[], (item) => {
          item.label = item.name;
          if (item.province || item.city) {
            const v = item.value;
            if (item.sameLevelValue) {
              // 解决地方城投债 跳转 地方融资平台
              // 传递的 regincode 与地区筛选框中 value不同 导致的 问题
              item.value = item.regionCode;
              item.wholeCode = v;
            }
            if (item.province) {
              delete item.province;
              item.provinceSelf = true;
            } else {
              delete item.city;
              item.citySelf = true;
            }
          }
        }),
      };
    },
  });

  /** 初始化及年份筛选变化时更新表格入参 */
  const yearChange = useMemoizedFn((_, allSelected) => {
    updateIntegration('endDate', allSelected[0]?.value);
  });

  /** 地区筛选变化更新表格请求入参 */
  const areaChange = useMemoizedFn((_, allSelected) => {
    const allSelectedList = allSelected.map((item: ScreenAreaTreeData) => item.value);
    setInitCodes(allSelectedList);
    // updateIntegration('cr0231_013', allSelectedList.toString());
  });

  /** 指标筛选变化更新表格请求入参及添加表格列 */
  const handleIndicatorChange = useMemoizedFn((selectedRows) => {
    const selectedRowsStr = selectedRows.map((o: any) => o.title).toString();
    updateIntegration('indicName2', selectedRowsStr);
    onSetIndicators(selectedRows);

    setTimeout(() => {
      const tableHead = document.querySelector('#specialTopicDevelopmentZone  .ant-table-thead') as HTMLElement;
      onSetTableHeadTopHeight(tableHead?.clientHeight);
    });
  });

  /** 分类筛选变化更新表格请求入参 */
  const categoryChange = useMemoizedFn((_, allSelected) => {
    updateIntegration('cr0231_022', allSelected.map((o: any) => o.value).toString());
  });

  /** 搜索变化更新表格请求入参 */
  const handleDevelopSearch = useMemoizedFn((val: any) => {
    keywordRef.current = val;
    updateIntegration('devzName', keywordRef.current);
  });

  /** 搜索清空事件 */
  const handleDevelopSearchClear = useMemoizedFn(() => {
    handleDevelopSearch('');
  });

  return (
    <Wrapper ref={domRef}>
      <Screen options={yearConfig} onChange={yearChange} getPopContainer={popUpContainer} />
      <Screen
        options={areaConfig}
        dropdownVisible={[havePay ? undefined : false]}
        values={[initCodes]}
        onChange={areaChange}
        getPopContainer={popUpContainer}
      />
      <TransferSelect
        title="指标"
        data={indicatorList}
        moduleCode="areaDevelopment"
        pageCode=""
        //@ts-ignore
        forbidEmptyCheck
        onChange={handleIndicatorChange}
        getPopupContainer={popUpContainer}
      />
      <Screen options={[developCategory] as any} onChange={categoryChange} getPopContainer={popUpContainer} />
      <TopicSearch
        onClear={handleDevelopSearchClear}
        style={searchStyle}
        onChange
        onSearch={handleDevelopSearch}
        dataKey={AREA_DEVELOPMENT_HISTORY}
        cref={keyWordDomRef}
      />
    </Wrapper>
  );
};

export default memo(Filter);

const Wrapper = styled.div`
  float: left;
  padding: 9px 0;
  display: flex;
  align-items: center;

  > div {
    float: left;
    margin-right: 24px;
    vertical-align: middle;

    ul li .prefix-icon {
      line-height: 22px;
    }
  }
`;
