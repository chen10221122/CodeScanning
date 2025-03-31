import { FC, memo, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

import { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';

import { Loading } from '@/components';
import { Empty, Modal, Table } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { TblEl, useCtx } from '@/pages/area/areaDebt/getContext';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

type PropsType = {
  close: () => void;
  data: TblEl[];
  loading: boolean;
};

const UpdateModal: FC<PropsType> = ({ close, data, loading }) => {
  const domRef = useRef(null);
  const {
    state: { container, updateModalInfo },
  } = useCtx();

  const visibal = useMemo(() => {
    return Object.keys(updateModalInfo)?.length > 0;
  }, [updateModalInfo]);

  const setting = useMemo(
    () => ({
      width: 860,
      title: `${updateModalInfo.regionName}_${updateModalInfo.title}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'updateModal',
      footer: null,
      onCancel: () => close(),
      getContainer: () => container,
      destroyOnClose: true,
      loading,
    }),
    [updateModalInfo.regionName, updateModalInfo.title, loading, close, container],
  );

  const TblSetting = useMemo(() => {
    return {
      pagination: false,
      dataSource: data,
      type: 'stickyTable',
      // className: 'app-table',
      sticky: {
        offsetHeader: 0,
        getContainer: () => domRef.current || window,
      },
      columns: [
        {
          title: '序号',
          width: 42,
          align: 'center',
          render: (txt, record, index) => <span>{index + 1}</span>,
        },
        {
          title: '更新日期',
          width: 139,
          align: 'center',
          dataIndex: 'updateTime',
        },
        {
          title: <div className="title">{updateModalInfo?.title}</div>,
          width: 232,
          align: 'right',
          dataIndex: 'mValue',
          render(text: string) {
            if (text !== null && text !== undefined && text !== '') {
              return formatNumber(text);
            } else return '-';
          },
        },
        {
          title: '信源',
          width: 396,
          align: 'left',
          dataIndex: 'title',
          render: (text, record) => {
            if (text !== null && text !== undefined && text !== '') {
              if (record?.guid) {
                return (
                  <LinkStyle
                    style={{ color: '#025cdc' }}
                    to={() =>
                      urlJoin(
                        dynamicLink(LINK_INFORMATION_TRACE),
                        urlQueriesSerialize({
                          guId: record?.guid,
                        }),
                      )
                    }
                    title={text}
                  >
                    {text}
                  </LinkStyle>
                );
              } else return text;
            } else {
              return '-';
            }
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [data, updateModalInfo?.title]);

  return (
    <ModalStyle visible={visibal} {...setting}>
      <div className="modal-content app-scrollbar-small" ref={domRef}>
        <Loading show={loading} style={{ height: '226px' }}>
          {data?.length > 0 ? <TableStyle {...TblSetting} /> : <Empty type={Empty.NO_DATA} />}
        </Loading>
      </div>
    </ModalStyle>
  );
};

export default memo(UpdateModal);

const TableStyle = styled(Table)`
  .ant-table-container {
    //table {
    border-top: none !important;
    //}
  }

  .ant-table-header {
    overflow: visible !important;
  }
  .ant-table .ant-table-container .ant-table-thead > tr > th {
    text-align: center !important;
    position: relative;
    border-top: 1px solid #ebf1fc;

    /* &.ant-table-cell {
      padding-right: 0 !important;
      padding-left: 0 !important;
    } */

    &:before {
      content: '';
      position: absolute;
      top: -4px;
      left: 0;
      right: 0;
      height: 3px;
      background: #fff;
    }

    span {
      display: inline-block;
      text-align: right;
    }
  }

  td {
    &.idx {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    span {
      display: inline-block;
      text-align: right;
    }
  }
  .ant-table-sticky-scroll-bar {
    visibility: hidden !important;
  }
  .ant-table-tbody > tr > td {
    border-bottom: none;
    height: 30px;
  }
  /* .ant-table-tbody > tr.ant-table-row:nth-of-type(odd) > td {
    background-color: #f9fbff;
  }
  .ant-table-tbody > tr.ant-table-row:nth-of-type(even) > td {
    background-color: #ffffff;
  } */

  .ant-table-thead {
    th {
      padding-left: 12px !important;
      padding-right: 12px !important;
      border-top: 1px solid #ebf1fc;
    }
    th:first-of-type {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .align-left {
      text-align: left !important;
    }
    .align-right {
      text-align: right !important;
    }
  }

  .title {
    white-space: normal;
  }

  table {
    & > thead > tr > th:last-child,
    & > tbody > tr > td:last-child {
      border-right: none;
    }
  }
`;

const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding-right: 0 !important;
    padding-left: 24px;
    padding-top: 15px;
  }

  .modal-content {
    max-height: 392px;
    min-height: 226px;
    overflow-y: auto;
    overflow-y: ${(props) => (props.loading ? 'hidden' : 'overlay')};
    position: relative;
    padding-right: 24px;
  }

  .ant-empty {
    margin-top: 60px;
  }
`;
const LinkStyle = styled(Link)`
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
`;
