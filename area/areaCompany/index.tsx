import styled from 'styled-components';

// import FilterDemo from './filterDemo';
// import IPOStore from './module/IPOStore';
// import Pevc from './module/pevc';
// import FinancingLease from './module/financingLease';
// import Refinancing from './module/refinancing';
import Revoke from './module/revoke';
// import EstablishPage from './module/establish';

const AreaCompany = () => {
  return (
    <IndexContainer id="area-company-index-container">
      {/* <Pevc /> */}
      {/*<FinancingLease />*/}
      {/* <Refinancing /> */}
      {/* <FilterDemo /> */}
      <Revoke />
      {/* <EstablishPage /> */}
    </IndexContainer>
  );
};

export default () => {
  return <AreaCompany />;
};

const IndexContainer = styled.div`
  height: 100%;
  overflow: auto overlay;
`;
