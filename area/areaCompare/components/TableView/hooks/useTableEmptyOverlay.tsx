import { RefObject, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { AgGridReact } from 'ag-grid-react';

import { useCheckPagePlatform } from '@dataView/hooks';
import { useTableSheetData } from '@dataView/provider';

interface Options {
  sheetId: string;
  gridRef: RefObject<AgGridReact>;
  wrapperRef: RefObject<HTMLDivElement>;
  columns: any;
}

export default function useTableEmptyOverlay({ sheetId, wrapperRef, columns }: Options) {
  const { data, indicators } = useTableSheetData(sheetId);
  const { isArea } = useCheckPagePlatform();

  const tableDom = useMemo(() => {
    return (
      <>
        {Array(30)
          .fill('')
          .map(() => {
            return <div />;
          })}
      </>
    );
  }, []);
  useEffect(() => {
    if (wrapperRef.current && columns) {
      setTimeout(() => {
        if (!wrapperRef.current) return;
        const overlayEl = wrapperRef.current.querySelector('.ag-body-viewport');
        const emptyEl: HTMLDivElement | undefined | null = overlayEl?.querySelector('.empty-overlay-wrapper');
        if (overlayEl) {
          if (!emptyEl) {
            const ele = document.createElement('div');
            ele.className = 'empty-overlay-wrapper';
            // 添加30行高度为30px的行，超出隐藏，用作背景
            ReactDOM.render(tableDom, ele);
            overlayEl.appendChild(ele);
          } else {
            if (data.length) {
              emptyEl.style.display = 'none';
              return;
            }
            emptyEl.style.display = 'block';
            const firstDiv: HTMLDivElement | null = emptyEl.querySelectorAll('div')[0];
            if (firstDiv) {
              firstDiv.innerText = indicators.length ? `请添加${isArea() ? '地区' : '公司'}` : '请添加指标';
            }
          }
        }
      });
    }
  }, [columns, data, indicators, isArea, tableDom, wrapperRef]);
}
