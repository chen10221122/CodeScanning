import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isArray, isString } from 'lodash';

import NameFold from '@/components/foldDropMenu';
import { Flex } from '@/components/layout';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { highlight } from '@/utils/dom';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import IndustryList from './foldList/industryList';
import Label from './label';
import S from './style.module.less';

// 新三板上市状态
enum ThirdBoardListingStatus {
  // 已挂牌
  Listed = '1',
  // 待挂牌
  WillListed = '2',
  // 已退市
  DeListed = '3',
  // 已转板
  Changed = '4',
  // 在审
  Auditing = '5',
}

export const thirdBoardListingStatus: any = {
  [ThirdBoardListingStatus.DeListed]: '已摘牌',
  [ThirdBoardListingStatus.Changed]: '已转板',
};

export enum RenderMode {
  /* 序号 */
  RowIndex,
  /* 地区列 */
  Area,
  /* 点击明细弹窗 */
  ModalText,
  NormalText,
  /* 跳转链接 */
  LinkText,
  /* 纯数字 */
  NumberText,
  /* 按行分类折叠 */
  EllipsisByRow,
  /* 按文字分类折叠 */
  EllipsisByText,
  /* 股票代码（带标签） */
  StockCode,
}

// 排序
const sortMap: Record<string, string> = {
  asc: 'ascend',
  desc: 'descend',
};
interface Props {
  /** 当前页数 */
  page: number;
  /** 当前排序信息 */
  sortInfo: { sortKey?: string; sortRule?: string };
  keyword?: string;
}
export default function useCommonColumn({ page = 1, sortInfo = {}, keyword }: Props) {
  const history = useHistory();
  const { sortKey, sortRule } = sortInfo;
  const indexColumn = useMemo(() => {
    return {
      title: '序号',
      dataIndex: 'rowIndex',
      align: 'center',
      width: Math.max(`${Number(page * 50)}`.length > 3 ? `${Number(page * 50)}`.length * 13 : 42, 42),
      sorter: false,
      fixed: 'left',
      className: 'pdd-8',
    };
  }, [page]);
  const makeSingleColumn = useMemoizedFn(({ title, dataIndex, width, renderMode, sorter = true, ...restProps }) => {
    return {
      title,
      dataIndex,
      width,
      sortOrder: sortRule && dataIndex === sortKey ? sortMap[sortRule] : null,
      sorter,
      align: [RenderMode.NumberText].includes(renderMode) ? 'right' : restProps.align,
      render(text: any, row: Record<string, any>) {
        switch (renderMode) {
          case RenderMode.LinkText: {
            const code = row.itCode || row.ITCode2;
            return (
              <Flex>
                <div
                  className={cn(S.overflow, { [S.cursorText]: !!code })}
                  style={restProps.style ? { textAlign: 'left', ...restProps.style } : { textAlign: 'left' }}
                  title={text}
                  onClick={() => {
                    if (code)
                      history.push(
                        urlJoin(
                          dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                          urlQueriesSerialize({ code, type: 'company' }),
                        ),
                      );
                  }}
                >
                  {highlight(text, keyword)}
                </div>
              </Flex>
            );
          }
          case RenderMode.NumberText: {
            return (
              <div>
                {isString(text) && text.indexOf(',') > -1 ? text : formatNumber(text, restProps.toFixed ?? 2) || '-'}
              </div>
            );
          }
          case RenderMode.StockCode: {
            let labelText = '';
            // 新三板
            if (row.EQ0063_001) {
              labelText = thirdBoardListingStatus[String(row.EQ0063_001)];
            }
            return (
              <Flex>
                <div
                  className={S.overflow}
                  style={{ textAlign: 'left', flex: 1, maxWidth: 'calc(100% - 54px)' }}
                  title={text}
                >
                  {text}
                </div>
                {labelText ? <Label labelText={labelText} /> : null}
              </Flex>
            );
          }
          case RenderMode.EllipsisByRow:
            return text?.length ? <IndustryList list={text} wrapperRef={document.body} /> : '-';
          case RenderMode.EllipsisByText:
            return text?.length && text.some((o: Record<string, any>) => o.name) ? (
              <div style={{ whiteSpace: 'normal', overflow: 'auto' }}>
                <NameFold
                  clampNumber={3}
                  tagList={text.map((o: any) => (o.top ? '品牌' : ''))}
                  tabId="areaFinancingWrapper"
                  nameList={text.map((o: any) => o.name)}
                  codeList={text.map((o: any) => o.itCode)}
                />
              </div>
            ) : (
              '-'
            );
          default:
            return (
              <div className={S.overflow} title={text}>
                {text ? text : '-'}
              </div>
            );
        }
      },
      ...restProps,
    };
  });
  const makeColumns = useMemoizedFn(
    (columnData: Record<string, any> | Record<string, any>[], needIndexColumn = true) => {
      let result = needIndexColumn ? [indexColumn] : [];
      if (isArray(columnData)) {
        result = result.concat(
          columnData.map((o: Record<string, any>) => {
            if (o.children) {
              return {
                title: o.title,
                children: o.children.map((item: any) => {
                  return makeSingleColumn(item);
                }),
              };
            } else {
              return makeSingleColumn(o);
            }
          }),
        );
      } else {
        result = result.concat([makeSingleColumn(columnData)]);
      }
      return result;
    },
  );

  return { makeColumns, indexColumn };
}
