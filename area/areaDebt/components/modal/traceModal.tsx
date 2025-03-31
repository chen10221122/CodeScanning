import { FC, ReactElement, memo, useMemo, useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useMemoizedFn, useSize } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import cn from 'classnames';
import styled from 'styled-components';

import { Loading } from '@/components';
import { Empty, Modal, Table } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { TblEl, useCtx } from '@/pages/area/areaDebt/getContext';
import closeSvg from '@/pages/area/areaDebt/images/close.svg';
import openSvg from '@/pages/area/areaDebt/images/open.svg';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';
type PropsType = {
  close: () => void;
  year: string | undefined;
  handleUpdateModalOpen: (record: any, realIndicName: string, o: string) => void;
};
const LinkStyles = { color: '#025cdc', textDecoration: 'underline' };
const TranceModal: FC<PropsType> = ({ close, year, handleUpdateModalOpen }) => {
  const domRef = useRef<any>();
  const {
    state: { container, traceModalInfo },
  } = useCtx();

  const history = useHistory();

  const loading = useMemo(() => {
    return traceModalInfo?.loading;
  }, [traceModalInfo]);

  const isEmpty = useMemo(() => {
    return !loading && !(traceModalInfo?.traceData?.length > 0);
  }, [loading, traceModalInfo?.traceData?.length]);

  /** 展开行受控keys */
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  /** 弹窗是否固定底部 */
  const [fixbottom, setFixbottom] = useState(false);

  const data = useMemo(() => {
    return traceModalInfo?.data;
  }, [traceModalInfo?.data]);

  const footer = useMemo(() => {
    if (fixbottom) {
      return (
        <FooterStyle>
          <div>说明：{data?.tips}</div>
          <div>{data?.detail}</div>
        </FooterStyle>
      );
    } else return null;
  }, [data?.detail, data?.tips, fixbottom]);

  const visible = useMemo(() => {
    return traceModalInfo?.visible;
  }, [traceModalInfo]);

  const setting = useMemo(
    () => ({
      width: 680,
      fixbottom,
      title: `${traceModalInfo.regionName}_${traceModalInfo.title}`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'trandeModal',
      footer: footer,
      onCancel: () => close(),
      getContainer: () => container,
      destroyOnClose: true,
      zIndex: 1000,
    }),
    [fixbottom, traceModalInfo.regionName, traceModalInfo.title, footer, close, container],
  );

  /** 折叠展开图标 */
  const getFoldIcon = useMemoizedFn((row) => {
    const { children, key } = row;
    return children ? (
      <IconStyle
        className="flod-icon"
        icon={expandedRowKeys.includes(key) ? closeSvg : openSvg}
        onClick={() => {
          setExpandedRowKeys((preState) => {
            if (preState.includes(key)) return preState.filter((item) => item !== key);
            else return [...preState, key];
          });
        }}
      ></IconStyle>
    ) : (
      ''
    );
  });

  /** 自定义展开 */
  const expandable = useMemo(
    () => ({
      expandedRowKeys,
      expandIcon: () => {}, // 去掉默认的展开图标
    }),
    [expandedRowKeys],
  );

  /** 初始化折叠行 */
  useEffect(() => {
    const temp: any[] = [];
    if (data?.data?.length > 0) {
      data.data.forEach((item: any) => {
        if (item?.children) {
          temp.push(item?.key);
        }
      });
      setExpandedRowKeys(temp);
    }
  }, [data?.data]);

  const { height = 0 } = useSize(document.querySelector('.trance-modal') as HTMLElement) || {};

  useEffect(() => {
    if (!loading && height > 310) {
      setFixbottom(true);
    } else setFixbottom(false);
  }, [height, loading]);

  /** 跳转溯源页 */
  const goToTrancePage = useMemoizedFn((guid: string) => {
    if (guid) {
      setTimeout(() => {
        history.push(
          urlJoin(
            dynamicLink(LINK_INFORMATION_TRACE),
            urlQueriesSerialize({
              guId: guid,
            }),
          ),
        );
      }, 100);
    } else return;
  });

  const TblSetting = useMemo(() => {
    return {
      pagination: false,
      dataSource: data?.data || [],
      // className: 'app-table',
      sticky: {
        offsetHeader: 0,
        getContainer: () => domRef.current || window,
      },
      expandable: expandable,
      columns: [
        {
          title: '指标',
          width: 345,
          align: 'left',
          dataIndex: 'indicName',
          className: 'align-left',
          render: (txt, record: any, index: number) => {
            return (
              <span className={cn('name', { title: record.isTitle, 'child-title': record?.ischildTitle })}>
                {record.formula
                  ? `${record.formula}： ${txt}` + (record.indicName ? '' : `${record.unit}`)
                  : txt + (record.indicName ? '' : `${record.unit}`)}
                {record?.children && getFoldIcon(record)}
              </span>
            );
          },
        },
        {
          title: year,
          width: 285,
          align: 'right',
          className: 'align-right',
          dataIndex: 'mValue',
          onCell: (record: any, index: number) => {
            const updateType = record?.updateType;
            const typeList: number[] = [1, 3];
            const showIcon = updateType && typeList.includes(updateType);
            if (updateType) {
              const indicName = record.addName || record.indicName;
              return {
                onClick: () => {
                  updateType
                    ? handleUpdateModalOpen(traceModalInfo, '', indicName)
                    : goToTrancePage(record[record.indicName + '_guId']);
                },
                className: showIcon ? 'first-update' : 'cell-class',
              };
            }
            return {};
          },
          render: (text, record) => {
            const updateType = record?.updateType;
            let result: string | ReactElement = '-';
            if (record.ischildTitle) {
              result = '';
            } else if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              if (record.guid) {
                result = updateType ? (
                  <LinkStyle>{result}</LinkStyle>
                ) : (
                  <Link
                    style={LinkStyles}
                    to={() =>
                      urlJoin(
                        dynamicLink(LINK_INFORMATION_TRACE),
                        urlQueriesSerialize({
                          guId: record.guid,
                        }),
                      )
                    }
                  >
                    {result}
                  </Link>
                );
              }
            }
            return result;
          },
        },
      ] as ColumnsType<TblEl>,
    };
  }, [data?.data, expandable, getFoldIcon, goToTrancePage, handleUpdateModalOpen, traceModalInfo, year]);

  const hasData = useMemo(() => {
    return data?.data?.length > 0;
  }, [data?.data?.length]);

  return (
    <ModalStyle visible={visible} {...setting}>
      <div className="modal-content app-scrollbar-small trance-modal" ref={domRef}>
        <Loading show={loading || (!isEmpty && !hasData)} style={{ height: '226px' }}>
          {hasData ? (
            <>
              <TableStyle {...TblSetting} />
              {!fixbottom ? (
                <div className="tips">
                  <div>说明：{data?.tips}</div>
                  <div>{data?.detail}</div>
                </div>
              ) : null}
            </>
          ) : (
            <Empty type={Empty.NO_DATA} />
          )}
        </Loading>
      </div>
    </ModalStyle>
  );
};

