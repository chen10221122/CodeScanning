import { useMemo } from 'react';

// import { useMemoizedFn } from 'ahooks';
import { useMemoizedFn } from 'ahooks';
import { isNumber } from 'lodash';

import { formatNumber } from '@/utils/format';

const useColumns = (arr) => {
  // const arr = [4, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1];

  const renderContent = useMemoizedFn((value, row, index) => {
    const obj = {
      children: isNumber(value) ? formatNumber(value) : value ? <div>{value}</div> : '-',
      props: {},
    };
    if (index === arr.length) {
      obj.props.colSpan = 0;
    }
    return obj;
  });

  const columns = useMemo(() => {
    return [
      {
        title: '指标',
        colSpan: 2,
        width: 86,
        dataIndex: 'partName',
        render: (value, row, index) => {
          // console.log('row', row);
          const obj = {
            children: value,
            props: {},
          };
          // const arr = [4, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1];
          obj.props.rowSpan = arr[index];
          if (index === arr.length) {
            obj.props.colSpan = 2;
          }
          return obj;
        },
      },
      {
        title: '指标',
        colSpan: 0,
        dataIndex: 'name',
        width: 154,
        align: 'left',
        render: (value, row, index) => {
          const obj = {
            children: value ? value : '-',
            props: {},
          };
          if (index === arr.length) {
            obj.props.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '权重',
        dataIndex: 'proportion',
        width: 72,
        align: 'right',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === arr.length) {
            obj.props.colSpan = 3;
            if (row?.total) obj.children = row.total;
          }
          return obj;
        },
      },
      {
        title: '指标值',
        width: 88,
        dataIndex: 'value',
        align: 'right',
        render: renderContent,
      },
      {
        title: '具体得分',
        dataIndex: 'rating',
        width: 80,
        align: 'right',
        render: renderContent,
      },
    ];
  }, [arr, renderContent]);

  return {
    columns,
  };
};

export default useColumns;
