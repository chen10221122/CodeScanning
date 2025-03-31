import { memo, useRef, useState, useMemo } from 'react';

import { Popover } from '@dzh/components';
import { ColDef, GetRowIdFunc, BodyScrollEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';
// import { cloneDeep } from 'lodash';

import Icon from '@/components/icon';
import IndicHeaderCell from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/components/table/IndicHeaderCell';
import useTreeChange from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/components/table/useTreeChange';
import { useCtx2 } from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/context2';
import ToAreaCompare from '@/pages/area/areaF9/modules/regionalOverview/similarEconomy/ToAreaCompare';
import { RowConfig } from '@/pages/dataView/provider';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './ag-grid-dzh-vars.less';

interface Props {
  payCheck: any;
  loading: boolean;
  tableData: any;
}

const defaultColDef: ColDef<RowConfig> = {
  width: 160,
  minWidth: 20,
  maxWidth: 800,
  resizable: false,
  /** true 表示列被拖出网格时不会隐藏 */
  lockVisible: true,
  /** true 表示锁定的列无法拖出固定部分 */
  lockPinned: true,
  suppressMovable: false,
};

const AgGridTable = (props: Props) => {
  const {
    state: { params },
    update,
  } = useCtx2();

  const { year } = params;
  const { tableData, payCheck, loading } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  const [isExpandAll, setIsExpandAll] = useState(true);

  const isEmptyLineOpen = false;

  const IndicHeaderCellComponent = () => {
    return <IndicHeaderCell isExpandAll={isExpandAll} setIsExpandAll={setIsExpandAll} />;
  };

  const ordinaryCellRender = (params: any) => {
    // console.log('params---ordi---', params);
    return params.value || '-';
  };

  const getAreasFromRow = (row: any) => {
    // console.log('row----', row, year);
    let areas: any = {
      areas: [],
      codes: [],
      year: year,
    };
    Object.keys(row).forEach((key) => {
      const item: any = row[key];
      if (key.indexOf('compareRegionCode') !== -1) {
        areas.codes.push(item + '');
      } else if (key.indexOf('compareRegionName') !== -1) {
        areas.areas.push(item);
      }
    });
    return areas;
  };

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

  const handleMoreArea = useMemoizedFn((params) => {
    // console.log('params---click---', params);
    const rows = params.data;
    update((d) => {
      d.isOpenModals = true;
      d.modalRow = {
        title: rows.indicatorName,
        indicName2: rows.indicatorName,
        indicatorCode: rows.indicatorCode,
        originIndicatorValue: rows.originIndicatorValue,
        regionName: rows.regionName,
        regionCode: rows.regionCode,
        score: rows.score,
      };
    });
  });

  const otherData = [];
  for (let i = 0; i < 5; i++) {
    otherData.push(
      {
        headerName: '地区',
        field: `compareRegionName${i}`,
        headerClass: 'text-center',
        width: 96,
        minWidth: 96,
        flex: 96,
        cellClass: 'cell-box-left',
        cellRenderer: (params: any) => {
          return <OneLine title={params.value}>{params.data[`regionShortName${i}`] || '-'}</OneLine>;
        },
      },
      {
        headerName: '得分',
        field: `score${i}`,
        headerClass: 'text-center',
        width: 60,
        minWidth: 60,
        flex: 60,
        cellRenderer: ordinaryCellRender,
      },
      {
        headerName: '偏离度',
        field: `deviation${i}`,
        headerClass: 'text-center',
        width: 60,
        minWidth: 60,
        flex: 60,
        cellRenderer: (params: any) => {
          // console.log('params---偏离度---', params);
          const value = params.value;
          const matchValue = (value && value.split('%')[0]) || 0;
          const degree = Number(matchValue) || 0;
          return (
            <div style={{ color: degree ? (degree > 0 ? '#FE3A2F' : '#14BA70') : '#262626' }}>
              {value ? degree : '-'}
            </div>
          );
        },
      },
    );
  }

  const columnDefs = [
    {
      headerName: '指标名称(权重)',
      field: 'indicatorName',
      colId: 'renderIndicator',
      width: 243,
      headerClass: 'custom-merge-row-span2',
      // rowSpan: () => 2,
      headerComponent: IndicHeaderCellComponent,
      // 固定列
      lockPosition: 'left',
      pinned: 'left',
      // 列不可被拖动
      suppressMovable: false,
      cellRenderer: (params: any) => {
        const { data, value } = params;
        const { level, hasChildren, isExpand, needPrivilege, maxTitle, headName, description } = data;
        const unit = headName?.match(/\(([^)]+)\)[^)]*$/)?.[1];
        return (
          <div
            className={cn(`ag-title-item ${maxTitle}`)}
            id={params.data.indexId}
            style={{
              paddingLeft: (level - 1) * 14,
              cursor: hasChildren ? 'pointer' : 'default',
            }}
          >
            <span
              title={`${value}${unit && !value?.includes(unit) ? `(${unit})` : ''}`}
              className={`ag-title-lable ag-title-level${level}`}
            >
              {`${value}${unit && !value?.includes(unit) ? `(${unit})` : ''}`}
            </span>
            {hasChildren && (
              <Icon
                size={10}
                image={require(level === 1 ? '../../imgs/expand.png' : '../../imgs/expand2.png')}
                style={{ transform: isExpand && isExpandAll ? 'unset' : 'rotate(-90deg)' }}
              />
            )}
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

            {needPrivilege === 1 && <Icon size={12} image={require('../../imgs/vip.png')} />}
          </div>
        );
      },
    },
    {
      headerName: '本地区',
      headerClass: 'text-center border-btm-1',
      marryChildren: true,
      children: [
        {
          headerName: '地区',
          field: 'regionName',
          headerClass: 'text-center',
          width: 96,
          minWidth: 96,
          flex: 96,
          cellClass: 'cell-box-left',
          cellRenderer: (params: any) => {
            return <OneLine title={params.value}>{params.data.regionShortName || '-'}</OneLine>;
          },
        },
        {
          headerName: '得分',
          field: 'score',
          headerClass: 'text-center',
          width: 60,
          minWidth: 60,
          flex: 60,
          cellRenderer: ordinaryCellRender,
        },
      ],
    },
    {
      headerName: '相似地区',
      headerClass: 'text-center border-btm-1',
      marryChildren: true,
      children: otherData,
    },
    {
      headerName: '更多地区/去比较',
      headerClass: 'text-center custom-merge-row-span2 more-similar',
      // rowSpan: () => 2,
      // 固定列
      lockPosition: 'right',
      pinned: 'right',
      // 列不可被拖动
      suppressMovable: false,
      width: 114,
      cellRenderer: (params: any) => {
        const row = params.data;
        return (
          <RightButton>
            <div className="left">
              <div className="more" onClick={() => handleMoreArea(params)}>
                更多
              </div>
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
  ].map((d) => {
    return { ...d, key: d.headerName + defaultColDef.field };
  }) as RowConfig[];

  const rowDatas = useMemo(() => {
    return tableData;
  }, [tableData]);

  const { rowData, updateFoldKeys } = useTreeChange(rowDatas, isExpandAll, isEmptyLineOpen, gridRef);

  // console.log('rowData--------', rowData);
  const getRowId = useMemoizedFn<GetRowIdFunc<RowConfig>>((params) => params.data.indexId);

  // 处理点击事件并更新数据
  const handleCellClick = useMemoizedFn((params) => {
    if (params.column.colId === 'renderIndicator') {
      if (!params.data.hasChildren) return;
      updateFoldKeys(params.data.indexId);
    }
  });

  const handleBodyScroll = useMemoizedFn((event: BodyScrollEvent<RowConfig>) => {
    if (wrapperRef.current) {
      if (event.left > 0) {
        wrapperRef.current.classList.add('ag-table-has-left-offset');
      } else {
        wrapperRef.current.classList.remove('ag-table-has-left-offset');
      }
    }
  });

  /** 点击右侧目录，对应的标题行高亮 */
  const getRowStyle = useMemoizedFn((params) => {
    if (params.node.data.focused) {
      return { backgroundColor: '#FFF7EA' };
    }
  });

  /** loading样式 */
  const loadingTip = useMemo(() => {
    if (loading) {
      return (
        <div className="aggrid-area-compare-loading">
          <span className="loading-tips">
            <Icon
              style={{ width: 24, height: 24, marginTop: '20px', zIndex: 1 }}
              image={require('@/assets/images/common/loading.gif')}
            />
            <span className="loading-text">加载中</span>
          </span>
        </div>
      );
    }
  }, [loading]);

  return (
    <div ref={wrapperRef} style={{ height: 'calc(100% - 42px)' }} className="ag-theme-alpine">
      {loadingTip}
      <AgGridReact
        ref={gridRef}
        animateRows
        rowDragManaged
        getRowId={getRowId}
        rowHeight={30}
        headerHeight={24}
        columnDefs={columnDefs}
        rowData={rowData}
        suppressNoRowsOverlay={true}
        suppressScrollOnNewData={true}
        defaultColDef={defaultColDef}
        onCellClicked={handleCellClick}
        onBodyScroll={handleBodyScroll}
        suppressMoveWhenRowDragging
        getRowStyle={getRowStyle}
      />
    </div>
  );
};

export default memo(AgGridTable);

const OneLine = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 8px;
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
