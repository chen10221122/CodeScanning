import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';

import { Table } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { getLastYear } from '../../../common';
import { IIndustryName } from '../../../config/industryStructure';

interface IProps {
  openSource: boolean; // 是否开启溯源
  date: string; // 日期
  indicatorList: any[];
  sortKeyMap: any; // 排序
  hiddenColumn: boolean; // 是否隐藏列
  onChange: (pagination: any, filters: any, sorter: any) => void;
}

// 产业结构
export default function MyTable({ indicatorList, openSource, date, onChange, sortKeyMap, hiddenColumn }: IProps) {
  const renderColumn = useCallback(
    (text: string, guId: string) => {
      return text ? (
        openSource && guId ? (
          <Link
            style={{ color: '#025cdc', textDecoration: 'underline' }}
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
        ) : (
          text
        )
      ) : (
        '-'
      );
    },
    [openSource],
  );
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
        width: 220,
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
            render: (txt, record: any) => renderColumn(txt, record.guid_0),
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
            render: (txt, record: any) => renderColumn(txt, record.guid_1),
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
    [renderColumn, date],
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
      scroll={{ y: 448 }}
      onChange={onChange}
      isStatic
      dataSource={dataSource}
    />
  );
}
