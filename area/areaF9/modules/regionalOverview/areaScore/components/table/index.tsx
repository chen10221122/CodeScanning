import { memo, useRef, useState, useMemo } from 'react';

import { Popover } from '@dzh/components';
import { ColDef, GetRowIdFunc, BodyScrollEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import { RowConfig } from '@dataView/provider';

import Icon from '@/components/icon';
import IndicHeaderCell from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/table/IndicHeaderCell';
import useTreeChange from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/table/useTreeChange';
import { tagList, pointText } from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './ag-grid-dzh-vars.less';

const defaultColDef: ColDef<RowConfig> = {
  // width: 160,
  minWidth: 20,
  maxWidth: 800,
  resizable: true,
  /** true 表示列被拖出网格时不会隐藏 */
  // lockVisible: true,
  /** true 表示锁定的列无法拖出固定部分 */
  // lockPinned: true,
};

interface Props {
  handleShowModel: Function;
  detailData: any;
}

const ExpandTable = (props: Props) => {
  const { handleShowModel, detailData } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  const [isExpandAll, setIsExpandAll] = useState(true);

  const isEmptyLineOpen = false;

  const IndicHeaderCellComponent = () => {
    return <IndicHeaderCell isExpandAll={isExpandAll} setIsExpandAll={setIsExpandAll} />;
  };

  const showModel = useMemoizedFn((params) => {
    handleShowModel(params);
  });

  const columnDefs = [
    {
      headerName: '指标名称(权重)',
      field: 'indicatorName',
      colId: 'renderIndicator',
      width: 243,
      flex: 243,
      headerComponent: IndicHeaderCellComponent,
      // 列不可被拖动
      suppressMovable: false,
      cellRenderer: (params: any) => {
        // console.log('params', params);
        const { data, value } = params;
        const { level, hasChildren, isExpand, needPrivilege, maxTitle, description, weight } = data;
        // const unit = headName?.match(/\(([^)]+)\)[^)]*$/)?.[1];

        return (
          <div
            className={cn(`ag-title-item ${maxTitle}`)}
            id={params.data.indexId}
            style={{
              paddingLeft: (level - 1) * 14,
              cursor: hasChildren ? 'pointer' : 'default',
            }}
          >
            <span title={`${value}${weight ? `(${weight})` : ''}`} className={`ag-title-lable ag-title-level${level}`}>
              {`${value}${weight ? `(${weight})` : ''}`}
            </span>
            {hasChildren && (
              <Icon
                size={10}
                image={require(level === 1 ? '../../imgs/expand.png' : '../../imgs/expand2.png')}
                style={{ transform: isExpand && isExpandAll ? 'unset' : 'rotate(-90deg)' }}
              />
            )}

            {level && level > 1 ? (
              <div
                onClick={() => {
                  showModel(params);
                }}
              >
                <Icon
                  size={12}
                  image={require('../../imgs/chart.png')}
                  style={{ verticalAlign: '-1px', cursor: 'pointer' }}
                />
              </div>
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

            {needPrivilege === 1 && <Icon size={12} image={require('../../imgs/vip.png')} />}
          </div>
        );
      },
    },
    {
      headerName: '得分',
      field: 'score',
      width: 54,
      flex: 54,
      headerClass: 'text-center',
      cellRenderer: (params: any) => {
        return <OneLine className={`ag-title-level${params.data.level}`}>{params.value || '-'}</OneLine>;
      },
    },
    {
      headerName: '评分位置',
      field: 'position',
      width: 198,
      flex: 198,
      headerClass: 'text-center',
      cellRenderer: (params: any) => {
        let { value } = params;
        let num = value && +value.split('%')[0];
        let level = num === 100 ? 3 : Math.floor(num / 25);
        let list = cloneDeep(tagList);
        let isShowImg = Number.isInteger(level) && level >= 0;

        return (
          <div className="local-item">
            <div className="lines">
              {list.map((item) => (
                <div className="line" key={item.color} style={{ background: item.color }}></div>
              ))}
              {isShowImg ? (
                <img style={{ left: `${num - 5}%` }} src={list[level].img} alt="" className={list[level].className} />
              ) : null}
            </div>
            <div className="percent">{value}</div>
          </div>
        );
      },
    },
    {
      headerName: '指标值',
      field: 'value',
      width: 113,
      flex: 113,
      headerClass: 'text-center',
      cellRenderer: (params: any) => {
        let unit = params.data.unit || '';
        return (
          <OneLine className={`ag-title-level${params.data.level}`}>
            {params.value ? `${params.value}${unit}` : '-'}
            {params.data.source === '2' ? (
              <div className="point-box">
                <Popover placement="right" content={<div>{pointText}</div>} trigger="hover">
                  <div className="point"></div>
                </Popover>
              </div>
            ) : null}
          </OneLine>
        );
      },
    },
    {
      headerName: '全省',
      field: 'provinceRank',
      width: 64,
      flex: 64,
      headerClass: 'text-center',
      cellRenderer: (params: any) => {
        return <OneLine className={`ag-title-level${params.data.level}`}>{params.value || '-'}</OneLine>;
      },
    },
    {
      headerName: '全国',
      field: 'nationalRank',
      width: 84,
      flex: 84,
      headerClass: 'text-center',
      cellRenderer: (params: any) => {
        return <OneLine className={`ag-title-level${params.data.level}`}>{params.value || '-'}</OneLine>;
      },
    },
  ];

  const rowDatas = useMemo(() => {
    return detailData.data.regionalIndicList || [];
  }, [detailData.data.regionalIndicList]);

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
    // updateContextVisible(false);
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

  return (
    <div ref={wrapperRef} style={{ height: '100%' }} className="ag-theme-alpine">
      <AgGridReact
        ref={gridRef}
        animateRows
        // rowDragManaged
        getRowId={getRowId}
        rowHeight={30}
        columnDefs={columnDefs}
        rowData={rowData}
        // suppressNoRowsOverlay={true}
        // suppressScrollOnNewData={true}
        defaultColDef={defaultColDef}
        onCellClicked={handleCellClick}
        onBodyScroll={handleBodyScroll}
        // suppressMoveWhenRowDragging
        getRowStyle={getRowStyle}
      />
    </div>
  );
};

export default memo(ExpandTable);

const OneLine = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  .point-box {
    position: absolute;
    right: 0;
    top: 5px;
    cursor: pointer;
    .point {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: red;
    }
  }
`;
