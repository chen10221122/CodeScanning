/**
 * 这是地区选择模态框中的内容
 * 主要负责地区选择相关逻辑
 *
 * author: Chenhua Fan
 *
 * date: April 08, 2021
 */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useMemoizedFn } from 'ahooks';
import { WritableDraft } from 'immer';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { AreaCompare } from '@/apis/area/type.define';
import { Modal } from '@/components/antd';
import { quickAreaOptions, ThirdSelectPopover } from '@/components/screen';
import { ThirdSelectRowItem, ThirdSelectWithParentRowItem } from '@/components/screen/items/types';
import { getThirdWithParentFlattenData } from '@/components/screen/utils';
import { convertRawAreas2ThirdSelectRowItem } from '@/pages/area/areaCompare/components/AreaSelectorModal/hooks/useAreaOptions';
import { LIMIT_SELECT } from '@/pages/area/areaCompare/const';
import useRequest from '@/utils/ahooks/useRequest';
import { recursion } from '@/utils/share';

import { AreaContext, useCtx } from '../../context';
import { convertSelectedValueToVitrualAreaItem } from './utils';

export interface AreaSelectorModalProps {
  // 显示弹窗
  visible: boolean;
  // 设置弹窗的显示
  setVisible: (visible: boolean) => void;
  // 全部已选择的地区
  searchAreaData: AreaCompare.areaItem[][];
  //
  setSearchAreaData: (f: (draft: WritableDraft<AreaCompare.areaItem>[][]) => void | AreaCompare.areaItem[][]) => void;
  // 弹窗挂载的目标
  target?: any;
  // 其他属性
  [key: string]: any;
}
const { getAllAreaTree, onSearch } = quickAreaOptions;
/**
 * 地区选择弹窗
 * @param props  AreaSelectorModalProps 类型 props
 * @returns
 */
const AreaSelectorModal: React.FC<AreaSelectorModalProps> = ({
  visible,
  setVisible,
  limited,
  searchAreaData,
  setSearchAreaData,
  target,
  ...props
}) => {
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
  const { areaData } = useContext(AreaContext);

  // context
  const {
    state: { areaChangeIndex, selectedAreaDataWithSelfLevel },
    update,
  } = useCtx();

  const closeModal = useCallback(() => {
    // 此处负责初始化弹窗的内容 & 关闭弹窗
    update((d) => {
      d.count = {};
    });
    setVisible(false);
  }, [setVisible, update]);

  const rebuildData = useMemo(
    () => (data?.length ? convertRawAreas2ThirdSelectRowItem(cloneDeep(data as any)) : []),
    [data],
  );

  const getName = (row: ThirdSelectWithParentRowItem) => {
    let names = [row.name];
    let parent = row._parent;
    while (parent) {
      names.unshift(parent.name);
      parent = parent._parent;
    }
    return names.join('/');
  };

  // 处理数据为详情数据
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
  // 看似无用的代码，却不能删
  /* eslint-disable */
  const withParentDataFilter = useMemo<ThirdSelectWithParentRowItem[]>(
    () => getThirdWithParentFlattenData(rebuildData),
    [rebuildData],
  );
  /* eslint-disable */
  // 设置地区组件选中项，若为省或者市本级需要补全代码-0
  useEffect(() => {
    if (withParentData) {
      let selectedValueArr: string[] = [];
      if (areaChangeIndex === -1) {
        selectedValueArr = areaData.map((o) => (o?.isSelfLevel ? o.value + '-0' : o.value + ''));
      } else {
        const currentArea = areaData[areaChangeIndex];
        if (currentArea?.isSelfLevel && currentArea?.value) {
          selectedValueArr = [currentArea.value + '-0'];
        } else {
          selectedValueArr = [currentArea?.value + '' ?? ''];
        }
      }
      setValue(
        withParentData.filter((d) => selectedValueArr.includes(d.regionCode) || selectedValueArr.includes(d.value)),
      );
    }
  }, [areaChangeIndex, areaData, visible, withParentData]);
  // 筛选变化
  const handleChange = useMemoizedFn((selectedAreas: ThirdSelectRowItem[]) => {
    setValue(selectedAreas);
    const newData = selectedAreas.map((item) => {
      return withParentData.find((i) => i.value === item.value);
    });
    // 用于替换的数据
    const areas = convertSelectedValueToVitrualAreaItem(newData as ThirdSelectWithParentRowItem[]);
    setSearchAreaData((d) => {
      if (areaChangeIndex > -1) {
        d.splice(areaChangeIndex, 1, ...areas);
        return d;
      }
      return areas;
    });
    //将选中的带有省市本级的数据更新
    let result = cloneDeep(selectedAreaDataWithSelfLevel);
    selectedAreas.forEach((o) => {
      const v = o?.regionCode ? o.regionCode : o.value;
      const findItemIndex = result?.findIndex((item: any) => v === item.value);
      if (findItemIndex > -1) {
        result[findItemIndex] = { value: v, isSelfLevel: !!o?.regionCode ?? false };
      } else {
        result.push({ value: v, isSelfLevel: !!o?.regionCode ?? false });
      }
    });

    console.log('result', result);

    update((d) => {
      d.selectedAreaDataWithSelfLevel = result;
    });
    closeModal();
  });
  return (
    <>
      <ModalStyle
        title={areaChangeIndex === -1 ? '添加地区' : '切换地区'}
        visible={visible}
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
          {/*{visible ? (*/}
          <ThirdSelectPopover
            // defaultValue={defaultSelect}
            value={value as ThirdSelectWithParentRowItem[]}
            data={rebuildData as ThirdSelectRowItem[]}
            onSearch={(keyword) => {
              return onSearch(keyword, true);
            }}
            multiple={areaChangeIndex === -1}
            limit={havePay ? LIMIT_SELECT.VIP : LIMIT_SELECT.NORMAL}
            onChange={handleChange}
          />
          {/*) : null}*/}
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
