import { ReactElement, useMemo, useRef, useState, useEffect, memo, FC } from 'react';
import { useHistory } from 'react-router-dom';

import { Table } from '@dzh/components';
import { useMemoizedFn, useSize } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { Loading } from '@/components';
import { Modal } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { InfoType } from '@/pages/area/areaF9/context';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  visible: boolean;
  /** 弹窗信息 */
  info: InfoType;
  onClose: () => void;
  container: any;
  run: any;
  tableData: any;
  loading: boolean;
  error: any;
}
const CalculateIndicModal: FC<Props> = ({ visible, info, onClose, container, run, tableData, loading, error }) => {
  const domRef = useRef<any>();
  const history = useHistory();

  /** 弹窗是否固定底部 */
  const [fixbottom, setFixbottom] = useState(false);

  useEffect(() => {
    const { regionCode } = info;
    if (regionCode) {
      run({ regionCode, aggType: 2 });
    }
  }, [info, run]);

  const footer = useMemo(() => {
    if (fixbottom) {
      return (
        <FooterStyle>
          <div>说明：城区常住人口=城区人口+城区暂住人口</div>
        </FooterStyle>
      );
    } else return null;
  }, [fixbottom]);

  const setting = useMemo(
    () => ({
      width: 680,
      fixbottom,
      title: info.title,
      type: 'titleWidthBgAndMaskScroll',
      footer: footer,
      onCancel: () => onClose(),
      getContainer: () => container,
      destroyOnClose: true,
      zIndex: 1000,
    }),
    [fixbottom, info.title, footer, onClose, container],
  );

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
      dataSource: tableData || [],
      // className: 'app-table',
      sticky: {
        offsetHeader: 0,
        getContainer: () => domRef.current || window,
      },
      columns: [
        {
          title: '指标',
          width: 345,
          align: 'left',
          dataIndex: 'indicName',
          className: 'align-left',
          render: (txt: any, record: any, index: number) => {
            return <span className={cn('name', { title: index === 0 })}>{txt}</span>;
          },
        },
        {
          title: info.year,
          width: 285,
          align: 'right',
          dataIndex: 'mValue',
          className: 'align-right',
          render: (text: any, record: any) => {
            let result: string | ReactElement = '-';
            if (text && formatNumber(text) !== '0.00') {
              result = formatNumber(text);
              if (record.guid) {
                result = <TranceStyle onClick={() => goToTrancePage(record?.guid)}>{result}</TranceStyle>;
              }
            }
            return result;
          },
        },
      ],
    };
  }, [tableData, info.year, goToTrancePage]);

  return (
    <ModalStyle visible={visible} {...setting}>
      <div className="modal-content app-scrollbar-small trance-modal" ref={domRef}>
        {/* {!loading && error ? (
          <Empty type={Empty.NO_DATA_NEW_IMG} />
        ) : ( */}
        <Loading show={loading} className="modal-loading">
          <>
            {/* @ts-ignore */}
            <TableStyle {...TblSetting} />
            {!fixbottom ? (
              <div className="tips">
                <div>说明：城区常住人口=城区人口+城区暂住人口</div>
              </div>
            ) : null}
          </>
        </Loading>
        {/* )} */}
      </div>
    </ModalStyle>
  );
};
export default memo(CalculateIndicModal);
const ModalStyle = styled((props) => <Modal {...props} />)`
  .ant-modal-body {
    padding-right: 0 !important;
    padding-left: 24px;
    padding-top: 15px;
    padding-bottom: ${(props) => (props.fixbottom ? '0' : '16px')} !important;
  }

  .modal-content {
    max-height: ${(props) => (props.fixbottom ? '321px' : '386px')};
    min-height: 118px;
    /* min-height: 226px; */
    /* height: 152px; */
    overflow-y: auto;
    position: relative;
    padding-right: 14px;
    scrollbar-gutter: stable;
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
    padding: 12px 24px 16px 24px !important;
    border-top: none !important;
  }

  .ant-empty {
    margin-top: 60px;
  }
  .modal-loading {
    height: 152px;
  }
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
  }
  .ant-table .ant-table-container .ant-table-thead > tr {
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

  table {
    & > thead > tr > th:last-child,
    & > tbody > tr > td:last-child {
      border-right: none;
    }
  }

  .name {
    margin-left: 12px;
    /* height: 20px; */
    font-size: 12px;
    text-align: left;
    color: #141414;
    /* line-height: 20px; */
    text-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09);
  }
  .title {
    margin-left: 0;
    color: #ff7500;
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > .cell-class {
    background-color: #ffd6d6 !important;
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > .first-update {
    background-color: #ffe9d7 !important;
  }
`;

const TranceStyle = styled.div`
  color: #025cdc;
  cursor: pointer;
  text-decoration: underline;
`;
