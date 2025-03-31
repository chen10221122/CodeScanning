import { FC, memo, ReactElement, useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Table, SpinProps, PaginationType, Popover } from '@dzh/components';
import { useScroll } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import cn from 'classnames';
import { findKey, isEmpty, isFunction, isUndefined } from 'lodash';
import styled from 'styled-components';

import TipDialog from '@pages/area/areaF9/components/header-content/areaReportDown/tipDialog';
import useDownload from '@pages/area/areaF9/components/header-content/areaReportDown/useDownLoad';

import { IndicatorResultType } from '@dataView/provider';

import missVCAIcon from '@/assets/images/area/missVCA.svg';
import { Icon } from '@/components';
import { Button, Tooltip } from '@/components/antd';
import { OpenDataSourceDrawer, IDataSourceDrawerInfoType } from '@/components/dataSource';
import { Flex } from '@/components/layout';
import CustomIndicatorModal from '@/components/transferSelectNew/modules/customModal';
import { getAllCustomIndicators } from '@/components/transferSelectNew/modules/customModal/api';
import TooltipExpressText from '@/components/transferSelectNew/modules/customModal/module/tooltipText';
import { ModalSourceType } from '@/components/transferSelectNew/modules/customModal/type';
import useCustomIndicator from '@/components/transferSelectNew/modules/customModal/useCustomIndicator';
import { getIndicatorResData } from '@/components/transferSelectNew/modules/customModal/utils';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { useTrackMenuClick } from '@/libs/eventTrack';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { getScrollX } from '@/pages/area/areaDebt/config';
import { tblDataItem, TblEl, useCtx } from '@/pages/area/areaDebt/getContext';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import useMemoizedFn from '@/pages/dataView/components/dzhTable/hooks/useMemoizedFn';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { nameValueObj } from '../filter/indicator';
interface IndicObjType {
  indicName: string;
  updateType?: number;
  child?: [
    {
      indicName: string;
      updateType?: number;
    },
  ];
}

export interface UpdateDataItemType {
  regionCode: string;
  indicObj: IndicObjType[];
}

