import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { ArtColumn } from 'ali-react-table';
import cn from 'classnames';

import { SelectItem } from '@pages/area/landTopic/components/IndexTable';
import Area from '@pages/area/landTopic/modules/overview/modules/cardTable/area';
import useIndicatorColumn from '@pages/area/landTopic/modules/overview/modules/cardTable/hooks/useIndicatorColumn';
import { useCtx, WHOLE_COUNTRY_NAME } from '@pages/area/landTopic/modules/overview/provider';

import { Image } from '@/components/layout';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import globalStyles from '@pages/bond/cityInvestSpread/styles.module.less';

interface Props {
  dataSource: Record<string, any>[];
  indicator: SelectItem[];
  expandFlag: boolean;
  expandedRows: string[];
  setIsAllNation: (v: boolean) => void;
  onChangeOpenKeys: (key: string, expand: boolean) => void;
  sortKey?: string;
  sortRule?: string;
  keyword?: string;
}

const useColumns = ({
  sortKey,
  sortRule,
  dataSource,
  indicator,
  expandFlag,
  expandedRows,
  setIsAllNation,
  onChangeOpenKeys,
}: Props) => {
  const {
    state: {
      checkRowArea: { areaCode },
    },
    update,
  } = useCtx();

  const { indicatorColumns } = useIndicatorColumn({ sortKey, sortRule, indicator });

  const history = useHistory();

  const columns = useMemo(() => {
    return [
      {
        title: <Area setIsAllNation={setIsAllNation} />,
        code: 'areaName',
        width: 180,
        align: 'left',
        lock: true,
        className: 'area-clo',
        render: (text: string, record: any) => {
          const { isEmpty, provinceName, cityName, areaCode: curAreaCode, areaLevel } = record;
          if (isEmpty) {
            return <span style={{ color: '#c0c0c0' }}>暂无数据</span>;
          }
          const level = +(areaLevel || 0);
          const rightText =
            level === 2 ? `${provinceName}` : level === 3 ? `${provinceName}${cityName ? `/${cityName}` : ''}` : '';
          const expand = !expandedRows.includes(curAreaCode);
          return (
            <>
              {record.children?.length ? (
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeOpenKeys(curAreaCode, expand);
                  }}
                  size={12}
                  style={{
                    marginLeft: `${16 * (level - 1)}px`,
                    marginRight: '4px',
                    cursor: 'pointer',
                    verticalAlign: '-1px',
                  }}
                  src={
                    expand
                      ? require('@/pages/bond/cityInvestSpread/images/expand_open.svg')
                      : require('@/pages/bond/cityInvestSpread/images/expand_close.svg')
                  }
                />
              ) : null}
              <div
                title={expandFlag ? text : text}
                className={globalStyles.ellipsis}
                style={{
                  // marginLeft: text === WHOLE_COUNTRY_NAME && expandFlag ? '-8px' : 0,
                  display: 'inline-flex',
                  width: `${156 - (expandFlag ? (level - 1) * 14 + 16 : 0)}px`,
                }}
              >
                {text === WHOLE_COUNTRY_NAME ? (
                  text
                ) : (
                  <div
                    className={cn(globalStyles.link, globalStyles.ellipsis)}
                    style={{
                      color: '#141414',
                      minWidth: text?.length > 2 ? '39px' : undefined,
                    }}
                    onDoubleClick={() => {
                      history.push(
                        urlJoin(
                          dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: curAreaCode }),
                          urlQueriesSerialize({
                            code: curAreaCode,
                          }),
                        ),
                      );
                    }}
                  >
                    {text}
                  </div>
                )}
                {expandFlag ? null : (
                  <div
                    title={rightText}
                    style={{ marginLeft: '6px', color: '#8c8c8c' }}
                    className={globalStyles.ellipsis}
                  >
                    {rightText}
                  </div>
                )}
              </div>
            </>
          );
        },
      },
      ...indicatorColumns,
    ] as ArtColumn[];
  }, [setIsAllNation, indicatorColumns, expandedRows, expandFlag, onChangeOpenKeys, history]);

  const preCheckRowCode = useMemo(() => {
    let code = '';
    const showCodes: string[] = [];
    const getShowCodes = (data: Record<string, any>[]) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        showCodes.push(element.areaCode);
        if (expandFlag && element.children && expandedRows.includes(element.areaCode)) {
          getShowCodes(element.children);
        }
      }
    };
    getShowCodes(dataSource);
    for (let index = 0; index < showCodes.length; index++) {
      const element = showCodes[index];
      if (element === areaCode) break;
      else code = element;
    }
    return code;
  }, [areaCode, dataSource, expandFlag, expandedRows]);

  const getRowProps = useMemoizedFn((record: any, rowIndex: number) => {
    const { areaName, areaLevel, areaCode: curAreaCode } = record;
    return {
      onClick: () => {
        if (curAreaCode) {
          update((draft) => {
            if (draft.checkRowArea.areaCode !== curAreaCode)
              draft.checkRowArea = { areaName: areaName.split(' ')[0], areaCode: curAreaCode, areaLevel };
          });
        }
      },
      className: cn({
        'row-check': areaCode && areaCode === curAreaCode,
        'pre-row-check': preCheckRowCode === curAreaCode,
        'first-row-check': dataSource?.[0]?.areaCode === areaCode && areaCode === curAreaCode,
      }),
    };
  });

  return { columns, getRowProps };
};

export default useColumns;
