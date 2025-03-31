import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isArray, isString } from 'lodash';

import { Flex } from '@/components/layout';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import Label from '@/pages/area/areaFinancing/components/label';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import S from '@/pages/area/areaFinancing/style.module.less';

export enum RenderMode {
  /* 序号 */
  RowIndex,
  /* 点击明细弹窗 */
  ModalText,
  NormalText,
  /* 跳转链接 */
  LinkText,
  /* 纯数字 */
  NumberText,
}

// 排序
const sortMap: Record<string, string> = {
  asc: 'ascend',
  desc: 'descend',
};
interface Props {
  page: number;
  sortInfo: { sortKey?: string; sortRule?: string };
}
export default function useCommonColumn({ page = 1, sortInfo = {} }: Props) {
  const history = useHistory();
  const { sortKey, sortRule } = sortInfo;
  const makeSingleColumn = useMemoizedFn(({ title, dataIndex, width, renderMode, sorter = true, ...restProps }) => {
    return {
      title,
      dataIndex,
      width,
      sortOrder: sortRule && dataIndex === sortKey ? sortMap[sortRule] : null,
      sorter,
      align: [RenderMode.ModalText, RenderMode.NumberText].includes(renderMode) ? 'right' : restProps.align,
      render(text: any, row: Record<string, any>) {
        if (renderMode === RenderMode.LinkText) {
          let labelText = '';
          // A股、上市平台
          if (row.EQ0062_011 === '已退市') {
            labelText = '已退市';
          }
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
        if (renderMode === RenderMode.NumberText)
          return (
            <div>
              {isString(text) && text.indexOf(',') > -1 ? text : formatNumber(text, restProps.toFixed ?? 2) || '-'}
            </div>
          );
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
