import { memo, forwardRef, FC, CSSProperties, useState, useImperativeHandle, useRef, useEffect } from 'react';

import Screen from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import MoreScreenModal from '@/components/moreScreenModal';
import closeActiveImg from '@/pages/detail/components/intelligence/moreScreen/images/close-active.svg';
import closeImg from '@/pages/detail/components/intelligence/moreScreen/images/close.svg';
import moreScreenActiveImg from '@/pages/detail/components/intelligence/moreScreen/images/screen-outlined-active.svg';
import moreScreenImg from '@/pages/detail/components/intelligence/moreScreen/images/screen-outlined.svg';
import { useImmer } from '@/utils/hooks';

import { ModuleEnum } from '../../constant';

interface TagItem {
  name: string;
  isMoreScreen?: boolean;
  [key: string]: any;
}

interface TabFilterProps {
  className?: string;
  style?: CSSProperties;
  /** tab数据*/
  tabDataList?: Array<TagItem>;
  /** 更多类型弹框数据 */
  treeDataList?: any[];
  /**更多行业 */
  industryDataList: any[];
  onChange: (data: any[], type?: string) => void;
  /**更多类型弹框数据统计数 */
  countMap: Record<string, any>;
  /**模块类型 */
  moduleType?: string;
  /**筛选受控值 */
  tabFilterValues: string;
  [key: string]: any;
}

const TabFilter: FC<TabFilterProps> = forwardRef((props, ref) => {
  const {
    className,
    style,
    tabDataList,
    treeDataList,
    industryDataList,
    onChange,
    countMap,
    moduleType,
    tabFilterValues,
  } = props;
  const [selectedTags, updateSelectedTags] = useImmer<Set<TagItem>>(new Set());
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState<any>([[]]);
  const [tagsValues, setTagsValues] = useState<any>([]);
  const [dropdownVisible, setDropdownVisible] = useState<(boolean | undefined)[]>([false, undefined]);
  const [filterValues, setFilterValues] = useState<any>([]);
  const [screenKey, setScreenKey] = useState(0);
  const modalRef = useRef<any>();
  const tabFilterRef = useRef<any>();
  const screenRef = useRef<any>();

  useImperativeHandle(ref, () => ({
    setVisible,
    handleRest,
  }));
  /** tag筛选的受控处理 */
  useEffect(() => {
    updateSelectedTags((d) => d.clear());
    tagsValues?.forEach((id: string) => {
      updateSelectedTags((d) => {
        const item = tabDataList?.find((t) => Number(t.id) === Number(id));
        if (item && item.num) {
          d.add(item);
        }
      });
    });
  }, [tabDataList, updateSelectedTags, tagsValues]);

  useEffect(() => {
    const value = tabFilterValues;
    if (value) {
      switch (moduleType) {
        case ModuleEnum.AREA:
          setTagsValues([value]);
          break;
        case ModuleEnum.INDUSTRY:
          if (tabDataList && tabDataList?.findIndex((el) => el.id === value) > 0) {
            setTagsValues([value]);
          } else {
            setValues([[value]]);
            setFilterValues([value]);
          }
          break;
        case ModuleEnum.COMPANY:
          if (tabDataList && tabDataList?.findIndex((el) => el.id === value) > 0) {
            setTagsValues([value]);
          } else {
            setFilterValues([Number(value)]);
          }
          break;
      }
    }
  }, [tabFilterValues, moduleType, tabDataList, updateSelectedTags]);

  const handleTagItemClick = useMemoizedFn((data) => {
    if (data.isMoreScreen) {
      moduleType === ModuleEnum.COMPANY ? setVisible(true) : setDropdownVisible([!dropdownVisible[0], undefined]);
    } else {
      if (data.num === 0) return;
      setValues([[]]);
      setScreenKey(Math.random());
      setFilterValues([]);
      updateSelectedTags((d) => {
        // @ts-ignore
        let tags = [...selectedTags];
        if (d.has(data)) {
          d.delete(data);
          tags = tags.filter((t) => Number(data.id) !== Number(t.id));
        } else {
          d.clear();
          d.add(data);
          tags = [data];
        }
        setTagsValues(tags.map((el) => el.id));
        onChange(tags);
      });
    }
  });

  const handleCancel = useMemoizedFn(() => {
    setVisible(false);
  });

  const handleSave = (selectedData: any, flatData: any, checkedData: any) => {
    setVisible(false);
    updateSelectedTags((d) => d.clear());
    setFilterValues(flatData.map((el: any) => el.id));
    onChange(flatData);
  };

  const handleRest = useMemoizedFn((e) => {
    e?.stopPropagation();
    modalRef.current?.reset();
    updateSelectedTags((d) => d.clear());
    setScreenKey(Math.random());
    setValues([[]]);
    setFilterValues([]);
    setTagsValues([]);
    onChange([]);
  });

  const handleDropdownVisibleChange = useMemoizedFn((visible: boolean, index: number) => {
    setDropdownVisible((d) => {
      const newD = [...d];
      newD[index] = visible;
      return newD;
    });
  });
  const screenChange = useMemoizedFn((value) => {
    setDropdownVisible([false, undefined]);
    updateSelectedTags((d) => d.clear());
    const valueArr: string[] = value.map((item: any) => item.value);
    setValues([valueArr]);
    setFilterValues(valueArr);
    onChange(value);
  });

  return (
    <Container
      className={cn(className, moduleType === ModuleEnum.COMPANY ? 'hidden' : '')}
      style={style}
      ref={tabFilterRef}
    >
      {tabDataList?.map((tagItem) => {
        const isActive =
          selectedTags.has(tagItem) ||
          (tagItem.isMoreScreen && filterValues?.length) ||
          (tagItem.id === '' && !filterValues?.length && !selectedTags.size);
        const moreSelected = tagItem.isMoreScreen && filterValues?.length;
        return (
          <div
            className={cn(
              'tag-content',
              { 'tag-more-type': tagItem.isMoreScreen },
              { disabled: tagItem.count === 0 },
              { active: isActive, 'more-tag': moreSelected },
            )}
            key={tagItem.name}
            onClick={() => handleTagItemClick(tagItem)}
          >
            {tagItem.isMoreScreen ? (
              isActive ? (
                <img className="prefix" src={moreScreenActiveImg} alt="" />
              ) : (
                <img className="prefix" src={moreScreenImg} alt="" />
              )
            ) : null}
            {tagItem.isMoreScreen ? (
              <span className="close-prefix-wrap" onClick={handleRest}>
                <img className="close-prefix" src={closeImg} alt="" />
                <img className="close-prefix-active" src={closeActiveImg} alt="" />
              </span>
            ) : null}
            {tagItem.name}
          </div>
        );
      })}

      {moduleType === ModuleEnum.COMPANY ? (
        <MoreScreenModal
          visible={visible}
          onCancel={handleCancel}
          data={treeDataList || []}
          title={'更多类型'}
          fieldNames={{ label: 'name', value: 'id', children: 'children', count: 'count' }}
          onSave={handleSave}
          countMap={countMap}
          values={filterValues}
          onValueChange={() => {}}
          ref={modalRef}
        />
      ) : moduleType !== ModuleEnum.COMPANY ? (
        <ScreenWrap ref={screenRef}>
          <Screen
            key={screenKey}
            getPopContainer={() => screenRef.current}
            options={industryDataList}
            dropdownVisible={dropdownVisible}
            onDropdownVisibleChange={handleDropdownVisibleChange}
            values={values}
            onChange={screenChange}
          />
        </ScreenWrap>
      ) : null}
    </Container>
  );
});

