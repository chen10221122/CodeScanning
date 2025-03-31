import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isArray, isString } from 'lodash';

import NameFold from '@/components/foldDropMenu';
import IndustryList from '@/components/foldList/industryList';
import { Flex } from '@/components/layout';
import { LINK_AREA_F9, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { useConditionCtx } from '@/pages/area/areaFinancing/components/commonLayout/context';
import Label, { LabelType } from '@/pages/area/areaFinancing/components/label';
import { useCtx } from '@/pages/area/areaFinancing/context';
import useDetailModal from '@/pages/area/areaFinancing/hooks/useDetailModal';
import { DetailModalTypeEnum } from '@/pages/area/areaFinancing/types';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import S from '@/pages/area/areaFinancing/style.module.less';

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
// 排序
const sortMap: Record<string, string> = {
  asc: 'ascend',
  desc: 'descend',
};
export default function useCommonColumn(sortInfo?: { sortKey: string; sortRule: string }) {
  const {
    state: { condition, page, selectTopCounty },
  } = useConditionCtx();
  const {
    state: { wrapperRef },
  } = useCtx();
  const history = useHistory();
  const { sortKey, sortRule, regionLevel } = sortInfo ? sortInfo : condition || {};

  const { handleModalClick } = useDetailModal();
  const makeSingleColumn = useMemoizedFn(({ title, dataIndex, width, renderMode, sorter = true, ...restProps }) => {
    return {
      title,
      dataIndex,
      width,
      sortOrder: dataIndex === sortKey ? sortMap[sortRule] : null,
      sorter,
      align: [RenderMode.ModalText, RenderMode.NumberText].includes(renderMode) ? 'right' : restProps.align,
      render(text: any, row: Record<string, any>) {
        if (renderMode === RenderMode.ModalText)
          return text !== 0 ? (
            <div
              className={S.cursorText}
              onClick={() => {
                handleModalClick({
                  title: row.regionName + '-' + restProps.modalType || DetailModalTypeEnum.StockA,
                  modalType: restProps.modalType,
                  row: row,
                  customModalCondition: restProps.customModalCondition,
                });
              }}
            >
              {isString(text) && text.indexOf(',') > -1 ? text : formatNumber(text, 0) || '-'}
            </div>
          ) : (
            0
          );
        if (renderMode === RenderMode.LinkText) {
          let labelText = '';
          // A股、上市平台
          if (row.EQ0062_011 === '已退市') {
            labelText = '已退市';
          }
          // 港股
          if (row.isDelisted === '1') {
            labelText = '已退市';
          }
          /*// 新三板
          if (row.EQ0063_001) {
            labelText = thirdBoardListingStatus[String(row.EQ0063_001)];
          }*/
          return (
            <Flex>
              <div
                className={cn(S.cursorText, S.overflow)}
                style={restProps.style ? { textAlign: 'left', ...restProps.style } : { textAlign: 'left' }}
                title={text}
                onClick={() => {
                  history.push(
                    `${urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                      urlQueriesSerialize({ code: row.itcode2 || row.ITCode2, type: 'company' }),
                    )}`,
                  );
                }}
              >
                {text}
              </div>
              {labelText ? <Label labelText={labelText} /> : null}
            </Flex>
          );
        }
        if (renderMode === RenderMode.StockCode) {
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

        if (renderMode === RenderMode.EllipsisByRow)
          return text?.length ? <IndustryList list={text} wrapperRef={wrapperRef} /> : '-';
        if (renderMode === RenderMode.EllipsisByText)
          return row.investITName && row.investList?.length ? (
            <NameFold
              clampNumber={3}
              tagList={row.investList.map((o: any) => (o.BrandCode ? '品牌' : ''))}
              tabId="areaFinancingWrapper"
              nameList={row.investList.map((o: any) => o.ITName)}
              codeList={row.investList.map((o: any) => o.ITCode2)}
            />
          ) : (
            '-'
          );
        if (renderMode === RenderMode.NumberText)
          return (
            <div>
              {isString(text) && text.indexOf(',') > -1 ? text : formatNumber(text, restProps.toFixed ?? 2) || '-'}
            </div>
          );
        if (renderMode === RenderMode.Area) {
          return (
            // 区县级需要显示百强县
            <Flex justify={'left'}>
              <span
                title={text}
                className={cn(S.overflowThree, S.cursorText)}
                onClick={() => {
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: row.regionCode }),
                      urlQueriesSerialize({
                        code: row.regionCode,
                      }),
                    ),
                  );
                }}
                style={
                  regionLevel === '3' && String(row.isTopCounty) === '1' && !selectTopCounty
                    ? { maxWidth: 'calc(100% - 54px)', textAlign: 'left' }
                    : { textAlign: 'left' }
                }
              >
                {text}
              </span>
              {regionLevel === '3' && String(row.isTopCounty) === '1' && !selectTopCounty ? (
                <Label type={LabelType.TopCounty} labelText={'百强县'} />
              ) : (
                ''
              )}
            </Flex>
          );
        }
        return (
          <div className={S.overflow} title={text}>
            {text ? text : '-'}
          </div>
        );
      },
      ...restProps,
    };
  });
  const makeColumns = useMemoizedFn((columnData: Record<string, any> | Record<string, any>[]) => {
    if (isArray(columnData)) {
      return columnData.map((o: Record<string, any>) => {
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
      });
    } else {
      return makeSingleColumn(columnData);
    }
  });

  const indexColumn = useMemo(() => {
    return {
      title: '序号',
      dataIndex: 'rowIndex',
      align: 'center',
      width: Math.max(`${Number(page * 50)}`.length > 3 ? `${Number(page * 50)}`.length * 13 : 42, 42),
      sorter: false,
      className: 'pdd-8',
    };
  }, [page]);
  return { makeColumns, indexColumn };
}
