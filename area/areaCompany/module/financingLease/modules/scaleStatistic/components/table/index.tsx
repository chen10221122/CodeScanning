import { FC, memo, useMemo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { TableProps } from 'antd';
import cn from 'classnames';
import { cloneDeep, isUndefined } from 'lodash';
import shortid from 'shortid';

import { useSelector } from '@pages/finance/financingLeaseNew/modules/censusAnalyse/context';

import CommonLink from '@/app/components/CommonLink';
import { Icon } from '@/components';
import { Table as AntCustomTable } from '@/components/antd';
import Pagination from '@/components/Pagination';
import TableFinance from '@/components/tableFinance';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import PDF_image from '@/pages/finance/financingLeaseNew/images/PDF.svg';
import { quarterFormatValue } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/screen';
import { formatNumber, getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import CompanyEllipsis from '../../components/companyEllipsis';
import Label from './label';
import SortField from './sortField';
import styles from './style.module.less';

interface Props {
  /** 表格原始数据 */
  data: Record<string, any>[];
  /** 数据总量 */
  total: number;
  /** loading样式及分类loading */
  loading?: boolean;
  /** 分页 */
  paginationSize: number;
  currentPage: number;
  /** 排序 */
  currentSort?: { key: string; value: string; rule?: string };
  setCurrentSort?: any;
  /** 指标信息，用来生成表格列信息 */
  indicators: any[];
  /** 搜索关键词 */
  searchKey?: string;
  /** 序号列是否需要固定 */
  noFixed?: boolean;
  /** 排序事件 */
  onSortChange?: (currentSort: any) => void;
  /** 分页事件 */
  onPageChange?: TableProps<any>['onChange'];
  /** 数字modal点击弹框事件 */
  onClickNumModal?: Function;
  /** 表格头部sticky的高度 */
  headFixedPosition?: number;
  /** 季度日期下value值format */
  quarterFormat?: string;
  /** 是否单独选中百强县 */
  selectedCounty?: boolean;
  /** 是否是双表头表格 */
  isDoubleThead?: boolean;
}

export interface columnType {
  /** 数据渲染key */
  dataIndex: string;
  /** 排序key */
  sortKey?: string;
  /** 标题 */
  title: string;
  /** 列宽 */
  width?: number;
  /** 当前列文字显示位置 */
  align?: string;
  /** 需要展示textEllipsis的列 */
  needTextEllipsis?: boolean;
  /** 需要展示statusPopover的列 */
  needStatusPopover?: boolean;
  /** 自定义 */
  [T: string]: any;
}

const Table: FC<Props> = ({
  data,
  total,
  loading,
  searchKey,
  currentPage,
  noFixed = false,
  paginationSize,
  indicators,
  currentSort,
  quarterFormat,
  setCurrentSort,
  onSortChange,
  onPageChange,
  onClickNumModal,
  headFixedPosition = 92,
  selectedCounty,
  isDoubleThead,
}) => {
  const showFullAreaName = useSelector((state) => state.showFullAreaName);
  const [dataSource, setDataSource] = useState<any>([]);
  const history = useHistory();
  const toAreaF9 = useMemoizedFn((row) => {
    history.push(
      urlJoin(
        dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: row.regionCode }),
        urlQueriesSerialize({
          code: row.regionCode,
        }),
      ),
    );
  });
  const handleNumModal = useMemoizedFn((num, type) => {
    onClickNumModal?.(num, type);
  });

  /** 序号列宽 */
  const idxWidth = useMemo(() => {
    return Math.max(`${currentPage * paginationSize}`.length * 16, 44);
  }, [currentPage, paginationSize]);

  const indicatorColumns = useMemo(() => {
    let copyIndicators = cloneDeep(indicators);
    /** 将传入的配置信息生成对应的column */
    const getColumnItem = (item: any, index: number) => {
      const {
        title,
        sortKey,
        align,
        isFixed,
        dataIndex,
        className,
        resizable,
        wrapLine,
        isAreaLink,
        isTextEllipsis,
        LesseeOrLeaser,
        isNumberModal,
        NumberModalType,
        isCreditRating,
        isQuarterFormat,
      } = item;
      const titleText = sortKey ? title : <span title={title}>{title}</span>;
      if (isUndefined(align)) item.align = 'center';
      /* 根据有无排序给title赋值*/
      if (sortKey) {
        //@ts-ignore
        item.title = (
          <SortField
            sortChange={onSortChange}
            sortOpt={{ key: sortKey, value: titleText, rule: 'desc' }}
            currentSort={currentSort}
            align={item?.headAlign}
            setCurrentSort={setCurrentSort}
          />
        );
      } else if (!sortKey && item?.children) {
        item.title = (
          <span style={{ fontWeight: 500 }} title={title}>
            {title}
          </span>
        );
        item.children.forEach((i: any, idx: number) => {
          item.children[idx] = {
            ...i,
            title: (
              <SortField
                sortChange={onSortChange}
                sortOpt={{ key: i.sortKey, value: i.title, rule: 'desc' }}
                align={i?.headAlign}
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            ),
          };
        });
      } else {
        item.title = titleText;
      }

      /* 注意：dataIndex是用作表格列数据渲染的， sortKey是用来传递排序参数的，dataIndex和sortKey可能不是一样的，所以配置两个参数*/
      item.dataIndex = dataIndex ?? sortKey;
      item.key = item.dataIndex;
      item.fixed = index === 0 ? 'left' : isFixed ?? false;
      item.resizable = index === 0 ? { max: Number(940 - idxWidth) } : resizable ?? true;
      item.wrapLine = wrapLine ?? item.dataIndex === 'area';
      item.className = className;
      item.render = (text: any, record: any) => {
        let result: any;
        if (text) {
          result = <span title={text}>{text}</span>;
          if (item.dataIndex === 'area') {
            result =
              showFullAreaName || isAreaLink ? (
                <div className={styles.overflow}>
                  <div
                    title={text}
                    onClick={() => {
                      toAreaF9(record);
                    }}
                    className={cn(styles.cursorText, {
                      [styles.overflowLeft]: String(record.isTopCounty) === '1' && !selectedCounty,
                    })}
                  >
                    {text}
                  </div>
                  {String(record.isTopCounty) === '1' && !selectedCounty ? <Label /> : null}
                </div>
              ) : (
                <div title={text}>{text}</div>
              );
          }
          if (isTextEllipsis) {
            result = (
              <CompanyEllipsis
                data={LesseeOrLeaser === 'lessee' ? record?.lessee : record?.leaser || []}
                type={LesseeOrLeaser}
                textLimitwidth={item.width - 25}
                keyword={searchKey}
              />
            );
          }
          if (isNumberModal) {
            const number = formatNumber(record?.[item.dataIndex], 0);
            result = (
              <span className="numberModal" title={number} onClick={() => handleNumModal(record, NumberModalType)}>
                {number}
              </span>
            );
          }
          if (isCreditRating) {
            result = (
              <div className="creditRating">
                <span title={record?.creditRating}>{record?.creditRating}</span>
                <span>
                  {record?.creditRatingAddress && (
                    <CommonLink to={getExternalLink(record?.creditRatingAddress, true)}>
                      <img src={PDF_image} alt="" />
                    </CommonLink>
                  )}
                </span>
              </div>
            );
          }
          if (isQuarterFormat) {
            const registerDate = record?.registerStartDate || record?.registerEndDate;
            /** 按月份、季度、年份转化字符串 */
            if (quarterFormat === '2') {
              const yearDate = registerDate?.match(/^\w{4}/);
              const quarterDate = registerDate?.match(/\w{2}$/)[0];
              result = (
                <span>
                  <span>{yearDate + '年'}</span>
                  <span>{quarterFormatValue.get(quarterDate)}</span>
                </span>
              );
            } else {
              if (/^\d{4}$/.test(registerDate)) {
                result = <span>{registerDate + '年'}</span>;
              } else {
                const formatDate = registerDate.replace(/^(\d{4})-(\d{2})$/, '$1年$2月');
                result = <span>{formatDate}</span>;
              }
            }
          }
        } else result = '-';
        return result;
      };
      return item;
    };
    /** 循环 indicators 生成对应的columns结构 */
    const getColumns = (indicatorData: any[]) => {
      const newTree = indicatorData.map((item, index) => getColumnItem(item, index));
      return newTree;
    };

    const indicatorColumns = getColumns(copyIndicators);
    return indicatorColumns;
  }, [
    currentSort,
    handleNumModal,
    idxWidth,
    indicators,
    onSortChange,
    quarterFormat,
    searchKey,
    selectedCounty,
    setCurrentSort,
    showFullAreaName,
    toAreaF9,
  ]);

  /** 表格列信息，除前两列信息是写死的，后面所有列的信息是根据传入指标配置生成的 */
  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'orderNumber',
        align: 'center',
        width: idxWidth,
        fixed: noFixed ? false : 'left',
        render: (_: any, __: any, index: number) => {
          return index + 1 + (currentPage - 1) * paginationSize;
        },
      },

      ...indicatorColumns,
      {
        title: '',
        dataIndex: 'blank',
      },
    ],
    [idxWidth, currentPage, indicatorColumns, paginationSize, noFixed],
  );

  /** loading样式 */
  const loadingTip = useMemo(() => {
    if (loading) {
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
    }
  }, [loading]);

  const paginationStyle = useMemo(() => {
    return { paddingTop: '8px', marginBottom: '0px', position: 'relative', visibility: loading ? 'hidden' : 'visible' };
  }, [loading]);

  useEffect(() => {
    data?.length && setDataSource(data);
  }, [data]);

  return (
    <div className={styles.censusAnalyse_table_container}>
      {isDoubleThead ? (
        <AntCustomTable
          type="stickyTable"
          size="small"
          dataSource={dataSource}
          columns={columns}
          rowKey={shortid()}
          loading={loadingTip}
          scroll={{ x: '100%' }}
          headFixedPosition={headFixedPosition}
          sticky={{
            offsetHeader: headFixedPosition,
            getContainer: () => document.querySelector('#areaF9censusAnalyseMountedId') as HTMLElement,
          }}
          showSorterTooltip={false}
        />
      ) : (
        /*@ts-ignore*/
        <TableFinance
          type="stickyTable"
          size="small"
          stripe
          dataSource={dataSource}
          columns={columns}
          // rowKey={shortid()}
          noSelectRow={true}
          loading={loadingTip}
          scroll={{ x: '640px' }}
          headFixedPosition={headFixedPosition}
          sticky={{
            offsetHeader: headFixedPosition,
            getContainer: () => document.querySelector('#areaF9censusAnalyseMountedId') as HTMLElement,
          }}
          showSorterTooltip={false}
        />
      )}
      {total > 50 ? (
        <Pagination
          current={currentPage}
          pageSize={paginationSize}
          total={total}
          onChange={onPageChange as any}
          style={paginationStyle}
          align={'left'}
        />
      ) : null}
    </div>
  );
};
export default memo(Table);
