import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useClickAway, useDebounceEffect, useHover, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { cloneDeep, isEmpty, isUndefined, uniqBy } from 'lodash';
import styled from 'styled-components';

import { Empty, Select } from '@/components/antd';
import { Options, quickAreaOptions, Screen, ScreenType, ScreenValues } from '@/components/screen';
import { ThirdOnSearchSelectRow } from '@/components/screen/items/types';
import DropdownList from '@/pages/area/areaDebt/components/DropdownList';
import NoscreenDataImg from '@/pages/area/areaDebt/images/selectEmpty@2x.png';
import { highlight } from '@/utils/dom';
import { isPromise } from '@/utils/share';

import styles from './styles.module.less';

const { onSearch } = quickAreaOptions;
const { Option } = Select;

interface ValueObject {
  label: string;
  value: string;
  key: string;
}
interface SearchProps {
  isClearSearch: boolean;
  // values?: any[];
  getPopupContainer?: (props: any) => HTMLElement;
  onSelectClick: (value: ValueObject) => void;
  onDeselect: () => void;
  dataKey?: any;
  firstLoading?: boolean;
}

const maxSaveLen = 10;
const currentSelect = -1;

const AreaSearch = ({ dataKey, isClearSearch, getPopupContainer, onSelectClick, onDeselect }: SearchProps) => {
  const sRef = useRef(null);
  const downlistRef = useRef(null);
  const baseWrapper = useRef<HTMLDivElement>(null);
  // 地区是不是搜索框搜索后选中的，默认否
  const isSearchRef = useRef(false);
  /** 输入法编辑时，不搜索 */
  const isInputLockRef = useRef(false);
  const hasSelectRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [placeholder, setPlaceholder] = useState('搜索');
  /** 输入字符超过2个 */
  const [keyWordFlag, setKeyWordFlag] = useState(false);
  /** 搜索框是否获取焦点 */
  const [isFocus, setIsFocus] = useState(false);
  const [isSelectEmpty, setIsSelectEmpty] = useState(false);
  const [searchList, setSearchList] = useState<ThirdOnSearchSelectRow[]>([]);
  const [selectedItems, setSelectedItems] = useState<any>(undefined);
  /** 搜索下拉数据加载状态 */
  const [loading, setLoading] = useState(true);
  /** 中文输入法编辑状态 */
  const [isComposition, setIsComposition] = useState(false);
  const getData = localStorage.getItem(dataKey) ? JSON.parse(localStorage.getItem(dataKey) as any) : [];
  /** 历史记录弹窗是否显示 */
  const [visible, setVisible] = useState(false);
  /** 历史记录弹窗数据 */
  const [historyData, setHistoryData] = useState(getData);

  /** 根据关键字获取数据 */
  useDebounceEffect(
    () => {
      if (isComposition) {
        setLoading(true);
      } else if (!isUndefined(onSearch) && keyword) {
        const items = onSearch(keyword);
        if (isPromise(items)) {
          items.then((res) => {
            setSearchList(res);
            setLoading(false);
          });
        } else {
          setSearchList(items);
        }
      }
    },
    [onSearch, keyword, isComposition],
    { wait: 500 },
  );

  /** 文本框值变化时的回调 */
  const handleSearch = useMemoizedFn((k: string) => {
    setScreenVisible([false]);
    hasSelectRef.current = false;
    if (k?.length > 1) {
      setKeyWordFlag(true);
    } else {
      setKeyWordFlag(false);
    }
    setLoading(true);
    setKeyword(k);
    setOpen(true);
    if (!k) {
      setOpen(false);
      /** 1.避免关键词为空时显示上次搜索结果 */
      setSearchList([]);
    }
  });

  const clearKeyword = useMemoizedFn(() => {
    setKeyword('');
  });

  /** 控制搜索框失去焦点 */
  const handleBlur = useMemoizedFn(() => {
    // @ts-ignore
    sRef.current?.blur();
  });

  /** 清除选项时，values为undefined */
  const handleChange = useMemoizedFn((values: ValueObject) => {
    setKeyWordFlag(false);
    if (values?.label !== '全国') {
      setSelectedItems(values);
      handleBlur();
      if (values) {
        const tempData = cloneDeep(historyData);
        if (values?.label) {
          tempData.unshift(values);
        }
        if (tempData?.length > 0) {
          const result = uniqBy(tempData, 'label').slice(0, maxSaveLen);
          setHistoryData(result);
          localStorage.setItem(dataKey, JSON.stringify(result));
        }
      }
    }
    //选中全国时，搜索框显示默认占位符
    else {
      setSelectedItems([]);
      setPlaceholder('搜索');
      handleBlur();
    }
    setOpen(false);
    setSearchList([]);
    if (values && values?.label !== null) {
      onSelectClick?.(values);
    } else {
      setSelectedItems([]);
    }
    isSearchRef.current = true;
  });

  useEffect(() => {
    if ((!selectedItems || Object.keys(selectedItems)?.length === 0) && isFocus) {
      if (historyData.length > 0) {
        setVisible(true);
      }
    }
  }, [historyData.length, isFocus, selectedItems]);

  /** 搜索下拉框展示、搜索框有值时，关闭历史记录弹窗 */
  useEffect(() => {
    if (open || keyword) {
      setVisible(false);
    }
  }, [keyword, open]);

  /** 在历史记录以外的地方点击将弹窗隐藏 */
  useClickAway(() => {
    if (!isFocus) {
      setVisible(false);
    }
  }, [downlistRef.current]);

  const handleDeselect = useMemoizedFn(() => {
    setPlaceholder('搜索');
    clearKeyword();
    onDeselect();
    setSelectedItems([]);
    setScreenValues([[]]);
  });

  const highlightOption = useCallback((fullName: string, keyword: string) => {
    return highlight(fullName, keyword.split(''));
  }, []);

  useEffect(() => {
    if (isClearSearch) {
      setSelectedItems([]);
    }
  }, [isClearSearch]);

  const hightLight = useMemo(() => {
    if (isFocus || (keyword && keyword !== '全国') || (selectedItems && Object.keys(selectedItems)?.length > 0)) {
      return true;
    } else {
      return false;
    }
  }, [isFocus, keyword, selectedItems]);

  /** 单项选中 */
  const handleItemClick = useMemoizedFn((item: any) => {
    setSelectedItems(item);
    setVisible(false);
    handleChange(item);
  });
  /** 清空历史记录 */
  const handleClearClick = useMemoizedFn(() => {
    setHistoryData([]);
    setVisible(false);
    setScreenValues([[]]);
    localStorage.setItem(dataKey, JSON.stringify([]));
  });

  /** 删除单个记录 */
  const handleItemClear = useMemoizedFn((index: any) => {
    const tempData = cloneDeep(historyData);
    const result = tempData.filter((o: any, i: any) => index !== i);
    setHistoryData(result);
    if (!result.length) {
      setVisible(false);
    }
    localStorage.setItem(dataKey, JSON.stringify(result));
  });

  const handleBackClick = useMemoizedFn((e) => {
    // e.preventDefault();
    document.getElementById('sidebar-staff-service-btn')?.click();
  });

  useEffect(() => {
    if (visible) {
      setPlaceholder('请输入地区名称');
    } else if (!isFocus) {
      setPlaceholder('搜索');
    }
  }, [visible, isFocus]);

  const SelectEmpty = useMemo(() => {
    return (
      <div className="select-empty">
        <Empty type={Empty.NO_SEARCH_DATA_DOWNLOAD} image={<Img />} onClick={handleBackClick}></Empty>
      </div>
    );
  }, [handleBackClick]);

  useEffect(() => {
    if (!loading) {
      if (searchList?.length > 0) {
        setIsSelectEmpty(false);
      } else {
        setIsSelectEmpty(true);
      }
    }
  }, [loading, searchList?.length]);

  /** 输入法编辑时不实时匹配 */
  useEffect(
    function handleComposition() {
      if (baseWrapper.current) {
        const inputEl = baseWrapper.current.querySelector('input');
        if (inputEl) {
          const handleCompositionStart = () => {
            setIsComposition(true);
            isInputLockRef.current = true;
            setKeyWordFlag(false);
          };
          const handleCompositionEnd = () => {
            setIsComposition(false);
            isInputLockRef.current = false;
            const value = keyword;
            if (!isUndefined(value)) {
              handleSearch(value);
              if (value?.length > 1) {
                setKeyWordFlag(true);
              } else {
                setKeyWordFlag(false);
              }
            }
          };
          inputEl.addEventListener('compositionstart', handleCompositionStart, false);
          inputEl.addEventListener('compositionend', handleCompositionEnd, false);

          return () => {
            inputEl.removeEventListener('compositionstart', handleCompositionStart, false);
            inputEl.removeEventListener('compositionend', handleCompositionEnd, false);
          };
        }
      }
    },
    [handleSearch, keyword],
  );
  /** 搜索框悬浮状态 */
  const isHovering = useHover(() => document.querySelector('.ant-select-selector'));

  const screenOption = useMemo<Options[]>(
    () => [
      {
        title: '筛选',
        option: {
          type: ScreenType.SINGLE_THIRD_AREA,
          hideSearch: true,
          dynamic: true,
        },
      },
    ],
    [],
  );

  const [screenVisible, setScreenVisible] = useState([false]);
  const [screenValues, setScreenValues] = useState<ScreenValues>([]);
  const screenWrapperRef = useRef<HTMLDivElement>(null);

  const handleScreenChange = useMemoizedFn((_, v) => {
    if (!isEmpty(v)) {
      setScreenValues([v]);
      const [{ name, value }] = v;
      handleItemClick({ label: name, value, key: value });
    } else {
      setScreenValues([[]]);
    }
  });
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    if (screenVisible[0]) {
      setShowScreen(true);
    }
  }, [screenVisible]);

  return (
    <>
      <Selectwraper hightLight={hightLight} isSelectEmpty={isSelectEmpty} isHovering={isHovering}>
        <div className={cn(styles['searchWrapper'])} ref={baseWrapper}>
          <Select
            ref={sRef}
            allowClear
            filterOption={false}
            onSearch={handleSearch}
            showSearch
            onChange={handleChange}
            onClear={handleDeselect}
            value={selectedItems}
            labelInValue
            listHeight={284}
            className={cn(styles.selectInput, 'select-input')}
            placeholder={placeholder}
            size="small"
            suffixIcon={
              <span className="iconfont" style={{ color: '#2A86FF', marginLeft: '4px' }}>
                &#xe674;
              </span>
            }
            dropdownClassName={cn(styles.searchDropdown, 'search-dropdown')}
            dropdownMatchSelectWidth={false}
            notFoundContent={null}
            optionLabelProp="label"
            onFocus={(e) => {
              setPlaceholder('请输入地区名称');
              setIsFocus(true);
              if (isEmpty(historyData)) {
                setScreenVisible([true]);
              }
            }}
            onBlur={() => {
              setOpen(false);
              setIsFocus(false);
              setTimeout(() => {
                setScreenVisible([false]);
              }, 100);
            }}
            open={open}
            getPopupContainer={getPopupContainer || (() => baseWrapper.current!)}
          >
            {loading || !keyWordFlag
              ? null
              : !isSelectEmpty
              ? searchList.map((row, index) => {
                  const label = row._fullName ?? row.name;
                  return (
                    <Option value={row.value} label={row.name} key={index}>
                      <div title={label}>{highlightOption(label, keyword)}</div>
                    </Option>
                  );
                })
              : SelectEmpty}
          </Select>
          <div ref={downlistRef} className="down-list">
            <DropdownList
              visible={visible}
              data={historyData}
              activeIndex={currentSelect}
              onClick={(item: any) => handleItemClick(item)}
              onItemClearClick={(index: any) => handleItemClear(index)}
              onClearBtnClick={() => handleClearClick()}
              // prefix={prefix}
            />
          </div>
          {showScreen ? (
            <ScreenWrapper ref={screenWrapperRef}>
              <Screen
                arrow={false}
                options={screenOption}
                values={screenValues}
                dropdownVisible={screenVisible}
                onChange={handleScreenChange}
                getPopContainer={() => screenWrapperRef.current!}
              />
            </ScreenWrapper>
          ) : null}
        </div>
      </Selectwraper>
    </>
  );
};

