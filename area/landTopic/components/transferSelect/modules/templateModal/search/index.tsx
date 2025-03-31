import { FC, memo, useRef, useState, useEffect, Key } from 'react';

import { useClickAway, useMemoizedFn } from 'ahooks';
import cn from 'classnames';

import { SelectItem } from '@pages/area/landTopic/components/transferSelect';
import { useCtx } from '@pages/area/landTopic/components/transferSelect/context';

import CheckBox from '@/components/advanceSearch/components/checkbox';
import SearchSvg from '@/components/advanceSearch/components/extraModal/search/images/search.svg';
import SearchHoverSvg from '@/components/advanceSearch/components/extraModal/search/images/search_hover.svg';
import { Empty, Skeleton } from '@/components/antd';
import Input from '@/components/compositionInput';
import { highlight } from '@/utils/dom';

import styles from '@pages/area/landTopic/components/transferSelect/modules/templateModal/search/styles.module.less';

export interface SearchResItem {
  fromRank: string;
  key: string;
  title: string;
  nodeInfo: SelectItem;
}

interface Props {
  checkedNodes: SelectItem[];
  /** 选中的节点 */
  checkedKeys: Key[];
  /** 搜索关键字变更 */
  onSearchChange: (keyWord: string) => void;
  /** 搜索结果选中状态变更 */
  onCheckChange: (checkedKeys: Key[], { node }: { node: SelectItem }) => void;
}

/** 输入内容长度到多少开始搜索 */
const SEARCH_MIN_LENGTH = 1;

const Search: FC<Props> = ({ checkedKeys, checkedNodes, onSearchChange, onCheckChange }) => {
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSearchContent, setShowSearchContent] = useState(false);
  const searchContentRef = useRef<HTMLDivElement>(null);

  const {
    state: { searchRes, searchLoading, fuzzySearch, maxSelect, checkMaxLimit },
  } = useCtx();

  /* 触发搜索事件 */
  useEffect(() => {
    if (inputValue.length >= SEARCH_MIN_LENGTH) onSearchChange(inputValue);
  }, [onSearchChange, inputValue]);

  const handleChange = useMemoizedFn((e) => {
    // const reg = /[^\dA-Za-z\u3007\u4E00-\u9FCB\uE815-\uE864'\s]/;
    const content = e.target.value;
    setInputValue(content);
    setTimeout(() => setShowSearchContent(content?.length >= SEARCH_MIN_LENGTH), 300);
  });

  const handleSearchClick = useMemoizedFn(() => {});

  const handleFocus = useMemoizedFn(() => {
    setFocus(true);
    if (inputValue && inputValue?.length >= SEARCH_MIN_LENGTH) setShowSearchContent(true);
  });

  const handleBlur = useMemoizedFn(() => setFocus(false));

  const customerService = useMemoizedFn(() => document.getElementById('sidebar-staff-service-btn')?.click());

  useClickAway(() => setShowSearchContent(false), searchContentRef.current);

  const handleCheckedChange = useMemoizedFn((newCheck, node) =>
    onCheckChange([node.key], { node: { ...node, checked: newCheck } }),
  );

  return (
    <div className={styles.container} ref={searchContentRef}>
      <Input
        placeholder="指标名称"
        prefix={<img src={focus ? SearchHoverSvg : SearchSvg} alt="" />}
        onChange={handleChange}
        autoComplete="off"
        onClick={handleSearchClick}
        allowClear
        className="input"
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={100}
        value={inputValue}
      />

      {showSearchContent && inputValue?.length >= SEARCH_MIN_LENGTH ? (
        <div className={styles['search-content-wrap']}>
          {searchLoading ? (
            <div className="skeleton-container">
              <Skeleton active />
            </div>
          ) : searchRes.length === 0 ? (
            <Empty type={Empty.NO_GROUP_SEARCH_DATA} onClick={customerService} />
          ) : (
            <div className={styles['content-list-wrap']}>
              {searchRes?.map((list) => {
                const keywords = fuzzySearch ? inputValue?.split('') || [] : [inputValue];

                const isChecked = checkedKeys.includes(list.key);

                return (
                  <div
                    key={list.key}
                    className={cn(styles['list'], { [styles.singleText]: !list?.fromRank })}
                    onClick={() => handleCheckedChange(isChecked, list.nodeInfo)}
                  >
                    <CheckBox
                      style={{ marginTop: '0.5px' }}
                      checked={isChecked}
                      disabled={checkMaxLimit ? !isChecked && checkedNodes.length >= maxSelect : false}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCheckedChange(!e.target.checked, list.nodeInfo);
                      }}
                    />
                    <div>
                      <p className={styles.title}>{highlight(list.title, keywords)}</p>
                      {list?.fromRank ? <p className={styles.from}>来自层级：{list?.fromRank}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default memo(Search);