type propType = {
  originTblData: tblDataItem[];
  updateData: UpdateDataItemType[];
  handleOpenModal: (info: any, isCalculateIndic?: boolean, data?: any[]) => void;
  loading: boolean;
  refreshTable: Function;
  total: number;
  openDataSource?: OpenDataSourceDrawer;
  dataSourceInfo?: IDataSourceDrawerInfoType;
};
export const pageSize = 50;
const AREA_DEBT_TABLE = 'area-debt-table';
const AreaTable: FC<propType> = ({
  originTblData,
  updateData,
  handleOpenModal,
  loading = false,
  refreshTable,
  total,
  openDataSource,
  dataSourceInfo,
}) => {
  const {
    update,
    state: {
      condition,
      openSource,
      tblData,
      current,
      container,
      sortName,
      openUpdate,
      sortData,
      scrollLeft,
      indicatorAllAttribute,
      indexSort,
      filterInitYear,
      customallCustomIndicator,
    },
  } = useCtx();
  const { editModal, setEditModal, showEditIndicatorModal, getUserCustomAreaIndicators } = useCustomIndicator();
  const pageRef = useRef(1);
  const { trackMenuClick } = useTrackMenuClick();

  const { onDownClick, noPayDialogVisible, limitDialogVisible, setNoPayDialogVisible, setLimitDialogVisible } =
    useDownload();

  const conditionRef = useRef(condition);
  const isFirstRef = useRef(true);

  const scroll = useScroll(document.querySelector('#area-debt-table .ant-table-body'));
  /** 滚动定位 */
  useEffect(() => {
    const tableEle = document.querySelector('#area-debt-table .ant-table-body');
    if (scrollLeft) {
      tableEle?.scroll({ left: scrollLeft });
    }
  }, [scrollLeft]);
  const onCellClick = useMemoizedFn((record, column, title = '') => {
    const info: Record<string, any> = {
      tabName: '区域经济大全',
      url: window.location.href,
      colName: column.colName || column.title,
      rowName: record.regionName,
      sheetName: '区域经济数据大全',
      event: 'cellClick',
      sheetStatus: {
        /**溯源 */
        trace: openSource ? 'on' : 'off',
        /**更新提示 */
        updateTip: openUpdate ? 'on' : 'off',
      },
      id: record.regionCode4,
      type: 'area',
    };
    // 地区比较特殊 需要加title
    if (column.dataIndex === 'regionName') {
      if (!title) return;
      info.title = title;
    }
    trackMenuClick(null, info);
  });

  const getIsHasTip = (item: any) => {
    if (item.describe) {
      return true;
    } else if (item.isCustom) {
      return item.note || item.expression ? true : false;
    } else {
      return false;
    }
  };
  /** 表格取数据的键，普通指标取title 自定义取indexId */
  const getTableKeyIndex = (item: any) => {
    if (item.isCustom) {
      return item.indexId;
    } else {
      return item.secondTitle || item.title;
    }
  };
  const refreshEditTable = useMemoizedFn(() => {
    getAllCustomIndicators().then(({ data }: any) => {
      if (!isEmpty(data)) {
        update((d) => {
          d.indicatorAllAttribute = d.indicatorAllAttribute?.map((item) => {
            let matchedItem = data.find((ele: any) => ele.indexId === item.indexId);
            if (matchedItem) {
              return {
                ...item,
                /**刷新表头已被使用的内容 */
                decimal: matchedItem.decimal,
                indexName: matchedItem.indexName,
                indexName2: matchedItem.indexName2,
                expression: matchedItem.expression,
                note: matchedItem.note,
                param: matchedItem.param,
                resultType: matchedItem.resultType,
                title: matchedItem.indexName,
              };
            } else {
              return item;
            }
          });
        });
        getUserCustomAreaIndicators();
        refreshTable();
        update((d) => {
          d.customallCustomIndicator = data;
        });
      }
    });
  });

  const [traceInfo, setTraceInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!dataSourceInfo?.visible) {
      setTraceInfo({});
    }
  }, [dataSourceInfo?.visible]);

  const tblColumn = useMemo(() => {
    // let condition = conditionRef.current;
    let keyword = condition.keyword;
    let columns: ColumnsType<TblEl> = [
      {
        title: '序号',
        width: Math.max(String((current - 1) * pageSize).length * 16, 50),
        fixed: 'left',
        align: 'center',
        className: 'idx pdd-8',
        render: (txt, record, index) => (current - 1) * pageSize + index + 1,
      },
      {
        title: '地区',
        width: 240,
        dataIndex: 'regionName',
        key: 'regionName',
        fixed: 'left',
        align: 'left',
        //@ts-ignore
        resizable: { max: 860, min: 260 },
        coverCell: true,
        render: (txt, record, index) => {
          if (!txt) return txt;
          /** 前10条搜索结果不飘红 */
          const hightLightFlag = index > 9;
          let result = keyword && hightLightFlag ? txt.replace(new RegExp(keyword, 'g'), `<i>${keyword}</i>`) : txt;
          return (
            <div className="area-col">
              <Link
                style={{ color: '#025cdc' }}
                title={result}
                onClickCapture={() =>
                  onCellClick(record, { title: '地区', dataIndex: 'regionName', key: 'regionName' }, txt)
                }
                to={() =>
                  urlJoin(
                    dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: record.regionCode4 }),
                    urlQueriesSerialize({
                      code: record.regionCode4,
                    }),
                  )
                }
                dangerouslySetInnerHTML={{ __html: result }}
              ></Link>
              <Flex align="center" style={{ minWidth: 100 }}>
                <div
                  onClick={() => {
                    onCellClick(record, { title: '地区', dataIndex: 'regionName', key: 'regionName' }, '报告');
                    onDownClick(record.regionCode4, record.downFileId);
                  }}
                  className="area-report-down"
                >
                  <Icon size={12} symbol="iconicon_pdf_normal2x" />
                  <span className="fuc-text">报告</span>
                </div>
                <div className="split-line" />
                <ButtonStyle
                  type="link"
                  onClick={(e) => {
                    onCellClick(record, { title: '地区', dataIndex: 'regionName', key: 'regionName' }, '明细');
                    e.preventDefault();
                    update((o) => {
                      o.infoDetail = record;
                    });
                  }}
                >
                  <Icon image={require('@/pages/area/areaDebt/components/table/icon_zq_jgcc.svg')} size={13} />
                  <span className="fuc-text">明细</span>
                </ButtonStyle>
              </Flex>
            </div>
          );
        },
      },
    ];
    if (condition && indicatorAllAttribute) {
      indicatorAllAttribute.forEach((item: any, idx: number) => {
        // 表格标题(/** 指标名映射：地区生产总值增速:同比 GDP增速 */)
        let realIndicName = item.value || item.title;
        let o = getTableKeyIndex(item);
        const unitRes = item.secondTitleUnit || '';
        const isEnd = idx === indicatorAllAttribute.length - 1;
        const isCustom = item.isCustom;
        const templateType = item.templateType;
        let rol: {
          defaultSortOrder?: undefined | 'ascend' | 'descend';
          [a: string]: any;
        } = {
          sortOrder: sortData?.columnKey === o && sortData?.order,
          title: () => (
            <div
              title={isCustom ? item.title : o + unitRes}
              style={{
                WebkitLineClamp: 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
              }}
            >
              {/* 自定义指标编辑 */}
              {isCustom && templateType !== 'defaultTemplate' ? (
                <>
                  <span
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      showEditIndicatorModal(e, item);
                    }}
                  >
                    <Icon
                      image={require('@/pages/area/areaDebt/components/table/icon_edit.svg')}
                      size={12}
                      className="edit-icon"
                    />
                  </span>
                </>
              ) : null}
              {isCustom ? item.title : o}
              {unitRes}
              {getIsHasTip(item) ? (
                <Tooltip
                  color="#fff"
                  arrowPointAtCenter
                  placement={isEnd ? 'bottomRight' : 'bottom'}
                  overlayStyle={{
                    width: '300px',
                    maxWidth: '300px',
                    maxHeight: '80px',
                    height: '80px',
                  }}
                  title={() => <TooltipExpressText item={item}></TooltipExpressText>}
                >
                  <span>
                    <Icon
                      image={require('@/pages/area/areaDebt/components/table/icon_why.svg')}
                      size={12}
                      className="why-icon"
                    />
                  </span>
                </Tooltip>
              ) : null}
              <a
                href="##"
                className={cn('tiaoxintu-a', {
                  'tiaoxintu-a-disabled': item.resultType === IndicatorResultType.String,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  if (item.resultType === IndicatorResultType.String) {
                    return false;
                  } else {
                    update((d) => {
                      d.indicator = o;
                      d.realIndicator = realIndicName;
                      d.customIndicator = isCustom ? item : undefined;
                    });
                  }
                }}
              >
                {item.resultType === IndicatorResultType.String ? (
                  <Icon
                    image={require('@/pages/area/areaDebt/images/tiaoxintu_disabled.svg')}
                    size={12}
                    className="tiaoxintu-icon"
                  />
                ) : (
                  <Icon
                    image={require('@/pages/area/areaDebt/images/tiaoxintu.svg')}
                    size={12}
                    className="tiaoxintu-icon"
                  />
                )}
              </a>
            </div>
          ),
          colName: `${o}${unitRes}`,
          dataIndex: o,
          key: o,
          width: 144,
          align: 'right',
          isCustom,
          resizable: { max: 10000 },
          /** 单元格背景色 */
          onCell: (record: any, index: number) => {
            let update = false;
            let showIcon = false;
            const typeList: number[] = [1, 3];
            let data: any[] = [];
            const isSpecial = specialIndicList.includes(o);
            const nameList: string[] = ['工业增加值1', '工业增加值2'];
            updateData?.forEach((item: UpdateDataItemType) => {
              if (item) {
                if (item.regionCode === record.regionCode4) {
                  item.indicObj?.forEach((obj) => {
                    if (
                      obj.indicName === realIndicName ||
                      (obj.indicName === '工业增加值' && nameList.includes(realIndicName))
                    ) {
                      update = true;
                      /** 类型为2的是更新数据*/
                      if (!isCustom && obj?.updateType && typeList.includes(obj?.updateType)) {
                        showIcon = true;
                      }
                      if (!record[o + '_guId'] && obj?.child) {
                        data = obj?.child;
                      }
                    }
                  });
                }
              }
            });

            let result: Record<string, any> = {};

            /** 单元格背景色添加过滤条件 */
            if (!isCustom && openUpdate && update && (record[o] || record[o] === 0)) {
              result = {
                onClick: () => {
                  handleOpenModal(
                    {
                      title: `${record?.regionName}_${o}${unitRes}`,
                      regionCode: record?.regionCode4 || '',
                      indicName: o,
                      indicName2: realIndicName,
                      unit: `${unitRes}`,
                      year: record?.endDate || record?.year?.[0] || '',
                      pageCode: 'regionalEconomyAll',
                      regionName: record?.regionName,
                    },
                    isSpecial,
                    data,
                  );
                },
                className: showIcon ? 'first-update' : 'cell-class',
              };
            }

            // 单元格添加缺值计算提示
            if (record[`${o}_isMissVCA`] === 1) result.className = `${result.className || ''} missVCA`;

            return result;
          },
          render: (text: any, record: any, index: number) => {
            let result: string | ReactElement = '-';
            const nameList: string[] = ['工业增加值1', '工业增加值2'];
            if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              const isSpecial = specialIndicList.includes(o);

              /** 不溯源 */
              const noTraceList: string[] = ['城投平台有息债务', '城投平台有息债务(本级)'];
              /** 计算指标存在基础数据缺失的 */
              // if (record[o + '_isMissVCA'] === 1) {
              //   result = <LinkStyle onClick={() => handleOpenModal(record, o)}>{result}</LinkStyle>;
              // } else {
              let update = false;
              updateData?.forEach((item: UpdateDataItemType) => {
                if (item) {
                  if (item.regionCode === record.regionCode4) {
                    item.indicObj?.forEach((obj) => {
                      if (
                        obj.indicName === realIndicName ||
                        (obj.indicName === '工业增加值' && nameList.includes(realIndicName))
                      ) {
                        update = true;
                      }
                    });
                  }
                }
              });
              if (isCustom) {
                /**自定义指标不支持溯源*/
                result = <span>{getIndicatorResData(text)}</span>;
              }
              /** 溯源 */
              if (openSource && !isCustom) {
                if (record[o + '_posId'] || record[o + '_guId']) {
                  result =
                    openUpdate && update ? (
                      <LinkStyle>{result}</LinkStyle>
                    ) : record[o + '_posId'] && openDataSource ? (
                      <>
                        {traceInfo.posId === record[o + '_posId'] && traceInfo.value === formatNumber(text) ? (
                          <Bg />
                        ) : null}
                        <LinkStyle
                          style={{ color: '#025cdc', textDecoration: 'underline', position: 'relative' }}
                          onClick={() => {
                            openDataSource({
                              posIDs: record[o + '_posId'],
                              isPdfCallback: () => {
                                setTraceInfo({
                                  posId: record[o + '_posId'],
                                  value: formatNumber(text),
                                });
                              },
                            });
                          }}
                          data-prevent
                        >
                          {result}
                        </LinkStyle>
                      </>
                    ) : (
                      <Link
                        style={{ color: '#025cdc', textDecoration: 'underline' }}
                        to={() =>
                          urlJoin(
                            dynamicLink(LINK_INFORMATION_TRACE),
                            urlQueriesSerialize({
                              guId: record[o + '_guId'],
                            }),
                          )
                        }
                      >
                        {result}
                      </Link>
                    );
                } else if (isSpecial && !noTraceList.includes(o)) {
                  /** 计算指标溯源 */
                  result = (
                    <LinkStyle
                      onClick={() => {
                        handleOpenModal(
                          {
                            title: `${record?.regionName}_${o}_${unitRes}`,
                            regionCode: record?.regionCode4 || '',
                            indicName: o,
                            indicName2: realIndicName,
                            unit: `${unitRes}`,
                            year: record?.endDate || record?.year?.[0] || '',
                            pageCode: 'regionalEconomyAll',
                            regionName: record?.regionName,
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
            }
            return record[o + '_caliberDesc'] ? (
              <CaliberNotes>
                <div className="top">{result}</div>
                <Popover
                  placement="bottomLeft"
                  content={record[o + '_caliberDesc']}
                  arrowPointAtCenter={true}
                  overlayStyle={{
                    maxWidth: '208px',
                  }}
                >
                  <span className="icon"></span>
                </Popover>
              </CaliberNotes>
            ) : (
              <div className="text-content">{result}</div>
            );
          },
          sorter: true,
          ellipsis: false,
        };

        // if (d === '地区生产总值') rol.defaultSortOrder = 'descend';
        // @ts-ignore
        columns.push(rol);
      });

      columns.push({ title: '', dataIndex: 'blank' }); //插入空白列
      return columns;
    }
  }, [
    current,
    onCellClick,
    onDownClick,
    update,
    sortData?.columnKey,
    sortData?.order,
    updateData,
    openUpdate,
    handleOpenModal,
    openSource,
    indicatorAllAttribute,
    condition,
    showEditIndicatorModal,
    openDataSource,
    traceInfo,
  ]);
  const scrollX = useMemo(() => {
    return tblColumn ? getScrollX(tblColumn) : 'max-content';
  }, [tblColumn]);

  // 单元格点击埋点
  const trackCellClickColumns = useMemo(() => {
    return tblColumn?.map((column: any) => {
      if (!isUndefined(column.onCell) && isFunction(column.onCell)) {
        return {
          ...column,
          onCell: (record: TblEl, index: number) => {
            const returnProps = column.onCell(record, index) || {};
            return {
              ...returnProps,
              // 这里是捕获阶段，因为要在跳转之前获取页面的状态
              onClickCapture: (e: any) => {
                onCellClick(record, column);
                if (column.onCell && returnProps.onClickCapture) {
                  returnProps.onClickCapture.apply(column.onCell, e);
                }
              },
            };
          },
        };
      }
      return {
        ...column,
        onCell: (record: any) => {
          return {
            onClickCapture: () => onCellClick(record, column),
          };
        },
      };
    });
  }, [onCellClick, tblColumn]);

  const handleTblData = useCallback(
    (tblData: tblDataItem[]) => {
      let condition = conditionRef.current;
      // let areaCodeObj = { ...areaCodeRelation };
      if (condition) {
        // handleTblHead();
        let newTblData = tblData.map((item) => {
          const obj = item?.indicatorList?.reduce((res, d: any) => {
            const indicName = d.indicName;
            const indicatorIndexId = d.indexId;
            let data = {};
            // GDP:工业 和 工业增加值 的接口入参分别是工业增加值1、工业增加值2， 但取值为“工业增加值”，
            // 此处是对这两个数据取值逻辑的处理
            if (indicName === '工业增加值') {
              data = {
                'GDP:工业': Number(d.mValue) ?? '',
                工业增加值: Number(d.mValue) ?? '',
                'GDP:工业_guId': d.guid || '',
                工业增加值_guId: d.guid || '',
                'GDP:工业_posId': d.posId || '',
                工业增加值_posId: d.posId || '',
                'GDP:工业_isMissVCA': d.isMissVCA || '',
                工业增加值_isMissVCA: d.isMissVCA || '',
                'GDP:工业_caliberDesc': d.caliberDesc || '',
                工业增加值_caliberDesc: d.caliberDesc || '',
              };
            } else if (d.custom) {
              data = {
                [indicatorIndexId]: d.mValue ? d.mValue : null,
              };
            } else {
              data = {
                [nameValueObj[indicName]]: Number(d.mValue) ?? '',
                [`${nameValueObj[indicName]}_guId`]: d.guid || '',
                [`${nameValueObj[indicName]}_posId`]: d.posId || '',
                [`${nameValueObj[indicName]}_isMissVCA`]: d.isMissVCA || '',
                [`${nameValueObj[indicName]}_caliberDesc`]: d.caliberDesc || '',
              };
            }
            return {
              ...res,
              ...data,
            };
          }, {});

          return { ...item, ...obj, year: condition?.endDate };
        });
        const shortNameObj: { [a: string]: string } = {
          '150000': '内蒙古',
          '640000': '宁夏',
          '540000': '西藏',
          '650000': '新疆',
          '450000': '广西',
        };

        newTblData.forEach((o) => {
          if (shortNameObj[o.regionCode4]) o.regionName = shortNameObj[o.regionCode4];
        });
        update((o) => {
          o.tblData = newTblData;
        });
      }
    },
    [update],
  );

  const onPageChange = useMemoizedFn((page, isScroll = false) => {
    if (pageRef.current !== page) {
      update((o) => {
        if (scroll?.left) {
          o.scrollLeft = scroll?.left;
        }
      });
    }
    pageRef.current = page;
    update((o) => {
      o.current = page; //tipdata 也用了condition，所以current不能放在condition里面
    });

    // container?.scroll({ top: TITLE_HEIGHT });
    container?.scroll({ top: 0 });
  });

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    if (sorter) {
      update((d) => {
        /**sort 和indexSort互斥清理 */
        const { column } = sorter;
        d.sortData = sorter;
        if (column && column.isCustom) {
          let sortStr = sorter.order === 'descend' ? ':desc' : ':asc';
          d.sortName = '';
          d.indexSort = `${sorter.columnKey}${sortStr}`;
        } else if (column && !column.isCustom && sorter?.order) {
          let sortStr = sorter.order === 'descend' ? ':desc' : ':asc';
          d.sortName = findKey(nameValueObj, (o) => o === sorter.columnKey) + sortStr;
          d.indexSort = '';
        } else {
          d.sortName = '';
          d.indexSort = '';
        }
        if (scroll?.left) {
          d.scrollLeft = scroll?.left;
        }
      });
    }
  });
  useEffect(() => {
    /**给自定义指标加排序刷新 */
    if (isFirstRef.current) {
      if (indexSort || sortName || condition.regionCode || condition.endDate) isFirstRef.current = false;
      return;
    }
    onPageChange(1);
  }, [sortName, onPageChange, condition.regionCode, condition.endDate, indexSort]);

  useEffect(() => {
    if (originTblData.length) handleTblData(originTblData);
  }, [originTblData, handleTblData]);

  useEffect(() => {
    conditionRef.current = condition;
  }, [condition]);

  const onSelectChange = useMemoizedFn((_, selectedRows) => {
    update((draft) => {
      draft.selectedRowKeys = selectedRows?.map((o: any) => o.regionCode4);
    });
  });

  const tableLoadingIndicator: SpinProps = useMemo(
    () => ({ spinning: loading, translucent: true, type: 'square' }),
    [loading],
  );
  return (
    <>
      <CustomIndicatorModal
        modal={editModal}
        setModal={setEditModal}
        allCustomIndicator={customallCustomIndicator || []}
        refreshCustom={refreshEditTable}
        modalTitle="自定义指标管理"
        sourceType={ModalSourceType.topic}
        initYear={filterInitYear}
        trackType="customIndex-areaF9"
      ></CustomIndicatorModal>
      <TableStyle
        id={AREA_DEBT_TABLE}
        pagination={{
          current,
          total,
          type: PaginationType.DONT_SHOW_LAST,
          pageSize: 50,
          hideOnSinglePage: true,
          onChange: (page: number) => onPageChange(page, true),
        }}
        sticky={{
          offsetHeader: 40,
          getContainer: () => container || document.body,
        }}
        rowKey={(record: TblEl) => {
          return record ? record?.regionCode4 : record;
        }}
        rowSelection={{
          columnWidth: 28,
          onChange: onSelectChange,
        }}
        dataSource={tblData}
        columns={trackCellClickColumns}
        scroll={{ x: scrollX }}
        showSorterTooltip={false}
        onChange={handleChange}
        onlyBodyLoading={true}
        loading={tableLoadingIndicator}
      />
      <TipDialog
        noPayDialogVisible={noPayDialogVisible}
        limitDialogVisible={limitDialogVisible}
        setNoPayDialogVisible={setNoPayDialogVisible}
        setLimitDialogVisible={setLimitDialogVisible}
      />
    </>
  );
};