export default memo(TranceModal);

const TableStyle = styled(Table)`
  .ant-table-container {
    border-top: none !important;
  }

  .ant-table-header {
    overflow: visible !important;
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before,
  .ant-table-container:before {
    display: none;
  }

  .ant-table .ant-table-container .ant-table-thead > tr > th {
    position: relative;
    border-top: 1px solid #ebf1fc;
    height: 32px;
    padding-left: 12px !important;
    padding-right: 12px !important;

    span {
      display: inline-block;
      text-align: right;
    }
    .align-left {
      text-align: left !important;
    }
    .align-right {
      text-align: right !important;
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
    height: 32px;
  }

  /* .ant-table-tbody > tr.ant-table-row:nth-of-type(odd) > td {
    background-color: #f9fbff;
  }
  .ant-table-tbody > tr.ant-table-row:nth-of-type(even) > td {
    background-color: #ffffff;
  } */

  table {
    & > thead > tr > th:last-child,
    & > tbody > tr > td:last-child {
      border-right: none;
    }
  }

  .name {
    margin-left: 12px;
    height: 20px;
    font-size: 13px;
    text-align: left;
    color: #141414;
    line-height: 20px;
    text-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
  }
  .title {
    margin-left: 0;
    color: #ff7500;
  }
  .child-title {
    margin-left: 12px;
    color: #ff7500;
  }
  .cell-class {
    background-color: #ffd6d6 !important;
    &:hover {
      background-color: #ffd6d6 !important;
      cursor: pointer;
    }
  }
  .first-update {
    background-color: #ffe9d7 !important;
    &:hover {
      background-color: #ffe9d7 !important;
      cursor: pointer;
    }
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > .cell-class {
    background-color: #ffd6d6 !important;
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > .first-update {
    background-color: #ffe9d7 !important;
  }
`;

const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding-right: 0 !important;
    padding-left: 24px;
    padding-top: 15px;
    padding-bottom: ${(props) => (props.fixbottom ? '0' : '16px')};
  }

  .modal-content {
    max-height: ${(props) => (props.fixbottom ? '321px' : '386px')};
    min-height: 226px;
    overflow-y: auto;
    overflow-y: overlay;
    position: relative;
    padding-right: 24px;
    .tips {
      margin-top: 12px;
      font-size: 12px;
      text-align: left;
      color: #8c8c8c;
      line-height: 18px;
      text-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
    }
  }
  .ant-modal-footer {
    padding: 12px 24px 16px 24px;
    border-top: none;
  }

  .ant-empty {
    margin-top: 60px;
  }
`;
const IconStyle = styled.div<{ icon: any }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 4px;
  background: url(${({ icon }) => icon}) no-repeat center;
`;
const FooterStyle = styled.div`
  height: 54px;
  font-size: 12px;
  text-align: left;
  color: #8c8c8c;
  line-height: 18px;
  text-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
`;
export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
`;
