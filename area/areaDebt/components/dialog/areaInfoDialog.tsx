import { FC, memo, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Popover, Table } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import styled from 'styled-components';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { Loading } from '@/components';
import { Checkbox, Modal, Empty } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSource';
import ExportDoc from '@/components/exportDoc';
import { getIndicatorResData } from '@/components/transferSelectNew/modules/customModal/utils';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import useUpdateTip, { inModalInitparams } from '@/pages/area/areaDebt/components/updateTip';
import { flatData } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/areaDebt/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/areaDebt/components/updateTip/modal';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { TblEl, useCtx } from '@/pages/area/areaDebt/getContext';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import useTableData from './useTableData';

type PropsType = {
  show: boolean;
  close: () => void;
  pageCode?: string;
  hideUpdateTip?: boolean;
  moduleType?: 'web_area_economy_area_info' | 'web_area_economy_area_info_new';
  openDataSource?: OpenDataSourceDrawer;
};

const LinkStyles = { color: '#025cdc', textDecoration: 'underline' };

const AreaInfoDialog: FC<PropsType> = ({
  show,
  close,
  pageCode = 'regionalEconomyAll',
  hideUpdateTip = true,
  moduleType = 'web_area_economy_area_info',
  openDataSource,
}) => {
  const {
    state: { infoDetail, condition, container, openSource: listOpenSource },
  } = useCtx();
  const [check, setCheck] = useState(true);

  const {
    UpdateTipCref,
    // UpdateTipScreenCref,
    openUpdate,
    traceSource,
    traceCref,
    handleTipSwitch,
    setTraceSource,
    // inModalUpdateTipLoading,
    inModalUpdateTipInfo,
    getInModalUpdateTipInfo,
    handleTblCell,
  } = useUpdateTip({ defaultSource: listOpenSource, isLastMonth: pageCode !== 'regionalEconomyAll', missVCA: true });
  // 新增可自定义指标后需给导出配置user
  const { info: userInfo } = useSelector((state: any) => state.user);
  const getUserFromReduxState = useMemoizedFn(() => userInfo?.basic_info?.user);
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  useEffect(() => {
    if (condition?.indicName && infoDetail?.regionCode4) {
      getInModalUpdateTipInfo({
        ...inModalInitparams,
        days: openUpdate.days,
        regionCode: infoDetail?.regionCode4,
        indicName: condition?.indicName?.join(','),
        pageCode,
      });
    }
  }, [condition?.indicName, pageCode, openUpdate.days, infoDetail?.regionCode4, getInModalUpdateTipInfo]);

  const info = useMemo(() => {
    let copyCondition = { ...condition };
    delete copyCondition.regionName;
    delete copyCondition.indexSort;
    return {
      rowData: infoDetail,
      condition: copyCondition,
    };
  }, [infoDetail, condition]);

  const { loading, tblData, years } = useTableData(info);
  /** 明细弹窗导出参数 */
  const exportCondition = useMemo(() => {
    return {
      /**纯选自定义指标，可能存在indexName为空，不要默认值 */
      indicName: condition && condition.indicName ? condition.indicName.join(',') : '',
      indexId: condition && condition.indexId ? condition.indexId.join(',') : '',
      regionCode: infoDetail?.regionCode4,
      endDate: '(*,*)',
      sort: 'endDate:desc',
      module_type: moduleType,
      userID: getUserFromReduxState(),
      exportFlag: true,
      isPost: true,
      dealMissData: true,
    };
  }, [infoDetail?.regionCode4, moduleType, condition, getUserFromReduxState]);

  const domRef = useRef(null);

  /** 关闭弹窗时重置溯源/隐藏空行状态 */
  const handleCloseModal = useMemoizedFn(() => {
    setCheck(true);
    setTraceSource(listOpenSource);
    handleTipSwitch(true);
    close();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      title: infoDetail.regionName + ` 区域经济情况`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: null,
      // footer: hideUpdateTip ? null : UpdateTipCref,
      onCancel: handleCloseModal,
      getContainer: () => container,
    }),
    [infoDetail.regionName, handleCloseModal, container],
  );

  const inModalUpdateTipInfoFlat: any[] = useMemo(() => {
    return flatData(inModalUpdateTipInfo, 'year');
  }, [inModalUpdateTipInfo]);

  const TblSetting = useMemo(() => {
    if (tblData.length && years.length) {
      let dataSource = tblData;

      if (check) dataSource = tblData.filter((o) => !o.isEmpty);

      let result = {
        pagination: false,
        type: 'stickyTable',
        isStatic: false,
        dataSource,
        // rowKey: (record: TblEl) => record.name + shortId(),
        // className: 'app-table',
        columns: [
          {
            title: <div style={{ textAlign: 'left' }}>指标</div>,
            width: 230,
            align: 'left',
            dataIndex: 'name',
            className: 'align-left',
            render: (txt, record) => (
              <span className={`${record.isTitle ? 'title' : ''}`}>
                {txt + (record.isTitle ? '' : `${record.unit}`)}
              </span>
            ),
          },
        ] as ColumnsType<TblEl> as any,
        sticky: {
          offsetHeader: 30,
          getContainer: () => domRef.current || document.body,
        },
      };

      const nameList: string[] = ['工业增加值1', '工业增加值2'];
      years.forEach((year) => {
        result.columns.push({
          title: year,
          width: 114,
          align: 'right',
          dataIndex: year,
          onCell: (record: any) => {
            const isUpdateItem = inModalUpdateTipInfoFlat.find(
              (updateItem: any) =>
                Number(updateItem?.year) === year &&
                (updateItem?.indicName === record?.value ||
                  (updateItem?.indicName === '工业增加值' && nameList.includes(record?.value))),
            );
            return !record[year]
              ? {}
              : handleTblCell({
                  isUpdateItem,
                  onClick: () => {
                    openModal(
                      {
                        title: `${year}年_${infoDetail.regionName}_${record?.name}${record?.unit}`,
                        regionCode: infoDetail?.regionCode4 || '',
                        indicName: `${record?.name}`,
                        indicName2: `${record?.value}`,
                        unit: `${record?.unit}`,
                        year: year.toString(),
                        pageCode: 'regionalEconomyAll',
                        regionName: infoDetail.regionName,
                      },
                      specialIndicList.includes(record?.name),
                      !record[year + '_guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
                    );
                  },
                  isMissVCA: record[`${year}_isMissVCA`] === 1,
                  defaultClassName: '',
                });
          },
          render: (text: any, record: any) => {
            if (record.custom) {
              return <span>{getIndicatorResData(text)}</span>;
            }
            let result: string | ReactElement = '';
            const noTraceList: string[] = ['城投平台有息债务', '城投平台有息债务(本级)'];
            if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              const isSpecial = specialIndicList.includes(record.name);
              if (traceSource) {
                if (record[year + '_guId'] || record[year + '_posId']) {
                  const isUpdateItem = inModalUpdateTipInfoFlat.find(
                    (updateItem: any) =>
                      Number(updateItem?.year) === year &&
                      (updateItem?.indicName === record?.value ||
                        (updateItem?.indicName === '工业增加值' && nameList.includes(record?.value))),
                  );
                  result =
                    isUpdateItem && openUpdate.isUpdate ? (
                      <LinkStyle>{result}</LinkStyle>
                    ) : record[year + '_posId'] && openDataSource ? (
                      <LinkStyle
                        style={LinkStyles}
                        onClick={() => openDataSource({ posIDs: record[year + '_posId'], jumpToPdf: true })}
                        data-prevent // 必须
                      >
                        {result}
                      </LinkStyle>
                    ) : (
                      <Link
                        style={LinkStyles}
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
                } else if (isSpecial && !noTraceList.includes(record.name)) {
                  /** 计算指标溯源 */
                  result = (
                    <LinkStyle
                      onClick={() => {
                        openModal(
                          {
                            title: `${year}年_${infoDetail.regionName}_${record?.name}${record?.unit}`,
                            regionCode: infoDetail?.regionCode4 || '',
                            indicName: `${record?.name}`,
                            unit: `${record?.unit}`,
                            year: year.toString(),
                            pageCode: 'regionalEconomyAll',
                            regionName: infoDetail.regionName,
                          },
                          true,
                        );
                      }}
                    >
                      {result}
                    </LinkStyle>
                  );
                }
              }
              return record[year + '_caliberDesc'] ? (
                <CaliberNotes>
                  <div className="top">{result}</div>
                  <Popover
                    placement="bottomLeft"
                    content={record[year + '_caliberDesc']}
                    arrowPointAtCenter
                    overlayStyle={{
                      maxWidth: '208px',
                    }}
                  >
                    <span className="icon"></span>
                  </Popover>
                </CaliberNotes>
              ) : (
                result
              );
            } else if (!record.isTitle === true) {
              return '-';
            }
          },
        });
      });
      return result;
    }
  }, [
    tblData,
    years,
    check,
    infoDetail?.regionCode4,
    openModal,
    infoDetail.regionName,
    traceSource,
    openUpdate.isUpdate,
    inModalUpdateTipInfoFlat,
    handleTblCell,
    openDataSource,
  ]);

  return (
    <ModalStyle visible={show} {...setting}>
      <div className="modal-inner app-scrollbar-small" ref={domRef}>
        <Loading show={loading}>
          <div className="filter">
            <CheckboxStyle
              checked={check}
              onChange={(e) => {
                setCheck(e.target.checked);
              }}
            >
              <span className="text">隐藏空行</span>
            </CheckboxStyle>

            <div className="trace-source">
              {traceCref}
              {/* {UpdateTipScreenCref} */}
            </div>
            <div className="export">
              <ExportDoc
                condition={exportCondition}
                filename={`${infoDetail.regionName}区域经济${dayjs().format('YYYYMMDD')}`}
              />
            </div>
          </div>
          {years?.[0] === 0 ? (
            <Empty type={Empty.NO_DATA_LG} style={{ marginTop: 75 }} />
          ) : (
            <>
              {/* @ts-ignore */}
              <TableStyle {...TblSetting} />
              {hideUpdateTip ? null : UpdateTipCref}
            </>
          )}
        </Loading>
      </div>
      <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current!} openDataSource={openDataSource} />
      {contetHolder}
    </ModalStyle>
  );
};

