import { useMemo } from 'react';

import { Popover } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
// import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';
import IndicHeaderCell from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/table/IndicHeaderCell';
import { useCtx2 } from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/context2';
import ToAreaCompare from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/ToAreaCompare';

export const useColumns = (
  // handleShowEChartModel: any,
  setIsExpandAll: any,
  isExpandAll: boolean,
  selected: string[],
  payCheck: any,
) => {
  const {
    state: { params },
    update,
  } = useCtx2();
  const { year } = params;

  const ordinaryCellRender = (text: string, _row: any) => {
    return <Oneline title={text}>{text || '-'}</Oneline>;
  };

  const handleMoreArea = useMemoizedFn((rows) => {
    // console.log('rows---click---', rows);
    update((d) => {
      d.isOpenModals = true;
      d.modalRow = {
        title: rows.head,
        indicName2: rows.head,
        indicatorCode: rows.indicatorCode,
        originIndicatorValue: rows.originIndicatorValue,
        regionName: rows.regionName,
        regionCode: rows.regionCode,
        score: rows.score,
      };
    });
  });

  const getAreasFromRow = useMemoizedFn((row: any) => {
    // console.log('row----', row, year);
    let areas: any = {
      areas: [],
      codes: [],
      year: year,
    };
    Object.keys(row).forEach((key) => {
      const item: any = row[key];
      if (key === 'regionCode' || key.indexOf('compareRegionCode') !== -1) {
        areas.codes.push(item + '');
      } else if (key === 'regionName' || key.indexOf('compareRegionName') !== -1) {
        areas.areas.push(item);
      }
    });
    return areas;
  });

  /**
   * 构建用于转跳的链接
   * @param e 点击事件
   * @param areas 需要分享的对象
   */
  const buildCompareLink = (areas: any) => {
    let link = `?year=${areas.year}&codes=${encodeURIComponent(areas.codes.join(','))}&areas=${encodeURIComponent(
      areas.areas.join(','),
    )}`;
    return link;
  };

  const columns = useMemo(() => {
    let otherData = [];
    for (let i = 0; i < 5; i++) {
      otherData.push({
        title: '相似地区',
        children: [
          {
            title: '地区',
            dataIndex: `compareRegionName${i}`,
            // align: 'left',
            width: 96,
            render: (text: string, row: any) => {
              return <Oneline title={text}>{row[`regionShortName${i}`] || '-'}</Oneline>;
            },
          },
          {
            title: '得分',
            dataIndex: `score${i}`,
            align: 'right',
            width: 60,
            render: ordinaryCellRender,
          },
          {
            title: '偏离度',
            dataIndex: `deviation${i}`,
            align: 'right',
            width: 62,
            render: (value: string, _row: any) => {
              const matchValue = (value && value.split('%')[0]) || 0;
              const degree = Number(matchValue) || 0;
              return (
                <div style={{ color: degree ? (degree > 0 ? '#FE3A2F' : '#14BA70') : '#262626' }}>
                  {value ? degree : '-'}
                </div>
              );
            },
          },
        ],
      });
    }

    let tempColumns = [
      {
        title: <IndicHeaderCell isExpandAll={isExpandAll} setIsExpandAll={setIsExpandAll} title="指标名称" />,
        dataIndex: 'head',
        width: 243,
        fixed: 'left',
        align: 'left',
        render: (text: string, row: any) => {
          const { level, children, weight, description } = row;
          let isExpand = selected.includes(row.key);
          return (
            <IndicatorName>
              <span className={`indi-name indi-name${level}`}>{`${text}${weight ? `(${weight})` : ''}`}</span>
              {children ? (
                <Icon
                  size={10}
                  image={require(level === 1 ? '../../imgs/expand.png' : '../../imgs/expand2.png')}
                  style={{ transform: isExpand ? 'unset' : 'rotate(-90deg)' }}
                />
              ) : null}

              {description ? (
                <div style={{ cursor: 'pointer' }}>
                  <Popover placement="right" content={<div>{description}</div>} trigger="hover">
                    <img
                      src={require('../../imgs/ask.png')}
                      alt=""
                      style={{ width: '12px', height: '12px', marginLeft: '4px' }}
                    />
                  </Popover>
                </div>
              ) : null}
            </IndicatorName>
          );
        },
      },
      {
        title: '本地区',
        children: [
          {
            title: '地区',
            dataIndex: 'regionName',
            align: 'left',
            width: 96,
            render: ordinaryCellRender,
          },
          {
            title: '得分',
            dataIndex: 'score',
            align: 'right',
            width: 60,
            render: ordinaryCellRender,
          },
        ],
      },
      ...otherData,
      {
        title: '更多地区/去比较',
        fixed: 'right',
        width: 114,
        render: (_text: string, row: any) => {
          return (
            <RightButton>
              <div className="left">
                {row.compareRegionName4 ? (
                  <div className="more" onClick={() => handleMoreArea(row)}>
                    更多
                  </div>
                ) : (
                  '-'
                )}
              </div>
              <ToAreaCompare
                areas={getAreasFromRow(row)}
                beforeLeave={payCheck}
                query={buildCompareLink(getAreasFromRow(row))}
              />
            </RightButton>
          );
        },
      },
    ];

    return tempColumns.map((d: any) => ({
      ...d,
      // resizable: true,
      ellipsis: true,
      render: d.render ? d.render : ordinaryCellRender,
    })) as any;
  }, [getAreasFromRow, handleMoreArea, isExpandAll, payCheck, selected, setIsExpandAll]);

  return columns;
};

const IndicatorName = styled.div`
  display: flex;
  align-items: center;
  .indi-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .indi-name1 {
    color: #ff7500;
  }
  i {
    margin-left: 4px;
  }
`;

const Oneline = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.indi-name1 {
    color: #ff7500;
  }
`;

const RightButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;

  .left {
    min-width: 25px;
    .more {
      color: #025cdc;
      cursor: pointer;
      font-family: PingFangSC, PingFangSC-Regular;
      line-height: 18px;
    }
  }
`;
