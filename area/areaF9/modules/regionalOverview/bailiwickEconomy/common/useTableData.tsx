import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep, findKey } from 'lodash';
import shortid from 'shortid';
import styled from 'styled-components';

import { useAreaJumpLimit } from '@pages/area/areaF9/hooks';

import { getTblData } from '@/apis/area/areaDebt';
import { Icon } from '@/components';
import { Tooltip } from '@/components/antd';
import { OpenDataSourceDrawer } from '@/components/dataSource';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { nameValueObj, unitObj } from '@/pages/area/areaDebt/components/filter/indicator';
import { ButtonStyle, TooltipText } from '@/pages/area/areaDebt/components/table';
import { inModalInitparams } from '@/pages/area/areaDebt/components/updateTip';
import { flatData } from '@/pages/area/areaDebt/components/updateTip/formatData';
import useUpdateData from '@/pages/area/areaDebt/components/updateTip/hooks/useUpdateInfoData';
import { specialIndicList } from '@/pages/area/areaDebt/components/updateTip/specialConf';
import { ScrollSetting, tblDataItem, TblEl } from '@/pages/area/areaDebt/getContext';
import { useSelector } from '@/pages/area/areaF9/context';
import { pagesize } from '@/pages/bond/cityInvestMap/content';
import { formatNumber } from '@/utils/format';
import { useRequest } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { useCtx } from '../context';

interface TIDM {
  [key: string]: number;
}
const IDM: TIDM = {
  最大值: 0,
  最小值: 1,
  平均值: 2,
};

interface Props {
  /** 要查询的所有地区code */
  allRegionCode: string;
  /** 固定行的地区code,不传就没有固定行 */
  mainRegionCode?: string;
  handleTblCell?: Function;
  openModal: Function;
  openUpdate: any;
  pageCode?: string;
  openDataSource?: OpenDataSourceDrawer;
}

