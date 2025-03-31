import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { ColumnsType } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';

import { Table } from '@/components/antd';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useLimits from '@/pages/area/areaEconomy/useLimits';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { IIndustryName, IndustryName } from '../../../config/underArea';

interface IProps {
  openSource: boolean;
  tableData: any[];
  onChange: (pagination: any, filters: any, sorter: any) => void;
  sortKeyMap: { [k: string]: SortOrder };
}

export default function MyTable({ openSource, onChange, sortKeyMap, tableData }: IProps) {
  const getSortOrder = useCallback((key) => sortKeyMap[key], [sortKeyMap]);
  const history = useHistory();
  const { handleLimit } = useLimits();
  const renderGuIdItem = useCallback(
    ({ guid, text }) => {
      return openSource && guid ? (
        <span
          className="trace-link-span"
          onClick={() => {
            history.push(urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: guid })));
          }}
        >
          {text}
        </span>
      ) : (
        <span> {text} </span>
      );
    },
    [openSource, history],
  );
  const columns = useMemo(() => {
    let list: ColumnsType = [
      {
        title: '下属辖区',
        align: 'center',
        width: 80,
        fixed: 'left',
        dataIndex: 'regionName',
        key: 'regionName',
        render(text: string, row: any) {
          return (
            <span
              className="hover-underline"
              onClick={() => {
                row.regionCode4 &&
                  handleLimit(row.regionCode4, () => {
                    history.push(urlJoin(dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: row.regionCode4 })));
                  });
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: '地区评分',
        align: 'center',
        width: 90,
        dataIndex: 'score',
        key: 'score',
        sorter: true,
        sortOrder: getSortOrder('score'),
        showSorterTooltip: false,
        render(text: string) {
          return text || '-';
        },
      },
    ];
    const columnsWidth = [102, 113, 115, 101, 103, 120];
    // 遍历数据获取table header内容
    Object.keys(IndustryName).forEach((key: string, index: number) => {
      const keyName = key as IIndustryName;
      const name: string = IndustryName[keyName];
      list.push({
        title: name,
        align: 'right',
        width: columnsWidth[index] ? columnsWidth[index] : 124,
        dataIndex: name,
        key: keyName,
        sorter: true,
        sortOrder: getSortOrder(keyName),
        showSorterTooltip: false,
        render(t: string, row: any) {
          const { mValue, guid } = row.indicatorList.find((it: any) => it.indicName === keyName) || {};
          const text = mValue ? parseFloat(mValue).toFixed(2).toLocaleString() : '-';
          return renderGuIdItem({ guid, text });
        },
      });
    });
    return list;
  }, [renderGuIdItem, history, getSortOrder, handleLimit]);
  const stick = useMemo(
    () => ({
      offsetHeader: 114,
      getContainer: () => document.getElementById('tabsWrapper') || window,
    }),
    [],
  );
  return (
    <Table
      rowKey="regionCode4"
      className="specific-table underArea-table"
      type="stickyTable"
      scroll={{ x: 1265 }}
      sticky={stick}
      onChange={onChange}
      columns={columns}
      dataSource={tableData}
    />
  );
}
