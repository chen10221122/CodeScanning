import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { ColumnsType } from 'antd/es/table';
import cn from 'classnames';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import useIndicatorColumn from '@pages/area/landTopic/modules/overview/hooks/useIndicatorColumn';

import { LINK_LAND_PARCEL_DETAIL, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { dynamicLink } from '@/utils/router';
import { urlQueriesSerialize } from '@/utils/url';

interface Props {
  currentPage: number;
  dataSource: Record<string, any>[];
  indicator: SelectItem[];
  holdRatio: string;
  setHoldRatio: (v: string) => void;
  sortKey?: string;
  sortRule?: string;
  keyword?: string;
}
const useColumns = ({
  currentPage,
  sortKey,
  sortRule,
  keyword,
  dataSource,
  indicator,
  holdRatio,
  setHoldRatio,
}: Props) => {
  const history = useHistory();
  const { indicatorColumns } = useIndicatorColumn({
    sortKey,
    sortRule,
    keyword,
    dataSource,
    indicator,
    holdRatio,
    setHoldRatio,
  });
  const fixColumns: ColumnsType<any> = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'idx',
        key: 'idx',
        className: 'dzh-table-column-index',
        width: Math.max(`${(currentPage - 1) * 50}`.length * 16, 42),
        align: 'center',
        fixed: 'left',
        render: (_, __, i) => i + 1 + (currentPage - 1) * 50,
      },
      {
        title: '宗地编号',
        dataIndex: 'landCode',
        key: 'landCode',
        width: 200,
        align: 'left',
        fixed: 'left',
        resizable: { max: 780 },
        render: (text, row) => (
          <span
            className={cn('ellipsis2', { 'link-underline': !!row.mainCode })}
            title={text ?? undefined}
            onClick={() =>
              row.mainCode &&
              history.push({
                pathname: dynamicLink(LINK_LAND_PARCEL_DETAIL, { key: row.mainCode }),
                state: { landName: row.landCode, originLink: row?.url || '' },
              })
            }
          >
            {text ? highlight(`${text}`, keyword) : '-'}
          </span>
        ),
      },
    ],
    [currentPage, history, keyword],
  );

  const columns: ColumnsType<any> = useMemo(
    () => [
      ...fixColumns,
      ...indicatorColumns,
      {
        title: '信源',
        width: 72,
        align: 'center',
        dataIndex: 'guid',
        resizable: true,
        render: (text: any, row) => {
          return text ? (
            <span
              className="link-underline"
              onClick={() => {
                history.push({
                  pathname: LINK_INFORMATION_TRACE,
                  search: urlQueriesSerialize({
                    guid: text,
                  }),
                  state: {
                    title: row?.landName || '地块详情',
                    originLink: row?.url || '',
                  },
                });
              }}
            >
              查看
            </span>
          ) : (
            '-'
          );
        },
      },
    ],
    [fixColumns, history, indicatorColumns],
  );

  return columns;
};

export default useColumns;
