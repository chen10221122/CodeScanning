import { FC, memo, useMemo, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { TableProps } from 'antd';
import { cloneDeep, isUndefined } from 'lodash';
import styled from 'styled-components';

import { useAreaJumpLimit } from '@pages/area/areaF9/hooks';

import { Icon } from '@/components';
import { Table as AntCustomTable, Button, Spin } from '@/components/antd';
import Pagination from '@/components/Pagination';
import { LINK_INFORMATION_TRACE, LINK_AREA_F9 } from '@/configs/routerMap';
import { selectItem, indicatorsItem } from '@/pages/area/areaDevelopment/types';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { shortId } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import DetailInfoDialog from '../components/detailInfoModal';
import Ellipsis from '../components/ellipsisUseTitle';
import { nameValueObj } from '../components/filter/indicator';
import SortField from './sortField';

interface Props {
  /** 表格原始数据 */
  data: [];
  /** 数据总量 */
  total: number;
  /** loading样式及分类loading */
  loading?: boolean;
  loadingType?: string;
  /** 分页 */
  paginationSize: number;
  curentPage: number;
  /** 排序 */
  currentSort?: { key: string; value: string; rule?: string };
  setCurrentSort?: any;
  /** 指标信息，用来生成表格列信息 */
  indicators: indicatorsItem[];
  /** 溯源 */
  isOpenSource?: boolean;
  /** 搜索关键词 */
  searchKey?: string;
  /** 表格分页排序加载露出表头的top动态值 */
  tableHeadTopHeight?: number;
  /** 排序事件 */
  onSortChange?: (currentSort: any) => void;
  /** 分页事件 */
  onPageChange?: TableProps<any>['onChange'];
}

const Table: FC<Props> = ({
  data,
  total,
  loading,
  loadingType,
  curentPage,
  paginationSize,
  indicators,
  currentSort,
  setCurrentSort,
  isOpenSource,
  searchKey,
  tableHeadTopHeight,
  onSortChange,
  onPageChange,
}) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [isDetailModalShow, setDetailModalShow] = useState(false);
  const [detailInfo, setDetailInfo] = useState();
  const { handleLimit } = useAreaJumpLimit();
  const history = useHistory();
  const indicatorColumns = useMemo(() => {
    let copyIndicators = cloneDeep(indicators);
    /** 将传入的指标信息生成对应的column */
    const getColumnItem = (item: indicatorsItem) => {
      const { title, value, sortKey, secondTitleUnit, align, dataIndex } = item;
      const titleText = `${title}${secondTitleUnit ?? ''}`;
      if (isUndefined(align)) item.align = 'right';
      /* 根据有无排序给title赋值*/
      if (sortKey) {
        //@ts-ignore
        item.title = (
          <SortField
            sortChange={onSortChange}
            sortOpt={{ key: sortKey, value: titleText, rule: 'desc' }}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        );
      } else item.title = titleText;
      /* 注意：此处是特殊处理，普通的筛选指标取得是value，有筛选的指标选取的是sortKey，基本信息中的筛选指标取得是dataIndex */
      item.dataIndex = dataIndex ?? sortKey ?? value;
      item.key = item.dataIndex;
      item.render = (text: any, record: any) => {
        let result: any;
        if (text) {
          result = <Ellipsis text={text} clamp={3} />;
          /* 溯源 */
          if (isOpenSource && record[title + '_guId']) {
            result = (
              <Link
                style={{ color: '#025cdc', textDecoration: 'underline' }}
                to={() =>
                  urlJoin(
                    dynamicLink(LINK_INFORMATION_TRACE),
                    urlQueriesSerialize({
                      guId: record[title + '_guId'],
                    }),
                  )
                }
              >
                {result}
              </Link>
            );
          }
        } else result = '-';
        return result;
      };
      return item;
    };

    /** 循环 indicators 生成对应的columns结构 */
    const getColumns = (indicatorData: selectItem[]) => {
      const newTree = indicatorData.map((item) => getColumnItem(item));
      return newTree;
    };

    const indicatorColumns = getColumns(copyIndicators);
    return indicatorColumns;
  }, [indicators, onSortChange, currentSort, setCurrentSort, isOpenSource]);

  /** 处理原始数据，将树形结构处理成一维数据，并将各数据对应的溯源数据提出来 */
  const handleTblData = useMemoizedFn((originData: any) => {
    if (originData) {
      let processedTableData = originData.map((item: any) => {
        const mergedObject = item?.hits.reduce((pre: any, cur: any) => {
          const indicName = cur.IndicName2;
          let data = {};
          data = {
            [nameValueObj[indicName]]: cur.Mvalue ?? '',
            [`${nameValueObj[indicName]}_guId`]: cur.Guid || '',
          };
          return { ...pre, ...data };
        }, {});
        return { ...item, ...mergedObject };
      });
      setDataSource(processedTableData);
    }
  });

  const jumpArea = useMemoizedFn((code) => {
    handleLimit(code, () => {
      history.push(
        urlJoin(
          dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code }),
          urlQueriesSerialize({
            code,
          }),
        ),
      );
    });
  });

  /** 表格列信息，除前五列信息是写死的，后面所有列的信息是根据指标动态生成的 */
  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'orderNumber',
        align: 'center',
        width: Math.max(`${curentPage * paginationSize}`.length * 16, 44),
        fixed: 'left',
        render: (_: any, __: any, index: number) => {
          return index + 1 + (curentPage - 1) * paginationSize;
        },
      },
      {
        title: '开发区名称',
        dataIndex: 'devzName',
        key: 'devzName',
        align: 'left',
        width: 224,
        fixed: 'left',
        render: (text: string) => {
          return <span>{searchKey ? highlight(text, searchKey) : text}</span>;
        },
      },
      {
        title: '明细',
        width: 52,
        fixed: 'left',
        align: 'center',
        render: (_: any, record: any) => {
          return (
            <ButtonStyle
              type="link"
              onClick={() => {
                setDetailModalShow(true);
                setDetailInfo({ ...record, detailId: shortId() });
              }}
            >
              <Icon image={require('@/pages/area/areaDebt/components/table/icon_zq_jgcc.svg')} size={13} />
            </ButtonStyle>
          );
        },
      },
      {
        title: '区域',
        dataIndex: 'CR0231_014',
        key: 'CR0231_014',
        align: 'left',
        width: 102,
        render: (text: any, row: any) => (
          // @ts-ignore
          <Link title={text || '-'} className="link" onClick={() => jumpArea(row?.['CR0231_013'])}>
            {text || '-'}
          </Link>
        ),
      },
      {
        title: '开发区类别',
        dataIndex: 'CR0231_022',
        key: 'CR0231_022',
        align: 'left',
        width: 130,
        render: (text: string) => {
          return text ? <span>{text || '-'}</span> : '-';
        },
      },
      ...indicatorColumns,
    ],
    [jumpArea, curentPage, indicatorColumns, paginationSize, searchKey],
  );
  // console.log('columns', columns);

  /** 列表scroll的宽度根据指标中每一列的width进行累加操作 */
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

  /** 分页加载和筛选加载loading区分 */
  const chooseLoadingType = () => {
    if (loading && loadingType === 'SORT_PAGE_CHANGE') {
      return {
        wrapperClassName: 'sort-page-loading',
        indicator: (
          <span className="loading-tips">
            <Icon
              style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
              image={require('@/assets/images/common/loading.gif')}
            />
            <span className="loading-text">加载中</span>
          </span>
        ),
      };
    } else if (loading && loadingType === 'SCREEN') {
      return {
        wrapperClassName: 'screen-table-loading',
        indicator: <Spin spinning={true} type={'fullThunder'} />,
      };
    }
  };

  const paginationStyle = useMemo(() => {
    return { paddingTop: '8px', marginBottom: '0px', position: 'relative', visibility: loading ? 'hidden' : 'visible' };
  }, [loading]);
  const getRowKey = useMemoizedFn((record: { DEVZCode: string }) => record.DEVZCode);

  useEffect(() => {
    data?.length && handleTblData(data);
  }, [data, handleTblData]);

  return (
    <TableContainer tableHeadTopHeight={tableHeadTopHeight}>
      <AntCustomTable
        size="small"
        columns={columns}
        scroll={scroll}
        // headFixedPosition={69}
        rowKey={getRowKey}
        type="stickyTable"
        dataSource={dataSource}
        loading={chooseLoadingType()}
        sticky={{
          offsetHeader: 69,
          getContainer: () => document.getElementById('specialTopicDevelopmentZone') as HTMLElement,
        }}
      />
      <Pagination
        current={curentPage}
        pageSize={paginationSize}
        total={total}
        onChange={onPageChange as any}
        style={paginationStyle}
        align={'left'}
      />
      <DetailInfoDialog show={isDetailModalShow} close={() => setDetailModalShow(false)} detailInfo={detailInfo} />
    </TableContainer>
  );
};
export default memo(Table);
const TableContainer = styled.div<{ tableHeadTopHeight?: number }>`
  width: 100%;
  margin: 0 auto;
  /* padding: 0 30px 16px; */
  background-color: #fff;

  .ant-table {
    color: #141414;
  }
  .loading-tips {
    width: 88px;
    height: 88px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 22px 6px rgba(44, 44, 48, 0.07);
    margin-left: -52px !important;
    opacity: 1;
    margin-top: -44px;
    z-index: 1;
    .loading-text {
      font-size: 13px;
      color: #434343;
      line-height: 20px;
      margin-top: 6px;
      display: block;
    }
  }
  .sort-page-loading {
    //设置翻页时露出表头
    position: relative;
    z-index: 100px;
    .ant-spin-container {
      opacity: 1;
      overflow: visible !important;

      &:after {
        top: ${(prop) =>
          prop?.tableHeadTopHeight ? `${prop.tableHeadTopHeight}px` : '53px'}; //此top根据表格头部高度来设定
        opacity: 0.9;
        transition: none;
        z-index: 3 !important;
        height: calc(100% + 30px);
      }
    }
  }
  .screen-table-loading {
    .ant-spin-dot {
      margin-left: -36px !important;
    }
    .ant-spin-text {
      width: 60px !important;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: #434343;
      line-height: 20px;
      margin: 12px 0 0 -53px;
    }
    .ant-spin-container::after {
      background: rgba(255, 255, 255);
    }
    .ant-spin-blur::after {
      opacity: 1;
    }
  }
  /* 去除表格阴影 */
  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    box-shadow: none;
  }
  .ant-table-cell {
    padding: 6px 12px !important;
    font-size: 13px;
  }
  .ant-table-tbody > tr:not(:first-of-type) > td:first-of-type,
  .ant-table-container table > thead > tr:first-child th:first-child {
    padding: 6px 8px !important;
  }
  .ant-table-pagination.ant-pagination {
    padding-bottom: 0;
  }
  .ant-table-thead > tr > th {
    white-space: unset;
  }
  .ant-btn-link {
    transform: translateY(-2px);
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

const ButtonStyle = styled(Button)`
  padding: 0;
  line-height: 13px;
  height: 18px;
`;
