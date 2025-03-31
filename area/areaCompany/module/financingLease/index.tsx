import FinancingLease, { FinancingType } from '@pages/area/areaCompany/module/financingLease/template';

export const FinancingByLessee = () => {
  return <FinancingLease type={FinancingType.ByLessee} />;
};
export const FinancingByLessor = () => {
  return <FinancingLease type={FinancingType.ByLessor} />;
};
export const FinancingByExpired = () => {
  return <FinancingLease type={FinancingType.ByExpired} />;
};
