import { FC, useState, useRef, useEffect } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import { EmptyError } from '@/pages/area/areaEconomy/modules/blackList/style';
import { highlight } from '@/utils/dom';

import styles from './style.module.less';

interface DropDownContentProps {
  loading: boolean;
  hanleOpenModal: (row: Record<string, any>, isHot?: boolean) => void;
  isNormal?: boolean;
  keyword?: string;
  data?: Record<string, any>[];
  normalData?: Record<string, any>[];
}

const DropDownContent: FC<DropDownContentProps> = ({
  hanleOpenModal,
  isNormal = false,
  keyword,
  data,
  normalData,
  loading,
}) => {
  // 没有更多数据提示
  const [noMoraTipsShow, setNoMoreTipsShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 判断出现时机
  useEffect(() => {
    if (keyword && keyword.length > 1 && !loading) {
      const wrap = containerRef.current;
      if (wrap) {
        setNoMoreTipsShow(wrap.clientHeight >= wrap.scrollHeight);
      }
    }
  }, [keyword, loading]);

  // 加载时禁止滚动条
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.overflowY = loading ? 'hidden' : 'overlay';
    }
  }, [loading]);

  return (
    <LoadingWrapper
      ref={containerRef}
      className={cn(styles.dropdownContent, isNormal ? styles.dropdownContentNormal : '')}
    >
      {isNormal ? (
        <Spin type="thunder" spinning={loading}>
          {loading ? null : (
            <>
              <div className={styles.dropdownTitle}>热搜榜单</div>
              {normalData && normalData.length
                ? normalData.map((item: Record<string, any>) => {
                    return (
                      <ItemContentContainer
                        className={styles.dropdownItemNormalContent}
                        key={item?.sort}
                        index={item?.sort}
                        onClick={() =>
                          item?.id
                            ? hanleOpenModal(
                                {
                                  id: item?.id,
                                  blackList: item?.TagDisplayName,
                                },
                                true,
                              )
                            : null
                        }
                      >
                        <span className="normal-content-icon"></span>
                        <span className="normal-content-text">{item?.TagDisplayName || '-'}</span>
                        {item.dataSources && <span className="normal-content-tag">{item.dataSources}</span>}
                      </ItemContentContainer>
                    );
                  })
                : null}
            </>
          )}
        </Spin>
      ) : (
        <Spin type="thunder" spinning={loading}>
          {loading ? null : (
            <>
              {data && data.length ? (
                <>
                  {data.map((item: Record<string, any>, idx: number) => {
                    const name = item?.TagDisplayName;
                    return (
                      <ItemContentContainer
                        className={styles.dropdownItemContent}
                        key={idx}
                        onClick={() =>
                          item?.id
                            ? hanleOpenModal(
                                {
                                  id: item?.id,
                                  blackList: name,
                                },
                                true,
                              )
                            : null
                        }
                      >
                        <span className={styles.dropdownItemIcon}></span>
                        <span className={styles.dropdownItemRight}>
                          <span className={styles.dropdownItemText}>
                            {name ? (keyword ? highlight(name, keyword) : name) : '-'}
                          </span>
                          {item.dataSources && (
                            <span className={cn('normal-content-tag', styles.dropdownItemTag)}>{item.dataSources}</span>
                          )}
                        </span>
                      </ItemContentContainer>
                    );
                  })}
                  <NoMoreDataCotnainer show={noMoraTipsShow}>没有更多数据啦</NoMoreDataCotnainer>
                </>
              ) : (
                <EmptyError paddingTop={60} imageBottom={2} imgHeight={60} imgWidth={124} fontSize={12}>
                  <Empty
                    type={Empty.NO_GROUP_SEARCH_DATA}
                    onClick={() => {
                      const el = document.getElementById('sidebar-staff-service-btn');
                      if (el) {
                        el.click();
                      }
                    }}
                  />
                </EmptyError>
              )}
            </>
          )}
        </Spin>
      )}
    </LoadingWrapper>
  );
};

export default DropDownContent;

const ItemContentContainer = styled.div<{ index?: number }>`
  display: flex;
  overflow: hidden;
  align-items: center;
  .normal-content-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-right: 10px;
    background: ${({ index }) =>
      index
        ? `url(${require(`@/pages/area/areaEconomy/modules/blackList/images/${index}@2x.png`)}) no-repeat 100% 100% / contain`
        : ''};
  }
  .normal-content-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    margin-right: 8px;
  }
  .normal-content-tag {
    flex-shrink: 0;
    height: 18px;
    padding: 0 6px;
    border: 1px solid #73d7fd;
    border-radius: 1px;
    color: #20aef5;
    font-size: 12px;
    line-height: 16px;
  }
`;

const LoadingWrapper = styled.div`
  // loading样式
  .loading-container {
    height: 100%;
    i {
      height: 100%;
    }
  }
`;

const NoMoreDataCotnainer = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  margin: 12px auto 0;
  width: 84px;
  height: 21px;
  font-size: 12px;
  color: #999999;
  line-height: 21px;
  text-align: center;
`;
