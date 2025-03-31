import { useMemo } from 'react';

import { withLazyLoad } from '@pages/detail/common/components';

import { Skeleton } from '@/components/antd';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';

import { Wrapper, ModuleTitle, Empty } from '../../components';
import Table from '../bankResources/table';
import useColumn from './useColumn';
import useLogic from './useLogic';
import useTab from './useTab';

//PEVC活跃赛道top5
const PEVCTOP = () => {
  const { tabConfig, tab, onTabChange } = useTab();

  const { loading, tableData, year } = useLogic(tab);

  const { scrollX, columns } = useColumn(year);

  const headerRight = useMemo(() => {
    return <Tab {...{ tabConfig, tab, onTabChange }} />;
  }, [tabConfig, tab, onTabChange]);

  return (
    <Wrapper height={242} ratio={36.55}>
      <ModuleTitle title="PEVC活跃赛道" rightComp={headerRight} />
      <Skeleton paragraph={{ rows: 4 }} active loading={loading}>
        {tableData.length > 0 ? (
          <Table columns={columns} tableData={tableData} scroll={{ x: scrollX, y: 169 }} />
        ) : (
          <Empty />
        )}
      </Skeleton>
    </Wrapper>
  );
};

export default withLazyLoad(PEVCTOP, 242);
