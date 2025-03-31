import { Continer } from '@/pages/area/areaFinancingBoard/modules/financingScale/modules/enterprise/index';

import { Wrapper, Header } from '../../components/moduleWrapper/styles';
import Table from './Table';

const RiskMonitoring = () => {
  return (
    <Wrapper height={237} ratio={36}>
      <Header>
        <div className="wrapper-title">风险监测</div>
      </Header>
      <Continer>
        <Table />
        <div className="des">注：票据逾期因为信息披露特点无法统计事件总量。</div>
      </Continer>
    </Wrapper>
  );
};

export default RiskMonitoring;
