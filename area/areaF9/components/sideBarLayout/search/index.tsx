import { memo, useState, FC, useEffect } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Tooltip } from 'antd';
import styled from 'styled-components';

import { CompositionSearch } from '@/components/compositionInput/search';
import { getPrefixCls, getStyledPrefixCls } from '@/utils/getPrefixCls';
import { useLocalStorage } from '@/utils/hooks';

import styles from './style.module.less';

const prefix = getPrefixCls('search');
const css = getStyledPrefixCls('search');

export interface SearchWithHideProps {
  /** 修改输入 */
  onChange?: (keyword: string) => void;
  /** 显示空节点 */
  onShowNoData?: (show: boolean) => void;
  /** 记录隐藏节点history key */
  hideDataIconHistoryKey: string;
}

const SearchWithHide: FC<SearchWithHideProps> = ({ onChange, onShowNoData, hideDataIconHistoryKey }) => {
  const [focus, setFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [showNoDataNode, setShowNoDataNode] = useLocalStorage(hideDataIconHistoryKey, true);

  useEffect(() => {
    onShowNoData?.(showNoDataNode);
  }, [showNoDataNode, onShowNoData]);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = useMemoizedFn(() => {
    setFocus(false);
  });

  const handleSearch = useMemoizedFn((word, e) => {
    if (e?.nativeEvent?.type === 'click' && word) {
      const keyword = word?.trim();
      // if (!keyword) return;
      setSearchValue(keyword);
      onChange?.(keyword);
    }
  });

  const handleChange = useMemoizedFn((e) => {
    const keyword = e.target.value.trim();
    setSearchValue(keyword);
    onChange?.(keyword);
  });

  const handleMouseEnter = useMemoizedFn(() => {
    setTooltipVisible(true);
  });

  const handleMouseLeave = useMemoizedFn(() => {
    setTooltipVisible(false);
  });

  // 隐藏/显示 无数据节点
  const handleNoDataClick = useMemoizedFn(() => {
    setShowNoDataNode(!showNoDataNode);
  });

  return (
    <Container className={prefix('container')} showNoDataNode={showNoDataNode} focus={focus}>
      <div className={prefix('content')}>
        <CompositionSearch
          placeholder="搜索"
          allowClear
          value={searchValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onSearch={handleSearch}
          prefix={<Icon src={require('./images/ico_search.svg')} />}
        />
      </div>

      <Tooltip
        title={showNoDataNode ? '隐藏无数据节点' : '显示无数据节点'}
        visible={tooltipVisible}
        overlayClassName={styles.tooltipOverlay}
        mouseEnterDelay={0.5}
      >
        <div
          className={prefix('hide-data-icon')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleNoDataClick}
        />
      </Tooltip>
    </Container>
  );
};

export default memo(SearchWithHide);

const Container = styled.div<{ showNoDataNode: boolean; focus: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  margin-right: -6px;
  border-top: 1px solid #efefef;
  background-color: #fff;

  ${css('content')} {
    height: 26px;
    flex: 1;
    display: flex;
    user-select: none;
    align-items: center;
    font-size: 12px;
    border-radius: 14px;
    overflow: hidden;
    > div {
      width: 100%;
    }

    .ant-input-group-wrapper,
    .ant-input-wrapper,
    .ant-input-affix-wrapper,
    input {
      height: auto;
    }

    input {
      border: none;
      font-size: 12px;
      color: #141414;
      &::-webkit-input-placeholder {
        font-size: 12px;
        color: #9fadc1;
      }
    }

    .ant-input-prefix {
      width: 14px;
    }

    .ant-input-suffix {
      margin-right: 8px;
    }

    .ant-input-affix-wrapper {
      height: 26px;
      padding: 0 0 0 10px;
      border: none;
      border-radius: 14px !important;
      overflow: hidden;
      &:hover {
        border-color: #0171f6;
        box-shadow: none;
      }
    }

    .ant-input-affix-wrapper-focused {
      box-shadow: none;
    }

    .ant-input-group-addon {
      display: none;
      background: transparent;
    }
  }

  ${css('hide-data-icon')} {
    margin-left: ${({ focus }) => (focus ? '0' : '16')}px;
    width: 16px;
    height: 16px;
    display: ${({ focus }) => (focus ? 'none' : 'block')};
    background: url(${({ showNoDataNode }) =>
      require(showNoDataNode ? './images/ico_hide_btn.svg' : './images/ico_hide_btn_active.svg')});
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
    flex-shrink: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Icon = styled.img`
  padding-right: 8px;
`;
