import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { useHistory } from 'react-router-dom';

import { Table, Popover } from '@dzh/components';
import { useMemoizedFn, useDebounce, useCreation } from 'ahooks';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

// import attention from '@/assets/images/area/attention.svg';
import { Empty, Spin, Modal } from '@/components/antd';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import * as S from '@/pages/area/areaF9/style';
import useUpdateTip from '@/pages/area/monthlyEconomy/components/updateTip';
import { getIndicAndUnit } from '@/pages/area/monthlyEconomy/components/updateTip/formatData';
import useUpdateModalInfo from '@/pages/area/monthlyEconomy/components/updateTip/hooks/useModalBaseInfo';
import UpdateModal from '@/pages/area/monthlyEconomy/components/updateTip/modal';
import { specialIndicList } from '@/pages/area/monthlyEconomy/components/updateTip/specialConf';
import { useCtx } from '@/pages/area/monthlyEconomy/getContext';
import { formatNumber } from '@/utils/format';
import useWindowSize from '@/utils/hooks/useWindowSize';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import Header from './header';
import useListData from './useListData';

/**
 * code snippets from
 *
 * `src/pages/area/areaF9/modules/regionalOverview/regionalEconomy/index.js`
 */

export const currentYear = new Date().getFullYear().toString();

const AreaIndicatorDetails = ({
  show,
  close,
  pageCode = 'regionalEconomyAll',
  moduleType = 'web_area_economy_area_info',
  openDataSource,
}) => {
  const {
    state: { infoDetail, condition, container, openSource: listOpenSource },
  } = useCtx();
  const domRef = useRef();
  const [activeTab] = useState(2);
  const [quarterFlag, setQuarterFlag] = useState(false);
  const history = useHistory();
  const { width } = useWindowSize();

  /** 隐藏空行 */
  const [hiddenChecked, setHiddenChecked] = useState(true);
  /** 隐藏空列 */
  const [hiddenEmptyCols, setHiddenEmptyCols] = useState(true);
  /**地区代码 */
  const code = useMemo(() => infoDetail.regionCode4, [infoDetail]);
  const {
    pending: loading,
    tableData,
    handleChangeData,
    traceType,
    hasData,
  } = useListData({ hiddenChecked, hiddenEmptyCols, code, indicName: condition.indicName?.join(), quarterFlag });
  const { openUpdate, traceSource, traceCref, UpdateTipCref, setTraceSource, handleTblCell } = useUpdateTip({
    defaultSource: listOpenSource,
    isLastMonth: true,
  });
  /** 更新提示弹窗 */
  const { modalInfo, openModal, closeModal, contetHolder } = useUpdateModalInfo();

  /** 关闭弹窗时重置溯源/隐藏空行状态 */
  const handleCloseModal = useMemoizedFn(() => {
    setHiddenEmptyCols(true);
    setHiddenChecked(true);
    setTraceSource(listOpenSource);
    close();
  });

  const setting = useMemo(
    () => ({
      width: 860,
      title: infoDetail.regionName + `_区域经济情况`,
      type: 'titleWidthBgAndMaskScroll',
      contentId: 'AreaInoDialog',
      footer: loading || !hasData ? null : UpdateTipCref,
      onCancel: handleCloseModal,
      getContainer: () => container,
    }),
    [infoDetail.regionName, loading, hasData, UpdateTipCref, handleCloseModal, container],
  );

  // 无数据时不显示滚动条
  useEffect(() => {
    const wrap = document.getElementById('tabsWrapper');
    if (wrap) {
      wrap.style.overflowY = !hasData ? 'hidden' : '';
    }
    return () => {
      if (wrap) wrap.style.overflowY = '';
    };
  }, [hasData]);

  /**只看季度 */
  const handleOnlyQ = useMemoizedFn((e) => {
    setQuarterFlag(e.target.checked);
  });

  /** 隐藏空行 */
  const handleChangeHidden = useMemoizedFn(() => {
    setHiddenChecked((base) => !base);
  });

  /** 隐藏空列 */
  const handleChangeColsHidden = useMemoizedFn(() => {
    setHiddenEmptyCols((base) => !base);
  });

  const finalColumns = useCreation(() => {
    const cloneInitColumn = [
      {
        title: '指标',
        align: 'left',
        fixed: true,
        width: 284,
        resizable: { min: 284, max: 780 },
        className: 'padding-left24 align-left',
        dataIndex: 'paramName',
        render: (text, row) => {
          const dataobj = cloneDeep(row.paramDetailArr) || {};
          /** 不展示预期目标列数据 */
          if (Object.keys(dataobj).includes(currentYear)) {
            delete dataobj[currentYear];
          }
          if (row.specialTitle) {
            return <span className="orange-title">{row.specialTitle}</span>;
          }
          return <span>{text}</span>;
        },
      },
    ];

    tableData?.colKey?.forEach((o, i) => {
      const [_y, _d] = o.split('-');
      cloneInitColumn.push({
        title: `${_y}年${Number(_d)}月`,
        width: 119,
        align: 'right',
        dataIndex: o,
        onCell: (record) => {
          const isUpdateItem = record?.paramDetailArr?.[o]?.updateValue;
          return !record?.[o]
            ? {}
            : handleTblCell({
                isUpdateItem,
                onClick: () => {
                  const { indicName: unUnitName, unit } = getIndicAndUnit(record?.paramName);
                  let tab2Info = record?.[o + 'indicCode'].split('-');
                  openModal(
                    {
                      title: `${_y}年${_d}月_${infoDetail?.regionName}_${record?.paramName}`,
                      regionCode: code || '',
                      indicName: unUnitName,
                      indicName2: `${isUpdateItem?.indicName}`,
                      unit,
                      year: `${_y}${_d}`,
                      regionName: infoDetail?.regionName,
                      projectCode: tab2Info[0],
                      rate: tab2Info[1],
                    },
                    specialIndicList.includes(unUnitName) && activeTab !== 2,
                    !record[o + 'guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
                  );
                },
                defaultClassName: i !== tableData?.colKey?.length - 1 ? 'padding-10 align-right' : 'align-right',
              });
        },
        render: (text, row) => {
          if (row.specialTitle) return null;
          const noTraceList = ['城投平台有息债务', '城投平台有息债务(本级)'];
          const isUpdateItem = row?.paramDetailArr?.[o]?.updateValue;
          const caliberDesc = row?.paramDetailArr?.[o]?.caliberDesc;
          const { indicName: unUnitName, unit } = getIndicAndUnit(row?.paramName);
          const isSpecial = specialIndicList.includes(unUnitName);
          const res = formatNumber(text);
          // 口径注释添加
          let processedText;
          if (caliberDesc) {
            processedText = (
              <CaliberNotes>
                <div className="top">{text}</div>
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
            );
          } else {
            processedText = text;
          }
          return !res ? (
            <>-</>
          ) : traceSource ? (
            row[o + 'guId'] || row[o + 'posId'] ? (
              isUpdateItem && openUpdate.isUpdate ? (
                <span className="trace-link-span">{processedText || '-'}</span>
              ) : row[o + 'posId'] ? (
                <span
                  className="trace-link-span"
                  data-prevent // 必须
                  onClick={() => openDataSource && openDataSource({ posIDs: row[o + 'posId'] })}
                >
                  {processedText || '-'}
                </span>
              ) : (
                <span
                  className="trace-link-span"
                  onClick={() => {
                    history.push(
                      urlJoin(LINK_INFORMATION_TRACE, urlQueriesSerialize({ guId: row[tableData.colKey[i] + 'guId'] })),
                    );
                  }}
                >
                  {processedText || '-'}
                </span>
              )
            ) : isSpecial && !noTraceList.includes(unUnitName) ? (
              <span
                className="trace-link-span"
                onClick={() => {
                  openModal(
                    {
                      title: `${_y}年${_d}月_${infoDetail?.regionName}_${row?.paramName}`,
                      regionCode: code || '',
                      indicName: unUnitName,
                      indicName2: `${isUpdateItem?.indicName}`,
                      unit,
                      year: o,
                      pageCode: 'areaF9PlatformEconomy',
                      regionName: infoDetail?.regionName,
                      activeTab: activeTab,
                    },
                    true,
                  );
                }}
              >
                {processedText || '-'}
              </span>
            ) : (
              <span>{processedText || '-'}</span>
            )
          ) : (
            <span>{processedText || '-'}</span>
          );
        },
      });
    });

    if (
      width >
      213 /** menu width */ +
        40 /** content padding */ +
        cloneInitColumn?.reduce((prev, curr) => prev + curr?.width, 0) /** total width */
    ) {
      cloneInitColumn.push({
        title: '',
        dataIndex: 'blank',
        className: 'no-padding',
      });
    }

    return cloneInitColumn;
  }, [
    history,
    handleTblCell,
    tableData?.colKey,
    traceSource,
    openUpdate.isUpdate,
    code,
    openModal,
    infoDetail?.regionName,
    activeTab,
    width,
  ]);

  const debounceLoading = useDebounce(loading, {
    wait: 1000,
    leading: true,
  });

  useEffect(() => {
    if (debounceLoading) {
      document.querySelector('.modal-inner')?.scrollTo({ top: 0 });
    }
  }, [debounceLoading]);

  // 解决双滚动条处理
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [tableData?.data]);

  return (
    <ModalStyle visible={show} {...setting}>
      <Spin type="square" spinning={debounceLoading}>
        <ContentContainer>
          {/* 去除滚动条变窄的样式，ui要求修改为滚动条滚动到底部大小不变 */}
          <div ref={domRef} className="modal-inner">
            <S.Container>
              <Header
                code={code}
                handleChangeColsHidden={handleChangeColsHidden}
                hiddenEmptyCols={hiddenEmptyCols}
                onChange={handleChangeData}
                checked={traceType}
                hiddenChecked={hiddenChecked}
                onChangeHidden={handleChangeHidden}
                filename={`${infoDetail?.regionName ?? ''}月度季度数据-${dayjs(new Date()).format('YYYYMMDD')}`}
                exportCondition={{
                  areaCode: code,
                  exportFlag: true,
                  statNature: quarterFlag ? '1,3' : '',
                  quarterFlag,
                  indicName: condition.indicName?.join(),
                  module_type: 'web_progress_area_indicators',
                  isPost: 'true',
                  sheetNames: { 0: '月度季度经济' },
                }}
                updateTip={traceCref}
                exportDisabled={!hasData}
                onlyQuarter={{
                  default: false,
                  currentVal: quarterFlag,
                  onChange: handleOnlyQ,
                }}
              />
              <ListWrapper>
                <div className="area-economy-table-wrap">
                  {hasData ? (
                    <>
                      <Table
                        columns={finalColumns}
                        dataSource={tableData?.data}
                        pagination={false}
                        // rowKey={(_, index) => index}
                        sticky={{
                          offsetHeader: 27,
                          getContainer: () => domRef.current || document.body,
                        }}
                        scroll={{
                          x: 'max-content',
                        }}
                      />
                      {/* {UpdateTipCref} */}
                    </>
                  ) : !loading ? (
                    !quarterFlag ? (
                      <Empty type={Empty.NO_DATA_NEW} className="module-empty" />
                    ) : (
                      <Empty
                        type={Empty.NO_SCREEN_DATA_CLEAR}
                        onClick={() => setQuarterFlag(false)}
                        className="module-empty"
                      />
                    )
                  ) : null}
                </div>
                <UpdateModal {...modalInfo} onClose={closeModal} container={domRef.current} />
                {contetHolder}
              </ListWrapper>
            </S.Container>
          </div>
        </ContentContainer>
      </Spin>
    </ModalStyle>
  );
};

