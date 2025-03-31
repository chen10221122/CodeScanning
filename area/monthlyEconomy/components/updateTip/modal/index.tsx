import { useEffect, memo, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Table, Popover } from '@dzh/components';
import { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';

// import attention from '@/assets/images/area/attention.svg';
import { Loading } from '@/components';
import { Empty, Modal } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSourceDrawer';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import { TblEl } from '@/pages/area/monthlyEconomy/getContext';
import { IRootState } from '@/store';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { shortId } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useData from '../hooks/useUpdateModalData';

export interface Info {
  title: string;
  year: string;
  pageCode: string;
  /**指标项目代码 */
  projectCode?: string;
  /** 指标名称 - 用作计算指标更新弹窗中的请求参数，或者非计算指标更新弹窗中的表头显示 */
  indicName: string;
  regionCode: string;
  regionName?: string;
  /** 指标名称 - 用作非计算指标更新弹窗中的请求参数, 例如：页面显示GDP, 参数要传"地区生产总值" */
  indicName2?: string;
  unit?: string;
  activeTab?: number; // 当前激活tab
  tab2Info?: Record<string, any>;
}

export interface UpdateModalIprops {
  visible: boolean;
  /** 弹窗内的请求参数和标题信息 */
  info: Info;
  /** 关闭弹窗 */
  onClose: Function;
  /** 弹窗挂载的容器 */
  container: React.ReactDOM | React.ReactElement | HTMLElement;
  openDataSource?: OpenDataSourceDrawer;
}

const UpdateModal = ({ visible, info, onClose, container, openDataSource }: any) => {
  const domRef = useRef(null);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;

  const { loading, data, run } = useData();
  useEffect(() => {
    /** 指标不一定是页面上显示的名称 */
    const { year, regionCode, projectCode, rate = '月' } = info || {};
    if (regionCode) {
      run({
        areaCode: regionCode,
        endDate: year || '',
        projectCode: projectCode,
        rate,
      });
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
      dataSource: data,
      rowKey: () => shortId(),
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
          title: <div className="title">{`${info?.indicName}${info?.unit}`}</div>,
          width: 232,
          align: 'right',
          dataIndex: 'mValue',
          render(text: string, record: any) {
            if (text !== null && text !== undefined && text !== '') {
              let caliberDesc = record.caliberDesc || '';
              return caliberDesc ? (
                <CaliberNotes>
                  <div className="top">{formatNumber(text)}</div>
                  <Popover
                    placement="bottomLeft"
                    content={caliberDesc}
                    arrowPointAtCenter={true}
                    overlayStyle={{
                      maxWidth: '208px',
                    }}
                  >
                    <span className="icon"></span>
                  </Popover>
                </CaliberNotes>
              ) : (
                formatNumber(text)
              );
              // return formatNumber(text);
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
                ) : record?.posId ? (
                  <SpanStyle
                    data-prevent // 必须
                    onClick={() => openDataSource && openDataSource({ posIDs: record.posId })}
                  >
                    {text}
                  </SpanStyle>
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
      ] as ColumnsType<TblEl>,
    };
  }, [data, info?.indicName, info?.unit, hasPay, openDataSource]);

  return (
    <IndicModalStyle visible={visible} {...setting}>
      <div className="modal-content app-scrollbar-small" ref={domRef}>
        <Loading show={loading} style={{ height: '226px' }}>
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
  .ant-table-thead {
    th {
      padding-left: 12px !important;
      padding-right: 12px !important;
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
    padding-top: 12px;
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

const SpanStyle = styled.span`
  color: #025cdc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// export const CaliberNotes = styled.span`
//   .top {
//     position: relative;
//     z-index: 1;
//   }
//   .icon {
//     position: absolute;
//     top: 8px;
//     right: 0;
//     width: 14px;
//     height: 14px;
//     background: url(${attention});
//   }
// `;
