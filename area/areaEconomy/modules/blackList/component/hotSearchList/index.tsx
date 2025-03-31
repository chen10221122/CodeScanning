import { FC, useState, useRef, useEffect } from 'react';
import TextLoop from 'react-text-loop';

import { useMemoizedFn, useBoolean, useClickAway } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Input } from '@/components/antd';
import Icon from '@/components/icon';
import { getHotSearchListData } from '@/pages/area/areaEconomy/modules/blackList/apis';
import blueSearchIcon from '@/pages/area/areaEconomy/modules/blackList/images/blueSearchIcon.svg';
import useRequest from '@/utils/ahooks/useRequest';

import Ellipsis from './../ellipsis';
import DropdownContent from './dropDownContent';
import styles from './style.module.less';

const { Search } = Input;

interface HotSearchListProps {
  hanleOpenModal: (row: Record<string, any>, isHot?: boolean) => void;
}

const defaultParams = {
  skip: 0,
  pageSize: 12,
};

const HotSearchList: FC<HotSearchListProps> = ({ hanleOpenModal: clickItem }) => {
  const [keyword, setKeyword] = useState<string>('');
  // 输入框是否聚焦
  const [isFocus, { setTrue: setFocusTrue, setFalse: setFocusFalse }] = useBoolean(false);
  // 下拉框状态
  const [dropdownStatus, setDropDownStatus] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  // 输入状态
  const [isCompositionend, setIsCompositionend] = useState(false);
  const [hasClear, setHasClear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // 默认第一个请求，拿到全量数据
  const firstRef = useRef(true);
  // 跳过第一次的effect
  const isFirstRunRef = useRef(true);

  const { data, loading, run } = useRequest(getHotSearchListData, {
    manual: false,
    defaultParams: [defaultParams],
    formatResult(res: { data: { list: any } }) {
      const data = res?.data?.list;
      if (firstRef.current && data) {
        setAllData(data);
        firstRef.current = false;
      }
      return data || [];
    },
  });

  // 在搜索以外的地方点击将下拉框隐藏
  useClickAway(() => {
    if (!isFocus) {
      setDropDownStatus(false);
    }
  }, [containerRef.current]);

  // 处理清除按钮状态
  useEffect(() => {
    if (!isCompositionend) setHasClear(!!keyword.length);
  }, [isCompositionend, keyword.length]);

  // 发起请求
  useEffect(() => {
    if (dropdownStatus && keyword.length > 1) {
      // setDropDownStatus(true);
      run({
        ...defaultParams,
        keyWord: keyword,
      });
    }
  }, [keyword, dropdownStatus, run]);

  // 退出搜索清除并更新data
  useEffect(() => {
    if (!isFocus && !dropdownStatus && !isFirstRunRef.current) {
      setKeyword('');
      run({
        ...defaultParams,
        keyWord: '',
      });
    }
    if (isFirstRunRef.current) isFirstRunRef.current = false;
  }, [isFocus, dropdownStatus, run]);

  // 处理搜索
  const handleSearch = useMemoizedFn((e) => {
    // console.log('search', e);
    // setDropDownStatus(true);
    setKeyword(e.target.value?.trim());
  });

  // 输入法编辑中
  const handleComposition = useMemoizedFn((e) => {
    const isCompositionend = e.type === 'compositionend';
    // 火狐浏览器中结束了之后没有触发 change事件，导致不能输入中文，在 compositionend 的时候更改输入框的值
    if (isCompositionend && !/Chrome/.test(navigator.userAgent)) {
      handleSearch(e);
    }
    setIsCompositionend(!isCompositionend);
  });

  // 打开弹窗
  const hanleOpenModal = useMemoizedFn((row: Record<string, any>, isHot?: boolean) => {
    setDropDownStatus(false);
    clickItem?.(row, isHot);
  });

  return (
    <HotSearchListContainer isFocus={isFocus} dropdownStatus={dropdownStatus} ref={containerRef} hasClear={hasClear}>
      {/* 搜索区域 */}
      <Search
        placeholder={isFocus || dropdownStatus ? '请输入榜单名称' : '搜索榜单'}
        maxLength={100}
        allowClear
        prefix={<Icon image={blueSearchIcon} size={12} />}
        onFocus={setFocusTrue}
        onBlur={setFocusFalse}
        onChange={handleSearch}
        // 加定时器延时，防止闪动出滚动条
        onMouseUp={() => setTimeout(() => setDropDownStatus(true), 200)}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        value={keyword}
      />
      {dropdownStatus ? (
        <DropdownContent
          loading={loading}
          isNormal={keyword.length < 2}
          keyword={keyword}
          normalData={allData}
          data={data}
          hanleOpenModal={hanleOpenModal}
        />
      ) : null}
      {/* 热搜榜单轮播区域 */}
      <div className={styles.hotSearchListShow}>
        <span className={styles.hotSearchIcon}></span>
        <span className={styles.splitLine}></span>
        <ShowContentContainer className={styles.showContent}>
          {allData && allData.length ? (
            <TextLoop>
              {allData.map((item: any, i: number) => {
                const title = item?.TagDisplayName;
                return (
                  <Ellipsis
                    hasHoverStyle={false}
                    className={cn(styles.showContentDetail, 'showContentDetail')}
                    key={i}
                    onClick={() =>
                      hanleOpenModal(
                        {
                          id: item?.id,
                          blackList: title,
                        },
                        true,
                      )
                    }
                    text={title}
                    noPopover={true}
                  />
                );
              })}
            </TextLoop>
          ) : null}
        </ShowContentContainer>
      </div>
    </HotSearchListContainer>
  );
};

export default HotSearchList;

const HotSearchListContainer = styled.div<any>`
  position: relative;
  display: inline-flex;
  align-items: center;
  .ant-input-group-wrapper {
    .ant-input-group {
      width: ${({ isFocus, dropdownStatus }) => (isFocus || dropdownStatus ? '218px' : '88px')};
      transition: width 500ms ease;
      .ant-input-affix-wrapper {
        border: none;
        box-shadow: none;
        color: #111111;
        caret-color: #0062f5;
        border-radius: 14px;
        background: #fbfbfb;
        input::placeholder {
          color: ${({ isFocus, dropdownStatus }) =>
            isFocus || dropdownStatus ? '#8b8b8b !important' : '#434343 !important'};
        }
        .ant-input {
          background: #fbfbfb;
          font-size: 12px;
          line-height: 18px;
        }
        .ant-input-suffix {
          /* visibility */
          display: ${({ hasClear }) => (hasClear ? 'inline-block' : 'none')};
        }
      }
      .ant-input-group-addon {
        display: none;
      }
    }
  }
`;

const ShowContentContainer = styled.span`
  .showContentDetail {
    .text {
      font-size: 12px;
      color: #434343;
      line-height: 18px;
      &:hover {
        color: #0171f6;
      }
    }
    .has-popover {
      display: block;
    }
  }
`;
