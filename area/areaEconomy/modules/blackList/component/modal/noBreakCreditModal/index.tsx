import { FC, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useMemoizedFn, useSize } from 'ahooks';
import cn from 'classnames';
import { isFunction } from 'lodash';
import styled from 'styled-components';

import { getConfig } from '@/app';
import { Empty, Spin, Table } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Pagination from '@/components/Pagination';
import TopicSearch from '@/components/topicSearch';
import AddCombination, { ItemProps } from '@/pages/area/areaEconomy/modules/blackList/component/addCombination';
import Ellipsis from '@/pages/area/areaEconomy/modules/blackList/component/ellipsis';
import Tag from '@/pages/area/areaEconomy/modules/blackList/component/tag';
import { TabEnum, TABLEHEADERHEIGHT } from '@/pages/area/areaEconomy/modules/blackList/constant';
import {
  ConditionProps,
  defaultParams,
  PAGESIZE,
  useGetListData,
} from '@/pages/area/areaEconomy/modules/blackList/hooks/useGetListData';
import { useTableSelect } from '@/pages/area/areaEconomy/modules/blackList/hooks/useTableSelect';
import { TableInnerEmptyAndError, TableInnerLoading } from '@/pages/area/areaEconomy/modules/blackList/style';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import useLoading from '@/utils/hooks/useLoading';

import {
  column as originColumn,
  MODALFOOTERHEIGHT,
  MODALTABLESEARCHHEIGHT,
  MODALTOPAGETOP,
  TITLEMARIGINHEIGHT,
} from './config';
import Modal from './fullModal';
import { LinkToFile } from './linkToFile';
import styles from './style.module.less';

interface NobreakCreditProps {
  visible: boolean;
  closeModal: () => void;
  rowInfo?: Record<string, any>;
  isHotSearch?: boolean;
  handleSkipChange?: Function;
}

const orderMap = new Map([
  ['ascend', 'asc'],
  ['descend', 'desc'],
]);

