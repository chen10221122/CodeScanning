import { useEffect, useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover, message } from 'antd';
import classNames from 'classnames';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { LinkToFile } from '@/pages/bond/overdue/components/LinkToFile';
import { LABELCOLOR, LABELTEXTCOLOR, SORTKEY, SortFieldWrapper, sortIcon } from '@/pages/bond/overdue/hooks/useColumn';
import { highlight } from '@/utils/dom';
import { useImmer } from '@/utils/hooks';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';
export default function useColumn(
  setCondition: any,
  searchText: string,
  searchPre: string[],
  data: any,
  currentPage: number,
) {
  const history = useHistory();
  const modalRef = useRef(null);
  const loadRef = useRef(false);

  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o: Record<string, any>) => o[key]).join('\n'));
    message.success('复制成功');
  });

  /* 排序 */
  const [sortFiled, update] = useImmer<{
    filed: string;
    rules: string;
  }>({
    filed: '',
    rules: '',
  });
  /** 排序改变 */
  const onSortChange = useMemoizedFn((filed: string) => {
    loadRef.current = true;
    if (sortFiled?.filed === filed) {
      update((d) => {
        if (d.rules === 'desc') {
          d.rules = 'asc';
        } else {
          d.filed = '';
          d.rules = '';
        }
      });
    } else {
      update((d) => {
        d.filed = filed;
        d.rules = 'desc';
      });
    }
  });

  useEffect(() => {
    if (loadRef.current) {
      setCondition((old: any) => {
        old.sortKeyEnum = SORTKEY.get(sortFiled.filed);
        old.sortOrder = sortFiled.rules === 'desc' ? '1' : '2';
      });
    }
  }, [setCondition, sortFiled]);

  const column = useMemo(() => {
    const debtColumns = [
      {
        title: '序号',
        align: 'center',
        key: 'index',
        dataIndex: 'index',
        fixed: true,
        className: 'pdd-8',
        resizable: false,
        width: 42 + Math.max((String(currentPage * 50).length - 2) * 8, 0),
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('公告日期')} row={1}>
            <span>
              {'公告日期'}
              <Popover
                placement="bottom"
                arrowPointAtCenter
                overlayClassName="factoring_tip_special"
                content={<div> 信源公告的披露日期 </div>}
              >
                <img src={require('@/pages/bond/overdue/images/question@2x.png')} alt="" />
              </Popover>
            </span>
            {sortIcon(sortFiled, '公告日期')}
          </SortFieldWrapper>
        ),
        align: 'center',
        key: 'publishDate',
        dataIndex: 'publishDate',
        width: 112,
        fixed: true,
        resizable: false,
      },
      {
        title: () => (
          <>
            债务人
            <AddBtn
              container={() => document.querySelector('#overdue-content') || document.body}
              text={'债务人'}
              onClickWithHasPower={() => {
                onCopyBtnClick('obligorName');
              }}
            />
          </>
        ),
        align: 'left',
        key: 'obl',
        dataIndex: 'obl',
        width: 294,
        fixed: true,
        resizable: { max: 602 - (42 + Math.max((String(currentPage * 50).length - 2) * 8, 0)) },
        render: (_: string, record: any, __: number) => {
          const needRed = searchPre.findIndex((item) => item === '2') !== -1 || searchPre.length === 0;
          return (
            <div
              className="f9-ellipsis-link"
              onClick={() => {
                if (record?.obligorItCode2) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, {
                        key: '',
                      }),
                      urlQueriesSerialize({ type: 'company', code: record.obligorItCode2 }),
                    ),
                  );
                }
              }}
            >
              {searchText.length !== 0 && needRed ? (
                <div title={record.obligorName} className={classNames({ 'link pointer': record?.obligorItCode2 })}>
                  {highlight(record.obligorName, searchText)}
                </div>
              ) : (
                <div title={record.obligorName} className={classNames({ 'link pointer': record?.obligorItCode2 })}>
                  {record.obligorName}
                </div>
              )}
              {record.labelList.map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    style={{
                      background: LABELCOLOR.get(item) ?? '#FEF4ED',
                      color: LABELTEXTCOLOR.get(item) ?? '#FE934B',
                    }}
                    className="labelWrap"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        title: '披露方',
        align: 'left',
        key: 'discloser',
        dataIndex: 'discloser',
        width: 232,
        resizable: true,
        render: (_: string, record: any, __: number) => {
          const needRed = searchPre.findIndex((item) => item === '1') !== -1 || searchPre.length === 0;
          return (
            <div
              className="f9-ellipsis-link"
              onClick={() => {
                if (record?.discloserItCode2) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, {
                        key: '',
                      }),
                      urlQueriesSerialize({ type: 'company', code: record.discloserItCode2 }),
                    ),
                  );
                }
              }}
            >
              {searchText.length !== 0 && needRed ? (
                <span className={classNames({ 'link pointer': record?.discloserItCode2 })} title={record.discloserName}>
                  {highlight(record.discloserName, searchText)}
                </span>
              ) : (
                <span className={classNames({ 'link pointer': record?.discloserItCode2 })} title={record.discloserName}>
                  {record.discloserName}
                </span>
              )}
            </div>
          );
        },
      },
      {
        title: '来源',
        align: 'center',
        key: 'peo',
        dataIndex: 'peo',
        width: 51,
        resizable: false,
        render(_: any, record: any, __: number) {
          return <>{record.sourseUrl ? <LinkToFile originalText={record.sourseUrl} /> : '-'}</>;
        },
      },
      {
        title: '债权人',
        align: 'left',
        key: 'creditor',
        dataIndex: 'creditor',
        width: 232,
        resizable: true,
        render: (_: string, record: any, __: number) => {
          const needRed = searchPre.findIndex((item) => item === '1') !== -1 || searchPre.length === 0;
          return (
            <div
              className="f9-ellipsis-link"
              title={record.creditorName}
              onClick={() => {
                if (record?.creditorItCode2) {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, {
                        key: '',
                      }),
                      urlQueriesSerialize({ code: record.creditorItCode2, type: 'company' }),
                    ),
                  );
                }
              }}
            >
              {searchText.length !== 0 && needRed ? (
                <span className={classNames({ 'link pointer': record?.creditorItCode2 })}>
                  {highlight(record.creditorName, searchText)}
                </span>
              ) : (
                <span className={classNames({ 'link pointer': record?.creditorItCode2 })}>{record.creditorName}</span>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('逾期金额(万元)')} row={1}>
            <span title="逾期金额(万元)">{'逾期金额(万元)'}</span>
            {sortIcon(sortFiled, '逾期金额(万元)')}
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'overdueAmount',
        dataIndex: 'overdueAmount',
        width: 150,
        resizable: true,
        render: (text: string, record: any, __: number) => {
          const count = record.currency === 'USD' ? record.currency + ' ' + record.overdueAmount : record.overdueAmount;
          return count ?? '-';
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('债务类型')} row={1}>
            <span>{'债务类型'}</span>
            {sortIcon(sortFiled, '债务类型')}
          </SortFieldWrapper>
        ),
        align: 'left',
        key: 'debtType',
        dataIndex: 'debtType',
        width: 150,
        resizable: true,
        render: (text: any) => {
          return text ?? '-';
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('逾期起始日')} row={1}>
            <span>{'逾期起始日'}</span>
            {sortIcon(sortFiled, '逾期起始日')}
          </SortFieldWrapper>
        ),
        align: 'center',
        key: 'overdueStartDate',
        dataIndex: 'overdueStartDate',
        width: 110,
        resizable: true,
        render: (text: any) => {
          return text ?? '-';
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('逾期本金(万元)')} row={1}>
            <span>{'逾期本金(万元)'}</span>
            {sortIcon(sortFiled, '逾期本金(万元)')}
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'overduePrincipalAmount',
        dataIndex: 'overduePrincipalAmount',
        width: 150,
        resizable: true,
        render: (text: string, record: any, __: number) => {
          const count =
            record.currency === 'USD'
              ? record.currency + ' ' + record.overduePrincipalAmount
              : record.overduePrincipalAmount;
          return count ?? '-';
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('逾期利息(万元)')} row={1}>
            <span>{'逾期利息(万元)'}</span>
            {sortIcon(sortFiled, '逾期利息(万元)')}
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'overdueInterest',
        dataIndex: 'overdueInterest',
        width: 150,
        resizable: true,
        render: (text: string, record: any, __: number) => {
          const count =
            record.currency === 'USD' ? record.currency + ' ' + record.overdueInterest : record.overdueInterest;
          return count ?? '-';
        },
      },
      {
        title: '行业',
        align: 'left',
        key: 'industryFirst',
        dataIndex: 'industryFirst',
        width: 150,
        resizable: true,
        render: (text: string, record: any, __: number) => {
          const industry = record.industrySecond ? record.industrySecond : record.industryFirst;
          return industry ?? '-';
        },
      },
      {
        title: '企业类型',
        align: 'center',
        key: 'enterpriseNature',
        dataIndex: 'enterpriseNature',
        width: 150,
        resizable: true,
        render: (text: any) => {
          return text ?? '-';
        },
      },
      {
        title: '所属地区',
        align: 'left',
        key: 'area',
        dataIndex: 'area',
        width: 150,
        resizable: true,
        render: (title: string, record: any, __: number) => {
          const area = `${record.province ?? ''}${record.city ?? ''}${record.county ?? ''}`;
          return (
            <div className="f9-ellipsis-link" title={area}>
              <span>{area.length > 0 ? area : '-'}</span>
            </div>
          );
        },
      },
      {
        title: (
          <SortFieldWrapper onClick={() => onSortChange('截止日期')} row={1}>
            <span>
              {'截止日期'}
              <Popover
                placement="bottomRight"
                overlayClassName="special_space factoring_tip_special "
                content={
                  <div>
                    {' '}
                    公告披露的截止日期。若为定报，未披露截止日期时，则默认为定报对应的报告期；若为日常公告，未明确披露截止日期时，则默认为公告日期。{' '}
                  </div>
                }
              >
                <img src={require('@/pages/bond/overdue/images/question@2x.png')} alt="" />
              </Popover>
            </span>
            {sortIcon(sortFiled, '截止日期')}
          </SortFieldWrapper>
        ),
        align: 'center',
        key: 'endDate',
        dataIndex: 'endDate',
        width: 114,
        resizable: true,
      },
    ];

    return debtColumns;
  }, [history, onSortChange, searchPre, searchText, sortFiled, onCopyBtnClick, currentPage]);

  return {
    column,
    modalRef,
  };
}
