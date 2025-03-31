import { FC, memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMemoizedFn, useSize } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';

import { Icon } from '@/components';
import { Checkbox, Modal, Table, Spin, Empty } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useTraceInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useTraceSource';
import { tableEl } from '@/pages/area/areaDevelopment/types';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useTableData from './useTableData';

interface PropsType {
  /** 当前点击行的数据信息 */
  detailInfo: any;
  /** 是否显示弹窗 */
  show: boolean;
  /** 关闭弹窗事件 */
  close: () => void;
  /** 弹窗挂载容器 */
  container?: HTMLDivElement;
}

const DetailInfoDialog: FC<PropsType> = ({ detailInfo, show, close, container }) => {
  const [check, setCheck] = useState(true);
  const { traceSource, traceCref, setTraceSource } = useTraceInfo({});

  const info = useMemo(() => {
    return {
      rowData: detailInfo,
    };
  }, [detailInfo]);

  /** 弹窗内的内容高度根据当前浏览器窗口高度减去弹框距离body距离和距离页面底部的距离 */
  const { height: scrollHeight } = useSize(document.querySelector('body')) || {};

  /** 处理当前行的数据信息，将列数据转化成行数据 */
  const { loading, years, handledTableData, setHandledTableData } = useTableData(info);
  const domRef = useRef(null);

  /** 隐藏空行、溯源功能合并 */
  const TitleRight = useMemo(
    () => [
      <div className="modal_title">
        <div className="modalTitle">{detailInfo?.devzName}</div>
        {handledTableData.length ? (
          <div className="filter">
            <CheckboxStyle
              checked={check}
              onChange={(e) => {
                setCheck(e.target.checked);
              }}
            >
              隐藏空行
            </CheckboxStyle>
            {traceCref}
          </div>
        ) : null}
      </div>,
    ],
    [check, traceCref, detailInfo, handledTableData.length],
  );

  /** 弹窗关闭，表格数据置空 */
  const closeModal = useMemoizedFn(() => {
    close();
    setHandledTableData(() => []);
  });

  /** 弹窗挂载节点 */
  const popUpContainer = useMemoizedFn(
    () => container || (document.getElementById('areaDevelop_detailModal_container') as HTMLElement) || document.body,
  );

  /** 弹框配置 */
  const modalSetting = useMemo(
    () => ({
      width: 1000,
      title: TitleRight,
      type: 'stickyBottomModal',
      contentId: 'DetailInfoDialog',
      footer: null,
      onCancel: closeModal,
      getContainer: popUpContainer,
    }),
    [TitleRight, closeModal, popUpContainer],
  );

  /** 表格配置 */
  const tableSetting = useMemo(() => {
    if (handledTableData.length && years.length) {
      let dataSource = handledTableData;
      /** 数据去除空行 */
      if (check) dataSource = handledTableData.filter((o) => !o.isEmpty);

      let result = {
        pagination: false,
        type: 'stickyTable',
        isStatic: false,
        dataSource,
        rowKey: (record: tableEl) => record.devzName,
        className: 'app-table',
        columns: [
          {
            title: '指标',
            width: 230,
            align: 'left',
            dataIndex: 'name',
            render: (txt, record) => (
              <span className={`${record.isTitle ? 'title' : ''}`}>
                {txt + (record.isTitle ? '' : `${record.unit}`)}
              </span>
            ),
          },
        ] as ColumnsType<tableEl>,
        sticky: {
          offsetHeader: 0,
          getContainer: () => domRef.current || document.body,
        },
      };

      years.forEach((year) => {
        result.columns.push({
          title: year,
          width: 114,
          align: 'right',
          dataIndex: year,
          render: (text, record) => {
            let result: string | ReactElement = '';
            if (text) {
              result = text;
              /* 溯源 */
              if (traceSource && record[year + '_guId']) {
                result = (
                  <Link
                    style={{ color: '#025cdc', textDecoration: 'underline' }}
                    to={() =>
                      urlJoin(
                        dynamicLink(LINK_INFORMATION_TRACE),
                        urlQueriesSerialize({
                          guId: record[year + '_guId'],
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
        });
      });
      return result;
    }
  }, [handledTableData, years, check, traceSource]);

  /** 空数据状态样式 */
  const emptyStatusStyle = useMemo(() => {
    return { marginTop: 83, marginLeft: 415, top: 'unset', left: 'unset' };
  }, []);

  useEffect(() => {
    setCheck(true);
    setTraceSource(false);
  }, [detailInfo, setCheck, setTraceSource]);

  return (
    <ModalStyle visible={show} {...modalSetting} scrollHeight={scrollHeight! - 150} ref={domRef}>
      <div className="modal-inner app-scrollbar-small" ref={domRef}>
        {loading ? (
          <Spin type="fullThunder" />
        ) : handledTableData?.length ? (
          <TableStyle {...tableSetting} />
        ) : (
          <Empty type={Empty.NO_RELATED_DATA} style={emptyStatusStyle} />
        )}
      </div>
    </ModalStyle>
  );
};

export default memo(DetailInfoDialog);

const TableStyle = styled(Table)`
  .ant-table-container {
    border-top: none;
    //border-left: none;

    .ant-table-thead {
      th {
        text-align: right !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
        border-top: 1px solid #ebf1fc;
      }
      th:first-child {
        text-align: left !important;
      }
    }
  }

  .ant-table-tbody {
    tr td:last-of-type {
      border-right: none;
      //border-left: 1px solid #ebf1fc!important;
    }
  }
`;

const CheckboxStyle = styled(Checkbox)`
  font-size: 13px;
  color: #434343;
  font-weight: 400;

  .ant-checkbox-input,
  .ant-checkbox-inner {
    transform: scale(${12 / 16});
    transform-origin: center center;
  }

  .ant-checkbox {
    &:after {
      display: none;
    }

    & + span {
      padding-left: 2px;
      padding-right: 24px;
    }
  }
`;

const ModalStyle = styled(Modal)`
  .modalTitle {
    height: 27px;
    font-size: 18px;
    font-weight: 500;
    color: #141414;
    line-height: 27px;
  }
  .filter {
    display: flex;
    font-size: 12px;
    /* color: red; */

    > div:last-child {
      display: inline-flex !important;
      align-items: center !important;
      margin-right: 10px !important;
    }

    label {
      line-height: 18px;
    }

    > div {
      display: inline-block;
    }
  }
  .title {
    color: #ff9347;
    text-shadow: 0 2px 9px 2px rgba(0, 0, 0, 0.09);
  }
  .traceabilityBtn {
    width: 12px;
    height: 12px;
    margin: -2px 2px 0 0;
    cursor: pointer;
  }
  .traceability {
    font-size: 13px;
    font-weight: 400;
    color: #595959;
    cursor: pointer;
  }
  .ant-modal-body {
    padding-right: 0 !important;
    padding-top: 12px;

    .modal-inner {
      max-height: ${(prop) => (prop?.scrollHeight ? `${prop.scrollHeight}px` : '200px')};
      margin-right: 6px;
      padding-right: 26px;
      overflow-y: auto;
      overflow-y: overlay;
    }
  }
`;

export const IconStyle = styled(Icon)`
  margin-right: 2px;
  transform: scale(${12 / 13});
`;

export const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;
