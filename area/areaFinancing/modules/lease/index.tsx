import loadable from '@loadable/component';
export const RegionTotalAmount = loadable(
  () => import('@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/regionTotalAmount'),
);
export const RegionTrend = loadable(
  () => import('@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/regionTrend'),
);
export const RegionExpiringEvents = loadable(
  () => import('@/pages/finance/financingLeaseNew/modules/censusAnalyse/modules/regionExpiringEvents'),
);
