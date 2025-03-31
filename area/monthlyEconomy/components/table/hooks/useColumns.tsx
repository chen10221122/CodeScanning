import { ReactElement, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Popover } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import { isFunction, isUndefined } from 'lodash';
import styled from 'styled-components';

// import attention from '@/assets/images/area/attention.svg';
import { Icon } from '@/components';
import { LINK_AREA_F9, LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { useTrackMenuClick } from '@/libs/eventTrack';
import { CaliberNotes } from '@/pages/area/areaF9/style';
import { ScrollSetting, tblDataItem, TblEl, useCtx } from '@/pages/area/monthlyEconomy/getContext';
import { formatNumber } from '@/utils/format';
import { useImmer } from '@/utils/hooks';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { pageSize, PropType } from '../index';

const Columns = ({
  tableData,
  hiddenEmptyCols,
  handleOpenModal,
  openDataSource,
}: Omit<PropType, 'setTableLoading'>) => {
  const {
    update,
    state: { condition, indicatorInfo, openSource, current, sortData },
  } = useCtx();
  const conditionRef = useRef(condition);
  const [tblScrollSetting, setTblScrollSetting] = useImmer<ScrollSetting>({});
  const { trackMenuClick } = useTrackMenuClick();
  const onCellClick = useMemoizedFn((record, column) => {
    trackMenuClick(null, {
      tabName: '月度季度经济大全',
      url: window.location.href,
      colName: column.colName || column.title,
      rowName: record.regionName,
      sheetName: '月度季度经济数据大全',
      event: 'cellClick',
      sheetStatus: {
        /**溯源 */
        trace: openSource ? 'on' : 'off',
        /**更新提示 */
        updateTip: 'off',
      },
    });
  });
  const tblColumn = useMemo(() => {
    let condition = conditionRef.current;
    let keyword = condition.keyword;
    let columns: ColumnsType<TblEl> = [
      {
        title: '序号',
        width: Math.max(String((current - 1) * pageSize).length * 16, 50),
        fixed: 'left',
        className: 'idx pdd-8',
        align: 'center',
        render: (txt, record, index) => (current - 1) * pageSize + index + 1,
      },
      {
        title: '地区',
        width: 115,
        dataIndex: 'regionName',
        key: 'regionName',
        fixed: 'left',
        align: 'left',
        //@ts-ignore
        resizable: { max: 449 },
        render: (txt, record, index) => {
          if (!txt) return txt;
          /** 前10条搜索结果不飘红 */
          const hightLightFlag = index > 9;
          let result = keyword && hightLightFlag ? txt.replace(new RegExp(keyword, 'g'), `<i>${keyword}</i>`) : txt;

          return (
            <Link
              style={{ color: '#025cdc' }}
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
          );
        },
      },
      {
        title: '明细',
        width: 63,
        fixed: 'left',
        align: 'center',
        //@ts-ignore
        resizable: { max: 449 },
        render: (text, record, index) => {
          return (
            <span
              className="detail-span"
              onClick={(e) => {
                e.preventDefault();
                update((o) => {
                  o.infoDetail = record;
                });
              }}
            >
              <Icon image={require('@/pages/area/areaDebt/components/table/icon_zq_jgcc.svg')} size={13} />
            </span>
          );
        },
      },
    ];

    if (condition && condition.indicName && indicatorInfo.length) {
      /** 我的指标 */
      let resultIndicName: string[] = [];
      if (hiddenEmptyCols) {
        /**获取当前页数据 */
        // const currentPageData = cloneDeep(tableData).slice((current - 1) * pageSize, current * pageSize);
        condition.indicName.forEach((indicNameStr: string) => {
          /**过滤空列 */
          let noEmpty = false;
          tableData.forEach((item) => {
            if (item.indicatorList.some((el) => el.indicName === indicNameStr)) {
              noEmpty = true;
            }
          });
          noEmpty && resultIndicName.push(indicNameStr);
        });
      } else {
        resultIndicName = condition.indicName;
      }
      resultIndicName.forEach((d: string, idx: number) => {
        const currentIndicator = indicatorInfo.find((el) => el.value === d);
        // 表格标题(/** 指标名映射：地区生产总值增速:同比 GDP增速 */)
        let realIndicName = d;
        /**表格表头名称 */
        const tbTitle = currentIndicator?.title as string;
        const indicatorUnit = currentIndicator?.secondTitleUnit;
        let rol: {
          defaultSortOrder?: undefined | 'ascend' | 'descend';
          [a: string]: any;
        } = {
          sortOrder: sortData.field === currentIndicator?.value && sortData.order,
          title: () => (
            <span title={`${tbTitle}(${indicatorUnit})`}>
              {`${tbTitle}(${indicatorUnit})`}
              <a
                href="##"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  update((d) => {
                    d.indicator = realIndicName;
                    d.indicatorUnit = indicatorUnit;
                    d.realIndicator = tbTitle;
                  });
                }}
              >
                <Icon symbol={'icontiaoxingtu'} />
              </a>
            </span>
          ),
          colName: `${tbTitle}`,
          dataIndex: currentIndicator?.value,
          key: tbTitle,
          width: 150,
          align: 'right',
          wrapLine: true,
          //@ts-ignore
          resizable: { max: 3000 },
          /** 单元格背景色 */
          onCell: (record: any, index: number) => {
            let update = false;
            let showIcon = false;
            const typeList: string[] = ['1', '3'];
            let data: any[] = [];
            record.indicatorList.forEach((item: any) => {
              if (item.indicName === realIndicName) {
                const updateObj = item.updateValue;
                if (updateObj) {
                  update = true;
                  if (updateObj.updateType && typeList.includes(updateObj.updateType)) {
                    showIcon = true;
                  }
                  if (!(record[realIndicName + '_guId'] || record[realIndicName + '_posId']) && updateObj.child) {
                    data = updateObj.child;
                  }
                }
              }
            });
            let result: Record<string, any> = {};
            /** 单元格背景色添加过滤条件 */
            if (update && (record[realIndicName] || record[realIndicName] === 0)) {
              const detail = record.indicatorList.find((el: any) => el.indicName === realIndicName);
              result = {
                onClick: () => {
                  handleOpenModal(
                    {
                      title: `${record?.regionName}_${tbTitle}(${indicatorUnit})`,
                      regionCode: record?.regionCode4 || '',
                      indicName: tbTitle,
                      indicName2: realIndicName,
                      unit: `(${indicatorUnit})`,
                      year: record?.endDate || record?.year?.[0] || '',
                      projectCode: detail?.projCode,
                      regionName: record?.regionName,
                      rate: detail?.timeSort,
                    },
                    data,
                  );
                },
                className: showIcon ? 'first-update' : 'cell-class',
              };
            }
            return result;
          },
          render: (text: any, record: any, index: number) => {
            let result: string | ReactElement = '-';
            if (text !== null && text !== undefined && text !== '') {
              //fix bug6240,数据为0也要展示
              result = formatNumber(text);
              let update = false;
              record.indicatorList.forEach((item: any) => {
                if (item.indicName === realIndicName) {
                  if (item.updateValue) {
                    update = true;
                  }
                }
              });
              /** 溯源 */
              if (openSource && (record[realIndicName + '_guId'] || record[realIndicName + '_posId'])) {
                result = update ? (
                  <LinkStyle>{result}</LinkStyle>
                ) : record[realIndicName + '_posId'] ? (
                  <LinkStyle
                    data-prevent // 必须
                    onClick={() => openDataSource && openDataSource({ posIDs: record[realIndicName + '_posId'] })}
                  >
                    {result}
                  </LinkStyle>
                ) : (
                  <Link
                    style={{ color: '#025cdc', textDecoration: 'underline' }}
                    to={() =>
                      urlJoin(
                        dynamicLink(LINK_INFORMATION_TRACE),
                        urlQueriesSerialize({
                          guId: record[realIndicName + '_guId'],
                        }),
                      )
                    }
                  >
                    {result}
                  </Link>
                );
              }
            }
            // 单元格口径注释逻辑
            let caliberDesc = record[realIndicName + '_caliberDesc'] || '';
            return caliberDesc ? (
              <CaliberNotes>
                <div className="top">{result}</div>
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
              <span>{result}</span>
            );
            // return <span>{result}</span>;
          },
          sorter: true,
        };
        columns.push(rol);
      });

      const xWidth = columns.reduce((w, col) => {
        const width = parseInt(col.width as string);
        if (width) {
          w += width;
        }
        return w;
      }, 0);
      setTblScrollSetting((o: ScrollSetting) => {
        o.x = xWidth;
      });
      return [...columns, ...[{ title: '', width: '' }]];
    }
  }, [
    current,
    update,
    setTblScrollSetting,
    sortData.field,
    sortData.order,
    handleOpenModal,
    openSource,
    indicatorInfo,
    tableData,
    hiddenEmptyCols,
    openDataSource,
  ]);

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
      if (condition) {
        let newTblData = tblData.map((item) => {
          const obj = item?.indicatorList?.reduce((res, d: any) => {
            const indicName = d.indicName;
            const currentIndicator = indicatorInfo.find((el) => el.value === indicName);
            const columData = currentIndicator?.value as string;
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
                'GDP:工业_caliberDesc': d.caliberDesc || '',
                工业增加值_caliberDesc: d.caliberDesc || '',
              };
            } else {
              data = {
                [columData]: Number(d.mValue) ?? '',
                [`${columData}_guId`]: d.guid || '',
                [`${columData}_posId`]: d.posId || '',
                [`${columData}_caliberDesc`]: d.caliberDesc || '',
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
    [update, indicatorInfo],
  );

  return { tblScrollSetting, trackCellClickColumns, handleTblData };
};
export default Columns;

export const LinkStyle = styled.div`
  color: #025cdc;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
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
