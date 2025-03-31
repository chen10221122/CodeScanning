import { FC, memo, useMemo } from 'react';

import styled from 'styled-components';

import { Table } from '@/components/antd';
import { color } from '@/pages/area/areaEconomy/modules/blackList/constant';

import styles from '@/pages/area/areaEconomy/modules/blackList/style.module.less';

export interface TableListProps {
  title: string;
  dataSource?: Record<string, any>[];
}

const widthMapTitle = new Map([
  ['存续周期', [110, 116, 116]],
  ['企业规模', [152, 93, 98]],
  ['经营状态', [100, 121, 122]],
]);

const TableList: FC<TableListProps> = ({ title, dataSource }) => {
  const column = useMemo(() => {
    const widthList = widthMapTitle.get(title);
    return [
      {
        title: title,
        dataIndex: 'title',
        key: 'title',
        width: widthList ? widthList[0] : 90,
        align: 'left',
        render(record: string, _: any, index: number) {
          return (
            <>
              {record ? (
                <>
                  <span className={styles.tableListColorIcon} style={{ background: `${color[index % 5]}` }}></span>
                  <span>{record}</span>
                </>
              ) : null}
            </>
          );
        },
      },
      {
        title: '企业数量(家)',
        dataIndex: 'originCount',
        key: 'originCount',
        // width: 102,
        width: widthList ? widthList[1] : 90,
        align: 'right',
      },
      {
        title: '数量占比(%)',
        dataIndex: 'proportion',
        key: 'proportion',
        // width: 102,
        width: widthList ? widthList[2] : 90,
        align: 'right',
      },
    ];
  }, [title]);

  return (
    <TableWrapper>
      <Table
        type="stickyTable"
        // stripe={true}
        rowKey={(d: any) => JSON.stringify(d)}
        showSorterTooltip={false}
        columns={column}
        dataSource={dataSource}
        sticky={{
          // offsetHeader: 54,
          getContainer: () => document.getElementById('tabsWrapper') || document.body,
        }}
        scroll={{ x: 'max-content' }}
      />
    </TableWrapper>
  );
};

export default memo(TableList);

const TableWrapper = styled.div`
  .ant-table-container {
    .ant-table-header .ant-table-thead {
      .ant-table-cell:not(:first-child) {
        text-align: right !important;
      }
      .ant-table-cell:first-child {
        text-align: left !important;
      }
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 5px 12px;
    }
  }
`;
