import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';

import { Table } from '@/components/antd';
import { useCommonNavStatus, quickCommonNavigationHeight } from '@/components/commonQuickNavigation/utils';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { getLastYear } from '@/pages/area/areaF9/utils';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { IIndustryName } from '../industryStructure';

interface IProps {
  openSource: boolean; // 是否开启溯源
  date: string; // 日期
  indicatorList: any[];
  sortKeyMap: any; // 排序
  hiddenColumn: boolean; // 是否隐藏列
  onChange: (pagination: any, filters: any, sorter: any) => void;
  openUpdate: boolean;
  handleTblCell: Function;
  inModalUpdateTipInfoFlat: any[];
  openModal: Function;
  regionName: string;
  regionCode: string;
}

const linkStyle = { color: '#025cdc', textDecoration: 'underline' };
const nameList: string[] = ['工业增加值1', '工业增加值2'];
// 产业结构
export default function MyTable({
  indicatorList,
  openSource,
  date,
  onChange,
  sortKeyMap,
  hiddenColumn,
  openUpdate,
  handleTblCell,
  inModalUpdateTipInfoFlat,
  openModal,
  regionName,
  regionCode,
}: IProps) {
  const isCommonNavigation = useCommonNavStatus();
  const renderColumn = useCallback(
    (text: string, guId: string, indicName: any, year: string) => {
      const isUpdateItem = inModalUpdateTipInfoFlat.find(
        (updateItem: any) =>
          updateItem?.year === year &&
          (updateItem?.indicName === indicName ||
            (updateItem?.indicName === '工业增加值' && nameList.includes(indicName || ''))),
      );
      return text ? (
        openSource && guId ? (
          isUpdateItem && openUpdate ? (
            <span style={linkStyle}>{text || '-'}</span>
          ) : (
            <Link
              style={linkStyle}
              to={() =>
                urlJoin(
                  dynamicLink(LINK_INFORMATION_TRACE),
                  urlQueriesSerialize({
                    guId,
                  }),
                )
              }
            >
              {text}
            </Link>
          )
        ) : (
          text
        )
      ) : (
        '-'
      );
    },
    [inModalUpdateTipInfoFlat, openSource, openUpdate],
  );

  const renderCell = useMemoizedFn((record: any, year: string, val: any) => {
    const isUpdateItem = inModalUpdateTipInfoFlat.find(
      (updateItem: any) =>
        updateItem?.year === year &&
        (updateItem?.indicName === record?.key ||
          (updateItem?.indicName === '工业增加值' && nameList.includes(record?.key))),
    );
    return !val
      ? {}
      : handleTblCell({
          isUpdateItem,
          onClick: () => {
            openModal(
              {
                title: `${year}年_${regionName}_${record?.name}`,
                /** 动态表头名称 */
                unit: '(亿元)',
                indicName: '金额',
                regionName,
                /** 非计算指标更新弹窗请求用到的参数，必传 */
                year: year,
                regionCode,
                pageCode: 'industry',
                indicName2: `${record?.key}`,
              },
              false,
            );
          },
          defaultClassName: '',
        });
  });

  const columns: ColumnsType<IIndustryName> = useMemo(
    () => [
      {
        title: '序号',
        width: 50,
        align: 'center',
        dataIndex: 'name',
        className: 'pdd-8',
        render: (txt, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '产业类型',
        align: 'left',
        dataIndex: 'name',
      },
      {
        title: `${date}年`,
        align: 'left',
        children: [
          {
            title: '金额(亿元)',
            width: 99,
            align: 'right',
            dataIndex: 'value_0',
            key: 'mValue_0',
            sorter: true,
            showSorterTooltip: false,
            onCell: (row: any) => renderCell(row, date, row?.value_0),
            render: (txt, record: any) => renderColumn(txt, record.guid_0, record?.key, date),
          },
          {
            title: '占比(%)',
            width: 85,
            align: 'right',
            dataIndex: 'percent_0',
            key: 'percent_0',
            sorter: true,
            showSorterTooltip: false,
            render: (txt) => txt || '-',
          },
        ],
      },
      {
        title: `${getLastYear(date)}年`,
        align: 'left',
        children: [
          {
            title: '金额(亿元)',
            width: 99,
            align: 'right',
            dataIndex: 'value_1',
            key: 'mValue_1',
            sorter: true,
            showSorterTooltip: false,
            onCell: (row: any) => renderCell(row, getLastYear(date).toString(), row?.value_1),
            render: (txt, record: any) => renderColumn(txt, record.guid_1, record?.key, getLastYear(date).toString()),
          },
          {
            title: '占比(%)',
            width: 85,
            align: 'right',
            dataIndex: 'percent_1',
            key: 'percent_1',
            sorter: true,
            showSorterTooltip: false,
            render: (txt) => txt || '-',
          },
        ],
      },
    ],
    [renderColumn, date, renderCell],
  );

  // 前端排序逻辑处理
  const sortDataSource = useMemo(() => {
    const sortKey = Object.keys(sortKeyMap)[0];
    if (sortKey) {
      const sortType = sortKeyMap[sortKey];
      if (sortType) {
        const [totalGdp, ...list] = indicatorList;
        let noDataList: any[] = [],
          dataList: any[] = [];
        list.forEach((item) => {
          if (get(item, sortKey)) {
            dataList.push(item);
          } else {
            noDataList.push(item);
          }
        });
        dataList.sort((a, b) => {
          const aValue = get(a, sortKey, 0);
          const bValue = get(b, sortKey, 0);
          if (sortType === 'ascend') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
        return [totalGdp, ...dataList, ...noDataList];
      }
    }
    return indicatorList;
  }, [indicatorList, sortKeyMap]);
  // 隐藏空数据
  const dataSource = useMemo(() => {
    return hiddenColumn ? sortDataSource.filter((it: any) => it.mValue_0 || it.mValue_1) : sortDataSource;
  }, [sortDataSource, hiddenColumn]);

  return (
    <Table
      rowKey={(record: any) => record.key}
      className="specific-table underArea-table"
      type="stickyTable"
      columns={columns}
      scroll={{ y: 448 - (isCommonNavigation ? quickCommonNavigationHeight : 0) }}
      onChange={onChange}
      isStatic
      dataSource={dataSource}
    />
  );
}