export default memo(AreaInfoDialog);

const TableStyle = styled(Table)`
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link):hover > td {
    &.cell-class {
      background-color: #ffd6d6 !important;
    }
    &.first-update {
      background-color: #ffe9d7 !important;
    }
  }
  .ant-table-container {
    border-top: none;
    //border-left: none;

    .ant-table-thead {
      th {
        padding-left: 12px !important;
        padding-right: 12px !important;
        border-top: 1px solid #ebf1fc;
      }
      .align-left {
        text-align: left !important;
      }
      .align-right {
        text-align: right !important;
      }
    }
  }

  .ant-table-tbody {
    > tr > td {
      &.cell-class {
        background-color: #ffd6d6 !important;
        cursor: pointer;
        &:hover {
          background-color: #ffd6d6 !important;
        }
      }
      &.first-update {
        background-color: #ffe9d7 !important;
        cursor: pointer;
        &:hover {
          background-color: #ffe9d7 !important;
        }
      }
      &.missVCA {
        background: right center / 14px no-repeat url(${missVCAIcon});
      }
    }
    tr td:last-of-type {
      border-right: none;
      //border-left: 1px solid #ebf1fc!important;
    }
  }
`;

const CheckboxStyle = styled(Checkbox)`
  font-size: 12px;
  color: #595959;

  .ant-checkbox-input,
  .ant-checkbox-inner {
    transform: scale(${12 / 16});
    transform-origin: center center;
  }

  .ant-checkbox {
    &:after {
      display: none;
    }
    top: 0.3em;

    & + span {
      padding-left: 2px;
      padding-right: 24px;
    }
  }
`;

const ModalStyle = styled(Modal)`
  .ant-modal-footer {
    border: none;
    padding: 0 24px 7px 24px;
    .update-bottom-tip {
      padding-top: 7px !important;
    }
  }
  .filter {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    position: sticky;
    top: 0;
    z-index: 99;
    width: 100%;
    padding: 0 0 8px;
    /* height: 26px; */
    line-height: 20px;
    text-align: right;
    font-size: 12px;
    color: #595959;
    background: #fff;

    label {
      line-height: 20px;
    }

    .trace-source {
      display: inline-flex !important;
    }

    > div {
      display: inline-block;
    }
    .text {
      font-size: 13px;
    }
  }

  .title {
    color: #ff7500;
    text-shadow: 0 2px 9px 2px rgba(0, 0, 0, 0.09);
  }

  .ant-modal-body {
    padding: 12px 0 7px 24px;

    .modal-inner {
      overflow: auto !important;
      width: 100% !important;
      height: 393px;
      padding-right: 24px;
      overflow-y: auto;
      overflow-y: overlay;
      .export {
        /* margin-left: 18px; */
      }
    }
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
`;
