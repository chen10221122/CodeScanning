import { memo, useEffect, useMemo, useState } from 'react';

import { Table } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
// import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import useChangeData from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/customTable/useChangeData';

import { useColumns } from './groupColumns';

interface Props {
  detailData: any;
  containerRef: any;
  handleShowEChartModel: any;
}

const CustomTable = (props: Props) => {
  const { detailData, containerRef, handleShowEChartModel } = props;
  const [isExpandAll, setIsExpandAll] = useState(true);
  const [selected, setSelected] = useState<any>([]);

  const rowDatas = useMemo(() => {
    return detailData.data.regionalIndicList || [];
  }, [detailData.data.regionalIndicList]);

  const allKeys = useMemo(() => {
    let arr: any = [];
    rowDatas.length &&
      rowDatas.forEach((d: any) => {
        arr.push(d.indicatorCode);
      });
    return arr;
  }, [rowDatas]);

  const { changeData } = useChangeData(rowDatas);

  // console.log('changeData', changeData, selected);

  useEffect(() => {
    if (isExpandAll) {
      setSelected(allKeys);
    } else {
      setSelected([]);
    }
  }, [allKeys, isExpandAll]);

  const handleExpandClick = useMemoizedFn((record) => {
    // console.log('record', record.key);
    let { key } = record;
    if (selected.includes(key)) {
      let newArr = selected.filter((item: string) => item !== key);
      setSelected(newArr);
    } else {
      selected.push(key);
      setSelected([...selected]);
    }
    // updateFoldKeys();
  });

  const columns = useColumns(handleShowEChartModel, setIsExpandAll, isExpandAll, selected);

  return (
    <OutTableBox>
      <Table
        columns={columns}
        dataSource={changeData}
        expandable={{
          expandedRowKeys: selected,
          // defaultExpandedRowKeys: defaultExpandedRowKeys,
          // defaultExpandAllRows: true,
          // expandRowByClick: true,
          indentSize: 12,
          expandIcon: ({ record }: { onExpand: Function; record: { level: number; children: any[] } }) => {
            return record.level === 1 && record.children ? (
              <ExpandBox onClick={() => handleExpandClick(record)}></ExpandBox>
            ) : null;
          },
        }}
        scroll={{ x: '100%' }}
        sticky={{
          offsetHeader: 32,
          getContainer: () => containerRef.current || document.body,
        }}
      />
    </OutTableBox>
  );

  // return <div>table</div>;
};

export default memo(CustomTable);

const OutTableBox = styled.div`
  .local-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    .lines {
      display: flex;
      align-items: center;
      position: relative;
      .line {
        width: 31px;
        height: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:first-of-type {
          border-top-left-radius: 7px;
          border-bottom-left-radius: 7px;
        }
        &:last-of-type {
          border-top-right-radius: 7px;
          border-bottom-right-radius: 7px;
        }
        & ~ .line {
          margin-left: 1px;
        }
      }
      img {
        position: absolute;
        &.good {
          width: 12px;
          height: 12px;
        }

        &.bad {
          width: 13px;
          height: 11px;
        }
      }
    }

    .percent {
      width: 42px;
      min-width: 42px;
      font-size: 12px;
      text-align: left;
      font-family: ArialMT, ArialMT-ArialMT;
      font-weight: 400;
      color: #141414;
      line-height: 14px;
      margin-left: 10px;
    }
  }
`;

const ExpandBox = styled.div`
  // background: rgba(0, 0, 0, 0.1);
  background: transparent;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  top: 0;
  cursor: pointer;
`;
