import { forwardRef, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';

import { Skeleton } from '@dzh/components';
import { useMemoizedFn, useRequest, useSafeState } from 'ahooks';
import { isEmpty, isNumber } from 'lodash';
import styled from 'styled-components';

import { getGroupCompanySearch } from '@/apis/household';
import Dialog from '@/components/commonSearch/dialog';
import TopicSearchLayout from '@/layouts/topicSearchLayout';
import { DataItem } from '@/layouts/topicSearchLayout/searchItem';
import { usePage } from '@/utils/hooks';

const PAGE_SIZE = 15;

export interface ForwardObject {
  next: () => void;
  prev: () => void;
  enter: () => void;
}
interface IProps {
  getResult: (a: any) => void;
  keyword: string;
  vertical?: 'top' | 'bottom';
}

const STATIC_HEIGHT = 256;
const GAP_HEIGHT = 8;
const SELECT_DOM_CLASS = 'ReactVirtualized__Grid__innerScrollContainer';
const HIDE_DIALOG_HEIGHT = 30;

const Search = forwardRef<ForwardObject, IProps>(({ getResult, keyword, vertical = 'top' }, ref) => {
  const domRef = useRef<HTMLDivElement>(null);
  const lastSearchVal = useRef(''); // 上次搜索的值
  const pageRef = useRef(0);
  const [height, setHeight] = useSafeState(HIDE_DIALOG_HEIGHT);

  const [reachBottom, setReachBottom] = useState(false);

  const [searchData, setSearchData] = useState<DataItem[]>([]);
  const { run, loading, cancel } = useRequest(getGroupCompanySearch, {
    manual: true,
    onSuccess: (res) => {
      if (res.data) {
        setSearchData((o) => [...o, ...res.data.map((d: any) => ({ ...d, name: d.subname, label: [] }))]);
        setReachBottom(res.data.length < PAGE_SIZE);
      }
    },
  });

  const handleChange = useMemoizedFn((value) => {
    pageRef.current = 0;
    setSearchData([]);
    setReachBottom(false);

    const val = value.trim();
    if (!isEmpty(val)) {
      if (loading) cancel();

      lastSearchVal.current = val;
      run({ keyword: val, skip: 0, pagesize: PAGE_SIZE });
    }
  });

  const handleLoadMore = useMemoizedFn(() => {
    pageRef.current++;
    run({ keyword: lastSearchVal.current, skip: pageRef.current * PAGE_SIZE, pagesize: PAGE_SIZE });
  });

  const handleSelect = useMemoizedFn((value, index) => {
    getResult(searchData[index]);

    pageRef.current = 0;
    setSearchData([]);
    setReachBottom(false);
  });

  const searchOptions = useMemo(() => {
    return searchData.map((data: any, index) => ({
      value: data.name,
      label: <TopicSearchLayout.SearchItem data={data} index={index} />,
    }));
  }, [searchData]);

  const [showPopover, setShowPopover] = useState(false);
  const { index: currentIndex, next, prev } = usePage(searchOptions, false);

  useImperativeHandle(ref, () => ({
    next: () => {
      if (searchOptions.length) next();
    },
    prev: () => {
      if (searchOptions.length) prev();
    },
    enter: () => {
      if (isNumber(currentIndex) && searchOptions[currentIndex])
        handleSelect(searchOptions[currentIndex].value, currentIndex);
    },
  }));

  useEffect(() => {
    handleChange(keyword);
  }, [keyword, handleChange]);

  useEffect(() => {
    if (searchOptions.length) {
      requestAnimationFrame(() => {
        let dom = domRef.current?.querySelector('.' + SELECT_DOM_CLASS) as HTMLDivElement;
        if (dom) setHeight(Math.min(dom.offsetHeight + 16, STATIC_HEIGHT));
      });
    } else {
      setHeight(HIDE_DIALOG_HEIGHT);
    }
  }, [searchOptions, setHeight]);

  // if (!keyword) return null;

  return (
    <Wrapper className="search" ref={domRef} height={height} vertical={vertical}>
      <Dialog
        isSearching={false}
        noSearchValueLength={0}
        loading={loading}
        isFocus={false}
        width={undefined}
        height={height}
        emptyList={null}
        searchValue={keyword}
        overlayStyle={{}}
        debounceSearchValue={keyword}
        renderOptions={searchOptions}
        isReachBottom={reachBottom}
        onLoadMore={handleLoadMore}
        currentIndex={currentIndex}
        estimatedRowSize={50}
        isShowModal={showPopover}
        handleSelect={handleSelect}
        setShowPopover={setShowPopover}
        inputSearchRef={{}}
        isTyping={false}
        position={{}}
      />

      {loading && keyword ? (
        <div className={'dialog-loading'}>
          <Skeleton title={false} paragraph={{ rows: 5, width: ['90%', '80%', '90%', '80%', '90%'] }} active />
        </div>
      ) : null}
    </Wrapper>
  );
});

export default Search;

const Wrapper = styled.div<{ height: number; vertical: 'top' | 'bottom' }>`
  height: 0;
  width: 100%;
  .dialog-loading {
    position: relative;
    top: ${({ vertical }) => (vertical === 'top' ? '-156px' : '6px')};
    bottom: 0;
    height: 148px;
    border: 1px solid transparent;
    border-radius: 12px;
    padding: 16px 18px;
    background: #fff;
    box-shadow: 0 -3px 6px -4px rgba(0, 0, 0, 0.02), 0 -4px 22px 6px rgba(0, 0, 0, 0.05);

    li {
      height: 12px;
      + li {
        margin-top: 14px !important;
      }
    }
  }

  .search-modal-content {
    overflow: ${({ height }) => (height === HIDE_DIALOG_HEIGHT ? 'hidden' : 'initial')};

    > div {
      top: ${({ vertical, height }) => (vertical === 'top' ? `-${height + GAP_HEIGHT}px` : 'auto')} !important;
      bottom: ${({ vertical, height }) => (vertical === 'bottom' ? `-${height + GAP_HEIGHT}px` : 'auto')} !important;
      left: 0 !important;
      right: 0 !important;
      padding: 4px 4px 4px 0;
      overflow: hidden;
      opacity: ${({ height }) => (height === HIDE_DIALOG_HEIGHT ? 0 : 1)};
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 -3px 6px -4px rgba(0, 0, 0, 0.02), 0 -4px 22px 6px rgba(0, 0, 0, 0.05);

      .virtual-list-scroll-wrap {
        right: 0;
        padding-left: 0;

        .search-list-item:hover {
          background: #f5faff;
          border-color: transparent;
        }

        ::-webkit-scrollbar {
          border: 3px solid transparent;
        }
      }

      .meta {
        display: none;
      }

      .list-no-more {
        display: none;
      }
    }
  }
`;
