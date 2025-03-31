import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { Table } from '@/components/antd';
import { StockText } from '@/pages/finance/stockIssuance/components';
import { SMALL_PAGE_SIZE, MIN_WIDTH, PADDING } from '@/pages/finance/stockIssuance/constant';
import { getExternalLink } from '@/utils/format';
import { shortId } from '@/utils/share';

const Enquiry = ({ dataSource }: { dataSource: Record<string, string>[] }) => {
  const [current, setCurrent] = useState(1);
  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        width: Math.max(`${(current - 1) * SMALL_PAGE_SIZE}`.length * 8 + PADDING, MIN_WIDTH),
        className: 'pdd-8',
        render: (text: string, obj: any, i: number) => {
          return <span>{(current - 1) * SMALL_PAGE_SIZE + i + 1}</span>;
        },
      },
      {
        title: '文件名称',
        key: 'title',
        dataIndex: 'title',
        align: 'left',
        width: 642,
        render: (text: string, row: any) => {
          return row?.path ? (
            <Link to={getExternalLink(row?.path, true)}>
              <span className="link_style">{text}</span>
            </Link>
          ) : (
            '-'
          );
        },
      },
      {
        title: '日期',
        key: 'publishDate',
        dataIndex: 'publishDate',
        width: 150,
        render: (text: string) => <StockText text={text} />,
      },
    ],
    [current],
  );

  const handleChangePage = useCallback((page) => {
    setCurrent(page.current);
  }, []);

  return (
    <ModalTable
      rowKey={() => shortId()}
      columns={columns}
      dataSource={dataSource}
      isStatic
      type="stickyTable"
      pagination={{
        size: 'small',
        pageSize: SMALL_PAGE_SIZE,
        total: dataSource.length || 0,
        hideOnSinglePage: true,
        showSizeChanger: false,
      }}
      onChange={handleChangePage}
    />
  );
};

export default memo(Enquiry);

const ModalTable = styled(Table)`
  .ant-pagination {
    padding-bottom: 0 !important;
  }
`;
