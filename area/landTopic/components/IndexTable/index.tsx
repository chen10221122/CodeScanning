import { FC, memo, useMemo, useState, useRef, useEffect } from 'react';

import { TableProps } from '@dzh/components';
import { useSize } from 'ahooks';
import { BaseTableProps, ArtColumn } from 'ali-react-table';
import styled from 'styled-components';

import NormalTable from '@pages/area/landTopic/components/IndexTable/normalTable';
import VirtualTable from '@pages/area/landTopic/components/IndexTable/virtualTable';
import { TransferSelect, TransferSelectProps } from '@pages/area/landTopic/components/transferSelect';

import { Image } from '@/components/layout';
export type { SelectItem } from '@pages/area/landTopic/components/transferSelect';

export const MORE_INDEX_WIDTH = 48;
const DEFAULT_EXPANDS_KEYS = ['常用指标'];

export type IndexTransferSelectProps = Omit<TransferSelectProps, 'title'>;

interface IndexTableProps {
  transferSelectProps: IndexTransferSelectProps;
  tableProps: TableProps<Record<string, any>> | BaseTableProps;
  /** 使用虚拟表格组件 */
  virtualTable?: boolean;
  hiddenTable?: boolean;
  onHeightChange?: (height: number) => void;
}

const IndexTable: FC<IndexTableProps> = ({
  tableProps: { columns, ...restProps },
  transferSelectProps,
  virtualTable = false,
  hiddenTable = false,
  onHeightChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { height = 0 } = useSize(containerRef) || {};

  useEffect(() => {
    onHeightChange?.(height);
  }, [height, onHeightChange]);

  const rebuildColumns = useMemo(() => {
    const emptyColumn: Record<string, any> = { name: '', title: '', dataIndex: 'blank', code: 'blank', key: 'blank' };
    if (virtualTable) {
      emptyColumn.width = '';
    }
    return columns
      ? [
          ...columns,
          emptyColumn,
          {
            name: '',
            title: (
              <MoreIndex
                onClick={() => {
                  setModalVisible((preState) => !preState);
                }}
              >
                <Image src={require('@/components/columnPlanTable/image/set.png')} size={13} />
                <Image src={require('@/assets/images/common/icon_more_setting.png')} w={20} h={22} />
              </MoreIndex>
            ),
            width: MORE_INDEX_WIDTH,
            dataIndex: 'operation',
            code: 'operation',
            key: 'operation',
            fixed: 'right',
            lock: true,
            ellipsis: false,
            render: () => '',
          },
        ]
      : columns;
  }, [columns, virtualTable]);

  return (
    <Container ref={containerRef}>
      {hiddenTable ? null : virtualTable ? (
        <VirtualTable columns={rebuildColumns as ArtColumn[]} {...(restProps as Omit<BaseTableProps, 'columns'>)} />
      ) : (
        <NormalTable
          columns={rebuildColumns as any}
          {...(restProps as Omit<TableProps<Record<string, any>>, 'columns'>)}
        />
      )}
      <TransferSelect
        title=""
        noPlan
        selectedModalTitle="指标选择"
        selectedModalVisible={modalVisible}
        onSelectedModalVisibleChange={setModalVisible}
        maxPlan={0}
        maxSelect={50}
        defaultExpandKes={DEFAULT_EXPANDS_KEYS}
        {...transferSelectProps}
      />
    </Container>
  );
};

export default memo(IndexTable);

const Container = styled.div`
  width: 100%;

  .dzh-table-pagination {
    margin-bottom: 0;
  }
`;

const MoreIndex = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  grid-gap: 2px;
  cursor: pointer;
  width: 48px;
  height: 100%;
  top: 0;
  left: 0;
  background: rgb(236, 245, 255);
  z-index: 100;
`;