export default memo(AreaTable);
export const TooltipText = styled.div`
  color: #434343;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
`;
const TableStyle = styled(Table)`
  .ant-table-container {
    &:after {
      display: none;
    }
  }
  .why-icon {
    margin-left: 4px;
    vertical-align: -2px;
  }
  .edit-icon {
    margin-right: 4px;
    vertical-align: -1px;
  }
  .tiaoxintu-a {
    cursor: pointer;
    &-disabled {
      cursor: not-allowed;
    }
    .tiaoxintu-icon {
      margin-left: 4px;
      vertical-align: -1px;
    }
  }
  .area-col {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pk-img {
      width: 22px;
      height: 13px;
      cursor: pointer;
    }
    .area-report-down {
      cursor: pointer;
      &:hover {
        span {
          color: #0171f6 !important;
        }
      }
    }
    .fuc-text {
      font-size: 12px;
      color: #262626;
      line-height: 18px;
      margin-left: 3px;
    }
    .split-line {
      margin: 0px 8px;
      width: 1px;
      height: 16px;
      border-width: 0.5px;
      border-style: solid;
      border-color: initial;
      border-image: linear-gradient(
          rgba(239, 239, 239, 0),
          rgba(239, 239, 239, 0.6) 12%,
          rgb(239, 239, 239) 49%,
          rgba(239, 239, 239, 0.6) 89%,
          rgba(239, 239, 239, 0)
        )
        1 / 1 / 0 stretch;
    }
  }

  td.idx {
    white-space: nowrap;
    padding-left: 0;
    padding-right: 0;
  }

  td a i {
    font-style: normal;
    color: rgba(254, 58, 47, 1);
  }

  th {
    /* background-color: #f8faff !important; */
  }

  ul.ant-pagination {
    padding-bottom: 0;
  }

  .ant-table-body {
    /* .ant-table-cell:not(.ant-table-cell-fix-left) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .dzh-table-cell-nowrap {
        white-space: nowrap !important;
      }
    } */
    .text-content {
      white-space: nowrap;
      text-overflow: clip;
      overflow: hidden;
    }
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
  .ant-table-column-sorters {
    align-items: center;
    .ant-table-column-title {
      flex: 1;
      max-width: calc(100% - 10px);
    }
    svg {
      margin-left: 4px;
    }
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link) > .cell-class {
    background-color: #ffd6d6 !important;
  }
  .ant-table-container .ant-table-tbody > tr.ant-table-row:not(.focus-link) > .first-update {
    background-color: #ffe9d7 !important;
  }

  /* .ant-table-container前缀会导致hover时斑马色深色行的单元格背景被覆盖 */
  .ant-table-tbody > tr.ant-table-row > .missVCA {
    line-height: 20px;
    background: right center / 14px no-repeat url(${missVCAIcon});
  }

  .ant-checkbox-inner {
    width: 12px;
    height: 12px;
    z-index: 12;
    transform: translateY(-2px);
  }

  .ant-checkbox-checked {
    &::after {
      border: none;
    }
    .ant-checkbox-inner::after {
      scale: calc(${13 / 16});
      translate: -0.5px -1px;
    }
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner {
    &:after {
      width: 6px;
      height: 6px;
    }
  }

  .ant-table-container table > thead > tr:first-child th:first-child,
  .ant-table-tbody > tr > td:first-child {
    border-right: none !important;
    padding-right: 0px !important;
  }
`;

export const ButtonStyle = styled(Button)`
  padding: 0;
  line-height: 13px;
  height: 18px;
  i {
    vertical-align: -2px !important;
  }
  &:hover {
    span {
      color: #0171f6 !important;
    }
  }
`;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
`;

const Bg = styled.div`
  position: absolute;
  background: rgb(204, 238, 255);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
