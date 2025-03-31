import styled from 'styled-components';

import { Skeleton, Spin } from '@/components/antd';

import { Empty } from '../../components';
import Table from '../bankResources/table';
import PieChart from './Chart/Pie';
import useColumn from './useColumn';
import useLogic from './useLogic';
import { TabType } from './useTab';

const Index = ({ type, containerRef }: { type: TabType; containerRef: React.MutableRefObject<null> }) => {
  const { loading, tableData } = useLogic(type);

  const { scrollX, columns } = useColumn(type);

  return (
    <Spin type="square" spinning={false}>
      <Skeleton paragraph={{ rows: 3 }} active loading={loading}>
        {tableData.length > 0 ? (
          <Container ref={containerRef}>
            <div className="left">
              <PieChart tableData={tableData} />
            </div>
            <div className="right">
              <Table columns={columns} tableData={tableData} scroll={{ x: scrollX, y: 140 }} />
            </div>
          </Container>
        ) : (
          <Empty />
        )}
      </Skeleton>
    </Spin>
  );
};

export default Index;

const Container = styled.div`
  display: flex;
  .left {
    height: 170px;
    width: 49%;
    margin-right: 10px;
    border: 1px solid #f2f4f9;
    border-radius: 4px;
  }
  .right {
    width: 51%;
  }
`;
