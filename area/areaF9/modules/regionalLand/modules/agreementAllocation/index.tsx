import { FC, memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useParams } from '@pages/area/areaF9/hooks';
import WrapperContainer from '@pages/area/areaF9/modules/regionalLand/components/wrapperContainer';

import CardTable from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/modules/cardTable';
import HeaderFilter from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/modules/headerFilter';
import { useCtx, Provider } from '@/pages/area/areaF9/modules/regionalLand/modules/agreementAllocation/provider';
import { Provider as UseProvider } from '@/pages/area/areaF9/modules/regionalLand/provider';
import useIndicator from '@/pages/area/areaF9/modules/regionalLand/useIndicator';
import { getAreaLevel } from '@/pages/bond/cityInvestSpread/utils';
import useLoading from '@/pages/detail/hooks/useLoading';
import { IRootState } from '@/store';
import { useLocation } from '@/utils/router';

import S from '@pages/area/landTopic/styles.module.less';
const Main = () => {
  const {
    state: { loading, total },
  } = useCtx();
  /**通过路由来区分协议划拨明细页面还是招拍挂明细页面,1是招拍挂，2是协议划拨 */
  const location = useLocation<any>();
  const type = location.pathname.includes('agreementAllocation') ? '2' : '1';
  const title = type === '2' ? '协议划拨明细' : '招拍挂明细';
  const { code } = useParams();
  /** 堂地区级别,构建地区代码参数*/
  const level = getAreaLevel(`${code}`);
  const skeletonLoading = useLoading(loading);
  const hasPay = useSelector((store: IRootState) => store.user.info).havePay;
  const showLockLayer = !hasPay && total > 3;
  /** 参数之一:xx级地区代码*/
  const areaCode0bj = useMemo(() => {
    const key = level === '1' ? 'provinceCode' : level === '2' ? 'cityCode' : 'countyCode';
    return { [key]: code };
  }, [code, level]);
  /**获取指标树 */
  const { run } = useIndicator();

  /** 解决跳转页面后横滚动条消失问题*/
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [location]);

  useEffect(() => {
    run(type);
  }, [run, type]);

  const Header = <HeaderFilter pageType={type} areaCodeObj={areaCode0bj} />;
  const Content = (
    <div className={S['main-content']}>
      <CardTable areaCodeObj={areaCode0bj} pageType={type} skeletonLoading={skeletonLoading} />
    </div>
  );
  return (
    <WrapperContainer
      title={title}
      content={Content}
      loading={skeletonLoading}
      tableLoading={loading}
      offsetTop={130}
      showLockLayer={showLockLayer}
      filter={Header}
    ></WrapperContainer>
  );
};
const AgreementTransfer: FC = () => {
  return (
    <UseProvider>
      <Provider>
        <Main />
      </Provider>
    </UseProvider>
  );
};

export default memo(AgreementTransfer);
