import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Tooltip as OriginalTooltip } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import cn from 'classnames';
import styled from 'styled-components';

import { HOLD_RATIO } from '@pages/area/landTopic/commonMenu';
import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import Tooltip, { OVERLAY_INNER_STYLE, OVERLAY_STYLE } from '@pages/area/landTopic/components/tooltip';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { Screen } from '@/components/screen';
import { LINK_AREA_F9, LINK_DETAIL_ENTERPRISE, LINK_LAND_PARCEL_DETAIL } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { shortId } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import EnterpriseInfoItem from './enterpriseInfoItem';

interface Props {
  indicator: SelectItem[];
  dataSource?: Record<string, any>[];
  holdRatio?: string;
  setHoldRatio?: (v: string) => void;
  sortKey?: string;
  sortRule?: string;
  keyword?: string;
}

const useIndicatorColumn = ({
  sortKey,
  sortRule,
  keyword,
  dataSource = [],
  indicator,
  holdRatio,
  setHoldRatio,
}: Props) => {
  const history = useHistory();

  const getSortOrder = useCallback(
    (dataIndex) => (dataIndex !== sortKey || !sortRule ? null : `${sortRule}end`) as any,
    [sortKey, sortRule],
  );

  const onCopyClick = useMemoizedFn((key) => {
    const newList: string | any[] = dataSource.map(
      (o: Record<string, any>) => (key === 'enterpriseInfo' ? o[key]?.[0]?.groupTop : o[key]?.[0]?.name) || '',
    );
    navigator.clipboard.writeText(newList.filter((o: string) => o).join('\n'));
    message.success('复制成功');
  });

  const jumpCompany = useMemoizedFn((code) => {
    code &&
      history.push(
        urlJoin(
          dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
          urlQueriesSerialize({ type: 'company', code: code }),
        ),
      );
  });

  /* @ts-ignore */
  const indicatorColumns: ColumnsType<any> = useMemo(() => {
    const getColumnItem = (indicatorItem: SelectItem) => {
      const { dataIndex, description, sorter, tableTitle, unit } = indicatorItem;
      switch (dataIndex) {
        case 'landName':
          return {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Tooltip title={description} />
                  </span>
                ) : null}
              </>
            ),
            width: 280,
            align: 'left',
            sortOrder: sorter ? getSortOrder('landName') : undefined,
            render: (text: string, row: any) => {
              return text ? (
                <div
                  onClick={() =>
                    row.mainCode &&
                    history.push({
                      pathname: dynamicLink(LINK_LAND_PARCEL_DETAIL, { key: row.mainCode }),
                      state: { landName: text, originLink: row?.url || '' },
                    })
                  }
                  className={cn('ellipsis2', { 'link-underline': !!row.mainCode })}
                  title={text}
                >
                  {text ? highlight(`${text}`, keyword) : '-'}
                </div>
              ) : (
                '-'
              );
            },
          };
        case 'partyInfo':
          return {
            ...indicatorItem,
            className: 'multiple-td',
            title: (
              <div style={{ height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {tableTitle}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ marginBottom: '2px' }}
                >
                  <AddBtn onClickWithHasPower={() => onCopyClick('partyInfo')} text={'当事人'} />
                </span>
                {description ? <Tooltip title={description} /> : null}
              </div>
            ),
            width: 280,
            align: 'left',
            sortOrder: sorter ? getSortOrder('partyInfo') : undefined,
            render: (text: any, row: any) => {
              let total = 0;
              text?.forEach(({ enterpriseInfo }: any) => {
                const curLength = enterpriseInfo?.length || 1;
                total += curLength > 3 ? 3 : curLength;
              });
              return (
                text?.map((item: any, i: number) => {
                  let curLength = item.enterpriseInfo?.length || 1;
                  curLength = curLength > 3 ? 3 : curLength;
                  return (
                    <div
                      key={shortId()}
                      onClick={() => jumpCompany(item.code)}
                      className={cn('fake-td', { 'link-underline': !!item.code })}
                      title={item.name}
                      style={{ height: `calc((100% / ${total || 1}) * ${curLength})` }}
                    >
                      <div className="ellipsis">{highlight(`${item.name}`, keyword)}</div>
                    </div>
                  );
                }) || (
                  <div className={'fake-td'} style={{ height: '100%' }}>
                    -
                  </div>
                )
              );
            },
          };
        case 'partyType':
          return {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? <Tooltip title={description} /> : null}
              </>
            ),
            align: 'center',
            className: 'multiple-td',
            sortOrder: sorter ? getSortOrder('partyType') : undefined,
            render: (text: any, row: any) => {
              let total = 0;
              row.partyInfo?.forEach(({ enterpriseInfo }: any) => {
                const curLength = enterpriseInfo?.length || 1;
                total += curLength > 3 ? 3 : curLength;
              });
              return (
                row.partyInfo?.map((item: any, i: number) => {
                  let curLength = item.enterpriseInfo?.length || 1;
                  curLength = curLength > 3 ? 3 : curLength;
                  return (
                    <div
                      key={shortId()}
                      className={'fake-td'}
                      style={{ height: `calc((100% / ${total || 1}) * ${curLength})` }}
                      title={item.partyType}
                    >
                      <div className="ellipsis" style={{ width: '100%', textAlign: 'center' }}>
                        {item.partyType || '-'}
                      </div>
                    </div>
                  );
                }) || (
                  <div className={'fake-td'} style={{ height: '100%' }}>
                    <div style={{ width: '100%', textAlign: 'center' }}>-</div>
                  </div>
                )
              );
            },
          };
        case 'enterpriseInfo':
          return {
            ...indicatorItem,
            title: (
              <div style={{ height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {tableTitle}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ height: '18px', marginBottom: '4px' }}
                >
                  <AddBtn onClickWithHasPower={() => onCopyClick('enterpriseInfo')} text={'关联企业'} />
                  {description ? <Tooltip title={description} /> : null}
                  <Screen
                    options={HOLD_RATIO}
                    values={[[holdRatio || '']]}
                    onChange={(cur) => {
                      setHoldRatio?.(cur[0].value);
                    }}
                  />
                </span>
              </div>
            ),
            width: 380,
            align: 'left',
            className: 'multiple-td',
            sortOrder: sorter ? getSortOrder('enterpriseInfo') : undefined,
            render: (text: any, row: any) => {
              const lists = row.partyInfo;
              let total = 0;
              lists?.forEach(({ enterpriseInfo }: any) => {
                const curLength = enterpriseInfo?.length || 1;
                total += curLength > 3 ? 3 : curLength;
              });
              if (!lists?.length) {
                return (
                  <div className={'fake-td'} style={{ height: '100%' }}>
                    -
                  </div>
                );
              }
              return lists.map((item: any, i: number) => {
                let curLength = item.enterpriseInfo?.length || 1;
                curLength = curLength > 3 ? 3 : curLength;
                return (
                  <div
                    key={shortId()}
                    className={'fake-td'}
                    style={{
                      height: `calc((100% / ${total || 1}) * ${curLength})`,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}
                  >
                    {item.enterpriseInfo?.map((enterpriseInfoItem: any, i: number) => {
                      return i < 3 ? (
                        <EnterpriseInfoItem
                          key={shortId()}
                          enterpriseInfoItem={enterpriseInfoItem}
                          keyword={keyword}
                          history={history}
                          row={row}
                          jumpCompany={jumpCompany}
                          tip={
                            i === 2 && item.enterpriseInfo.length > 3 ? (
                              <OriginalTooltip
                                placement="bottomLeft"
                                color="#fff"
                                arrowPointAtCenter
                                overlayStyle={OVERLAY_STYLE}
                                overlayInnerStyle={OVERLAY_INNER_STYLE}
                                title={item.enterpriseInfo?.map((enterpriseInfoItem: any, i: number) => (
                                  <EnterpriseInfoItem
                                    key={i}
                                    enterpriseInfoItem={enterpriseInfoItem}
                                    keyword={keyword}
                                    history={history}
                                    row={row}
                                    jumpCompany={jumpCompany}
                                    tip={false}
                                  />
                                ))}
                              >
                                <Arrow />
                              </OriginalTooltip>
                            ) : null
                          }
                        />
                      ) : null;
                    }) || '-'}
                  </div>
                );
              });
            },
          };
        case 'regionName': // 所属地区
        case 'cityName': // 所属市
        case 'provinceName': // 所属省
          return {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? <Tooltip title={description} /> : null}
              </>
            ),
            sortOrder: sorter ? getSortOrder(dataIndex) : undefined,
            render: (text: any, record: any) => {
              const { countyCode, cityCode, provinceCode } = record;
              const code =
                dataIndex === 'regionName'
                  ? countyCode || cityCode || provinceCode
                  : dataIndex === 'cityName'
                  ? cityCode
                  : provinceCode;
              return text ? (
                <span
                  className={code ? 'link-underline' : ''}
                  onClick={() => {
                    code &&
                      history.push(
                        urlJoin(
                          dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code }),
                          urlQueriesSerialize({
                            code,
                          }),
                        ),
                      );
                  }}
                >
                  {text}
                </span>
              ) : (
                '-'
              );
            },
          };
        case 'landLocation': // 土地坐落
        case 'electronicSupervisionNo': // 电子监管号
          return {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? <Tooltip title={description} /> : null}
              </>
            ),
            sortOrder: sorter ? getSortOrder(dataIndex) : undefined,
            render: (text: any) => (
              <span className="ellipsis2" title={text ?? undefined}>
                {text ? highlight(`${text}`, keyword) : '-'}
              </span>
            ),
          };
        default:
          return {
            ...indicatorItem,
            title: (
              <>
                {tableTitle}
                {description ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Tooltip title={description} />
                  </span>
                ) : null}
              </>
            ),
            sortOrder: sorter ? getSortOrder(dataIndex) : undefined,
            render: (text: any) => {
              const showText = text ? (unit ? formatNumber(text) : text) : '-';
              return (
                <span className="ellipsis2" title={showText === '-' ? showText : undefined}>
                  {showText}
                </span>
              );
            },
          };
      }
    };
    /** 递归 indicators 生成对应的columns结构, */
    const getColumns = (sourceData: SelectItem[]) => {
      const newTree = sourceData.map((item, i) => getColumnItem(item));
      /* 有children的递归处理 */
      /* @ts-ignore */
      newTree.forEach((item) => item?.children && (item.children = getColumns(item.children)));
      return newTree;
    };
    return getColumns(indicator);
  }, [getSortOrder, history, holdRatio, indicator, jumpCompany, keyword, onCopyClick, setHoldRatio]);

  return { indicatorColumns, getSortOrder };
};

export default useIndicatorColumn;

const Arrow = styled.span`
  flex: none;
  display: inline-block;
  margin-left: 2px;
  width: 12px;
  height: 12px;
  background: url(${require('@/pages/bond/billOverdue/images/down_arrow.svg')}) no-repeat center;
  background-size: cover;
  &:hover {
    background-image: url(${require('@/pages/bond/billOverdue/images/up_arrow.svg')});
  }
`;
