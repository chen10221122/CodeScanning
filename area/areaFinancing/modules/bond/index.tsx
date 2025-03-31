import { useState } from 'react';

import BlueTabWithLoading from '@/pages/area/areaFinancing/components/blueTabWithLoading';
import BondTemplate from '@/pages/area/areaFinancing/components/bondTemplate';
import { BondFinancingColumnType } from '@/pages/area/areaFinancing/components/bondTemplate/type';
import CommonLayout from '@/pages/area/areaFinancing/components/commonLayout';

const Content = ({ typeArr, tableConf }: { typeArr: BondFinancingColumnType[]; tableConf?: { remark?: string }[] }) => {
  const tabConfig = [
    {
      tabName: '按年份',
      tabKey: '0',
      tabContent: (
        <BondTemplate
          pageConfig={{
            type: typeArr[1],
          }}
        />
      ),
    },
    {
      tabName: '按类型',
      tabKey: '1',
      tabContent: (
        <BondTemplate
          pageConfig={{
            type: typeArr[0],
            tableConf: tableConf?.[0],
          }}
        />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return (
    <CommonLayout>
      <BlueTabWithLoading
        activeKey={activeTab}
        setActiveTab={setActiveTab}
        tabConfig={tabConfig}
        destroyInactiveTabPane={false}
      />
    </CommonLayout>
  );
};

export const FinancialInventory = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.FinancialInventoryByType, BondFinancingColumnType.FinancialInventoryByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为截至本年度当日的统计数据，历史年度为截至当年12月31日的统计数据。',
        },
      ]}
    />
  );
};
export const FinancialFinancing = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.FinancialFinancingByType, BondFinancingColumnType.FinancialFinancingByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为本年度1月1日至当日的统计数据，历史年度为当年1月1日至12月31日的统计数据。',
        },
      ]}
    />
  );
};
export const FinancialIssue = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.FinancialIssueByType, BondFinancingColumnType.FinancialIssueByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为本年度1月1日至最新日期的统计数据，历史年度为当年1月1日至12月31日的统计数据。',
        },
      ]}
    />
  );
};

export const FinancialReturn = () => {
  return (
    <Content typeArr={[BondFinancingColumnType.FinancialReturnByType, BondFinancingColumnType.FinancialReturnByYear]} />
  );
};
export const NormalInventory = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.NormalInventoryByType, BondFinancingColumnType.NormalInventoryByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为截至本年度当日的统计数据，历史年度为截至当年12月31日的统计数据。',
        },
      ]}
    />
  );
};

export const NormalFinancing = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.NormalFinancingByType, BondFinancingColumnType.NormalFinancingByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为本年度1月1日至当日的统计数据，历史年度为当年1月1日至12月31日的统计数据。',
        },
      ]}
    />
  );
};
export const NormalIssue = () => {
  return (
    <Content
      typeArr={[BondFinancingColumnType.NormalIssueByType, BondFinancingColumnType.NormalIssueByYear]}
      tableConf={[
        {
          remark: '注：最新时间范围为本年度1月1日至最新日期的统计数据，历史年度为当年1月1日至12月31日的统计数据。',
        },
      ]}
    />
  );
};
export const NormalReturn = () => {
  return <Content typeArr={[BondFinancingColumnType.NormalReturnByType, BondFinancingColumnType.NormalReturnByYear]} />;
};
