import loadable from '@loadable/component';

import { PagePlatform, usePagePlatform } from '@dataView/provider';

const EnterpriseExtra = loadable(() => import('./enterprise'));
const AreaExtra = loadable(() => import('./area'));
const IssuerExtra = loadable(() => import('./issuer'));

export default function ExtraNode() {
  const pagePlatform = usePagePlatform();

  switch (pagePlatform) {
    case PagePlatform.Enterprise:
      return (
        <>
          <IssuerExtra />
          <EnterpriseExtra />
        </>
      );
    case PagePlatform.Area:
      return <AreaExtra />;
    case PagePlatform.Issuer:
      return (
        <>
          <IssuerExtra />
          <EnterpriseExtra />
        </>
      );
    default:
      return null;
  }
}
