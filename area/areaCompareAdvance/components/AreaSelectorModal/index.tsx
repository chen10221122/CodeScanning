import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isEmpty, uniqBy, sortBy, indexOf } from 'lodash';
import styled from 'styled-components';

import { Modal } from '@/components/antd';
import { quickAreaOptions, ThirdSelectPopover } from '@/components/screen';
import { ThirdSelectRowItem, ThirdSelectWithParentRowItem } from '@/components/screen/items/types';
import { getThirdWithParentFlattenData } from '@/components/screen/utils';
import { convertRawAreas2ThirdSelectRowItem } from '@/pages/area/areaCompare/components/AreaSelectorModal/hooks/useAreaOptions';
import useAreaOperate from '@/pages/area/areaCompareAdvance/hooks/useAreaOperate';
import { addDisableProperty } from '@/pages/area/areaCompareAdvance/utils';
import useRequest from '@/utils/ahooks/useRequest';
import { recursion } from '@/utils/share';

import { useCtx, LIMIT_SELECT } from '../../context';

const { getAllAreaTree, onSearch } = quickAreaOptions;

interface SelectAreaType {
  value: string;
  isSelfLevel: boolean;
  regionCode: string;
}

const AreaSelectorModal: React.FC = () => {
  const [value, setValue] = useState<ThirdSelectRowItem[]>([]);

  const havePay = useSelector((store: any) => store.user.info).havePay;

  const { data } = useRequest(getAllAreaTree, {
    defaultParams: [true],
    formatResult: ({ data }: any) => {
      return recursion(data, (item: any) => {
        item.label = item.name;
        if (item.province || item.city) {
          const v = item.value;
          if (item.sameLevelValue) {
            item.value = item.sameLevelValue;
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
      });
    },
  });

  // context
  const {
    state: { areaChangeIndex, selectedAreaDataWithSelfLevel, selectAreaModalVisible, areaSelectCode, isCompare },
    update,
  } = useCtx();

  const { addArea, replaceArea } = useAreaOperate();

  const closeModal = useCallback(() => {
    // 此处负责初始化弹窗的内容 & 关闭弹窗
    update((d) => {
      d.count = {};
      d.selectAreaModalVisible = false;
    });
  }, [update]);

  const rebuildData = useMemo(() => {
    if (isEmpty(data)) return [];
    let convertData = convertRawAreas2ThirdSelectRowItem(cloneDeep(data));
    areaChangeIndex > -1 && (convertData = addDisableProperty(convertData, areaSelectCode));
    return convertData;
  }, [areaChangeIndex, areaSelectCode, data]);

  const getName = (row: ThirdSelectWithParentRowItem) => {
    let names = [row.name];
    let parent = row._parent;
    while (parent) {
      names.unshift(parent.name);
      parent = parent._parent;
    }
    return names.join('/');
  };

  /** 处理数据为详情数据 */
  const withParentData = useMemo<ThirdSelectWithParentRowItem[]>(() => {
    const withParentItems: ThirdSelectWithParentRowItem[] = [];
    const _flat = (data: ThirdSelectRowItem[], parent?: ThirdSelectRowItem, parentIndex?: number) => {
      data.forEach((row, rowIndex) => {
        const newRow: ThirdSelectWithParentRowItem = (
          parent ? Object.assign(row, { _parent: parent, _parentIndex: parentIndex }) : row
        ) as ThirdSelectWithParentRowItem;
        Object.assign(newRow, { _fullName: getName(newRow), _index: rowIndex });
        withParentItems.push(newRow);
        if (row.children) {
          _flat(row.children, row, rowIndex);
        }
      });
    };
    _flat(rebuildData);

    return withParentItems;
  }, [rebuildData]);

  // 看似无用的代码，却不能删,删掉value值会不受控
  /* eslint-disable */
  const withParentDataFilter = useMemo<ThirdSelectWithParentRowItem[]>(
    () => getThirdWithParentFlattenData(rebuildData),
    [rebuildData],
  );

  /** 选择后组件value值受控 */
  useEffect(() => {
    if (withParentData?.length && areaSelectCode) {
      /** 老代码维护 (接手这个，就准备掉头发叭^~^^~^^~^) */

      const areaReplaceCode = areaSelectCode.replace('441900003', '');

      const selectedValue = areaChangeIndex === -1 ? areaReplaceCode : areaSelectCode.split(',')[areaChangeIndex];

      const filterSelection = withParentData.filter((o) =>
        areaChangeIndex === -1
          ? selectedValue?.includes(o.regionCode) || selectedValue?.includes(o.value)
          : selectedValue === o.regionCode || selectedValue === o.value,
      );
      /** #bug31672 添加东城街道后，地区组件会带上东莞市兼容处理 */
      const exceptSelection = areaSelectCode?.includes('441900003')
        ? withParentData.filter((o) => o.value === '441900003')
        : [];

      const allSelection = sortBy(
        withParentData
          .filter((o) => areaReplaceCode?.includes(o.regionCode) || areaReplaceCode?.includes(o.value))
          .concat(exceptSelection),
        (item) => indexOf(areaSelectCode.split(','), item.regionCode || item.value),
      );

      update((d) => {
        d.selectedAreaDataWithSelfLevel = allSelection.map((item: any) => ({
          value: item?.regionCode || item?.value,
          isSelfLevel: false,
          regionCode: item?.regionCode || item?.value,
        }));
      });

      setValue(filterSelection.concat(exceptSelection));
    } else {
      setValue([]);
    }
  }, [areaSelectCode, areaChangeIndex, isCompare, withParentData]);

  // 筛选变化
  const handleChange = useMemoizedFn((selectedAreas: ThirdSelectRowItem[]) => {
    /** 空值及替换地区为已选中地区 */
    if (isEmpty(selectedAreas)) {
      let selectArray: any[] = [];
      let areaSelectCode = '';
      if (areaChangeIndex > -1) {
        const restSelection = selectedAreaDataWithSelfLevel.filter(
          (o: SelectAreaType) => o.regionCode !== value[0].regionCode && o.regionCode !== value[0].value,
        );
        areaSelectCode = restSelection.map((item: SelectAreaType) => item.regionCode).toString();
        selectArray = restSelection;
        const restValue = withParentData.filter((item) => {
          return restSelection.some(
            (ite: SelectAreaType) => ite.regionCode === item.regionCode || ite.regionCode === item.value,
          );
        });
        setValue(restValue);
      }
      replaceArea('', areaChangeIndex);
      update((d) => {
        d.selectedAreaDataWithSelfLevel = selectArray;
        d.areaSelectCode = areaSelectCode;
        d.isCompare = false;
      });
    } else {
      let result: SelectAreaType[] = [];

      selectedAreas.forEach((o) => {
        const areaMark = o?.regionCode || o?.value;
        const selectItem = { value: areaMark, isSelfLevel: !!o?.regionCode ?? false, regionCode: areaMark };
        if (areaChangeIndex === -1) {
          result.push(selectItem);
        } else {
          result = cloneDeep(selectedAreaDataWithSelfLevel).map((item: any, index: number) =>
            index === areaChangeIndex ? selectItem : item,
          );
        }
      });
      const diffSelectData = uniqBy(result, 'regionCode');

      /** 添加地区及替换地区处理 */
      if (areaChangeIndex > -1) {
        setValue((prevValue) => {
          const updatedValue = [...prevValue];
          updatedValue[areaChangeIndex] = selectedAreas[0];
          return updatedValue;
        });

        replaceArea(selectedAreas[0]?.regionCode || selectedAreas[0]?.value, areaChangeIndex);
      } else {
        setValue(selectedAreas);
        addArea(result.map((o: any) => o.value));
      }

      update((d) => {
        d.isCompare = false;
        d.selectedAreaDataWithSelfLevel = diffSelectData;
        d.areaSelectCode = diffSelectData.map((o: any) => o.value).toString();
      });
    }
    closeModal();
  });
  return (
    <>
      <ModalStyle
        title={areaChangeIndex === -1 ? '添加地区' : '切换地区'}
        visible={selectAreaModalVisible}
        footer={null}
        destroyOnClose
        onCancel={closeModal}
        width={602}
        bodyStyle={{ padding: 0 }}
        centered
        type="titleWidthBgAndMaskScroll"
        contentId=""
      >
        <div style={{ position: 'relative' }} id="compare-modal">
          <ThirdSelectPopover
            value={value as ThirdSelectWithParentRowItem[]}
            data={rebuildData as ThirdSelectRowItem[]}
            onSearch={(keyword) => {
              return onSearch(keyword, true);
            }}
            multiple={areaChangeIndex === -1}
            limit={havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL}
            onChange={handleChange}
            onConfirm={closeModal}
          />
        </div>
      </ModalStyle>
    </>
  );
};

export default AreaSelectorModal;

const ModalStyle = styled(Modal)`
  .ant-modal-body {
    .screen-search-input-wrapper {
      padding: 0 12px;
      margin-top: 10px;
      > div {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    .screen-select-list-wrapper {
      transform: translateX(4px);
    }

    .screen-bottom-wrapper {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
`;
