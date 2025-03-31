import { FC, memo, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { TableProps } from 'antd';
import cn from 'classnames';
import { cloneDeep, isEmpty, isUndefined } from 'lodash';
import styled from 'styled-components';

import { Icon } from '@/components';
import { Popover, Table as AntCustomTable } from '@/components/antd';
import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import useCombination from '@/components/combinationDropdownSelect/useCombination';
import PaginationWithCheck from '@/components/paginationWithCheck';
import { selectItem } from '@/components/transferSelectNew';
import { LINK_AREA_ECONOMY, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { useAreaJumpLimit } from '@/pages/area/areaF9/hooks';
import { indicatorsItem, drawItemType } from '@/pages/bond/areaFinancingPlatform/components/filter/indicator';
import SortField from '@/pages/bond/areaFinancingPlatform/components/sortField';
import TableTooltip from '@/pages/bond/areaFinancingPlatform/components/tooltip';
import { maxDataType } from '@/pages/bond/areaFinancingPlatform/useFinancingPlateform';
import { CORPORATE_FINANCING } from '@/pages/detail/enterprise/config/pathConfig';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  handleDownload: (raw: any) => void;
  downloadLoading: Record<string, boolean>;
  currentSort?: { key: string; value: string; rule?: string };
  setCurrentSort?: any;
  handleSortChange: (currentSort: any) => void;
  data?: any;
  total: number;
  getChildrenMsg?: (index: number, tabIndex?: number) => void;
  paginationSize: number;
  curentPage: number;
  height?: number;
  sticky?: TableProps<any>['sticky'];
  onChange?: TableProps<any>['onChange'];
  indicators: indicatorsItem[];
  isScrollbarHide?: boolean;
  searchKey?: string; //搜索高亮关键字
  maxData: maxDataType;
}

function propData(getChildrenMsg: any, index: number, tabIndex?: number, tabIndex_index?: number) {
  getChildrenMsg(index, tabIndex, tabIndex_index);
}

const Table: FC<Props> = ({
  handleDownload,
  downloadLoading,
  currentSort,
  setCurrentSort,
  handleSortChange,
  data,
  onChange,
  sticky,
  total,
  getChildrenMsg,
  curentPage,
  paginationSize,
  indicators,
  isScrollbarHide,
  searchKey,
  maxData,
}) => {
  const history = useHistory();
  const { handleLimit } = useAreaJumpLimit();
  const { copyCombinationContent } = useCombination();
  const indicatorColumns = useMemo(() => {
    let copyIndicators = cloneDeep(indicators);
    let indicatorCount = 0; // 记录总共多少个指标
    /** 计数函数，把当前指标是第几个指标的信息写进自身 */
    const countFun = (sourceData: selectItem[]) => {
      sourceData.forEach((item) => {
        indicatorCount++;
        item.itemIndicatorCount = indicatorCount;
        if (item?.children) countFun(item?.children);
      });
    };
    countFun(copyIndicators);
    /** 将某个节点生成对应的column */
    const getColumnItem = (item: indicatorsItem, boldBorder?: boolean) => {
      const {
        title,
        value,
        sortKey,
        description,
        unit,
        align,
        dataIndex,
        jumpCode,
        jumpModule,
        jumpPage,
        drawKeys,
        itemIndicatorCount,
        titleHasModal,
      } = item;
      const titleText = `${title}${unit ?? ''}`;
      if (isUndefined(align)) item.align = 'right';
      /* 根据有无排序、toolTip给title赋值, 其中的placement参数取值规则：只有最后一个指标取bottomRight，否则取bottom，这是为了最后一列tooltip不超出 */
      if (sortKey)
        //@ts-ignore
        item.title = (
          <SortField
            sortChange={handleSortChange}
            sortOpt={{ key: sortKey, value: titleText, rule: 'desc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
            TooltipTitle={description}
            titleHasModal={titleHasModal}
            placement={itemIndicatorCount === indicatorCount ? 'bottomRight' : 'bottom'}
          />
        );
      else if (description)
        //@ts-ignore
        item.title = (
          <div className={'centerTitle'}>
            {titleText}
            <TableTooltip
              title={description}
              placement={itemIndicatorCount === indicatorCount ? 'bottomRight' : 'bottom'}
            />
          </div>
        );
      else item.title = titleText;
      if (!item.children) {
        item.className = boldBorder ? 'blodLeftBorder' : ''; // 每一个分类下，第一列的左边框颜色不一样
        item.dataIndex = dataIndex ?? sortKey ?? value;
        item.key = item.dataIndex;
        item.render = (text: any, row: any, index: number) => {
          if (text) {
            return (
              <div className={drawKeys ? 'bar-content' : ''}>
                <span
                  className={cn(
                    jumpCode && row[jumpCode] ? 'check' : '',
                    drawKeys ? 'half-number' : '',
                    'one-row-text',
                  )}
                  title={text}
                  style={{ textAlign: isUndefined(align) ? '' : align }}
                  onClick={() => {
                    if (jumpCode && row[jumpCode]) {
                      if (jumpCode === 'DEVZCode') propData(getChildrenMsg, index, 1, 1);
                      else if (jumpModule && jumpCode && row[jumpCode]) {
                        history.push(
                          urlJoin(
                            dynamicLink(LINK_DETAIL_ENTERPRISE, { key: jumpModule }),
                            urlQueriesSerialize(
                              {
                                type: 'company',
                                code: row[jumpCode],
                              },
                              false,
                              jumpPage ?? '',
                            ),
                          ),
                        );
                      }
                    }
                  }}
                >
                  {text}
                </span>
                {drawKeys ? (
                  <Popover
                    placement="bottomLeft"
                    title=""
                    content={
                      <>
                        <span style={{ marginRight: '24px' }}>报告期</span>
                        <span>{row?.BD0320_010}</span>
                        {drawKeys.map((drawItem: drawItemType) => {
                          const { itemKey, itemName, color } = drawItem;
                          const itemValue = row[itemKey];
                          return itemValue ? (
                            <div key={itemKey}>
                              <label
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  marginRight: '6px',
                                  background: color,
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                }}
                              ></label>
                              <span style={{ marginRight: '12px' }}>{itemName}：</span>
                              <span>{itemValue}亿元</span>
                            </div>
                          ) : null;
                        })}
                      </>
                    }
                    getPopupContainer={() => document.getElementById('areaFinancingPlatformTableDom') || document.body}
                  >
                    <span className="half-percent">
                      {drawKeys.map((drawItem: drawItemType) => {
                        const { itemKey, color } = drawItem;
                        const itemValue = row[itemKey];
                        //@ts-ignore
                        const percent = ((itemValue / (maxData[item.dataIndex] ?? itemValue)) * 100).toFixed(2);
                        return itemValue ? (
                          <label
                            key={itemKey}
                            className="half-percent-bar"
                            style={{ width: `${percent}%`, background: color }}
                          />
                        ) : null;
                      })}
                    </span>
                  </Popover>
                ) : null}
              </div>
            );
          } else return '-';
        };
      } else item.className = 'blodLeftBorder'; // 一级表头肯定要加粗左边界
      return item;
    };

    /** 递归 indicators 生成对应的columns结构, */
    const getColumns = (sourceData: selectItem[]) => {
      /* 如果某个层级的children只有1个节点，那就把该children提升一级 */
      const newTree = sourceData.map(
        (item, i) =>
          item.children?.length === 1
            ? getColumnItem(item.children[0], Boolean(i > 0 && (sourceData[i - 1]?.children?.length ?? 0) > 1)) // 单级列，只有当前一列是多级列时，左侧border要加深
            : getColumnItem(item, i === 0), // 多级的列，第一列左侧border要加深
      );
      /* 有children的递归处理 */
      newTree.forEach((item) => item?.children && (item.children = getColumns(item.children)));
      return newTree;
    };
    const indicatorColumns = getColumns(copyIndicators);
    return indicatorColumns;
  }, [indicators, handleSortChange, currentSort, setCurrentSort, getChildrenMsg, history, maxData]);

  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'orderNumber',
        align: 'center',
        className: 'pdd-8 noLeftBorder',
        width: Math.max(`${(curentPage - 1) * 50}`.length * 15, 50),
        fixed: 'left',
        render: (_: any, row: any, index: number) => {
          return index + 1 + (curentPage - 1) * paginationSize;
        },
      },
      {
        title: (
          <>
            公司名称
            <AddBtn
              container={() => document.getElementById('area-economy-platforms-container') || document.body}
              onClickWithHasPower={() => copyCombinationContent('ITName', data)}
              text={'公司名称'}
            />
          </>
        ),
        dataIndex: 'ITName',
        key: 'ITName',
        align: 'center',
        width: 380,
        fixed: 'left',
        render: (text: any, row: any, index: number) => {
          return (
            <div className={'company-name-wrapper'}>
              <Link
                title={text}
                to={urlJoin(
                  dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                  urlQueriesSerialize({
                    type: 'company',
                    code: row.ITCode2,
                  }),
                )}
                className="company-name link"
              >
                {highlight(text, searchKey)}
              </Link>
              <div>
                <span
                  onClick={() => handleDownload(row)}
                  className={cn('briefing', 'hoverLink', {
                    disabled: downloadLoading[row.id],
                  })}
                >
                  <Icon style={{ width: 12, height: 12, marginRight: '4px' }} symbol="iconicon_pdf_normal2x" />
                  简报
                </span>
                <span className={'splitLine'} />
                <span
                  className="hoverLink"
                  onClick={() => {
                    propData(getChildrenMsg, index);
                  }}
                >
                  <Icon
                    image={require('@/assets/images/bond/analyse.svg')}
                    size={12}
                    style={{ marginRight: '3px', marginBottom: '2px' }}
                  />
                  分析
                </span>
              </div>
            </div>
          );
        },
      },
      {
        title: '区域',
        dataIndex: 'DD0030_002',
        className: 'blodLeftBorder',
        key: 'area',
        align: 'center',
        width: 85,
        render: (_: any, row: any) => (
          <div
            title={row?.countiesName ?? row?.cityName ?? row?.provinceName}
            className="link inline-block one-row-text"
            onClick={() => {
              const code = row?.countiesCode ?? row?.cityCode ?? row?.provinceCode;
              code &&
                handleLimit(code, () => {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_AREA_ECONOMY, {
                        key: 'regionEconomy',
                        code,
                      }),
                    ),
                  );
                });
            }}
          >
            {row?.countiesName ?? row?.cityName ?? row?.provinceName}
          </div>
        ),
      },
      {
        title: (
          <SortField
            sortChange={handleSortChange}
            sortOpt={{ key: 'CR0202_001', value: '城投评分', rule: 'desc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
            TooltipTitle={
              '城投评分是对城投平台的信用评价，根据区域经济实力、政府支持意愿、平台自身经营及债务负担等维度综合评分'
            }
            placement={'bottom'}
          />
        ),
        dataIndex: 'CR0202_001',
        key: 'CR0202_001',
        align: 'center',
        width: 104,
        render: (text: any, row: any, index: number) => {
          return text ? (
            <span
              className="check"
              onClick={() => {
                propData(getChildrenMsg, index, 2);
              }}
            >
              {text}
            </span>
          ) : (
            '-'
          );
        },
      },
      {
        title: (
          <SortField
            sortChange={handleSortChange}
            sortOpt={{ key: 'rank', value: '省内排名', rule: 'asc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'rank',
        key: 'rank',
        width: 92,
        align: 'center',
        render: (text: any, row: any) => {
          return <div className="text-right">{text ? text + '/' + row.total : '-'}</div>;
        },
      },
      {
        title: (
          <SortField
            sortChange={handleSortChange}
            sortOpt={{ key: 'BD0320_001', value: '主体评级', rule: 'desc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
            // TooltipTitle={'剔除中债资信、国外三大评级公司（惠誉、穆迪、标准普尔）取最新披露主体评级'}
            // placement={'bottom'}
          />
        ),
        dataIndex: 'BD0320_001',
        key: 'BD0320_001',
        width: 92,
        align: 'center',
        // sorter: true,
        render: (text: any) => {
          return text ?? '-';
        },
      },
      {
        title: (
          <SortField
            sortChange={handleSortChange}
            sortOpt={{ key: 'BD0320_002', value: '债券余额(亿元)', rule: 'desc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        ),
        dataIndex: 'BD0320_002',
        key: 'BD0320_002',
        width: 127,
        align: 'center',
        render: (text: any, row: any) => {
          return (
            <div className="text-right">
              {text ? (
                <Link
                  title={text}
                  to={urlJoin(
                    dynamicLink(LINK_DETAIL_ENTERPRISE, { key: CORPORATE_FINANCING }),
                    urlQueriesSerialize({
                      type: 'company',
                      code: row.ITCode2,
                    }),
                    '#存续债券',
                  )}
                  className="link"
                >
                  {text ?? '-'}
                </Link>
              ) : (
                '-'
              )}
            </div>
          );
        },
      },
      ...indicatorColumns,
    ],
    [
      copyCombinationContent,
      curentPage,
      currentSort,
      data,
      downloadLoading,
      getChildrenMsg,
      handleDownload,
      handleLimit,
      handleSortChange,
      history,
      indicatorColumns,
      paginationSize,
      searchKey,
      setCurrentSort,
    ],
  );

  const scroll = useMemo(
    () =>
      columns.reduce(
        (pre, cur) => {
          if (cur.width) return { x: pre.x + Number(cur.width) };
          else return pre;
        },
        { x: 0 },
      ),
    [columns],
  );
  const pagination = useMemo(
    () => ({
      total,
      pageSize: 50,
      current: curentPage,
      showSizeChanger: false,
    }),
    [curentPage, total],
  );
  const getRowKey = useMemoizedFn((record: { ITName: any }) => record.ITName);
  // useEffect(() => console.log('scroll:', scroll), [scroll]);
  // useEffect(() => console.log('columns:', columns), [columns]);

  if (!data || isEmpty(data)) return null;

  return (
    <TableContainer isScrollbarHide={isScrollbarHide} id={'areaFinancingPlatformTableDom'}>
      <AntCustomTable
        sticky={sticky}
        rowKey={getRowKey}
        type="stickyTable"
        columns={columns}
        bordered={true}
        scroll={scroll}
        dataSource={data}
        onChange={null}
        pagination={null}
        size="small"
      />
      <PaginationWithCheck {...pagination} onPageChange={onChange} />
    </TableContainer>
  );
};
export default memo(Table);
const TableContainer = styled.div<{ isScrollbarHide?: boolean }>`
  width: 100%;
  margin: 0 auto;
  padding: 0 30px 16px;
  background-color: #fff;

  .ant-table {
    color: #141414;

    ${({ isScrollbarHide }) =>
      isScrollbarHide &&
      `
      .ant-table-sticky-scroll {
        display: none;
      }
    `}
  }

  .ant-table.ant-table-bordered > .ant-table-container {
    border-color: #f1f6fe;
    border-top: none;
    border-left: 1px solid #f1f6fe;
    border-bottom: 1px solid #f1f6fe;
  }

  .ant-table-tbody > tr.ant-table-row > td.ant-table-cell:last-of-type {
    border-left: 1px solid #f1f6fe;
  }

  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > thead > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > thead > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tbody > tr > td,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tbody > tr > td,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tbody > tr > td,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tfoot > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tfoot > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tfoot > tr > th,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tfoot > tr > td,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table > tfoot > tr > td,
  .ant-table.ant-table-bordered > .ant-table-container > .ant-table-body > table > tfoot > tr > td {
    border-left: 1px solid #f1f6fe;
  }

  //ant样式覆盖
  .ant-table-container:after {
    display: none;
  }

  .ant-table-thead > tr > th {
    line-height: 17px;
    border-bottom-color: #e8ecf4;
    border-top: none !important;
    /* &:last-child { */
    border-right: none !important;
    /* } */
  }

  .ant-table-body > table tr > td {
    /* &:last-child { */
    border-right: none !important;
    /* } */
  }
  .noLeftBorder {
    border-left: none !important;
  }

  .ant-table-cell {
    padding: 5px 12px !important;
    font-size: 13px;
  }
  .blodLeftBorder {
    border-left: 1px solid #e8ecf4 !important;
  }
  .ant-table-pagination.ant-pagination {
    padding-bottom: 0;
  }
  .company-name-wrapper {
    display: flex;
    justify-content: space-between;
  }
  .bar-content {
    width: 100%;
    display: flex;
    .half-number {
      width: 43%;
      text-align: right;
      padding-right: 12px;
      &:after {
        content: '';
        width: 1px;
        height: 100%;
        background: #f2f4f9;
        position: absolute;
        top: -6px;
        left: calc(43% + 1px);
      }
    }

    .half-percent {
      width: 57%;
      display: flex;
      align-items: center;
      min-width: 8px;
      .half-percent-bar {
        height: 12px;
        &:last-child {
          border-radius: 0 2px 2px 0;
        }
      }
    }
  }
  .check {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    color: #025cdc;
    line-height: 13px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .hoverLink {
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: #262626;
    line-height: 18px;
    cursor: pointer;
    &:hover {
      color: #0171f6;
    }
  }

  .splitLine {
    margin: 0 8px;
    width: 1px;
    height: 16px;
    border: 1px solid;
    border-image: linear-gradient(
        180deg,
        rgba(239, 239, 239, 0),
        rgba(239, 239, 239, 0.6) 12%,
        #efefef 49%,
        rgba(239, 239, 239, 0.6) 89%,
        rgba(239, 239, 239, 0)
      )
      1 1;
  }

  .link {
    cursor: pointer;
    display: inherit;
    color: #025cdc;

    &:hover {
      text-decoration: underline;
    }
  }

  .inline-block {
    display: inline-block;
  }

  .centerTitle {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .company-name {
    display: block;
    text-align: left;
    max-width: 236px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .one-row-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  .briefing {
    width: fit-content;
    cursor: pointer;
    margin: auto;

    &.disabled {
      cursor: not-allowed;
      filter: grayscale(100%);
      filter: gray;
    }
  }
`;
