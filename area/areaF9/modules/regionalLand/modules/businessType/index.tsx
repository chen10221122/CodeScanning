import { FC, memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useParams } from '@pages/area/areaF9/hooks';
import WrapperContainer from '@pages/area/areaF9/modules/regionalLand/components/wrapperContainer';

import CardTable from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/modules/cardTable';
import HeaderFilter from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/modules/headerFilter';
import { Provider, useCtx } from '@/pages/area/areaF9/modules/regionalLand/modules/businessType/provider';
import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';
import useLoading from '@/pages/detail/hooks/useLoading';
import { IRootState } from '@/store';

const Main = () => {
  const {
    state: { loading, total },
  } = useCtx();
  const { code } = useParams();
  /** 堂地区级别,构建地区代码参数*/
  const level = getAreaLevel(`${code}`);
  /** 参数之一:xx级地区代码*/
  const areaCode0bj = useMemo(() => {
    const key = level === '1' ? 'provinceCode' : level === '2' ? 'cityCode' : 'countyCode';
    return { [key]: code };
  }, [code, level]);
  const skeletonLoading = useLoading(loading);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;
  /**解决横向滚动条消失问题 */
  useEffect(() => {
    if (!skeletonLoading) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [skeletonLoading]);

  const Header = <HeaderFilter areaCodeObj={areaCode0bj} />;
  const Content = <CardTable areaCodeObj={areaCode0bj} showLockLayer={showLockLayer} />;
  return (
    <WrapperContainer
      title="土地成交统计(按企业类型)"
      content={Content}
      loading={skeletonLoading}
      backup={true}
      tableLoading={loading}
      offsetTop={370}
      showLockLayer={showLockLayer}
      filter={Header}
    ></WrapperContainer>
  );
};
const AgreementTransfer: FC = () => {
  return (
    <Provider>
      <Main />
    </Provider>
  );
};

export default memo(AgreementTransfer);
