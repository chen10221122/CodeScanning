import { FC, memo, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '@dzh/components';
import Screen, { ScreenType, Options, RowItem, quickAreaOptions } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import { isEmpty, cloneDeep, get } from 'lodash';
import styled from 'styled-components';

import { getConfig } from '@/app';
import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import vipSvg from '@/assets/images/common/vip.svg';
import { Icon } from '@/components';
import { TransferSelect } from '@/components/transferSelectNew';
import CustomIndicatorModal from '@/components/transferSelectNew/modules/customModal';
import { ModalSourceType } from '@/components/transferSelectNew/modules/customModal/type';
import useCustomIndicator, {
  DeleteModalParamsType,
} from '@/components/transferSelectNew/modules/customModal/useCustomIndicator';
import { AREA_REMEMBER_KEY } from '@/configs/constants';
import { AREA_DEPT_SEARCH } from '@/configs/localstorage';
import { useCtx, AreaCodeType, defaultAreaMap } from '@/pages/area/areaDebt/getContext';
import UpdateTipComponents from '@/pages/area/components/areaUpdateTip';
import { ScreenAreaItemType } from '@/pages/bond/areaFinancingPlatform/components/filter';
import { initUniqueKeyMenu, makeResult } from '@/pages/bond/areaFinancingPlatform/components/filter/handleAreaConfig';
import useRequest from '@/utils/ahooks/useRequest';
import { useImmer, useQuery } from '@/utils/hooks';
import { recursion, shortId } from '@/utils/share';

import AreaSearch from '../areaSearch';
import { indicatorList } from './indicator';
import { areaItem, selectItems } from './useFilter';

const { formatSelectAllTitle, hasAreaSelectAll, getAllAreaTree } = quickAreaOptions;

const hideAreaDebtCoustomIndex = getConfig((d) => d.modules.hideAreaDebtCoustomIndex);
const isXinsight = getConfig((d) => d.platform.IS_XINSIGHT_APP);
export const setConditionItem = (condition: { [a: string]: any }, arr: RowItem[], keyword?: string) => {
  if (keyword === 'regionCode') condition['regionName'] = [];
  if (keyword === 'indexId') {
    // 针对自定义指标单独计算、且早优先级return出去
    arr.forEach((o) => {
      if (condition['indexId']) {
        if (condition['indexId'].indexOf(o.indexId) === -1) condition['indexId'].push(o.indexId);
      } else {
        condition['indexId'] = [o.indexId];
      }
    });
    return;
  }
  arr.forEach((o) => {
    let key = keyword || o.key;

    if (condition[key]) {
      if (condition[key].indexOf(o.value) === -1) condition[key].push(o.value);
    } else {
      condition[key] = [o.value];
    }

    if (keyword === 'regionCode') condition['regionName'].push(o.name);
  });
};

const getAreaCodeRelation = (obj: AreaCodeType, o: areaItem) => {
  if (o.value) obj[o.value] = o.name;
  if (o.children) o.children.forEach((d) => getAreaCodeRelation(obj, d));
};

type Props = {
  isClearFilter?: boolean;
  handleSearchArea?: (obj: selectItems) => void;
  setScreenKey?: Function;
  handleAreaClick: () => void;
  onChange: (rows: any) => void;
  firstLoading?: boolean;
  handleRun: (condition: any) => void;
};

const Filter: FC<Props> = ({
  isClearFilter,
  handleSearchArea,
  setScreenKey,
  handleAreaClick,
  onChange,
  firstLoading,
  handleRun,
}) => {
  const {
    state: { indicatorAllAttribute, defaultSortOrder, filterInitYear, filterInitYearLoading, customallCustomIndicator },
    update,
  } = useCtx();
  const domRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef('');
  const selectAreaKeysRef = useRef<string[]>([]);
  const [indicators, setIndicators] = useImmer<RowItem[] | undefined>([]);
  const { regionCode, year: defaultYear, getChild, getSelf } = useQuery();
  const [pageMenus, setPageMenus] = useState<Options[]>([]);
  const [yearScreenKey, setYearScreenKey] = useState(shortId()); // 筛选组件的key
  const [areaScreenKey, setAreaScreenKey] = useState(shortId()); // 筛选组件的key

  const [areaScreenValues, setAreaScreenValues] = useState<string[]>([]);
  const { havePay, svip } = useSelector((store: any) => store.user.info);
  const {
    customIndicator,
    modal,
    setModal,
    customIndicatorIsPay,
    setCustomIndicatorIsPay,
    deleteModal,
    setDeleteModal,
    onDeletdOk,
    editModal,
    setEditModal,
    getUserCustomAreaIndicators,
  } = useCustomIndicator();
  const resViewIndicator = useMemo(() => {
    let resCustom: any = [];
    if (customallCustomIndicator && !isEmpty(customallCustomIndicator)) {
      resCustom = customIndicator.children.map((ele) => {
        let matchedItem = customallCustomIndicator?.find((item) => item.indexId === ele.indexId);
        if (matchedItem) {
          return {
            ...ele,
            decimal: matchedItem.decimal,
            indexName: matchedItem.indexName,
            indexName2: matchedItem.indexName2,
            expression: matchedItem.expression,
            note: matchedItem.note,
            param: matchedItem.param,
            resultType: matchedItem.resultType,
            title: matchedItem.indexName,
          };
        } else {
          return ele;
        }
      });
    }
    const resCustomIndicator = !isEmpty(resCustom) ? { ...customIndicator, children: resCustom } : customIndicator;
    return hideAreaDebtCoustomIndex ? [...indicatorList] : [resCustomIndicator, ...indicatorList];
  }, [customIndicator, customallCustomIndicator]);
  // const tableIsUsedCustomIndicators = indicatorAllAttribute?.every((ele) => !ele.isCustom) ? false : true;

  useEffect(() => {
    const customIndicatorList = customIndicator.children ?? [];
    const tableIsUsedCustomIndicators = customIndicatorList?.every((ele) => !ele.isCustom) ? false : true;
    update((d) => {
      d.customallCustomIndicator = customIndicatorList;
    });

    if (tableIsUsedCustomIndicators) {
      setIndicators((pre) => {
        return pre && !isEmpty(pre)
          ? pre
              .map((ele: any) => {
                if (ele.isCustom) {
                  let customfinedItem = customIndicatorList?.find((current) => current.indexId === ele.indexId);
                  if (customfinedItem) {
                    return {
                      ...ele,
                      /**刷新表头已被使用的内容 */
                      decimal: customfinedItem.decimal,
                      indexName: customfinedItem.indexName,
                      indexName2: customfinedItem.indexName2,
                      expression: customfinedItem.expression,
                      note: customfinedItem.note,
                      param: customfinedItem.param,
                      resultType: customfinedItem.resultType,
                      title: customfinedItem.indexName,
                    };
                  } else {
                    return null;
                  }
                } else {
                  return ele;
                }
              })
              .filter(Boolean)
          : [];
      });
    }
  }, [customIndicator, update, setIndicators]);
  /** 初始年份 */
  const initYear = useMemo(() => {
    return defaultYear ?? filterInitYear;
  }, [defaultYear, filterInitYear]);

  const [year, setYear] = useState<RowItem[] | undefined>([]);

  /** 是否清空搜索框 */
  const [isClearSearch, setIsClearSearch] = useState(false);

  /** 初始指标筛选 */
  const defaultSelectIndicators = useMemo(() => {
    let list = cloneDeep(indicatorList[0].children);
    const res = list.map((o) => {
      const temp = o?.associatedKey || [];
      return temp[0];
    });
    return res;
  }, []);
  const yearConfig: Options[] = useMemo(() => {
    if (filterInitYear || defaultYear) {
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
            default: initYear,
            cancelable: false,
          },
          formatTitle: (selectedRows) => {
            return selectedRows.map((item) => item.name).join(',');
          },
        },
      ];
    }

    return [];
  }, [defaultYear, initYear, filterInitYear]);

  const areaConfig = useMemo(
    () => (!isEmpty(pageMenus) ? initUniqueKeyMenu(pageMenus, regionCode, getChild, getSelf) : []),
    [getChild, getSelf, pageMenus, regionCode],
  );

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

  /* url 默认选中地区逻辑 */
  // useEffect(() => {
  //   if (areaConfig.length) {
  //     const defaultAreas = areaConfig[0]?.option?.defaults;

  //     if (defaultAreas?.length) {
  //       // setArea(defaultAreas);
  //       setAreaScreenValues(defaultAreas);
  //       selectAreaKeysRef.current = defaultAreas;
  //       // setArea(defaultAreas);
  //       // setAreaScreenValues(defaultAreas.map(({ value }: { value: string }) => value));
  //     } else {
  //       selectAreaKeysRef.current = Object.keys(defaultAreaMap);
  //     }
  //   }
  // }, [areaConfig]);

  useRequest(getAllAreaTree as any, {
    onSuccess(data) {
      const defaultAreas = data.remember?.split(',') || [];
      setAreaScreenValues(defaultAreas);
      selectAreaKeysRef.current = defaultAreas.length ? defaultAreas : Object.keys(defaultAreaMap);
      handleSearch();
      const rememberValues = data.remember?.split(',') || [];
      setPageMenus([
        {
          title: (
            <span style={{ marginLeft: 0 }} onClick={handleAreaClick}>
              地区{vipIcon}
              <UpdateTipComponents position={{ x: 26, y: -20 }} visibleKey="areaDebt_UpdateTipComponents" />
            </span>
          ),
          option: {
            type: ScreenType.MULTIPLE_THIRD_AREA,
            children: makeResult(data.data),
            formatSelectAllTitle,
            hasAreaSelectAll,
            isIncludingSameLevel: false,
            limit: svip && havePay ? -1 : 1000,
            dynamic: false,
            areaMemorizeKey: isXinsight ? '' : AREA_REMEMBER_KEY,
            defaults: rememberValues,
          } as any,
        },
      ]);
    },
    defaultParams: [true, true, AREA_REMEMBER_KEY],
    formatResult: ({ data, remember }: { data: any; remember: string }) => {
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

  const handleSearch = useCallback(
    (selectItems?: selectItems) => {
      let condition: { [a: string]: any } = {
        from: 0, //  起始值
        keyword: keywordRef.current, // 模糊搜索关键字，匹配地区简称
        size: 50, // 每页显示条数
        sort: '', // 排序规则，如地区生产总值: desc，多个逗号分割
      };
      if (keywordRef.current && selectItems) {
        condition.regionCode = [selectItems.value];
      } else if (selectAreaKeysRef.current.length) {
        condition.regionCode = selectAreaKeysRef.current;
      } else {
        return;
      }
      if (indicators?.length) {
        // 应自定义指标，不仅仅存name把整个已选项存储
        setConditionItem(
          condition,
          indicators.filter((ele) => !ele.isCustom),
          'indicName',
        );
        setConditionItem(
          condition,
          indicators.filter((ele) => ele.isCustom),
          'indexId',
        );
      } else {
        return;
      }

      if (year) setConditionItem(condition, year);

      if ((year && year.length) || defaultYear) {
        // if (!condition.regionCode) {
        //   condition.regionCode = Object.keys(defaultAreaMap);
        //   condition.regionName = Object.values(defaultAreaMap);
        // }
        if (condition.regionCode || condition.keyword) {
          let sortName = condition?.indicName && condition.indicName[0] ? condition?.indicName[0] + ':desc' : '';
          let resKey = '';
          let firstIsCustom = false;
          if (indicators && !isEmpty(indicators) && indicators.length > 0) {
            resKey = indicators[0].isCustom ? indicators[0].indexId : indicators[0].secondTitle || indicators[0].title;
            firstIsCustom = indicators[0].isCustom;
          }
          update((o) => {
            if (condition.keyword) delete condition.regionCode;
            o.condition = condition;
            o.sortName = sortName;
            o.indicatorAllAttribute = indicators;

            o.sortData = {
              columnKey: resKey,
              order: 'descend',
            };
            o.defaultSortOrder = {
              columnKey: resKey,
              order: 'descend',
            };
            if (firstIsCustom) {
              o.indexSort = `${resKey}:desc`;
              o.sortName = '';
            }
          });
          handleRun({
            ...condition,
            sortName,
            indexSort: firstIsCustom ? `${resKey}:desc` : '',
            current: 1,
          });
        }

        setIsClearSearch(false);
      }
    },
    [indicators, year, defaultYear, handleRun, update],
  );

  /** 地区筛选 */
  const areaChange = useCallback(
    (currentSelected, allSelected) => {
      update((d) => {
        d.sortData = defaultSortOrder;
        d.scrollLeft = 0;
      });
      setIsClearSearch(true);
      keywordRef.current = '';
      let regionCodeArr: any = [];
      allSelected.forEach((o: any) => {
        regionCodeArr.push(o.value);
      });
      selectAreaKeysRef.current = regionCodeArr.length ? regionCodeArr : Object.keys(defaultAreaMap);
      setAreaScreenValues(regionCodeArr);
      let areaObj: AreaCodeType = {};
      allSelected.forEach((o: areaItem) => getAreaCodeRelation(areaObj, o));
      handleSearch();
      update((o) => {
        o.areaCodeRelation = { ...o.areaCodeRelation, ...areaObj };
      });
    },
    [update, handleSearch, defaultSortOrder],
  );

  /** 年份筛选 */
  const yearChange = useCallback(
    (currentSelected, allSelected) => {
      setYear(allSelected);
      update((d) => {
        d.sortData = defaultSortOrder;
        d.scrollLeft = 0;
      });
    },
    [setYear, update, defaultSortOrder],
  );

  useEffect(() => {
    if (initYear)
      update((o) => {
        o.year = initYear;
      });
  }, [filterInitYear, update, defaultYear, initYear]);
  useEffect(() => {
    handleSearch();
  }, [indicators, year, handleSearch]);
  /** 筛选无数据，恢复默认 */
  useEffect(() => {
    if (isClearFilter) {
      setYearScreenKey(shortId());
      setAreaScreenKey(shortId());
      setScreenKey?.(shortId());
      setAreaScreenValues([]);
      selectAreaKeysRef.current = Object.keys(defaultAreaMap);
      setIsClearSearch(true);
      keywordRef.current = '';
      update((o) => {
        o.condition.endDate = [initYear];
        o.condition.keyword = '';
      });
    }
  }, [defaultSelectIndicators, initYear, isClearFilter, setScreenKey, update]);

  /** 指标筛选 */
  const handleChange = useMemoizedFn((selectedRows, filterRes) => {
    onChange(selectedRows);
    update((d) => {
      d.sortData = defaultSortOrder;
      d.scrollLeft = 0;
    });
    setIndicators(() => selectedRows);
  });

  /** 搜索下拉选中 */
  const handleSelectClick = useMemoizedFn((selectItems: selectItems | undefined) => {
    if (selectItems) {
      setAreaScreenValues([]);
      selectAreaKeysRef.current = [];
      update((d) => {
        d.sortData = defaultSortOrder;
        d.scrollLeft = 0;
      });
    }
    if (!selectItems || selectItems.label === '全国') {
      keywordRef.current = '';
    } else {
      keywordRef.current = selectItems.label;
      handleSearchArea?.(selectItems);
    }
    handleSearch(selectItems);
  });

  /** 清空搜索选项 */
  const handleDeselect = useMemoizedFn(() => {
    setAreaScreenValues([]);
    selectAreaKeysRef.current = [];
    keywordRef.current = '';
    handleSearch();
    handleSearchArea?.({ label: '', value: '', key: '' });
  });
  useEffect(() => {
    getUserCustomAreaIndicators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDropdownVisibleChange = useMemoizedFn((visible: boolean) => {
    const isMember = get(pageMenus, '0.option.defaults', []).length > 0;
    if (visible && isMember) {
      setTimeout(() => {
        const button = document.querySelector('.dzh-screen-memorize-area>button') as HTMLButtonElement;
        if (button && !button.classList.contains('ant-switch-checked')) {
          button.click();
        }
      }, 100);
    }
  });
  if (filterInitYearLoading || (!filterInitYear && !defaultYear)) return null;

  return (
    <Wrapper ref={domRef} className="filter">
      {/* 自定义指标配置：新建/编辑/删除 只要用到的这三部分都需要配置 */}
      <div style={{ marginRight: '0px' }}>
        <CustomIndicatorModal
          modal={modal}
          setModal={setModal}
          allCustomIndicator={customIndicator.children}
          refreshCustom={getUserCustomAreaIndicators}
          modalTitle="新建自定义指标"
          sourceType={ModalSourceType.modal}
          initYear={initYear}
          trackType="customIndex-areaEconomy"
        ></CustomIndicatorModal>
        <NoPayDialog
          visible={customIndicatorIsPay}
          setVisible={setCustomIndicatorIsPay}
          type
          zIndex={1210}
          customMsgTxt="此功能仅对VIP版开放"
        ></NoPayDialog>
        <Modal.Info
          type="warning"
          title="确定要删除此指标吗？"
          content={deleteModal.modalStatus ? '此指标已被引用，删除后引用指标将不可使用！' : ''}
          visible={deleteModal.show}
          onCancel={() =>
            setDeleteModal((base: DeleteModalParamsType) => {
              return { ...base, show: false, modalStatus: false };
            })
          }
          cancelText="再想想"
          zIndex={1210}
          onOk={() => onDeletdOk()}
        />
        <CustomIndicatorModal
          modal={editModal}
          setModal={setEditModal}
          allCustomIndicator={customIndicator.children}
          refreshCustom={getUserCustomAreaIndicators}
          modalTitle="自定义指标管理"
          sourceType={ModalSourceType.modal}
          initYear={initYear}
          trackType="customIndex-areaEconomy"
        ></CustomIndicatorModal>
      </div>
      <Screen
        key={yearScreenKey}
        options={yearConfig}
        onChange={yearChange}
        getPopContainer={() => domRef.current || document.body}
      />
      {areaConfig.length ? (
        <Screen
          key={areaScreenKey}
          options={areaConfig}
          dropdownVisible={[havePay ? undefined : false]}
          onChange={areaChange}
          getPopContainer={() => domRef.current || document.body}
          values={[areaScreenValues]}
          onDropdownVisibleChange={handleDropdownVisibleChange}
        />
      ) : null}
      <TransferSelect
        title="指标"
        data={resViewIndicator}
        moduleCode="qyjjdq"
        forbidEmptyCheck
        pageCode=""
        onChange={handleChange}
        getPopupContainer={() => domRef.current || document.body}
        tableCurrentSelectedIndicator={indicatorAllAttribute}
        waitTime={0}
      />
      {/* 地区搜索 */}
      <AreaSearch
        isClearSearch={isClearSearch}
        onSelectClick={handleSelectClick}
        dataKey={AREA_DEPT_SEARCH}
        onDeselect={handleDeselect}
        firstLoading={firstLoading}
      />
    </Wrapper>
  );
};

export default memo(Filter);

const Wrapper = styled.div`
  float: left;
  height: 40px;
  line-height: 20px;
  padding: 12px 0 8px 0;
  position: relative;
  display: flex;
  align-items: center;

  > div {
    margin-right: 24px;
    vertical-align: middle;

    ul li .prefix-icon {
      line-height: 22px;
    }
  }
  > div:nth-child(3) {
    /* margin-right: 0; */
  }
`;