export default memo(TabFilter);

const Container = styled.div`
  padding-bottom: 8px;
  height: 32px;
  display: flex;
  .tag-content {
    height: 24px;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    padding: 0 6px;
    margin-right: 8px;
    color: #555;
    font-size: 12px;
    display: flex;
    align-items: center;
    user-select: none;
    &.active {
      border: 1px solid #ff7500;
      color: #ff7500;
    }
    cursor: pointer;
    &:last-child {
      margin-right: 0px;
    }
    img {
      width: 14px;
      margin-right: 2px;
    }
    .close-prefix-wrap {
      display: none;
      height: 100%;
      padding: 0 4px 0 6px;
      .close-prefix-active {
        display: none;
      }
      &:hover {
        .close-prefix {
          display: none;
        }
        .close-prefix-active {
          display: inline-block;
        }
      }
    }
    .close-prefix,
    .close-prefix-active {
      width: 12px;
      margin-right: 0px;
    }
    .tag-count {
      margin-left: 4px;
      display: inline-block;
      transform: scale(0.88);
    }
  }
  .disabled {
    color: #bbbbbb !important;
    border: 1px solid #eeeeee !important;
  }
  .more-tag {
    &:hover {
      padding-left: 0;
      .prefix {
        display: none;
      }
      .close-prefix-wrap {
        display: flex;
        align-items: center;
      }
    }
  }
  &.hidden {
    display: none;
  }
`;

const ScreenWrap = styled.div`
  .dzh-screen-screen-title-wrapper .expandArrow {
    display: none;
  }
  .dzh-screen-screen-wrapper {
    position: relative;
    top: 25px;
    left: -65px;
  }
`;