export default memo(AreaSearch);
const Selectwraper = styled.div<{ hightLight: boolean; isSelectEmpty: boolean; isHovering: boolean }>`
  .select-input {
    .ant-select-selector {
      background-color: ${({ hightLight }) => (hightLight ? '#f9fafc' : '#fff')};
    }
    .ant-select-arrow {
      background-color: ${({ hightLight, isHovering }) => (hightLight || isHovering ? '#f9fafc' : '#fff')};
      transition: 1s;
    }
  }
  .select-empty {
    height: 240px;
    background-color: #fff !important;
    .ant-empty-image {
      margin-top: 55px;
      img {
        width: 126px;
        height: 76px;
      }
    }
    .ant-empty-description {
      .ant-btn-link {
        font-size: 13px;
        height: 18px;
        line-height: 18px;
      }
    }
  }
  .search-dropdown {
    height: ${({ isSelectEmpty }) => (isSelectEmpty ? '240px' : '300px')}!important;
  }
  .down-list {
    position: absolute;
    left: -16px;
    width: 360px;
  }
`;
const Img = styled.div`
  margin: 0 auto;
  width: 126px;
  height: 76px;
  background: url(${NoscreenDataImg}) no-repeat center;
  background-size: contain;
`;

const ScreenWrapper = styled.div`
  height: 1px;
  position: absolute;
  top: 3px;
  left: -15px;
  z-index: -1;
  .screen-select-list-wrapper {
    padding-top: 10px;
  }
`;