const NoBreakCredit: FC<NobreakCreditProps> = ({ visible, closeModal, rowInfo, isHotSearch, handleSkipChange }) => {
  const { selectRows, rowSelection, hasSelect, clearSelect } = useTableSelect();

  const [condition, updateCondition] = useImmer<ConditionProps>({
    ...defaultParams,
    enterpriseInfo: !isHotSearch ? JSON.stringify(rowInfo) : null,
    tagCode: isHotSearch ? rowInfo?.id : rowInfo?.tagCode,
  });

  const { tableData, listTotalCount, loading, loadingStatus, error, run, hasData } = useGetListData(
    condition,
    TabEnum.List,
    true,
  );

  const isLoading = useLoading(loading);

  // 是否搜索
  const isNoSearchRef = useRef(true);
  const [firstTableData, setFirstTableData] = useState<Record<string, any>>([]);
  const [firstIsLoading, setFirstIsLoading] = useState(true);
  // 双滚动条问题
  const [hasStickyScroll, setHasStickyScroll] = useState(false);
  const [columns, setColumns] = useState<Record<string, any>[]>([]);
  // 页数
  const [skip, setSkip] = useState(0);
  const [item, setItem] = useState<ItemProps[]>([]);
  // 搜索关键字
  const [keyword, setKeyword] = useState('');
  // 跳过第一次搜索的useEffect
  const isFirstRef = useRef(true);
  // 表格column只在第一次动态改变，其他数据变化时只改变序号列
  const isFirstColumn = useRef(true);
  // 是否翻页
  // const isSkipChangeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // 头部元素，用于计算sticky
  const headerRef = useRef<HTMLDivElement>(null);
  const headerViceRef = useRef<HTMLDivElement>(null);
  const { height: pageHeight } = useSize(document.getElementById('fullModalContainer')) || {};
  const { height: tableContainerHeight } = useSize(containerRef) || {};
  const { height: headerHeight } = useSize(headerRef) || {};
  const { height: headerViceHeight } = useSize(headerViceRef) || {};
  // 表格头部距离顶部的高度, 默认高度为176
  // const topRef = useRef(
  //   document.querySelector('#fullModalContainer .ant-table-thead')?.getBoundingClientRect().top || 176,
  // );

  // 头部总高度
  const headerTotalHeight = useMemo(() => {
    return (headerHeight || 0) + (headerViceHeight || 0) + TITLEMARIGINHEIGHT;
  }, [headerHeight, headerViceHeight]);

  // 表格头部距离弹窗顶部的高度
  const tableHeadTop = useMemo(() => {
    return (headerTotalHeight || 0) + MODALTABLESEARCHHEIGHT;
  }, [headerTotalHeight]);

  // 延迟500ms让表格渲染完在显示
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLoading) {
      timer = setTimeout(() => {
        setFirstIsLoading(isLoading);
      }, 500);
    } else {
      setFirstIsLoading(isLoading);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  // 手动判断双滚动条问题
  useEffect(() => {
    if (pageHeight && tableContainerHeight && tableHeadTop) {
      setHasStickyScroll(pageHeight <= tableContainerHeight + tableHeadTop);
    }
  }, [pageHeight, tableContainerHeight, tableHeadTop]);

  // y轴滚动条处理
  useEffect(() => {
    let wrap = document.getElementById('fullModalContainer');
    if (condition) {
      if (wrap) {
        let status = 'overlay';
        // 加载时隐藏滚动条
        // status = loadingStatus ? 'overlay' : 'hidden';
        if (!hasData || error || firstIsLoading || !loadingStatus) {
          status = 'hidden';
        }
        wrap.style.overflowY = status;

        // 加载完成滚动条回到顶部
        if (loadingStatus) {
          wrap.scrollTop = 0;
          // if (isSkipChangeRef.current) {
          //   isSkipChangeRef.current = false;
          // }
        }
      }
    }
    return () => {
      if (wrap) {
        wrap.style.overflowY = 'overlay';
        wrap = null;
      }
    };
  }, [condition, loadingStatus, hasData, error, firstIsLoading]);

  // 参数变化清除选中
  useEffect(() => {
    if (condition) {
      isFunction(clearSelect) && clearSelect();
    }
  }, [condition, clearSelect]);

  // 搜索
  useEffect(() => {
    if (!isFirstRef.current) {
      isNoSearchRef.current = false;
      updateCondition((d: ConditionProps) => {
        d.itName = keyword;
        d.skip = 0;
      });
      setSkip(0);
    } else {
      isFirstRef.current = false;
    }
  }, [keyword, updateCondition]);

  // 处理选中数据
  useEffect(() => {
    const rowInfo = selectRows.selectedRows;
    if (rowInfo && rowInfo.length) {
      const temp: ItemProps[] = rowInfo.map((item: any) => ({
        code: item?.enterpriseCode || '',
        name: item?.enterpriseName || '',
        type: 'company',
      }));
      setItem(temp);
    }
  }, [selectRows.selectedRows]);

  // 处理表格column
  useEffect(() => {
    const targetColumn: Record<string, any>[] = [];
    if (tableData) {
      if (isFirstColumn.current) {
        isFirstColumn.current = false;
        const { tagName, dataSources, declareDate, originalTextUrl } = tableData;
        const len = originColumn.length;
        let curCol: Record<string, any>;
        for (let i = 0; i < len; i++) {
          curCol = originColumn[i];
          // 认定单位
          if (curCol.key === 'Judge_sort' && tagName) {
            continue;
          }
          // 数据来源
          if (curCol.key === 'Source_sort' && dataSources) {
            continue;
          }
          // 公布日期
          if (curCol.key === 'DeclareDate' && declareDate) {
            continue;
          }
          // 原文
          if (curCol.key === 'detail') {
            if (originalTextUrl) {
              continue;
            } else {
              curCol.render = (_: any, row: any) => {
                return row.originalTextUrl ? <LinkToFile originFileUri={row.originalTextUrl} /> : '-';
              };
            }
          }
          // 公司名称
          if (curCol.key === 'ITNamePinyinInitial') {
            curCol.render = (record: string, row: any) => {
              const tagData = [];
              for (let prop in row) {
                if (prop.includes('enterpriseLabel')) {
                  tagData.push(row[prop]);
                }
              }
              return (
                <TagCon>
                  <Ellipsis
                    text={record}
                    code={row?.enterpriseCode}
                    hasHoverStyle={!!row?.enterpriseCode}
                    keyword={keyword}
                    getContainer={() => document.getElementById('fullModalContainer') || document.body}
                  />
                  <Tag data={tagData} />
                </TagCon>
              );
            };
          }
          // 默认render
          if (!curCol.render) {
            // curCol.render = (record: string) => <>{record || '-'}</>;
            curCol.render = (record: string) => {
              return (
                <Ellipsis
                  text={record}
                  hasHoverStyle={false}
                  getContainer={() => document.getElementById('fullModalContainer') || document.body}
                />
              );
            };
          }
          targetColumn.push(curCol);
        }
        targetColumn.unshift({
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: (String(skip + PAGESIZE).length - 2) * 13 + 42,
          fixed: true,
          render: (_: any, __: any, i: number) => <>{skip + i + 1}</>,
        });
        setColumns(targetColumn);
      } else {
        setColumns((d: Record<string, any>[]) => {
          d[0].width = (String(skip + PAGESIZE).length - 2) * 13 + 42;
          d[0].render = (_: any, __: any, i: number) => <>{skip + i + 1}</>;
          // 公司名称
          const targetItem = d.filter((item: any) => item.key === 'ITNamePinyinInitial')[0];
          targetItem.render = (record: string, row: any) => {
            const tagData = [];
            for (let prop in row) {
              if (prop.includes('enterpriseLabel')) {
                tagData.push(row[prop]);
              }
            }
            return (
              <TagCon>
                <Ellipsis
                  text={record}
                  code={row?.enterpriseCode}
                  hasHoverStyle={!!row?.enterpriseCode}
                  keyword={keyword}
                  getContainer={() => document.getElementById('fullModalContainer') || document.body}
                />
                <Tag data={tagData} />
              </TagCon>
            );
          };
          return d;
        });
      }

      if (isNoSearchRef.current) {
        setFirstTableData(tableData);
      }
    }
  }, [tableData, skip, keyword]);

  // 分页
  const handlePageChange = useMemoizedFn((page: number) => {
    let hasLimit: boolean = false;
    if (isFunction(handleSkipChange)) {
      hasLimit = handleSkipChange(page);
    }
    if (!hasLimit) {
      // isSkipChangeRef.current = true;
      setSkip((page - 1) * PAGESIZE);
      updateCondition((d: ConditionProps) => {
        d.skip = (page - 1) * PAGESIZE;
      });
    }
  });

  // 排序
  const handleChangeSort = useMemoizedFn((_, __, { columnKey, order }) => {
    updateCondition((d: ConditionProps) => {
      d.sort = order ? `${columnKey}:${orderMap.get(order)}` : defaultParams.sort;
      d.skip = defaultParams.skip;
    });
    setSkip(0);
  });

  // 搜索相关
  const clearKeyWord = useMemoizedFn(() => {
    setKeyword('');
  });
  const handleSearch = useMemoizedFn((val: string) => {
    setKeyword(val);
  });

  // 导出参数
  const moduleParams = useMemo(() => {
    return hasSelect
      ? {
          id: selectRows.selectedRows?.map((item: any) => item.id)?.join(',') || '',
          sort: condition?.sort,
        }
      : {
          ...condition,
          skip: defaultParams.skip,
        };
  }, [hasSelect, condition, selectRows.selectedRows]);

  // 弹窗最小高度
  const modalMinHeight = useMemo(() => {
    return (tableHeadTop || 0) + TABLEHEADERHEIGHT + 154 + 120 + MODALFOOTERHEIGHT;
  }, [tableHeadTop]);

  // 空状态高度
  const emptyHeight = useMemo(() => {
    const minHeight = (tableHeadTop || 0) + TABLEHEADERHEIGHT + 154 + 120 + MODALFOOTERHEIGHT;
    // 2是上下border
    return Math.max(pageHeight || 0, minHeight) - (tableHeadTop || 0) - TABLEHEADERHEIGHT - 2 - MODALFOOTERHEIGHT;
  }, [pageHeight, tableHeadTop]);

  // 因为这个弹窗在黑名单模块中是自定义的，所以需要固定在area_economy_container下面，都在会出现样式问题
  const container = document.getElementById('area_economy_container');
  if (!container) return null;

  return ReactDOM.createPortal(
    <ModalContainer
      hasSelected={hasSelect}
      hasStickyScroll={hasStickyScroll}
      top={headerHeight}
      noScroll={error || !hasData}
      emptyHeight={emptyHeight}
      modalMinHeight={modalMinHeight}
    >
      <Modal visible={visible} onClose={closeModal}>
        {firstIsLoading ? <Spin type="fullThunder" spinning={true}></Spin> : null}
        <div className={styles.modalContentContainer} style={{ visibility: firstIsLoading ? 'hidden' : 'visible' }}>
          <div className={styles.headerTitle} ref={headerRef}>
            {rowInfo?.blackList}
          </div>
          <div className={styles.headerViceTitle} ref={headerViceRef}>
            <div className={cn(styles.headerViceTitlePart, 'headerViceTitlePart-first')}>
              <div className={styles.headerViceTitleKey}>认定单位</div>
              <div className={styles.headerViceTitleValue}>{firstTableData?.list?.[0]?.identificationUnit || '-'}</div>
            </div>
            {firstTableData?.dataSources ? (
              <div className={cn(styles.headerViceTitlePart, 'headerViceTitlePart-second')}>
                <div className={styles.headerViceTitleKey}>数据来源</div>
                <div className={styles.headerViceTitleValue}>{firstTableData.dataSources}</div>
              </div>
            ) : null}
            {firstTableData?.declareDate ? (
              <div className={cn(styles.headerViceTitlePart, styles.noShrink)}>
                <div className={styles.headerViceTitleKey}>公布日期</div>
                <div className={cn(styles.headerViceTitleValue, styles.noShrink)}>{firstTableData.declareDate}</div>
              </div>
            ) : null}
            {firstTableData?.originalTextUrl ? (
              <div className={cn(styles.headerViceTitlePart, styles.noShrink)}>
                <div className={styles.headerViceTitleKey}>原文</div>
                <div className={styles.headerViceTitleValue}>
                  <LinkToFile originFileUri={firstTableData.originalTextUrl} size={16} />
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.content}>
            <div className={cn(styles.contentTitle, 'sticky-content-title')}>
              <div className={styles.contentTitleLeft}>
                <AddCombination
                  hasSelected={hasSelect}
                  getContainer={() => document.getElementById('blackListContainer') || document.body}
                  item={item}
                />
                {/* @ts-ignore */}
                <TopicSearch
                  onClear={clearKeyWord}
                  style={{ height: 20, marginLeft: '0' }}
                  maxSaveLen="20"
                  placeholder="请输入公司名称"
                  onSearch={handleSearch}
                  hasHistory={false}
                  focusedWidth={220}
                />
              </div>
              <div className={styles.contentTitleRight}>
                <span className="counter">
                  共计 <span className="count-num">{formatNumber(listTotalCount, 0) ?? ''}</span> 家
                </span>
                <ExportDoc
                  condition={{
                    ...moduleParams,
                    pageSize: 10000,
                    module_type: 'web_blackListTopic_detail',
                  }}
                  filename="黑名单企业"
                />
              </div>
            </div>
            <div className={styles.contentTable} ref={containerRef}>
              <TableInnerLoading
                top={tableHeadTop + MODALTOPAGETOP}
                clientHeight={(pageHeight || 0) - tableHeadTop}
                maxWidth={936}
              >
                <Spin type="square" spinning={loading && !firstIsLoading} />
              </TableInnerLoading>
              <>
                <Table
                  type="stickyTable"
                  rowSelection={!getConfig((d) => d.commons.hideOptionalButton) ? rowSelection : null}
                  rowKey={(d: any) => JSON.stringify(d)}
                  showSorterTooltip={false}
                  columns={columns}
                  dataSource={tableData?.list || []}
                  sticky={{
                    offsetHeader: (headerHeight || 0) + MODALTABLESEARCHHEIGHT,
                    getContainer: () => document.getElementById('fullModalContainer') || document.body,
                  }}
                  scroll={{ x: 705 }}
                  pagination={false}
                  onChange={handleChangeSort}
                  locale={{
                    emptyText: error ? (
                      <TableInnerEmptyAndError
                        type={Empty.MODULE_LOAD_FAIL}
                        onClick={() => run(condition)}
                        height="auto"
                        heightnumber={emptyHeight}
                      />
                    ) : (
                      <TableInnerEmptyAndError type={Empty.NO_SCREEN_DATA} heightnumber={emptyHeight} height="auto" />
                    ),
                  }}
                />
                {listTotalCount > PAGESIZE ? (
                  <Pagination
                    current={skip / PAGESIZE + 1}
                    onChange={handlePageChange}
                    pageSize={PAGESIZE}
                    total={listTotalCount}
                    style={{ padding: '8px 0px 0px', marginBottom: 0, position: 'relative', left: '9px' }}
                    align={'left'}
                  />
                ) : null}
              </>
            </div>
          </div>
        </div>
      </Modal>
    </ModalContainer>,
    container,
  );
};

export default NoBreakCredit;

const ModalContainer = styled.div<any>`
  .pop-box {
    width: 1002px;
  }

  .counter {
    font-size: 13px;
    font-weight: 400;
    color: #8c8c8c;
    margin-right: 24px;
    .count-num {
      color: #ff7500;
    }
  }

  /* 弹窗有个最小高度，最小时屏幕的滚动条 */
  .popupBlackListContent {
    /* 空状态存在一个最小值即弹窗存在最小值 */
    min-height: ${({ modalMinHeight }) => (modalMinHeight ? `${modalMinHeight}px` : '100%')};
  }

  /* 弹窗内部滚动条 */
  #fullModalContainer.pop-box {
    &::-webkit-scrollbar {
      width: 16px;
    }
    &::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-color: #cfcfcf;
      border-radius: 12px;
      background-clip: padding-box;
    }
  }

  /* 重置table样式 */
  .ant-table-container {
    /* 无数据表格自带滚动条去除 */
    .ant-table-body {
      overflow-x: ${({ noScroll }) => (noScroll ? 'hidden' : 'auto')}!important;
    }
    ${({ noScroll, emptyHeight }) => {
      return noScroll
        ? `
        .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
          background: #fff !important;
        }
        .ant-table-placeholder {
          height: ${emptyHeight ? `${emptyHeight}px` : '100%'};
          >td {
            padding: 0;
            >.ant-table-expanded-row-fixed {
              padding: 0;
              height: 100%;
            }
          }
        }
      `
        : '';
    }}

    .ant-checkbox-inner {
      transform: scale(0.75) translateX(-4px);
    }

    &::after {
      display: none;
    }

    // 取消 checkbox 点击水波纹效果
    .ant-checkbox-checked::after {
      display: none;
    }
    .ant-table-thead {
      tr > th {
        line-height: 17px;
      }

      // 序号列单独设置 padding
      th:nth-child(2) {
        padding: 6px 7px;
      }
      th.ant-table-column-has-sorters:hover {
        background: #f8faff !important;
      }
      // antd 排序的一些样式
      .ant-table-column-sorters {
        margin-top: 0 !important;
        margin-left: 4px;
        align-items: center;
        padding: 0;
        // 可控制表头的 align 根据需要改
        justify-content: center;

        .ant-table-column-sorter-full {
          position: relative;
          top: 1px;
          margin-top: 0;
          margin-left: 4px;
          .ant-table-column-sorter-inner {
            height: 20px;
          }
        }

        .ant-table-column-title {
          flex: initial;
          text-align: right;
          width: fit-content;
          //width: 100%;
        }
      }
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 5px 12px;
    }

    /* 双滚动条 */
    .ant-table-sticky-scroll {
      display: ${({ hasStickyScroll, noScroll }) => (hasStickyScroll && !noScroll ? 'block' : 'none')};
    }
  }

  /* sticky元素 */
  .sticky-content-title {
    top: ${({ top }) => top || 109}px;
  }

  .headerViceTitlePart-first {
    min-width: 138px;
  }
  .headerViceTitlePart-second {
    min-width: 112px;
  }
`;

const TagCon = styled.div`
  display: inline-flex;
  width: 100%;
`;