export default function useTableInfo({
  allRegionCode,
  mainRegionCode,
  handleTblCell,
  openModal,
  openUpdate,
  pageCode = 'areaF9DistrictEconomy',
  openDataSource,
}: Props) {
  const {
    state: { openSource, condition, requestParams, current, tblData, container, reloadData },
    update,
  } = useCtx();
  const { tipData, getTipData } = useUpdateData();

  const [fixedRow, setFixedRow] = useState<Record<string, any>[]>([]); // 固定行
  const [tableData, setTableData] = useState<TblEl[]>([]); // 表格数据
  const [tblScroll, setTblScroll] = useState<ScrollSetting>({});
  const [fixedRowIndex, setFixedRowIndex] = useState(0);
  const [sortInfo, setSortInfo] = useState<{ [a: string]: any }>({
    columnKey: '地区生产总值',
    order: 'descend',
  });

  const { handleLimit } = useAreaJumpLimit();
  const history = useHistory();

  const setLoading = useMemoizedFn((flag) => {
    update((draft) => {
      draft.tableLoading = flag;
    });
  });

  /* 有固定行时，要找到固定行的序号 */
  useEffect(() => {
    if (mainRegionCode) {
      const { columnKey, order } = sortInfo;
      if (columnKey && order) {
        let sourceData = cloneDeep(tblData);
        sourceData.sort((a, b) => {
          let notNumberA = typeof a[columnKey] !== 'number',
            notNumberB = typeof b[columnKey] !== 'number';
          if (notNumberA && notNumberB) return 0;

          // 这样可以确保排序空数据在后面
          if (notNumberA) return 1;
          else if (notNumberB) return -1;
          return order === 'descend' ? b[columnKey] - a[columnKey] : a[columnKey] - b[columnKey];
        });
        setFixedRowIndex(sourceData.findIndex((item) => item.regionCode4 === mainRegionCode));
      } else setFixedRowIndex(tblData.findIndex((item) => item.regionCode4 === mainRegionCode));
    }
  }, [mainRegionCode, sortInfo, tblData]);

  const { run } = useRequest(getTblData, {
    manual: true,
    formatResult: (res) => {
      update((o) => {
        o.total = res.data?.total || 0;
      });
      return res?.data?.data;
    },
    onSuccess: (info: tblDataItem[]) => {
      setLoading(false);
      update((o) => {
        o.tableError = undefined;
      });
      if (condition) {
        let statisticsRow: TblEl[] = []; // 要加在表格前面的统计值行
        let newTblData: TblEl[] = info.map((item) => {
          const obj = item?.indicatorList?.reduce((res, d: any) => {
            const indicName = d.indicName;
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
              };
            } else {
              data = {
                [nameValueObj[indicName]]: Number(d.mValue) ?? '',
                [`${nameValueObj[indicName]}_guId`]: d.guid || '',
                [`${nameValueObj[indicName]}_posId`]: d.posId || '',
                [`${nameValueObj[indicName]}_isMissVCA`]: d.isMissVCA || '',
              };
            }
            return {
              ...res,
              ...data,
            };
          }, {});
          /* 根据mainRegionCode找到对应对的固定行 */
          if (mainRegionCode) {
            if (item.regionCode4 === mainRegionCode) {
              const fixedRow = { ...item, ...obj, year: condition?.endDate, isFixdRow: true };
              setFixedRow([fixedRow]);
            }
          }
          /** 统计值固定行 */
          if (mainRegionCode) {
            if (['最大值', '最小值', '平均值'].includes(item.regionName)) {
              statisticsRow[IDM[item.regionName]] = { ...item, ...obj, year: condition?.endDate, isStatistics: true };
            }
          }

          return { ...item, ...obj, year: condition?.endDate };
        });
        /* 有固定行的计算统计值 */
        if (statisticsRow.length) {
          const _statisticsRow = cloneDeep(statisticsRow);
          statisticsRow = [
            { regionName: '最大值', isStatistics: true },
            { regionName: '最小值', isStatistics: true },
            { regionName: '平均值', isStatistics: true },
          ];
          _statisticsRow.forEach((cur) => {
            const keys = Object.keys(cur);
            keys.forEach((item) => {
              /* 统计值只计算那些有对应guId的，有对应guId的说明是数字 */
              if (!item.includes('_guId') && Object.prototype.hasOwnProperty.call(cur, `${item}_guId`)) {
                statisticsRow[IDM[cur.regionName]][item] = cur[item];
              }
            });
          });
        }
        const shortNameObj: Record<string, string> = {
          '150000': '内蒙古',
          '640000': '宁夏',
          '540000': '西藏',
          '650000': '新疆',
          '450000': '广西',
        };

        /* 区域F9-下辖区域经济 表格非固定行不展示当前地区、统计值，所以过滤掉当前地区固定行、统计值行 */
        if (mainRegionCode) {
          newTblData = newTblData.filter(
            (item) => item.regionCode4 !== mainRegionCode && !['最大值', '最小值', '平均值'].includes(item.regionName),
          );
        }

        newTblData.forEach((o, i) => {
          if (shortNameObj[o.regionCode4]) o.regionName = shortNameObj[o.regionCode4];
        });
        update((o) => {
          o.tblData = newTblData;
        });

        if (mainRegionCode) {
          setTableData([...statisticsRow, ...newTblData]);
        } else {
          setFixedRow([]);
          const hasData = newTblData?.filter((item: any) => item.indicatorList.length > 0)?.length || 0;
          setTableData(hasData ? newTblData : []);
          !hasData &&
            update((o) => {
              o.total = 0;
            });
        }
      }
    },
    onError: (error) => {
      setLoading(false);
      update((o) => {
        o.tableError = error;
      });
    },
  });

  /* 将请求的参数更新到context中 */
  useEffect(() => {
    if (condition?.indicName) {
      update((o) => {
        o.requestParams = {
          ...condition,
          indicName: condition?.indicName?.join(','),
          regionCode: allRegionCode,
          thisRegionCode: mainRegionCode,
        };
      });
    }
  }, [allRegionCode, condition, update, mainRegionCode]);

  useEffect(() => {
    if (condition?.endDate && condition?.indicName && allRegionCode) {
      getTipData({
        ...inModalInitparams,
        endDate: condition.endDate,
        days: 30,
        regionCode: allRegionCode,
        indicName: condition.indicName,
        pageCode,
      });
    }
  }, [condition?.endDate, condition?.indicName, allRegionCode, getTipData, pageCode]);

  useEffect(() => {
    if (condition?.indicName?.[0]) {
      setSortInfo({
        columnKey: nameValueObj[condition.indicName[0]],
        order: 'descend',
      });
    }
  }, [update, condition?.indicName]);

  const originParams = useRef('');

  const getData = useCallback(
    (isClear?: boolean) => {
      if (requestParams?.indicName || requestParams?.indexId) {
        setLoading(true);
        requestParams?.regionCode &&
          run(
            !isClear
              ? { ...requestParams, indexSort: '', indexId: '' }
              : { ...JSON.parse(originParams.current), indexSort: '', indexId: '' },
          );
        if (!originParams.current) {
          originParams.current = JSON.stringify(requestParams);
        }
        isClear &&
          update((o) => {
            o.screenKey = shortid();
          });
      }
    },
    [requestParams, setLoading, run, update],
  );

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    update((draft) => {
      draft.reloadData = () => getData(true);
    });
  }, [getData, update]);

  const jumpArea = useMemoizedFn((code) => {
    handleLimit(code, () => {
      history.push(
        urlJoin(
          dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code }),
          urlQueriesSerialize({
            code,
          }),
        ),
      );
    });
  });

  const inModalUpdateTipInfoFlat: any[] = useMemo(() => {
    return flatData(tipData, 'regionCode');
  }, [tipData]);

  const dataSourceInfo = useSelector((store) => store.dataSourceInfo);

  const [traceInfo, setTraceInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!dataSourceInfo?.visible) {
      setTraceInfo({});
    }
  }, [dataSourceInfo?.visible]);

  const tblColumn = useMemo(() => {
    let columns: ColumnsType<TblEl> = [
      {
        title: '序号',
        width: 42,
        fixed: 'left',
        align: 'center',
        render: (txt, record, index) => {
          if (record?.isStatistics) return null;
          else if (record?.isFixdRow) {
            return fixedRowIndex + 1;
          }
          return (current - 1) * pagesize + index + (mainRegionCode ? -2 : 1);
        },
      },
      {
        title: '地区',
        width: 90,
        dataIndex: 'regionName',
        key: 'regionName',
        fixed: 'left',
        align: 'left',
        render: (txt, record) =>
          !txt || record?.isStatistics ? (
            txt
          ) : (
            // @ts-ignore
            <Link className="link" style={{ color: '#025cdc' }} onClick={() => jumpArea(record.regionCode4)}>
              {txt}
            </Link>
          ),
      },
      {
        title: '明细',
        width: 65,
        fixed: 'left',
        align: 'center',
        render: (text, record, index) =>
          record?.isStatistics ? null : (
            <ButtonStyle
              type="link"
              onClick={(e) => {
                e.preventDefault();
                update((o) => {
                  o.infoDetail = record;
                });
              }}
            >
              <Icon image={require('@/pages/area/areaDebt/components/table/icon_zq_jgcc.svg')} size={13} />
            </ButtonStyle>
          ),
      },
    ];
    if (condition?.indicName) {
      condition.indicName.forEach((d: string, idx: number) => {
        let realIndicName = d;
        // 表格标题
        let o = nameValueObj[d];
        const decribe = nameValueObj[`${o}_describe`];
        const isEnd = idx === condition.indicName.length - 1;
        const nameList: string[] = ['工业增加值1', '工业增加值2'];

        let rol: {
          defaultSortOrder?: undefined | 'ascend' | 'descend';
          [a: string]: any;
        } = {
          sortOrder: sortInfo.columnKey === o && sortInfo.order,
          title: () => (
            <>
              {o}
              {unitObj[o]}
              {decribe ? (
                <Tooltip
                  color="#fff"
                  arrowPointAtCenter
                  getPopupContainer={() => container ?? document.body}
                  placement={isEnd ? 'bottomRight' : 'bottom'}
                  overlayStyle={{ maxWidth: '410px' }}
                  title={() => <TooltipText>{decribe}</TooltipText>}
                >
                  <span>
                    <Icon
                      image={require('@/pages/area/areaDebt/components/table/icon_why.svg')}
                      size={12}
                      style={{ marginLeft: '4px', marginBottom: '2px' }}
                    />
                  </span>
                </Tooltip>
              ) : null}
              <a
                href="##"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  update((d) => {
                    d.indicator = o;
                    d.realIndicator = realIndicName;
                  });
                }}
              >
                <Icon style={{ marginLeft: '4px' }} symbol={'icontiaoxingtu'} />
              </a>
            </>
          ),
          dataIndex: o,
          key: o,
          width: 144,
          align: 'right',
          wrapLine: true,
          onCell: (record: any) => {
            const isUpdateItem = inModalUpdateTipInfoFlat.find(
              (updateItem: any) =>
                updateItem?.regionCode === record?.regionCode4 &&
                (updateItem?.indicName === realIndicName ||
                  (updateItem?.indicName === '工业增加值' && nameList.includes(realIndicName))),
            );
            return !handleTblCell || !record?.[o]
              ? {}
              : handleTblCell({
                  isUpdateItem,
                  onClick: () => {
                    openModal(
                      {
                        title: `${record?.regionName}_${o}${unitObj[o]}`,
                        regionCode: record?.regionCode4 || '',
                        indicName: o,
                        indicName2: realIndicName,
                        unit: `${unitObj[o]}`,
                        year: record?.endDate || record?.year?.[0] || '',
                        pageCode: 'f9AreaCompare',
                        regionName: record?.regionName,
                      },
                      specialIndicList.includes(o),
                      !record[o + '_guId'] && isUpdateItem?.child ? isUpdateItem.child : [],
                    );
                  },
                  isMissVCA: record[`${o}_isMissVCA`] === 1,
                  defaultClassName: '',
                });
          },
          render: (text: any, record: any) => {
            let result: string | ReactElement = '-';
            const noTraceList: string[] = ['城投平台有息债务', '城投平台有息债务(本级)'];
            if (text !== null && text !== undefined && text !== '') {
              const isSpecial = specialIndicList.includes(o);
              result = formatNumber(text);
              if (openSource) {
                if (record[o + '_guId'] || record[o + '_posId']) {
                  const isUpdateItem = inModalUpdateTipInfoFlat.find(
                    (updateItem: any) =>
                      updateItem?.regionCode === record?.regionCode4 &&
                      (updateItem?.indicName === realIndicName ||
                        (updateItem?.indicName === '工业增加值' && nameList.includes(realIndicName))),
                  );
                  result =
                    isUpdateItem && openUpdate?.isUpdate ? (
                      <LinkStyle>{result}</LinkStyle>
                    ) : record[o + '_posId'] && openDataSource ? (
                      <>
                        {traceInfo.posId === record[o + '_posId'] && traceInfo.value === formatNumber(text) ? (
                          <Bg />
                        ) : null}
                        <span
                          style={{
                            color: '#025cdc',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                          data-prevent // 必须
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
                        >
                          {result}
                        </span>
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
                  result = (
                    <LinkStyle
                      onClick={() => {
                        openModal(
                          {
                            title: `${record?.regionName}_${o}${unitObj[o]}`,
                            regionCode: record?.regionCode4 || '',
                            indicName: o,
                            indicName2: realIndicName,
                            unit: `${unitObj[o]}`,
                            year: record?.endDate || record?.year?.[0] || '',
                            pageCode: 'f9AreaCompare',
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
              } else {
                return result;
              }
            }
            return result;
          },
          sorter: (a: any, b: any, c: string) => {
            let notNumberA = typeof a[o] !== 'number',
              notNumberB = typeof b[o] !== 'number';
            if ((notNumberA && notNumberB) || a.isStatistics || b.isStatistics) return 0;

            if (notNumberA) return c === 'descend' ? -1 : 1;
            else if (notNumberB) return c === 'descend' ? 1 : -1;

            return a[o] - b[o];
          },
        };

        columns.push(rol);
      });

      let x = 0;
      columns.forEach((o) => {
        if (typeof o.width === 'number') x += o.width;
      });

      setTblScroll({ x });
      return columns;
    }
    return [];
  }, [
    jumpArea,
    condition.indicName,
    current,
    mainRegionCode,
    fixedRowIndex,
    update,
    sortInfo.columnKey,
    sortInfo.order,
    container,
    openSource,
    handleTblCell,
    inModalUpdateTipInfoFlat,
    openModal,
    openUpdate?.isUpdate,
    openDataSource,
    traceInfo,
  ]);

  useEffect(() => {
    update((d) => {
      const { columnKey, order } = sortInfo;
      if (order) {
        let sortStr = order === 'descend' ? ':desc' : ':asc';
        d.sortName = findKey(nameValueObj, (o) => o === columnKey) + sortStr;
      } else d.sortName = '';
    });
  }, [sortInfo, update]);

  const handleChange = useMemoizedFn((pagination, filters, sorter) => {
    setSortInfo(sorter);
  });

  return {
    tblColumn,
    tblScroll,
    tableData,
    fixedRow,
    handleChange,
    pagination: null,
    reloadData,
  };
}

const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
`;

const Bg = styled.div`
  position: absolute;
  background: rgb(204, 238, 255);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
