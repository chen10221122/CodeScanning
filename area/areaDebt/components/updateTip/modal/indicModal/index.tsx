import { useEffect, memo, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Popover, Table } from '@dzh/components';
import styled from 'styled-components';

import { Loading } from '@/components';
import { Empty, Modal } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { ChangeIndicNameMap } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import { IRootState } from '@/store';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { shortId } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useData, { fixedParams } from '../../hooks/useUpdateModalData';

const UpdateModal = ({ visible, info, onClose, container, openDataSource }: any) => {
  const domRef = useRef(null);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;

  const { loading, data, run } = useData({ isCalculateIndic: false, tabIndex: info?.activeTab });
  useEffect(() => {
    /** 指标不一定是页面上显示的名称 */
    const { indicName2, year, regionCode, pageCode } = info || {};
    if (regionCode && indicName2 && pageCode) {
      if (info?.activeTab === 2) {
        const [projectCode, rate] = info.tab2Info.split('-');
        run({
          areaCode: regionCode,
          endDate: year?.split('-')?.join('') ?? '',
          projectCode,
          rate,
        });
      } else {
        run({
          ...fixedParams,
          indicName: ChangeIndicNameMap.get(indicName2) || indicName2,
          endDate: year,
          regionCode,
          pageCode,
        });
      }
    }
  }, [info, run]);

  const setting = useMemo(
    () => ({
      width: 860,
      title: `${info?.title}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'updateModal',
      footer: null,
      onCancel: () => onClose(),
      getContainer: () => container,
      destroyOnClose: true,
      loading,
    }),
    [info?.title, onClose, container, loading],
  );

  const TblSetting = useMemo(() => {
    return {
      pagination: false,
      dataSource: data,
      rowKey: () => shortId(),
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
          render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
        },
        {
          title: '更新日期',
          width: 139,
          align: 'center',
          dataIndex: 'updateTime',
        },
        {
          title: <div className="title">{info?.indicName + info?.unit}</div>,
          width: 232,
          align: 'right',
          dataIndex: 'mValue',
          render(text: string, record: Record<string, any>) {
            if (text !== null && text !== undefined && text !== '') {
              return record?.caliberDesc ? (
                <CaliberNotes>
                  <div className="top">{formatNumber(text)}</div>
                  <Popover
                    placement="bottomLeft"
                    content={record.caliberDesc}
                    arrowPointAtCenter
                    overlayStyle={{
                      maxWidth: '208px',
                    }}
                  >
                    <span className="icon"></span>
                  </Popover>
                </CaliberNotes>
              ) : (
                <div>{formatNumber(text)}</div>
              );
            } else return '-';
          },
        },
        {
          title: '信源',
          width: 396,
          align: 'left',
          dataIndex: 'title',
          render: (text: any, record: any) => {
            if (text !== null && text !== undefined && text !== '') {
              if (record?.guid || record?.posId) {
                return !hasPay ? (
                  text
                ) : record?.posId && openDataSource ? (
                  <SourceStyle
                    data-prevent // 必须
                    onClick={() => openDataSource({ posIDs: record.posId, jumpToPdf: true })}
                    title={text}
                  >
                    {text}
                  </SourceStyle>
                ) : (
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
      ],
    };
  }, [data, info?.indicName, info?.unit, hasPay, openDataSource]);

  return (
    <IndicModalStyle visible={visible} {...setting}>
      <div className="modal-content app-scrollbar-small" ref={domRef}>
        <Loading show={loading} style={{ height: '226px' }}>
          {/* @ts-ignore */}
          {data?.length > 0 ? <TableStyle {...TblSetting} /> : <Empty type={Empty.NO_DATA} />}
        </Loading>
      </div>
    </IndicModalStyle>
  );
};

export default memo(UpdateModal);

const TableStyle = styled(Table)`
  .ant-table-container {
    border-top: none !important;
  }

  .ant-table-header {
    overflow: visible !important;
  }
  .ant-table .ant-table-container .ant-table-thead > tr > th {
    text-align: center !important;
    position: relative;
    border-top: 1px solid #ebf1fc;

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
  /* .ant-table-tbody > tr > td {
    border-bottom: none;
    height: 30px;
  }
  .ant-table-tbody > tr.ant-table-row:nth-of-type(odd) > td {
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
    color: #262626 !important;
    white-space: normal;
  }

  table {
    & > thead > tr > th:last-child,
    & > tbody > tr > td:last-child {
      border-right: none;
    }
  }
`;

const IndicModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-content {
    width: 860px !important;
  }

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

const SourceStyle = styled.div`
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: #025cdc;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