export default memo(AreaIndicatorDetails);

const ModalStyle = styled(Modal)`
  .ant-modal-footer {
    border: none;
    padding: 0 24px 12px 24px;
    .update-bottom-tip {
      padding-top: 0px !important;
    }
  }
  .ant-modal-body {
    padding: 12px 0 0 24px;
    .modal-inner {
      overflow: scroll !important;
      width: 100% !important;
      height: 393px;
      padding-right: 12px;
      overflow-y: auto;
      overflow-y: overlay;
      > div {
        padding-bottom: 0;
      }
    }
    .ant-spin-blur {
      opacity: 0;
    }
  }
`;
const ListWrapper = styled.div`
  overflow: visible;

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
  }

  .module-empty {
    margin-top: 10% !important;
  }

  .no-padding {
    padding: 0 !important;
    min-width: 0;
  }
`;

const ContentContainer = styled.div`
  .module-empty {
    margin-top: 4px;
    margin-bottom: 28px;
  }

  .title-item-container {
    padding: 0;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    background: white;
    top: 0;
    z-index: 9;
    height: 34px;
    .select-right {
      font-size: 12px;
      font-weight: 400;
      color: #434343;
    }
  }

  .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none;
  }

  .custom-area-economy-screen-wrap {
    margin-bottom: 8px;
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
